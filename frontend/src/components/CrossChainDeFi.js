import React, { useState, useEffect } from 'react';
import {
    Wallet,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    Layers,
    Activity,
    RefreshCw,
    ExternalLink,
    Copy
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { portfolioAPI } from '../services/api';
import {
    formatCurrency,
    formatAddress,
    formatPercentage,
    getChangeColor,
    copyToClipboard,
    isValidAddress
} from '../utils/helpers';
import chains from '../config/chains';

const CrossChainDeFi = () => {
    const [address, setAddress] = useState('');
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [connected, setConnected] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Connect Wallet
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAddress(accounts[0]);
                setConnected(true);
                fetchPortfolio(accounts[0]);
            } catch (err) {
                setError('Failed to connect wallet');
            }
        } else {
            setError('Please install MetaMask');
        }
    };

    const fetchPortfolio = async (addr) => {
        if (!isValidAddress(addr)) {
            setError('Invalid Ethereum Address');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await portfolioAPI.getPortfolio(addr);
            setPortfolio(data);
        } catch (err) {
            setError('Failed to fetch portfolio data. Ensure backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPortfolio(address);
    };

    // Mock data if no backend response yet (for visualization)
    const mockPieData = [
        { name: 'Ethereum', value: 45, color: '#3B82F6' },
        { name: 'Polygon', value: 25, color: '#6366F1' },
        { name: 'Arbitrum', value: 20, color: '#0EA5E9' },
        { name: 'Optimism', value: 10, color: '#EF4444' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
            {/* Header */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Layers className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">
                                ChainVault Pro
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <form onSubmit={handleSearch} className="hidden md:flex relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search any address..."
                                    className="bg-slate-900 border border-slate-700 rounded-full py-2 pl-10 pr-4 w-64 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </form>

                            <button
                                onClick={connectWallet}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${connected
                                        ? 'bg-slate-800 text-blue-400 border border-blue-900/50'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                                    }`}
                            >
                                <Wallet className="h-4 w-4" />
                                <span>{connected ? formatAddress(address) : 'Connect Wallet'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-200 flex items-center">
                        <Activity className="h-5 w-5 mr-3" />
                        {error}
                    </div>
                )}

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Total Balance Card */}
                    <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Net Worth</h3>
                                <div className="mt-2 flex items-baseline space-x-4">
                                    <span className="text-4xl font-bold text-white">
                                        {portfolio ? formatCurrency(portfolio.totalValue) : '$0.00'}
                                    </span>
                                    <span className={`flex items-center text-sm font-bold ${getChangeColor(2.5)}`}>
                                        <ArrowUpRight className="h-4 w-4 mr-1" />
                                        +2.5% (24h)
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => address && fetchPortfolio(address)}
                                className={`p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all ${loading ? 'animate-spin' : ''}`}
                            >
                                <RefreshCw className="h-5 w-5 text-blue-400" />
                            </button>
                        </div>

                        {/* Chart Area */}
                        <div className="h-64 w-full mt-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={portfolio?.history || []}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(val) => `$${val / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        dot={false}
                                        fill="url(#colorValue)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Allocation Card */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-6">Chain Allocation</h3>
                        <div className="h-64 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={portfolio?.assets ?
                                            Object.values(portfolio.assets.reduce((acc, asset) => {
                                                acc[asset.chain] = (acc[asset.chain] || 0) + asset.value;
                                                return acc;
                                            }, {})).map((val, idx, arr) => ({
                                                name: Object.keys(chains)[idx] || 'Unknown',
                                                value: val
                                            }))
                                            : mockPieData
                                        }
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {mockPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xs text-slate-500">Networks</span>
                                <span className="text-xl font-bold">{portfolio?.assets ? new Set(portfolio.assets.map(a => a.chain)).size : 0}</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-4 space-y-3">
                            {Object.entries(chains).slice(0, 4).map(([key, chain]) => (
                                <div key={key} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: chain.color }}></div>
                                        <span className="text-slate-300 capitalize">{chain.name}</span>
                                    </div>
                                    <span className="text-slate-500">
                                        {portfolio ? formatPercentage(
                                            (portfolio.assets.filter(a => a.chain === key).reduce((sum, a) => sum + a.value, 0) / portfolio.totalValue) * 100
                                        ) : '0%'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Asset List */}
                <div className="mt-6 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-white font-bold text-lg">Cross-Chain Assets</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`px-3 py-1 rounded-lg text-sm transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('nfts')}
                                className={`px-3 py-1 rounded-lg text-sm transition-colors ${activeTab === 'nfts' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                NFTs
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/50 text-slate-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Asset</th>
                                    <th className="px-6 py-4 font-medium">Chain</th>
                                    <th className="px-6 py-4 font-medium text-right">Price</th>
                                    <th className="px-6 py-4 font-medium text-right">Balance</th>
                                    <th className="px-6 py-4 font-medium text-right">Value</th>
                                    <th className="px-6 py-4 font-medium text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {portfolio?.assets.map((asset, index) => (
                                    <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center mr-3 font-bold text-blue-500">
                                                    {asset.name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{asset.name}</div>
                                                    <div className="text-xs text-slate-500">{asset.fullName || asset.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-slate-800 text-slate-300">
                                                {asset.chain}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-300">
                                            {formatCurrency(asset.price)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-300">
                                            {parseFloat(asset.balance).toFixed(4)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-white">
                                            {formatCurrency(asset.value)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-slate-500 hover:text-blue-400 transition-colors">
                                                <ExternalLink className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )) || (
                                        // Empty State
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                                {loading ? (
                                                    <div className="flex justify-center flex-col items-center">
                                                        <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                                                        <span>Scanning blockchains...</span>
                                                    </div>
                                                ) : (
                                                    'No assets found or wallet not connected'
                                                )}
                                            </td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CrossChainDeFi;
