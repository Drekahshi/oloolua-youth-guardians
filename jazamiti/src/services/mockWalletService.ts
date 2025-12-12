// Mock Wallet Service - No real wallet connection required
export class MockWalletService {
    private connected = false;
    private mockAccountId = "0.0.12345";
    private mockBalance = "100.5";
    private connectionListeners: Array<(connected: boolean, accountId?: string) => void> = [];

    async connect(): Promise<{ success: boolean; accountId?: string; error?: string }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.connected = true;
                this.notifyListeners(true, this.mockAccountId);
                resolve({
                    success: true,
                    accountId: this.mockAccountId
                });
            }, 500);
        });
    }

    disconnect(): void {
        this.connected = false;
        this.notifyListeners(false);
    }

    isConnected(): boolean {
        return this.connected;
    }

    getPrimaryAccountId(): string | null {
        return this.connected ? this.mockAccountId : null;
    }

    async getBalance(): Promise<string> {
        return this.connected ? this.mockBalance : "0";
    }

    onConnectionChange(callback: (connected: boolean, accountId?: string) => void): void {
        this.connectionListeners.push(callback);
    }

    removeConnectionListener(callback: (connected: boolean, accountId?: string) => void): void {
        this.connectionListeners = this.connectionListeners.filter(cb => cb !== callback);
    }

    private notifyListeners(connected: boolean, accountId?: string): void {
        this.connectionListeners.forEach(callback => callback(connected, accountId));
    }

    async executeTransaction(transaction: any): Promise<{ success: boolean; transactionId?: string; error?: string }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: `0.0.${Date.now()}@${Math.random().toString(36).substr(2, 9)}`
                });
            }, 800);
        });
    }
}

export const mockWallet = new MockWalletService();
