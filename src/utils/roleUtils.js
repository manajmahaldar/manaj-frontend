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
        allowedCategories: ['Fingerling'],
        canCreatePosts: false,
        dashboardTitle: 'Farmer Dashboard'
    },
    seller: {
        allowedCategories: ['Feed', 'Medicine'],
        canCreatePosts: false,
        dashboardTitle: 'Seller Dashboard'
    },
    trader: {
        allowedCategories: [],
        canCreatePosts: true,
        dashboardTitle: 'Trader Dashboard'
    },
    hatchery: {
        allowedCategories: ['Spawn', 'Fingerling'],
        canCreatePosts: false,
        dashboardTitle: 'Hatchery Dashboard'
    },
    admin: {
        allowedCategories: ['Fish'],
        canCreatePosts: true,
        dashboardTitle: 'Admin Dashboard'
    }
};
