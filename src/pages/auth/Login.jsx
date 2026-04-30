import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../utils/api';
import toast from 'react-hot-toast';

import { getDashboardPath } from '../../utils/roleUtils';

const Login = () => {
    const { t } = useLanguage();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSuccess = (res) => {
        const user = res.data.user;
        login(res.data);
        toast.success(t.loginSuccess);
        
        // Redirect to role-specific dashboard
        navigate(getDashboardPath(user.role));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { phone, password });
            handleSuccess(res);
        } catch (err) {
            toast.error(err.response?.data?.msg || t.loginFail);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await api.post('/auth/google-login', {
                token: credentialResponse.credential,
                isRegistration: false
            });
            handleSuccess(res);
        } catch (err) {
            toast.error(err.response?.data?.msg || "Google login failed");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="card w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">{t.loginTitle}</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                        <input 
                            type="tel" 
                            required 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="98XXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.passwordPlaceholder}</label>
                        <input 
                            type="password" 
                            required 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="flex justify-end mt-1">
                            <Link to="/forgot-password" size="sm" className="text-sm text-primary hover:underline font-medium">
                                {t.forgotPasswordLink}
                            </Link>
                        </div>
                    </div>
                    <button type="submit" className="w-full btn btn-primary py-4">{t.loginBtn}</button>
                </form>

                <div className="mt-6">
                    <div className="relative flex items-center justify-center mb-6">
                        <div className="border-t border-gray-300 w-full"></div>
                        <span className="bg-white px-4 text-sm text-gray-500 absolute uppercase font-medium">{t.or}</span>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Google Login Failed")}
                            useOneTap
                            theme="outline"
                            size="large"
                            width="100%"
                            text="continue_with"
                            shape="pill"
                        />
                    </div>
                </div>

                <p className="mt-6 text-center text-gray-600">
                    {t.noAccount} <Link to="/register" className="text-primary font-semibold">{t.registerLink}</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
