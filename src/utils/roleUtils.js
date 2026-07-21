/**
 * Returns the default dashboard path for a given user role.
 */
export const getDashboardPath = (role) => {
    switch (role) {
        case 'admin':
            return '/admin/dashboard';
        case 'farmer':
            return '/dashboard/farmer';
        case 'seller':
            return '/dashboard/seller';
        case 'trader':
            return '/dashboard/trader';
        case 'hatchery':
            return '/dashboard/hatchery';
        default:
            return '/profile';
    }
};

/**
 * Role-based category permissions for listings
 */
export const ROLE_PERMISSIONS = {
    farmer: {
        allowedCategories: ['Fish', 'Spawn', 'Fingerling', 'Feed', 'Medicine', 'Equipment'],
        canCreatePosts: false,
        dashboardTitle: 'Farmer Dashboard'
    },
    seller: {
        allowedCategories: ['Fish', 'Spawn', 'Fingerling', 'Feed', 'Medicine', 'Equipment'],
        canCreatePosts: false,
        dashboardTitle: 'Seller Dashboard'
    },
    trader: {
        allowedCategories: ['Fish', 'Spawn', 'Fingerling', 'Feed', 'Medicine', 'Equipment'],
        canCreatePosts: true,
        dashboardTitle: 'Trader Dashboard'
    },
    hatchery: {
        allowedCategories: ['Fish', 'Spawn', 'Fingerling', 'Feed', 'Medicine', 'Equipment'],
        canCreatePosts: false,
        dashboardTitle: 'Hatchery Dashboard'
    },
    admin: {
        allowedCategories: ['Fish', 'Spawn', 'Fingerling', 'Feed', 'Medicine', 'Equipment'],
        canCreatePosts: true,
        dashboardTitle: 'Admin Dashboard'
    }
};
