import React from 'react';
import { Trophy, Medal } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

export const Leaderboard: React.FC = () => {
    const { userData } = useGamification();

    const leaders = [
        { rank: 1, name: 'EcoWarrior_99', trees: 1240, earned: '50,000 OJZ' },
        { rank: 2, name: 'GreenThumb', trees: 980, earned: '38,500 OJZ' },
        { rank: 3, name: 'ForestGuardian', trees: 850, earned: '32,000 OJZ' },
        { rank: 4, name: 'TreeHugger', trees: 620, earned: '24,000 OJZ' },
        { rank: 5, name: 'NatureLover', trees: 540, earned: '18,000 OJZ' },
        // Add current user dynamically for demo purposes
        { rank: 99, name: userData.displayName + ' (You)', trees: Math.floor(userData.points / 10), earned: userData.points + ' OJZ' }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Top Planters</h2>
                <p className="mt-2 text-gray-500">Recognizing the heroes of reforestation</p>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {leaders.map((leader) => (
                        <li key={leader.rank} className="px-4 py-5 sm:px-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full font-bold text-lg
                    ${leader.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                            leader.rank === 2 ? 'bg-gray-100 text-gray-700' :
                                                leader.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-green-50 text-green-700'}`}>
                                        {leader.rank <= 3 ? <Trophy className="w-5 h-5" /> : leader.rank}
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-lg font-medium text-gray-900">{leader.name}</p>
                                        <p className="text-sm text-gray-500">Rank #{leader.rank}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-8">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{leader.trees} Trees</p>
                                        <p className="text-xs text-gray-500">Planted</p>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-medium text-green-600">{leader.earned}</p>
                                        <p className="text-xs text-gray-500">Total Earned</p>
                                    </div>
                                    {leader.rank <= 3 && (
                                        <Medal className={`w-6 h-6 ${leader.rank === 1 ? 'text-yellow-400' :
                                            leader.rank === 2 ? 'text-gray-400' : 'text-orange-400'
                                            }`} />
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
