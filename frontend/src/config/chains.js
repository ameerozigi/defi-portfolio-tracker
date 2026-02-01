const chains = {
    ethereum: {
        id: 1,
        name: 'Ethereum',
        color: '#3B82F6',
        rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
        blockExplorer: 'https://etherscan.io'
    },
    polygon: {
        id: 137,
        name: 'Polygon',
        color: '#6366F1',
        rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        blockExplorer: 'https://polygonscan.com'
    },
    arbitrum: {
        id: 42161,
        name: 'Arbitrum',
        color: '#0EA5E9',
        rpcUrl: 'https://arb-mainnet.g.alchemy.com/v2/',
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
        blockExplorer: 'https://arbiscan.io'
    },
    optimism: {
        id: 10,
        name: 'Optimism',
        color: '#EF4444',
        rpcUrl: 'https://opt-mainnet.g.alchemy.com/v2/',
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
        blockExplorer: 'https://optimistic.etherscan.io'
    },
    base: {
        id: 8453,
        name: 'Base',
        color: '#0284C7',
        rpcUrl: 'https://base-mainnet.g.alchemy.com/v2/',
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
        blockExplorer: 'https://basescan.org'
    }
};

export default chains;
