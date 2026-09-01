import { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            toast.success(res.data?.msg || t.emailSentSuccess);
            setSubmitted(true);
        } catch (err) {
            toast.error(err.response?.data?.msg || t.emailSentFail);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="card w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">{t.forgotPasswordTitle}</h2>
                <p className="text-gray-600 text-center mb-6">{t.forgotPasswordDesc}</p>
                
                {submitted ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-center space-y-3">
                        <p className="font-medium text-sm">
                            {t.emailSentSuccess || "If an account with that email exists, a password reset link has been sent."}
                        </p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="text-xs text-primary font-semibold underline"
                        >
                            Try another email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.emailAddress}</label>
                            <input 
                                type="email" 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full btn btn-primary py-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? '...' : t.sendResetLink}
                        </button>
                    </form>
                )}

                <p className="mt-8 text-center">
                    <Link to="/login" className="text-primary font-semibold flex items-center justify-center gap-2">
                        ← {t.backToLogin}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
