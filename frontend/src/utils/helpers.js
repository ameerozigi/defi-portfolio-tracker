// Format wallet address
export const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format currency
export const formatCurrency = (value, decimals = 2) => {
    if (value === undefined || value === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
};

// Format number with commas
export const formatNumber = (value, decimals = 2) => {
    if (value === undefined || value === null) return '0';
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
};

// Format percentage
export const formatPercentage = (value, decimals = 2) => {
    if (value === undefined || value === null) return '0%';
    const formatted = (value > 0 ? '+' : '') + value.toFixed(decimals);
    return `${formatted}%`;
};

// Validate Ethereum address
export const isValidAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Truncate text
export const truncate = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
};

// Get color for percentage change
export const getChangeColor = (change) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
};

// Generate random color
export const generateColor = (seed) => {
    const colors = [
        '#3B82F6', '#6366F1', '#0EA5E9', '#EF4444', '#0284C7',
        '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'
    ];
    const index = Math.abs(hashCode(seed)) % colors.length;
    return colors[index];
};

// Simple hash function for string
const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
};
