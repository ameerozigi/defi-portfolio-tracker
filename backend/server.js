require('dotenv').config();
const express = require('express');
const cors = require('cors');
const portfolioRoutes = require('./routes/portfolio');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:3000',
            process.env.FRONTEND_URL,
            // Add any other local/staging URLs here if needed
        ];

        if (allowedOrigins.indexOf(origin) !== -1 || !process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.json());

// Routes
app.use('/api/portfolio', portfolioRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Portfolio API: http://localhost:${PORT}/api/portfolio/:address`);
});
