import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        district: '',
        role: 'farmer'
    });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const districts = t.districtsList;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://manaj-backend.onrender.com/api/auth/register', formData);
            login(res.data);
            toast.success(t.registerSuccess);
            const role = res.data.user.role;
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/profile');
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || t.registerFail);
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
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                            <input 
                                type="tel" required 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                                placeholder="98XXXXXXXX"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
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
                        <div className="grid grid-cols-3 gap-2">
                            {['farmer', 'seller', 'trader'].map(role => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setFormData({...formData, role})}
                                    className={`py-2 rounded-lg border text-sm font-medium ${formData.role === role ? 'bg-primary text-white border-primary' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                                >
                                    {role === 'farmer' ? t.farmer : role === 'seller' ? t.seller : t.trader}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.passwordPlaceholder}</label>
                        <input 
                            type="password" required 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="w-full btn btn-primary py-4">{t.registerBtn}</button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    {t.alreadyAccount} <Link to="/login" className="text-primary font-semibold">{t.loginLink}</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
