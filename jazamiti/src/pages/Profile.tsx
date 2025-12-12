import React from 'react';
import { User, MapPin, Calendar, Share2 } from 'lucide-react';

export const Profile: React.FC = () => {
    const nfts = [
        { id: 1, type: 'Acacia', date: '2023-11-15', location: 'Kenya', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?auto=format&fit=crop&q=80&w=400' },
        { id: 2, type: 'Baobab', date: '2023-12-01', location: 'Tanzania', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=400' },
        { id: 3, type: 'Cedar', date: '2024-01-10', location: 'Uganda', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=400' },
    ];

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="bg-green-600 h-32"></div>
                <div className="px-4 pb-6">
                    <div className="relative flex items-end -mt-12 mb-4">
                        <div className="bg-white p-1 rounded-full">
                            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white">
                                <User className="h-12 w-12 text-gray-400" />
                            </div>
                        </div>
                        <div className="ml-4 mb-1">
                            <h2 className="text-2xl font-bold text-gray-900">Green Planter</h2>
                            <p className="text-sm text-gray-500">Joined November 2023</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-gray-900">15</span>
                            <span className="text-sm text-gray-500">Trees Planted</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-gray-900">450</span>
                            <span className="text-sm text-gray-500">OJZ Earned</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-gray-900">Silver</span>
                            <span className="text-sm text-gray-500">Staker Rank</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* NFT Gallery */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">My Tree NFTs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nfts.map((nft) => (
                        <div key={nft.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                            <img src={nft.image} alt={nft.type} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{nft.type} Tree #{nft.id}</h4>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {nft.location}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {nft.date}
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-green-600">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
