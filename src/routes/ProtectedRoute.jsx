import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, requireVerification = false }) => {
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

    if (requireAdmin && user.role !== 'admin') {
        // Redirect to home if admin is required but user is not admin
        return <Navigate to="/" replace />;
    }

    // Redirect to verification ONLY if required for this route
    if (requireVerification && user.role !== 'admin' && user.accountStatus !== 'active') {
        return <Navigate to="/verification" replace />;
    }

    return children;
};

export default ProtectedRoute;
