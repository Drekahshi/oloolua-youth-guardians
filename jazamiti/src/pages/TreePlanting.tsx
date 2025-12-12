import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { AchievementModal } from '../components/AchievementModal';
import { useGamification } from '../context/GamificationContext';
import { useVerification } from '../context/VerificationContext';
import { hederaService } from '../services/hederaService';

export const TreePlanting: React.FC = () => {
    const navigate = useNavigate();
    const { unlockBadge, userData } = useGamification();
    const { submitForVerification } = useVerification();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showAchievement, setShowAchievement] = useState(false);
    const [formData, setFormData] = useState({
        treeType: 'Oak',
        location: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Submit tree planting to Hedera HCS
            const result = await hederaService.submitTreePlanting({
                treeType: formData.treeType,
                location: formData.location || '-1.2921, 36.8219',
                photoUrl: 'https://example.com/tree.jpg', // TODO: Upload to IPFS
                planterId: '', // Will be set by service
                timestamp: Date.now()
            });

            if (result.success) {
                setIsSubmitting(false);
                setIsSuccess(true);

                // Submit to verification queue (local state for UI)
                submitForVerification({
                    treeType: formData.treeType,
                    location: formData.location || '-1.2921, 36.8219',
                });

                // Show First Planter badge only if it's their first submission
                if (!userData.badges.includes('First Planter')) {
                    unlockBadge('First Planter');
                    setTimeout(() => {
                        setShowAchievement(true);
                    }, 1000);
                }
            } else {
                setIsSubmitting(false);
                alert(`Transaction failed: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error:", error);
            setIsSubmitting(false);
            alert("Transaction failed! Ensure you are connected to Hedera HashPack.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Plant a Tree, Earn Rewards!
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Submit proof of your tree planting to earn points and badges.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {isSuccess ? (
                        <div className="text-center">
                            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Submitted for Verification!</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Your tree planting has been submitted to the community for verification. Once verified by 3 community members, you'll earn 10 points!
                            </p>
                            <div className="mt-6 flex gap-3 justify-center">
                                <button
                                    type="button"
                                    onClick={() => navigate('/verify')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-vegetation-medium hover:bg-vegetation-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vegetation-medium"
                                >
                                    Verify Others
                                    <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vegetation-medium"
                                >
                                    Dashboard
                                </button>
                            </div>
                            {showAchievement && (
                                <AchievementModal
                                    title="First Planter Badge Unlocked!"
                                    description="You've planted your first tree and earned the 'First Planter' badge!"
                                    onClose={() => setShowAchievement(false)}
                                    isOpen={showAchievement}
                                    xpEarned={10}
                                />
                            )}
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="tree-type" className="block text-sm font-medium text-gray-700">
                                    Type of Tree Planted
                                </label>
                                <select
                                    id="tree-type"
                                    name="tree-type"
                                    value={formData.treeType}
                                    onChange={(e) => setFormData({ ...formData, treeType: e.target.value })}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                                >
                                    <option>Oak</option>
                                    <option>Maple</option>
                                    <option>Pine</option>
                                    <option>Birch</option>
                                    <option>Bamboo</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">GPS Coordinates</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                        <MapPin className="h-4 w-4" />
                                    </span>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-green-500 focus:border-green-500 sm:text-sm border-gray-300 border"
                                        placeholder="-1.2921, 36.8219"
                                    />
                                </div>
                                <button type="button" className="mt-2 text-xs text-green-600 hover:text-green-500">
                                    Use current location
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Photo Evidence</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                                <span>Upload a file</span>
                                                <input type="file" className="sr-only" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Verifying on Blockchain...' : 'Submit Proof'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
