const { ethers } = require('ethers');
const axios = require('axios');
const chains = require('../config/chains');

// ERC-20 Token ABI (minimal)
const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function name() view returns (string)'
];

class BlockchainService {
    constructor() {
        // Create providers for each chain
        this.providers = {};
        Object.entries(chains).forEach(([key, chain]) => {
            // Only initialize if the URL is valid (not undefined or containing placeholders if possible, though tough to check fully)
            if (chain.rpcUrl && !chain.rpcUrl.includes('undefined')) {
                this.providers[key] = new ethers.JsonRpcProvider(chain.rpcUrl);
            } else {
                console.warn(`Skipping provider for ${key} - RPC URL missing or invalid. Check .env file.`);
            }
        });
    }

    // Get native balance (ETH, MATIC, etc.)
    async getNativeBalance(chainKey, address) {
        if (!this.providers[chainKey]) return '0';
        try {
            const balance = await this.providers[chainKey].getBalance(address);
            return ethers.formatEther(balance);
        } catch (error) {
            console.error(`Error getting native balance on ${chainKey}:`, error.message);
            return '0';
        }
    }

    // Get ERC-20 token balance
    async getTokenBalance(chainKey, tokenAddress, walletAddress) {
        if (!this.providers[chainKey]) return null;
        try {
            const contract = new ethers.Contract(
                tokenAddress,
                ERC20_ABI,
                this.providers[chainKey]
            );
            const [balance, decimals, symbol, name] = await Promise.all([
                contract.balanceOf(walletAddress),
                contract.decimals(),
                contract.symbol(),
                contract.name()
            ]);
            return {
                balance: ethers.formatUnits(balance, decimals),
                symbol,
                name,
                decimals: Number(decimals)
            };
        } catch (error) {
            //   console.error(`Error getting token balance on ${chainKey}:`, error); // Commented out to reduce noise
            return null;
        }
    }

    // Get all tokens for a wallet using Alchemy API
    async getAlchemyTokens(chainKey, address) {
        const chain = chains[chainKey];
        if (!chain || !chain.rpcUrl) return [];

        try {
            const response = await axios.post(chain.rpcUrl, {
                jsonrpc: '2.0',
                method: 'alchemy_getTokenBalances',
                params: [address],
                id: 1
            });
            return response.data.result?.tokenBalances || [];
        } catch (error) {
            console.error(`Error getting Alchemy tokens on ${chainKey}:`, error.message);
            return [];
        }
    }

    // Get token prices from CoinGecko
    async getTokenPrices(tokenIds) {
        if (!tokenIds.length) return {};
        try {
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price`,
                {
                    params: {
                        ids: tokenIds.join(','),
                        vs_currencies: 'usd',
                        include_24hr_change: true
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error getting token prices:', error.message);
            return {};
        }
    }

    // Get full portfolio for an address
    async getPortfolio(address) {
        const portfolio = {
            address,
            chains: {},
            totalValue: 0,
            assets: []
        };

        // Token ID mapping for CoinGecko
        const tokenIdMap = {
            'ETH': 'ethereum',
            'MATIC': 'matic-network',
            'USDC': 'usd-coin',
            'USDT': 'tether',
            'WETH': 'weth',
            'DAI': 'dai'
        };

        // Get balances from all chains
        for (const [chainKey, chain] of Object.entries(chains)) {
            if (!this.providers[chainKey]) continue; // Skip if provider not initialized

            try {
                // Get native balance
                const nativeBalance = await this.getNativeBalance(chainKey, address);
                const nativeSymbol = chain.nativeCurrency.symbol;

                if (parseFloat(nativeBalance) > 0) {
                    portfolio.assets.push({
                        chain: chainKey,
                        chainId: chain.id,
                        symbol: nativeSymbol,
                        name: chain.nativeCurrency.name,
                        balance: nativeBalance,
                        isNative: true
                    });
                }

                // Get token balances using Alchemy
                const tokens = await this.getAlchemyTokens(chainKey, address);

                // Limit to top 10 tokens per chain to avoid rate limits/perf issues
                for (const token of tokens.slice(0, 5)) {
                    if (token.tokenBalance && parseInt(token.tokenBalance, 16) > 0) {
                        const tokenData = await this.getTokenBalance(
                            chainKey,
                            token.contractAddress,
                            address
                        );

                        if (tokenData && parseFloat(tokenData.balance) > 0) {
                            portfolio.assets.push({
                                chain: chainKey,
                                chainId: chain.id,
                                symbol: tokenData.symbol,
                                name: tokenData.name,
                                balance: tokenData.balance,
                                isNative: false,
                                contractAddress: token.contractAddress
                            });
                        }
                    }
                }
            } catch (error) {
                console.error(`Error processing ${chainKey}:`, error.message);
            }
        }

        // Get prices for all assets
        const tokenIds = portfolio.assets
            .map(asset => tokenIdMap[asset.symbol])
            .filter(Boolean);

        // Remove duplicates
        const uniqueTokenIds = [...new Set(tokenIds)];

        if (uniqueTokenIds.length > 0) {
            const prices = await this.getTokenPrices(uniqueTokenIds);

            portfolio.assets.forEach(asset => {
                const tokenId = tokenIdMap[asset.symbol];
                if (tokenId && prices[tokenId]) {
                    asset.price = prices[tokenId].usd;
                    asset.value = parseFloat(asset.balance) * asset.price;
                    asset.change24h = prices[tokenId].usd_24h_change || 0;
                    portfolio.totalValue += asset.value;
                } else {
                    // Fallback if no price found
                    asset.price = 0;
                    asset.value = 0;
                    asset.change24h = 0;
                }
            });
        }

        return portfolio;
    }
}

module.exports = new BlockchainService();
