# 🚀 Cross-Chain DeFi Portfolio Tracker

A beautiful, real-time DeFi portfolio tracker that aggregates your crypto holdings across multiple blockchain networks.

## ✨ Features

- 🌐 **Multi-Chain Support**: Track assets across Ethereum, Polygon, Arbitrum, Optimism, and Base
- 💰 **Real-Time Balances**: Get up-to-date token balances and portfolio values
- 🎨 **Modern UI**: Beautiful, responsive interface with smooth animations
- ⚡ **Fast & Efficient**: Powered by Alchemy's robust blockchain APIs
- 📊 **Portfolio Analytics**: View total portfolio value and asset distribution

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- Alchemy SDK for blockchain data
- CORS enabled for cross-origin requests

### Frontend
- React.js
- Modern CSS with glassmorphism effects
- Responsive design

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Alchemy API keys ([Get them here](https://www.alchemy.com/))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ameerozigi/defi-portfolio-tracker.git
cd defi-portfolio-tracker
```

### 2. Set Up Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (use `.env.example` as a template):

```bash
cp ../.env.example .env
```

Edit `.env` and add your Alchemy API keys:

```env
PORT=5000

ALCHEMY_ETHEREUM_KEY=your_ethereum_key_here
ALCHEMY_POLYGON_KEY=your_polygon_key_here
ALCHEMY_ARBITRUM_KEY=your_arbitrum_key_here
ALCHEMY_OPTIMISM_KEY=your_optimism_key_here
ALCHEMY_BASE_KEY=your_base_key_here

FRONTEND_URL=http://localhost:3000
```

### 3. Set Up Frontend

```bash
cd ../frontend
npm install
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will open at `http://localhost:3000`

## 🚀 Deployment

The project is configured for easy deployment on **Render**.

👉 **[Read the Full Deployment Guide](DEPLOYMENT.md)**

Quick summary:
1. Push code to GitHub
2. Create a "Blueprint" on Render linked to your repo
3. Add your Alchemy API keys in the Render Dashboard
4. Profit! 💸

## 🎯 Usage

1. Enter any Ethereum wallet address in the search bar
2. Click "Track Portfolio" or press Enter
3. View your cross-chain DeFi portfolio with real-time data

## 🌐 Supported Networks

- Ethereum Mainnet
- Polygon (MATIC)
- Arbitrum One
- Optimism
- Base

## 📡 API Endpoints

### Get Portfolio Data
```
GET /api/portfolio/:address
```

Returns comprehensive portfolio data including:
- Token balances across all chains
- Total portfolio value
- Individual chain breakdowns

## 🔒 Security

- Never commit your `.env` file to version control
- Keep your API keys secure
- The `.gitignore` file is configured to exclude sensitive files

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [Alchemy](https://www.alchemy.com/) for providing robust blockchain APIs
- React community for amazing tools and libraries

---

Made with ❤️ by [ameerozigi](https://github.com/ameerozigi)
