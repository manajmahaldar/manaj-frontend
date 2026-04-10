import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
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
            return toast.error(t.passwordsNotMatch);
        }

        setLoading(true);
        try {
            await axios.post(`https://manaj-backend.onrender.com/api/auth/reset-password/${token}`, { password });
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
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.confirmNewPassword}</label>
                        <input 
                            type="password" 
                            required 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="******"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
