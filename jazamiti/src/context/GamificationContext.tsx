import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserData {
    points: number;
    level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    badges: string[];
    displayName: string;
}

interface GamificationContextType {
    userData: UserData;
    awardPoints: (amount: number) => void;
    unlockBadge: (badgeId: string) => void;
}

const defaultUserData: UserData = {
    points: 0,
    level: 'Bronze',
    badges: [],
    displayName: 'Green Planter'
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData>(() => {
        const saved = localStorage.getItem('onejaz_gamification');
        return saved ? JSON.parse(saved) : defaultUserData;
    });

    useEffect(() => {
        localStorage.setItem('onejaz_gamification', JSON.stringify(userData));
    }, [userData]);

    const awardPoints = (amount: number) => {
        setUserData(prev => {
            const newPoints = prev.points + amount;
            let newLevel = prev.level;

            // Level up logic
            if (newPoints >= 1000) newLevel = 'Platinum';
            else if (newPoints >= 500) newLevel = 'Gold';
            else if (newPoints >= 200) newLevel = 'Silver';

            return {
                ...prev,
                points: newPoints,
                level: newLevel
            };
        });
    };

    const unlockBadge = (badgeId: string) => {
        setUserData(prev => {
            if (prev.badges.includes(badgeId)) return prev;
            return {
                ...prev,
                badges: [...prev.badges, badgeId]
            };
        });
    };

    return (
        <GamificationContext.Provider value={{ userData, awardPoints, unlockBadge }}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};
