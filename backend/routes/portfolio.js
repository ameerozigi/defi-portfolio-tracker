const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchain');

// Helper to generate mock history
function generateHistoryData(currentValue) {
    // If value is 0, give a flat 0 line
    if (currentValue === 0) {
        return Array.from({ length: 30 }, (_, i) => ({
            day: i + 1,
            value: 0
        }));
    }

    return Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        value: currentValue * (0.9 + Math.random() * 0.2) // Random fluctuation +/- 10% roughly
    }));
}

// GET /api/portfolio/:address
router.get('/:address', async (req, res) => {
    try {
        const { address } = req.params;

        // Validate Ethereum address
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            return res.status(400).json({
                error: 'Invalid Ethereum address format'
            });
        }

        const portfolio = await blockchainService.getPortfolio(address);

        // Format response to match frontend expectations
        const response = {
            assets: portfolio.assets.map(asset => ({
                name: asset.symbol, // Using symbol as name for display if compact
                fullName: asset.name,
                chain: asset.chain,
                balance: parseFloat(asset.balance).toFixed(4),
                value: asset.value || 0,
                change: asset.change24h || 0,
                price: asset.price || 0
            })),
            totalValue: portfolio.totalValue,
            history: generateHistoryData(portfolio.totalValue)
        };

        res.json(response);
    } catch (error) {
        console.error('Error in portfolio route:', error);
        res.status(500).json({
            error: 'Failed to fetch portfolio data',
            message: error.message
        });
    }
});

module.exports = router;
