import React from 'react';
import { useVerification } from '../context/VerificationContext';
import { CheckCircle, XCircle, MapPin, Clock, User } from 'lucide-react';

export const Verify: React.FC = () => {
    const { getPendingForUser, verifySubmission } = useVerification();
    const pendingSubmissions = getPendingForUser();

    const [showReward, setShowReward] = React.useState<{ show: boolean; points: number }>({ show: false, points: 0 });

    const handleVerify = (submissionId: string, approved: boolean) => {
        verifySubmission(submissionId, approved);
        // Show reward animation
        setShowReward({ show: true, points: 5 });
        setTimeout(() => setShowReward({ show: false, points: 0 }), 2000);
    };

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return `${Math.floor(diffMins / 1440)}d ago`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Community Verification</h1>
                <p className="mt-2 text-gray-600">
                    Help verify tree planting submissions and earn <span className="font-semibold text-vegetation-medium">5 points</span> per verification!
                </p>
            </div>

            {pendingSubmissions.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <CheckCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
                    <p className="text-gray-500">
                        There are no pending submissions to verify at the moment.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingSubmissions.map((submission) => (
                        <div
                            key={submission.id}
                            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Photo or Placeholder */}
                            <div className="h-48 bg-gradient-to-br from-vegetation-light to-vegetation-medium flex items-center justify-center">
                                {submission.photoUrl ? (
                                    <img
                                        src={submission.photoUrl}
                                        alt="Tree planting"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-vegetation-dark text-6xl">🌳</div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{submission.treeType}</h3>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <User className="w-4 h-4 mr-1" />
                                            {submission.submitterName}
                                        </div>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-400">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formatTimestamp(submission.timestamp)}
                                    </div>
                                </div>

                                <div className="flex items-center text-sm text-gray-600 mb-4">
                                    <MapPin className="w-4 h-4 mr-1 text-vegetation-medium" />
                                    {submission.location}
                                </div>

                                {/* Verification Progress */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                        <span>Verifications</span>
                                        <span>{submission.verifications.length}/3</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-vegetation-medium h-2 rounded-full transition-all"
                                            style={{ width: `${(submission.verifications.length / 3) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleVerify(submission.id, true)}
                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-vegetation-medium text-white rounded-lg hover:bg-vegetation-dark transition-colors font-medium"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleVerify(submission.id, false)}
                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                                    >
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Reward Toast */}
            {showReward.show && (
                <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center animate-bounce z-50">
                    <div className="bg-white rounded-full p-1 mr-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="font-bold text-lg">+{showReward.points} Points!</p>
                        <p className="text-xs text-green-100">Verification Reward</p>
                    </div>
                </div>
            )}

            {/* Demo Controls */}
            <div className="mt-12 text-center border-t pt-8">
                <p className="text-sm text-gray-500 mb-4">Demo Controls</p>
                <button
                    onClick={() => {
                        import('../data/mockVerificationData').then(({ forceReloadMockData }) => {
                            if (window.confirm('Reset all verification data to default demo state?')) {
                                forceReloadMockData();
                            }
                        });
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                    Reset Demo Data
                </button>
            </div>
        </div>
    );
};
