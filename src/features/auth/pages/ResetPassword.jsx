import { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const { t } = useLanguage();
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return toast.error(t.passwordsNotMatch || "Passwords do not match.");
        }

        if (password.length !== 6 || !/^[0-9]{6}$/.test(password)) {
            return toast.error("Password must contain exactly 6 digits.");
        }

        setLoading(true);
        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            toast.success(t.passwordResetSuccess);
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.msg || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="card w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">{t.resetPasswordTitle}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.newPassword}</label>
                        <input 
                            type="password" 
                            required 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="••••••"
                            value={password}
                            onChange={(e) => {
                                const raw = e.target.value;
                                if (/\D/.test(raw)) {
                                    toast.error("Only digits (0-9) are allowed.");
                                }
                                const val = raw.replace(/\D/g, '');
                                if (val.length <= 6) {
                                    setPassword(val);
                                }
                            }}
                        />
                        <p className="text-xs text-gray-500 mt-1">Password must be exactly 6 digits</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.confirmNewPassword}</label>
                        <input 
                            type="password" 
                            required 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="••••••"
                            value={confirmPassword}
                            onChange={(e) => {
                                const raw = e.target.value;
                                if (/\D/.test(raw)) {
                                    toast.error("Only digits (0-9) are allowed.");
                                }
                                const val = raw.replace(/\D/g, '');
                                if (val.length <= 6) {
                                    setConfirmPassword(val);
                                }
                            }}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full btn btn-primary py-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? '...' : t.resetPasswordBtn}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
