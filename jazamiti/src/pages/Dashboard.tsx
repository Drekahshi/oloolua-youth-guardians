import React from 'react';
import { WalletConnect } from '../components/WalletConnect';
import { ArrowUpRight, TreeDeciduous, Coins, Activity, Medal } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

export const Dashboard: React.FC = () => {
    const { userData } = useGamification();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Wallet Section */}
                <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-1">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Coins className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Wallet Status</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">
                                            <WalletConnect />
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Impact Stats */}
                <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-1">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <TreeDeciduous className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Trees Planted</dt>
                                    <dd>
                                        <div className="text-3xl font-bold text-gray-900">{Math.floor(userData.points / 10)}</div>
                                        <div className="text-sm text-green-600 flex items-center mt-1">
                                            <ArrowUpRight className="w-4 h-4 mr-1" />
                                            <span>{userData.points} XP Earned</span>
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gamification Stats */}
                <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-1">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Medal className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Current Level</dt>
                                    <dd>
                                        <div className="text-3xl font-bold text-gray-900">{userData.level}</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {userData.badges.length} Badges Unlocked
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-gray-500" />
                        Recent Network Activity
                    </h3>
                </div>
                <ul className="divide-y divide-gray-200">
                    {[1, 2, 3].map((i) => (
                        <li key={i} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-green-600 truncate">
                                    New Tree Planted (Acacia)
                                </div>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Verified
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">
                                        Location: -1.2921, 36.8219
                                    </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                    <p>2 mins ago</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
