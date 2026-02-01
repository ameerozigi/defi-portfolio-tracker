require('dotenv').config();
const chains = {
    ethereum: {
        id: 1,
        name: 'Ethereum',
        rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ETHEREUM_KEY}`,
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 }
    },
    polygon: {
        id: 137,
        name: 'Polygon',
        rpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_POLYGON_KEY}`,
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
    },
    arbitrum: {
        id: 42161,
        name: 'Arbitrum',
        rpcUrl: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ARBITRUM_KEY}`,
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 }
    },
    optimism: {
        id: 10,
        name: 'Optimism',
        rpcUrl: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_OPTIMISM_KEY}`,
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 }
    },
    base: {
        id: 8453,
        name: 'Base',
        rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_BASE_KEY}`,
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 }
    }
};

module.exports = chains;
