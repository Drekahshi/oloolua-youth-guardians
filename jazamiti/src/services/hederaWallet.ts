import { HashConnect, HashConnectTypes, MessageTypes } from 'hashconnect';
import {
    AccountBalanceQuery,
    AccountId,
    Client,
    Transaction,
    TransactionId
} from '@hashgraph/sdk';

const appMetadata: HashConnectTypes.AppMetadata = {
    name: "Jaza Miti - Oloolua",
    description: "Tree Planting & Verification on Hedera",
    icon: "https://your-website.com/logo.png" // Replace with actual logo URL
};

export interface WalletAccount {
    accountId: string;
    balance: string; // HBAR balance
    network: string;
}

export class HederaWallet {
    hashconnect: HashConnect;
    client: Client;
    saveData: HashConnectTypes.InitilizationData | null = null;
    pairingData: HashConnectTypes.SavedPairingData | null = null;
    topic: string = "";
    network: "testnet" | "mainnet" = "testnet";

    // Event listeners
    private connectionListeners: Array<(accountId: string) => void> = [];
    private disconnectionListeners: Array<() => void> = [];

    constructor() {
        this.hashconnect = new HashConnect();
        this.client = Client.forTestnet(); // Default to testnet
    }

    async init(network: "testnet" | "mainnet" = "testnet") {
        this.network = network;
        this.client = network === "testnet" ? Client.forTestnet() : Client.forMainnet();

        const initData = await this.hashconnect.init(appMetadata, network, false);
        this.saveData = initData;
        this.topic = initData.topic;

        // Listen for connection status changes
        this.hashconnect.pairingEvent.on((pairingData) => {
            console.log("Wallet paired:", pairingData);
            this.pairingData = pairingData;

            // Notify listeners
            const accountId = pairingData.accountIds[0];
            if (accountId) {
                this.connectionListeners.forEach(listener => listener(accountId));
            }
        });

        // Listen for disconnection events
        this.hashconnect.disconnectionEvent.on(() => {
            console.log("Wallet disconnected");
            this.pairingData = null;
            this.disconnectionListeners.forEach(listener => listener());
        });

        return initData;
    }

    async connect() {
        if (!this.saveData) await this.init();
        if (this.saveData) {
            this.hashconnect.connectToLocalWallet();
        }
    }

    async disconnect() {
        if (this.pairingData) {
            await this.hashconnect.disconnect(this.pairingData.topic);
            this.pairingData = null;
        }
    }

    getAccountIds(): string[] {
        return this.pairingData?.accountIds || [];
    }

    getPrimaryAccountId(): string | null {
        const accounts = this.getAccountIds();
        return accounts.length > 0 ? accounts[0] : null;
    }

    isConnected(): boolean {
        return !!this.pairingData;
    }

    // Get HBAR balance for an account
    async getBalance(accountId: string): Promise<string> {
        try {
            const balance = await new AccountBalanceQuery()
                .setAccountId(AccountId.fromString(accountId))
                .execute(this.client);

            return balance.hbars.toString();
        } catch (error) {
            console.error('Failed to fetch balance:', error);
            return '0';
        }
    }

    // Get token balance for a specific token
    async getTokenBalance(accountId: string, tokenId: string): Promise<string> {
        try {
            const balance = await new AccountBalanceQuery()
                .setAccountId(AccountId.fromString(accountId))
                .execute(this.client);

            const tokenBalance = balance.tokens?.get(tokenId);
            return tokenBalance?.toString() || '0';
        } catch (error) {
            console.error('Failed to fetch token balance:', error);
            return '0';
        }
    }

    // Execute a transaction through HashConnect (user signs in wallet)
    async executeTransaction(transaction: Transaction): Promise<{ success: boolean; transactionId?: string; error?: string }> {
        if (!this.pairingData) {
            return { success: false, error: 'Wallet not connected' };
        }

        try {
            const accountId = this.getPrimaryAccountId();
            if (!accountId) {
                return { success: false, error: 'No account selected' };
            }

            // Freeze the transaction
            transaction.freezeWith(this.client);

            // Convert transaction to bytes for signing
            const transactionBytes = transaction.toBytes();

            // Request signature from wallet
            const result = await this.hashconnect.sendTransaction(
                this.pairingData.topic,
                {
                    topic: this.pairingData.topic,
                    byteArray: transactionBytes,
                    metadata: {
                        accountToSign: accountId,
                        returnTransaction: false
                    }
                }
            );

            if (result.success) {
                return {
                    success: true,
                    transactionId: result.receipt?.transactionId?.toString()
                };
            } else {
                return { success: false, error: 'Transaction rejected by user' };
            }
        } catch (error: any) {
            console.error('Transaction execution failed:', error);
            return { success: false, error: error.message || 'Transaction failed' };
        }
    }

    // Event listener management
    onConnect(listener: (accountId: string) => void) {
        this.connectionListeners.push(listener);
    }

    onDisconnect(listener: () => void) {
        this.disconnectionListeners.push(listener);
    }

    removeConnectionListener(listener: (accountId: string) => void) {
        this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
    }

    removeDisconnectionListener(listener: () => void) {
        this.disconnectionListeners = this.disconnectionListeners.filter(l => l !== listener);
    }
}

export const hederaWallet = new HederaWallet();
