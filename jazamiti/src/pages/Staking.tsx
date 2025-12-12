import React from 'react';
import { Shield, Star, Crown, Zap } from 'lucide-react';
import { hederaService } from '../services/hederaService';

const tiers = [
    {
        name: 'Bronze',
        apy: '5%',
        minStake: '100 OJZ',
        icon: Shield,
        color: 'text-orange-700',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
    },
    {
        name: 'Silver',
        apy: '12%',
        minStake: '500 OJZ',
        icon: Star,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
    },
    {
        name: 'Gold',
        apy: '25%',
        minStake: '2,000 OJZ',
        icon: Crown,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
    },
    {
        name: 'Platinum',
        apy: '40%',
        minStake: '10,000 OJZ',
        icon: Zap,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
    },
];

export const Staking: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Stake OJZ & Earn Rewards
                </h2>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                    Choose a staking pool to earn passive income while supporting global reforestation.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {tiers.map((tier) => (
                    <div
                        key={tier.name}
                        className={`rounded-lg border ${tier.borderColor} ${tier.bgColor} shadow-sm hover:shadow-md transition-shadow duration-200`}
                    >
                        <div className="p-6 text-center">
                            <div className={`mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-white shadow-sm mb-4`}>
                                <tier.icon className={`h-8 w-8 ${tier.color}`} />
                            </div>
                            <h3 className={`text-lg font-medium ${tier.color}`}>{tier.name}</h3>
                            <div className="mt-4">
                                <span className="text-4xl font-extrabold text-gray-900">{tier.apy}</span>
                                <span className="text-base font-medium text-gray-500"> APY</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">Min: {tier.minStake}</p>

                            <button
                                onClick={async () => {
                                    const result = await hederaService.stakeTokens("100");
                                    if (result.success) {
                                        alert("Staking Successful! TX: " + result.transactionId);
                                    } else {
                                        alert("Staking failed: " + result.error);
                                    }
                                }}
                                className={`mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900`}
                            >
                                Stake Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white shadow rounded-lg p-6 mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Staking Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Total Staked</p>
                        <p className="text-2xl font-bold text-gray-900">0 OJZ</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Pending Rewards</p>
                        <p className="text-2xl font-bold text-green-600">0 OJZ</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Active Pools</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
