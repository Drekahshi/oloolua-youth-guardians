import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadMockData } from '../data/mockVerificationData';
import { useGamification } from './GamificationContext';

export interface TreeSubmission {
    id: string;
    submitterId: string;
    submitterName: string;
    treeType: string;
    location: string;
    photoUrl?: string;
    timestamp: number;
    verifications: {
        verifierId: string;
        approved: boolean;
        timestamp: number;
    }[];
    status: 'pending' | 'approved' | 'rejected';
}

interface VerificationContextType {
    pendingVerifications: TreeSubmission[];
    mySubmissions: TreeSubmission[];
    submitForVerification: (data: {
        treeType: string;
        location: string;
        photoUrl?: string;
    }) => void;
    verifySubmission: (submissionId: string, approved: boolean) => void;
    getPendingForUser: () => TreeSubmission[];
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const useVerification = () => {
    const context = useContext(VerificationContext);
    if (!context) {
        throw new Error('useVerification must be used within a VerificationProvider');
    }
    return context;
};

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { userData, awardPoints, unlockBadge } = useGamification();
    const [allSubmissions, setAllSubmissions] = useState<TreeSubmission[]>([]);

    // Load submissions from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('treeSubmissions');
        if (stored) {
            setAllSubmissions(JSON.parse(stored));
        } else {
            // Load mock data for MVP showcase
            loadMockData();
            const mock = localStorage.getItem('treeSubmissions');
            if (mock) {
                setAllSubmissions(JSON.parse(mock));
            }
        }
    }, []);

    // Save to localStorage whenever submissions change
    useEffect(() => {
        localStorage.setItem('treeSubmissions', JSON.stringify(allSubmissions));
    }, [allSubmissions]);

    const submitForVerification = (data: {
        treeType: string;
        location: string;
        photoUrl?: string;
    }) => {
        const newSubmission: TreeSubmission = {
            id: `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            submitterId: userData.displayName, // Using displayName as a simple user ID
            submitterName: userData.displayName,
            treeType: data.treeType,
            location: data.location,
            photoUrl: data.photoUrl,
            timestamp: Date.now(),
            verifications: [],
            status: 'pending',
        };

        setAllSubmissions((prev) => [...prev, newSubmission]);
    };

    const verifySubmission = (submissionId: string, approved: boolean) => {
        setAllSubmissions((prev) =>
            prev.map((submission) => {
                if (submission.id !== submissionId) return submission;

                // Check if user already verified this submission
                const alreadyVerified = submission.verifications.some(
                    (v) => v.verifierId === userData.displayName
                );
                if (alreadyVerified) return submission;

                // Add verification
                const updatedVerifications = [
                    ...submission.verifications,
                    {
                        verifierId: userData.displayName,
                        approved,
                        timestamp: Date.now(),
                    },
                ];

                // Award points to verifier
                awardPoints(5);

                // Check if verification threshold is met (3 verifications)
                if (updatedVerifications.length >= 3) {
                    const approvalCount = updatedVerifications.filter((v) => v.approved).length;
                    const newStatus = approvalCount >= 2 ? 'approved' : 'rejected';

                    // If approved, award points to original submitter
                    if (newStatus === 'approved') {
                        // Note: In a real app, you'd need to trigger this for the submitter's account
                        // For now, this is a simplified version
                        console.log(`Submission ${submissionId} approved! Would award 10 points to ${submission.submitterName}`);
                    }

                    return {
                        ...submission,
                        verifications: updatedVerifications,
                        status: newStatus,
                    };
                }

                return {
                    ...submission,
                    verifications: updatedVerifications,
                };
            })
        );

        // Check for Community Validator badge
        const myVerificationCount = allSubmissions.reduce((count, submission) => {
            return count + submission.verifications.filter((v) => v.verifierId === userData.displayName).length;
        }, 0) + 1; // +1 for the verification we just did

        if (myVerificationCount >= 10 && !userData.badges.includes('Community Validator')) {
            unlockBadge('Community Validator');
        }
    };

    const getPendingForUser = (): TreeSubmission[] => {
        return allSubmissions.filter(
            (submission) =>
                submission.status === 'pending' &&
                submission.submitterId !== userData.displayName &&
                !submission.verifications.some((v) => v.verifierId === userData.displayName)
        );
    };

    const pendingVerifications = allSubmissions.filter((s) => s.status === 'pending');
    const mySubmissions = allSubmissions.filter((s) => s.submitterId === userData.displayName);

    return (
        <VerificationContext.Provider
            value={{
                pendingVerifications,
                mySubmissions,
                submitForVerification,
                verifySubmission,
                getPendingForUser,
            }}
        >
            {children}
        </VerificationContext.Provider>
    );
};
