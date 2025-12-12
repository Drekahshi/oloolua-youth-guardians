import { TreeSubmission } from '../context/VerificationContext';

/**
 * Mock tree submission data for MVP demonstration
 * This showcases the manual verification system with realistic examples
 */
export const mockTreeSubmissions: TreeSubmission[] = [
    {
        id: 'submission-1732651200000-abc123',
        submitterId: 'user-sarah-johnson',
        submitterName: 'Sarah Johnson',
        treeType: 'Oak Tree',
        location: 'Central Park, Nairobi',
        photoUrl: '/assets/images/tree_oak.png',
        timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        verifications: [
            {
                verifierId: 'user-john-doe',
                approved: true,
                timestamp: Date.now() - 1.5 * 60 * 60 * 1000,
            }
        ],
        status: 'pending',
    },
    {
        id: 'submission-1732651300000-def456',
        submitterId: 'user-michael-ochieng',
        submitterName: 'Michael Ochieng',
        treeType: 'Pine Tree',
        location: 'Mount Kenya Forest',
        photoUrl: '/assets/images/tree_pine.png',
        timestamp: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
        verifications: [],
        status: 'pending',
    },
    {
        id: 'submission-1732651400000-ghi789',
        submitterId: 'user-amina-hassan',
        submitterName: 'Amina Hassan',
        treeType: 'Maple Tree',
        location: 'Uhuru Park, Nairobi',
        photoUrl: '/assets/images/tree_maple.png',
        timestamp: Date.now() - 3 * 60 * 60 * 1000, // 3 hours ago
        verifications: [
            {
                verifierId: 'user-peter-kamau',
                approved: true,
                timestamp: Date.now() - 2 * 60 * 60 * 1000,
            },
            {
                verifierId: 'user-grace-wanjiru',
                approved: true,
                timestamp: Date.now() - 1 * 60 * 60 * 1000,
            }
        ],
        status: 'pending',
    },
    {
        id: 'submission-1732651500000-jkl012',
        submitterId: 'user-david-mwangi',
        submitterName: 'David Mwangi',
        treeType: 'Acacia Tree',
        location: 'Karura Forest, Nairobi',
        photoUrl: undefined, // No photo provided
        timestamp: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
        verifications: [],
        status: 'pending',
    },
    {
        id: 'submission-1732651600000-mno345',
        submitterId: 'user-lucy-akinyi',
        submitterName: 'Lucy Akinyi',
        treeType: 'Eucalyptus Tree',
        location: 'Ngong Hills',
        photoUrl: undefined,
        timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
        verifications: [
            {
                verifierId: 'user-james-otieno',
                approved: true,
                timestamp: Date.now() - 3.5 * 60 * 60 * 1000,
            }
        ],
        status: 'pending',
    },
    {
        id: 'submission-1732651700000-pqr678',
        submitterId: 'user-kevin-njoroge',
        submitterName: 'Kevin Njoroge',
        treeType: 'Mango Tree',
        location: 'Community Garden, Kibera',
        photoUrl: undefined,
        timestamp: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
        verifications: [],
        status: 'pending',
    },
    // Some approved submissions for showcase
    {
        id: 'submission-1732640000000-stu901',
        submitterId: 'user-faith-wambui',
        submitterName: 'Faith Wambui',
        treeType: 'Cedar Tree',
        location: 'Aberdare Forest',
        photoUrl: undefined,
        timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
        verifications: [
            {
                verifierId: 'user-john-doe',
                approved: true,
                timestamp: Date.now() - 23 * 60 * 60 * 1000,
            },
            {
                verifierId: 'user-peter-kamau',
                approved: true,
                timestamp: Date.now() - 22 * 60 * 60 * 1000,
            },
            {
                verifierId: 'user-grace-wanjiru',
                approved: true,
                timestamp: Date.now() - 21 * 60 * 60 * 1000,
            }
        ],
        status: 'approved',
    },
    {
        id: 'submission-1732630000000-vwx234',
        submitterId: 'user-patrick-kimani',
        submitterName: 'Patrick Kimani',
        treeType: 'Bamboo',
        location: 'Nairobi Arboretum',
        photoUrl: undefined,
        timestamp: Date.now() - 48 * 60 * 60 * 1000, // 2 days ago
        verifications: [
            {
                verifierId: 'user-sarah-johnson',
                approved: false,
                timestamp: Date.now() - 47 * 60 * 60 * 1000,
            },
            {
                verifierId: 'user-michael-ochieng',
                approved: false,
                timestamp: Date.now() - 46 * 60 * 60 * 1000,
            },
            {
                verifierId: 'user-amina-hassan',
                approved: true,
                timestamp: Date.now() - 45 * 60 * 60 * 1000,
            }
        ],
        status: 'rejected',
    },
    {
        id: 'submission-1732651800000-stu901',
        submitterId: 'user-fatuma-ali',
        submitterName: 'Fatuma Ali',
        treeType: 'Baobab Tree',
        location: 'Tsavo East National Park',
        photoUrl: undefined,
        timestamp: Date.now() - 30 * 60 * 1000, // 30 mins ago
        verifications: [],
        status: 'pending',
    },
    {
        id: 'submission-1732651900000-vwx234',
        submitterId: 'user-john-kamau',
        submitterName: 'John Kamau',
        treeType: 'Jacaranda Tree',
        location: 'Westlands, Nairobi',
        photoUrl: '/assets/images/tree_maple.png', // Reusing maple image for demo
        timestamp: Date.now() - 15 * 60 * 1000, // 15 mins ago
        verifications: [
            {
                verifierId: 'user-sarah-johnson',
                approved: true,
                timestamp: Date.now() - 10 * 60 * 1000,
            }
        ],
        status: 'pending',
    },
    {
        id: 'submission-1732652000000-yz0123',
        submitterId: 'user-mary-williams',
        submitterName: 'Mary Williams',
        treeType: 'Fig Tree',
        location: 'Kakamega Forest',
        photoUrl: '/assets/images/tree_oak.png', // Reusing oak image for demo
        timestamp: Date.now() - 5 * 60 * 1000, // 5 mins ago
        verifications: [],
        status: 'pending',
    },
];

/**
 * Helper function to load mock data into localStorage
 * Call this once to populate the verification system with demo data
 */
export const loadMockData = () => {
    localStorage.setItem('treeSubmissions', JSON.stringify(mockTreeSubmissions));
    console.log('✅ Mock verification data loaded successfully!');
    console.log(`📊 Loaded ${mockTreeSubmissions.length} tree submissions`);
    console.log(`🌳 Pending: ${mockTreeSubmissions.filter(s => s.status === 'pending').length}`);
    console.log(`✅ Approved: ${mockTreeSubmissions.filter(s => s.status === 'approved').length}`);
    console.log(`❌ Rejected: ${mockTreeSubmissions.filter(s => s.status === 'rejected').length}`);
};

/**
 * Helper function to clear all verification data
 */
export const clearVerificationData = () => {
    localStorage.removeItem('treeSubmissions');
    console.log('🗑️ Verification data cleared');
};

/**
 * Force reload mock data (clears existing and reloads)
 * Useful for resetting the demo state
 */
export const forceReloadMockData = () => {
    clearVerificationData();
    loadMockData();
    window.location.reload(); // Refresh to show changes
};
