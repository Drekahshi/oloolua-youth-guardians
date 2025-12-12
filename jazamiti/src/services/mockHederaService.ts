// Mock Hedera Service - No real blockchain interaction required
export interface TreePlantingData {
    treeType: string;
    location: string;
    photoUrl: string;
    planterId: string;
    timestamp: number;
}

export interface VerificationData {
    submissionId: string;
    verifierId: string;
    approved: boolean;
    timestamp: number;
}

class MockHederaService {
    private mockAccount = "0.0.12345";
    private mockBalance = "100";
    private treeCount = 0;
    private stakedAmount = 0;
    private points = 0;

    async submitTreePlanting(data: TreePlantingData): Promise<{ success: boolean; transactionId?: string; error?: string }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.treeCount++;
                this.points += 10;
                resolve({
                    success: true,
                    transactionId: `0.0.${Date.now()}@${Math.random().toString(36).substr(2, 9)}`
                });
            }, 1000);
        });
    }

    async submitVerification(data: VerificationData): Promise<{ success: boolean; transactionId?: string; error?: string }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.points += 5;
                resolve({
                    success: true,
                    transactionId: `0.0.${Date.now()}@${Math.random().toString(36).substr(2, 9)}`
                });
            }, 800);
        });
    }

    async stakeTokens(amount: string): Promise<{ success: boolean; transactionId?: string; error?: string }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.stakedAmount += parseFloat(amount);
                resolve({
                    success: true,
                    transactionId: `0.0.${Date.now()}@${Math.random().toString(36).substr(2, 9)}`
                });
            }, 1000);
        });
    }

    async getStakedBalance(accountId: string): Promise<string> {
        return this.stakedAmount.toString();
    }

    async getUserTreeCount(accountId: string): Promise<number> {
        return this.treeCount;
    }

    async awardPoints(accountId: string, points: number, reason: string): Promise<{ success: boolean; transactionId?: string; error?: string }> {
        this.points += points;
        return {
            success: true,
            transactionId: `0.0.${Date.now()}@${Math.random().toString(36).substr(2, 9)}`
        };
    }

    getPoints(): number {
        return this.points;
    }

    getMockAccountId(): string {
        return this.mockAccount;
    }

    getMockBalance(): string {
        return this.mockBalance;
    }
}

export const mockHederaService = new MockHederaService();
