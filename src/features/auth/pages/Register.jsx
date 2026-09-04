import { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

import { stateDistricts, getPoliceStations } from '../../../utils/districtsData';

const Register = () => {
    const { t } = useLanguage();
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') || 'farmer';
    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        district: '',
        localDistrict: '',
        policeStation: '',
        role: initialRole
    });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const states = Object.keys(stateDistricts);
    const districts = formData.district ? stateDistricts[formData.district] : [];
    const policeStationsList = formData.localDistrict ? getPoliceStations(formData.localDistrict) : [];

    const handleSuccessRedirect = (res) => {
        login(res.data);
        toast.success(t.registerSuccess);
        // New users must wait for admin approval — send to pending page
        navigate('/pending-approval', { replace: true });
    };

    const isValidSixDigitPassword = (pw) => {
        return /^[0-9]{6}$/.test(pw);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.district || !formData.localDistrict || !formData.policeStation) {
            return toast.error("Please select state, district, and police station.");
        }

        if (!formData.phone) {
            return toast.error("Mobile number is required.");
        }

        if (!formData.email) {
            return toast.error("Email address is required.");
        }

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match.");
        }

        if (formData.password.length !== 6 || !isValidSixDigitPassword(formData.password)) {
            return toast.error("Password must contain exactly 6 digits.");
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
                                placeholder={t.enterNamePlaceholder || 'Your Name'}
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone} <span className="text-red-500">*</span></label>
                            <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                                <select className="bg-gray-50 border-r border-gray-300 px-3 py-3 outline-none text-gray-700 text-sm font-medium cursor-pointer">
                                    <option value="+91">🇮🇳 +91</option>
                                </select>
                                <input 
                                    type="tel"
                                    required
                                    maxLength={10}
                                    className="w-full px-4 py-3 outline-none bg-transparent"
                                    placeholder={t.enterPhonePlaceholder || '98XXXXXXXX'}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.emailAddressLabel || t.emailAddress || 'Email Address'} <span className="text-red-500">*</span></label>
                        <input 
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                            placeholder={t.enterEmailPlaceholder || 'example@gmail.com'}
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.district || 'State'}</label>
                            <select 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none h-[50px]"
                                value={formData.district}
                                onChange={(e) => setFormData({...formData, district: e.target.value, localDistrict: '', policeStation: ''})}
                                required
                            >
                                <option value="">{t.selectState || t.selectDistrictPlaceholder || 'Select State'}</option>
                                {states.map((state) => <option key={state} value={state}>{t.districts?.[state] || state}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.localDistrict || 'District'}</label>
                            <select 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none h-[50px]"
                                value={formData.localDistrict}
                                onChange={(e) => setFormData({...formData, localDistrict: e.target.value, policeStation: ''})}
                                required
                                disabled={!formData.district}
                            >
                                <option value="">{t.selectDistrict || t.selectBtn || 'Select District'}</option>
                                {districts.map(d => <option key={d} value={d}>{t.districts?.[d] || d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.policeStation || 'Police Station'}</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                                placeholder={t.enterPoliceStation || 'Enter your police station'}
                                value={formData.policeStation}
                                onChange={(e) => setFormData({...formData, policeStation: e.target.value})}
                            />
                        </div>
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
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                            placeholder="••••••"
                            value={formData.password}
                            onChange={(e) => {
                                const raw = e.target.value;
                                if (/\D/.test(raw)) {
                                    toast.error("Only digits (0-9) are allowed.");
                                }
                                const val = raw.replace(/\D/g, '');
                                if (val.length <= 6) {
                                    setFormData({...formData, password: val});
                                }
                            }}
                        />
                        <p className="text-xs text-gray-500 mt-1">Password must be exactly 6 digits</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.confirmNewPassword}</label>
                        <input 
                            type="password" required 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                            placeholder="••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => {
                                const raw = e.target.value;
                                if (/\D/.test(raw)) {
                                    toast.error("Only digits (0-9) are allowed.");
                                }
                                const val = raw.replace(/\D/g, '');
                                if (val.length <= 6) {
                                    setFormData({...formData, confirmPassword: val});
                                }
                            }}
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
