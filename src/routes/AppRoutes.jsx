import { Routes, Route } from 'react-router-dom';
import Home from '../pages/public/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Listings from '../pages/public/Listings';
import BuyingPosts from '../pages/public/BuyingPosts';
import Knowledge from '../pages/public/Knowledge';
import About from '../pages/public/About';
import Profile from '../pages/user/Profile';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/Dashboard';
import Contact from '../pages/public/Contact';
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import Terms from '../pages/public/Terms';
import DashboardLayout from '../components/layout/DashboardLayout';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/listings" element={<Listings />} />
      <Route path="/posts" element={<BuyingPosts />} />
      <Route path="/knowledge" element={<Knowledge />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile/*" element={<DashboardLayout><Profile /></DashboardLayout>} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard/*" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />

      <Route path="*" element={<div className="text-center py-20 font-bold text-2xl text-gray-500">পেজটি পাওয়া যায়নি (৪১০)</div>} />
    </Routes>
  );
};

export default AppRoutes;
