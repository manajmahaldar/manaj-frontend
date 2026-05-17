import { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

import { getDashboardPath } from '../../../utils/roleUtils';

const Register = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        district: '',
        role: 'farmer'
    });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const districts = t.districtsList;

    const handleSuccessRedirect = (res) => {
        const user = res.data.user;
        login(res.data);
        toast.success(t.registerSuccess);
        
        // Redirect to role-specific dashboard
        navigate(getDashboardPath(user.role));
    };

    const isStrongPassword = (pw) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(pw);
        const hasLowerCase = /[a-z]/.test(pw);
        const hasNumber = /[0-9]/.test(pw);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pw);
        return pw.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (!isStrongPassword(formData.password)) {
            return toast.error("Password is too weak. It must be at least 8 characters and include uppercase, lowercase, number, and special character.");
        }

        try {
            const res = await api.post('/auth/register', formData);
            handleSuccessRedirect(res);
        } catch (err) {
            toast.error(err.response?.data?.msg || t.registerFail);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await api.post('/auth/google-login', {
                token: credentialResponse.credential,
                role: formData.role,
                district: formData.district,
                isRegistration: true
            });
            handleSuccessRedirect(res);
        } catch (err) {
            toast.error(err.response?.data?.msg || "Google registration failed");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="card w-full max-w-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">{t.registerTitle}</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
                            <input 
                                type="text" required 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                            <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                                <select className="bg-gray-50 border-r border-gray-300 px-3 py-3 outline-none text-gray-700 text-sm font-medium cursor-pointer">
                                    <option value="+91">🇮🇳 +91</option>
                                </select>
                                <input 
                                    type="tel" required 
                                    maxLength={10}
                                    className="w-full px-4 py-3 outline-none bg-transparent"
                                    placeholder="98XXXXXXXX"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 10) setFormData({...formData, phone: val});
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.emailAddress}</label>
                        <input 
                            type="email" required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                            placeholder="example@gmail.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.district}</label>
                        <select 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                            value={formData.district}
                            onChange={(e) => setFormData({...formData, district: e.target.value})}
                            required
                        >
                            <option value="">{t.selectDistrict}</option>
                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.yourRole}</label>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            {['farmer', 'seller', 'trader', 'hatchery'].map(role => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setFormData({...formData, role})}
                                    className={`py-2 rounded-lg border text-sm font-medium ${formData.role === role ? 'bg-primary text-white border-primary' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                                >
                                    {role === 'farmer' ? t.farmer : role === 'seller' ? t.seller : role === 'trader' ? t.trader : t.hatchery}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.newPassword}</label>
                        <input 
                            type="password" required 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                            placeholder="Enter a secure password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters, include uppercase, lowercase, number, and special character.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.confirmNewPassword}</label>
                        <input 
                            type="password" required 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="w-full btn btn-primary py-4">{t.registerBtn}</button>
                </form>

                <div className="mt-8">
                    <div className="relative flex items-center justify-center mb-6">
                        <div className="border-t border-gray-300 w-full"></div>
                        <span className="bg-white px-4 text-sm text-gray-500 absolute uppercase font-medium">{t.or || 'OR'}</span>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Google Registration Failed")}
                            useOneTap={false}
                            theme="outline"
                            size="large"
                            width="100%"
                            text="signup_with"
                            shape="pill"
                        />
                    </div>
                </div>

                <p className="mt-6 text-center text-gray-600">
                    {t.alreadyAccount} <Link to="/login" className="text-primary font-semibold">{t.loginLink}</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
