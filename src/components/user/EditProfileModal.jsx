import { useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Save, User as UserIcon, Phone, MapPin } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const EditProfileModal = ({ isOpen, onClose, onSuccess }) => {
    const { user, updateUser } = useContext(AuthContext);
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        district: user?.district || '',
        phone: user?.phone || ''
    });
    const [loading, setLoading] = useState(false);

    const districts = t.districtsList || [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put('http://localhost:5000/api/users/profile', formData, {
                headers: { 'x-auth-token': token }
            });
            updateUser(res.data.user);
            toast.success(t.updateSuccess);
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.msg || t.updateFail);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-gray-900">{t.editProfileTitle}</h2>
                    <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-2">{t.fullNameLabel}</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="text" required 
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                                    placeholder={t.yourNamePlaceholder}
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-2">{t.mobileNumberLabel}</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="tel" required 
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                                    placeholder={t.yourPhonePlaceholder}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-2">{t.district}</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <select 
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold appearance-none h-[60px]"
                                    value={formData.district}
                                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                                    required
                                >
                                    <option value="">{t.selectDistrictPlaceholder}</option>
                                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="w-full bg-primary hover:bg-blue-700 text-white py-5 rounded-2xl font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20 flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? t.saving : <><Save size={20} /> {t.saveProfile}</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
