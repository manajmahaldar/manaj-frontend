import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, RoleRoute } from '../features/auth/components';

// Lazy-load all pages
const Home             = lazy(() => import('../pages/public/Home'));
const Login            = lazy(() => import('../features/auth/pages/Login'));
const Register         = lazy(() => import('../features/auth/pages/Register'));
const ForgotPassword   = lazy(() => import('../features/auth/pages/ForgotPassword'));
const ResetPassword    = lazy(() => import('../features/auth/pages/ResetPassword'));
const Listings         = lazy(() => import('../features/product/pages/Listings'));
const BuyingPosts      = lazy(() => import('../features/product/pages/BuyingPosts'));
const Knowledge        = lazy(() => import('../pages/public/Knowledge'));
const About            = lazy(() => import('../pages/public/About'));
const Contact          = lazy(() => import('../pages/public/Contact'));
const PrivacyPolicy    = lazy(() => import('../pages/public/PrivacyPolicy'));
const Terms            = lazy(() => import('../pages/public/Terms'));
const Profile          = lazy(() => import('../pages/user/Profile'));
const Verification     = lazy(() => import('../pages/user/Verification'));
const AdminLogin       = lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboard   = lazy(() => import('../pages/admin/Dashboard'));
const DashboardLayout  = lazy(() => import('../components/layout/DashboardLayout'));
const RoleDashboard    = lazy(() => import('../pages/dashboards/RoleDashboard'));

// Full-screen loading fallback for route transitions
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">লোড হচ্ছে...</p>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"                    element={<Home />} />
        <Route path="/login"               element={<Login />} />
        <Route path="/register"            element={<Register />} />
        <Route path="/forgot-password"     element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/listings"            element={<Listings />} />
        <Route path="/posts"               element={<BuyingPosts />} />
        <Route path="/knowledge"           element={<Knowledge />} />
        <Route path="/about"               element={<About />} />
        <Route path="/contact"             element={<Contact />} />
        <Route path="/privacy-policy"      element={<PrivacyPolicy />} />
        <Route path="/terms"               element={<Terms />} />

        {/* General Profile (Dashboard Overview) */}
        <Route path="/profile/*" element={
          <ProtectedRoute>
            <DashboardLayout><Profile /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Role-specific Dashboards */}
        <Route path="/dashboard/farmer" element={
          <RoleRoute allowedRoles={['farmer']}>
            <DashboardLayout><RoleDashboard allowedRole="farmer" /></DashboardLayout>
          </RoleRoute>
        } />
        <Route path="/dashboard/seller" element={
          <RoleRoute allowedRoles={['seller']}>
            <DashboardLayout><RoleDashboard allowedRole="seller" /></DashboardLayout>
          </RoleRoute>
        } />
        <Route path="/dashboard/trader" element={
          <RoleRoute allowedRoles={['trader']}>
            <DashboardLayout><RoleDashboard allowedRole="trader" /></DashboardLayout>
          </RoleRoute>
        } />
        <Route path="/dashboard/hatchery" element={
          <RoleRoute allowedRoles={['hatchery']}>
            <DashboardLayout><RoleDashboard allowedRole="hatchery" /></DashboardLayout>
          </RoleRoute>
        } />

        <Route path="/verification" element={
          <ProtectedRoute requireVerification={false}><Verification /></ProtectedRoute>
        } />

        <Route path="/master-control-gate" element={<AdminLogin />} />

        {/* Convenience redirects for /admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<Navigate to="/master-control-gate" replace />} />

        <Route path="/admin/dashboard/*" element={
          <ProtectedRoute requireAdmin={true}>
            <DashboardLayout><AdminDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={
          <div className="text-center py-20 font-bold text-2xl text-gray-500">
            পেজটি পাওয়া যায়নি (৪০৪)
          </div>
        } />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
