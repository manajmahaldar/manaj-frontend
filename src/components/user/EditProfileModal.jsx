import { useState, useContext } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { X, Save, User as UserIcon, Phone, MapPin, Shield } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { stateDistricts } from '../../utils/districtsData';

const EditProfileModal = ({ isOpen, onClose, onSuccess }) => {
    const { user, updateUser } = useContext(AuthContext);
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        district: user?.district || '',
        localDistrict: user?.localDistrict || '',
        policeStation: user?.policeStation || '',
        phone: user?.phone || ''
    });
    const [loading, setLoading] = useState(false);

    const districtsEn = ["West Bengal", "Jharkhand", "Assam", "Odisha", "Bihar"];
    const districts = t.districtsList || [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/users/profile', formData);
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
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-black text-gray-900">{t.editProfileTitle}</h2>
                    <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 min-h-0">
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
                            <div className="flex border border-gray-100 rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all bg-gray-50">
                                <select className="bg-transparent border-r border-gray-200 px-3 py-4 outline-none text-gray-700 text-sm font-bold cursor-pointer h-full">
                                    <option value="+91">🇮🇳 +91</option>
                                </select>
                                <div className="relative w-full">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="tel" required 
                                        maxLength={10}
                                        className="w-full pl-10 pr-4 py-4 outline-none bg-transparent font-bold"
                                        placeholder={t.yourPhonePlaceholder}
                                        value={formData.phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val.length <= 10) setFormData({...formData, phone: val});
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-2">{t.district}</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <select 
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold h-[60px]"
                                    value={formData.district}
                                    onChange={(e) => setFormData({...formData, district: e.target.value, localDistrict: ''})}
                                    required
                                >
                                    <option value="">{t.selectDistrictPlaceholder || 'Select State'}</option>
                                    {districtsEn.map((d, index) => <option key={d} value={d}>{districts[index]}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-2">{t.localDistrict || 'District'}</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <select 
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold h-[60px]"
                                    value={formData.localDistrict}
                                    onChange={(e) => setFormData({...formData, localDistrict: e.target.value})}
                                    required
                                    disabled={!formData.district}
                                >
                                    <option value="">{t.selectBtn || 'Select District'}</option>
                                    {formData.district && stateDistricts[formData.district]?.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-2">{t.policeStation}</label>
                            <div className="relative">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="text" required 
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                                    placeholder={t.policeStationPlaceholder}
                                    value={formData.policeStation}
                                    onChange={(e) => setFormData({...formData, policeStation: e.target.value})}
                                />
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
