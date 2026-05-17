import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

/**
 * RoleRoute
 * ---------
 * A route guard that checks if the user is authenticated AND has one of the allowed roles.
 * If the user has an incorrect role, it redirects them to their proper dashboard.
 */
const RoleRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login if not logged in
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their own dashboard based on their role
        const dashboardPaths = {
            'admin': '/admin/dashboard',
            'farmer': '/dashboard/farmer',
            'seller': '/dashboard/seller',
            'trader': '/dashboard/trader',
            'hatchery': '/dashboard/hatchery'
        };
        
        const fallbackPath = dashboardPaths[user.role] || '/profile';
        return <Navigate to={fallbackPath} replace />;
    }

    return children;
};

export default RoleRoute;
