import React, { useState, useEffect } from 'react';
import { mockWallet as hederaWallet } from '../services/mockWalletService';
// import { formatBalance } from '../utils/formatBalance'; // Ensure this exists or reimplement

export const WalletConnect: React.FC = () => {
    const [accountId, setAccountId] = useState<string | null>(null);
    const [balance, setBalance] = useState<string>('0');
    const [error, setError] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [transactions, setTransactions] = useState<Array<{ hash: string, type: string, status: string, timestamp: number }>>([]);

    // Initialize wallet listeners
    useEffect(() => {
        // Setup connection listener
        const handleConnection = (connectedAccountId: string) => {
            setAccountId(connectedAccountId);
            fetchBalance(connectedAccountId);
        };

        const handleDisconnection = () => {
            setAccountId(null);
            setBalance('0');
        };

        hederaWallet.onConnect(handleConnection);
        hederaWallet.onDisconnect(handleDisconnection);

        // Check if already connected
        if (hederaWallet.isConnected()) {
            const accId = hederaWallet.getPrimaryAccountId();
            if (accId) {
                setAccountId(accId);
                fetchBalance(accId);
            }
        }

        // Cleanup listeners on unmount
        return () => {
            hederaWallet.removeConnectionListener(handleConnection);
            hederaWallet.removeDisconnectionListener(handleDisconnection);
        };
    }, []);

    // Fetch balance whenever accountId changes
    useEffect(() => {
        if (accountId) {
            fetchBalance(accountId);

            // Poll balance every 10 seconds
            const interval = setInterval(() => fetchBalance(accountId), 10000);
            return () => clearInterval(interval);
        }
    }, [accountId]);

    const fetchBalance = async (accId: string) => {
        try {
            const bal = await hederaWallet.getBalance(accId);
            setBalance(bal);
        } catch (error) {
            console.error('Failed to fetch balance:', error);
        }
    };

    const handleConnect = async () => {
        setIsConnecting(true);
        setError(null);
        try {
            await hederaWallet.connect();
            // Connection handled by event listener
        } catch (err: any) {
            setError(err.message || 'Failed to connect wallet');
        } finally {
            setIsConnecting(false);
        }
    };

    const simulateTransaction = async (type: string) => {
        if (!accountId) return;

        const newTx = {
            hash: '0.0.' + Math.floor(Math.random() * 100000) + '@' + Math.floor(Date.now() / 1000), // Hedera style ID-ish
            type,
            status: 'Pending',
            timestamp: Date.now()
        };

        setTransactions(prev => [newTx, ...prev]);

        // Simulate network delay
        setTimeout(() => {
            setTransactions(prev => prev.map(tx =>
                tx.hash === newTx.hash ? { ...tx, status: 'Success' } : tx
            ));
        }, 2000);
    };

    return (
        <div className="p-4 border rounded shadow-md bg-white max-w-2xl mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4">Hedera Wallet Connection</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {!accountId ? (
                <div className="text-center">
                    <p className="mb-4 text-gray-600">Connect your Hedera wallet to start.</p>
                    <button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isConnecting ? 'Connecting...' : 'Connect Hedera Wallet'}
                    </button>
                    <p className="mt-2 text-xs text-gray-500">Requires HashPack or compatible Hedera wallet extension.</p>
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Connected Account
                                </label>
                                <div className="p-2 bg-gray-100 rounded text-sm break-all font-mono">
                                    {accountId}
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-gray-600">Balance:</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {balance} HBAR
                                </p>
                            </div>

                            <div className="text-xs text-gray-500 mt-4">
                                Provider: HashConnect
                            </div>
                        </div>

                        <div className="border-l pl-6">
                            <h3 className="font-bold mb-3">Transaction Simulator</h3>
                            <div className="space-y-2 mb-4">
                                <button
                                    onClick={() => simulateTransaction('Mint OJZ Token')}
                                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-sm"
                                >
                                    Mint Token (HTS)
                                </button>
                                <button
                                    onClick={() => simulateTransaction('Register Planting')}
                                    className="w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700 text-sm"
                                >
                                    Register Tree (HCS)
                                </button>
                            </div>

                            <h3 className="font-bold mb-2 text-sm">Recent Receipts</h3>
                            <div className="bg-gray-50 rounded p-2 h-48 overflow-y-auto text-xs">
                                {transactions.length === 0 ? (
                                    <p className="text-gray-400 text-center py-4">No transactions yet</p>
                                ) : (
                                    transactions.map(tx => (
                                        <div key={tx.hash} className="border-b last:border-0 py-2">
                                            <div className="flex justify-between font-semibold">
                                                <span>{tx.type}</span>
                                                <span className={tx.status === 'Success' ? 'text-green-600' : 'text-yellow-600'}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                            <div className="text-gray-500 truncate" title={tx.hash}>
                                                ID: {tx.hash}
                                            </div>
                                            <div className="text-gray-400">
                                                {new Date(tx.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
