import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheck, LockKeyhole } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const AdminLogin = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const { user, login } = useContext(AuthContext);
    const { t } = useLanguage();
    const navigate = useNavigate();

    // If an admin is already logged in, redirect them directly to the dashboard
    if (user && user.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://manaj-backend.onrender.com/api/auth/login', { phone, password });
            
            // Explicitly deny non-admins
            if (res.data.user.role !== 'admin') {
                toast.error(t.accessDeniedAdmin);
                return;
            }

            login(res.data);
            toast.success(t.adminLoginSuccess);
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.msg || t.loginFail);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="w-20 h-20 bg-gray-900 rounded-3xl mx-auto flex items-center justify-center text-white mb-6 shadow-xl shadow-gray-900/20 rotate-3 hover:rotate-0 transition-transform">
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t.adminPortal}</h1>
                    <p className="text-gray-500 font-medium mt-2">{t.secureLoginDesc}</p>
                </div>

                <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 animate-in fade-in zoom-in-95 duration-500 delay-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.phone}</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 group-focus-within:text-gray-900 transition-colors">+91</div>
                                <input 
                                    type="tel" 
                                    required 
                                    className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-gray-900 rounded-2xl outline-none transition-all font-bold text-gray-900 placeholder:font-medium placeholder:text-gray-400"
                                    placeholder="8XXXXXXX"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t.password}</label>
                            <div className="relative group">
                                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={20} />
                                <input 
                                    type="password" 
                                    required 
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-gray-900 rounded-2xl outline-none transition-all font-bold text-gray-900 placeholder:font-medium placeholder:text-gray-400"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-gray-900/20 mt-4 uppercase tracking-widest text-sm"
                        >
                            {t.enterSystem}
                        </button>
                    </form>
                </div>
                
                <p className="text-center text-xs font-bold text-gray-400 mt-8 uppercase tracking-widest">
                    Authorized Personnel Only
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
