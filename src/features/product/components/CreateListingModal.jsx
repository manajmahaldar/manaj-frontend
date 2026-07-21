import { useState, useContext, useEffect, useMemo } from 'react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';
import { X, Upload, Plus } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { stateDistricts } from '../../../utils/districtsData';

const CreateListingModal = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useContext(AuthContext);
    const { t, formatDigit } = useLanguage();
    const [formData, setFormData] = useState({
        productName: '',
        category: 'Fish',
        price: '',
        district: '',
        localDistrict: '',
        policeStation: '',
        description: '',
        phoneNumber: '',
        quantity: '',
        unit: 'kg'
    });
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);

    const allCategories = ['Fish', 'Spawn', 'Fingerling', 'Feed', 'Medicine', 'Equipment'];

    // All roles can select any category
    const categories = useMemo(() => allCategories, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset form fields only when the modal opens or the logged-in user changes.
    // Do NOT include `categories` here — it would cause a reset loop that
    // overwrites the user's selection on every keystroke / re-render.
    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({
                ...prev,
                category: categories[0] || 'Fish',
                district: user?.district || '',
                localDistrict: user?.localDistrict || '',
                policeStation: user?.policeStation || '',
                phoneNumber: user?.phone || ''
            }));
        }
    }, [isOpen, user]); // ← categories intentionally omitted

    const units = ['kg', 'gm', 'piece', 'mound', 'ton'];
    const districtsEn = ["West Bengal", "Jharkhand", "Assam", "Odisha", "Bihar"];

    const handlePhotoChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            toast.error(t.maxPhotos);
            return;
        }

        let hasError = false;
        for (let file of files) {
            if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.preload = 'metadata';
                video.src = URL.createObjectURL(file);
                
                try {
                    await new Promise((resolve, reject) => {
                        video.onloadedmetadata = () => {
                            window.URL.revokeObjectURL(video.src);
                            if (video.duration > 11) { // 11s to allow slight float margins
                                reject(new Error("Video must be 10 seconds or less."));
                            } else {
                                resolve();
                            }
                        };
                        video.onerror = () => reject(new Error("Failed to load video metadata."));
                    });
                } catch (error) {
                    toast.error(error.message);
                    hasError = true;
                    break;
                }
            }
        }

        if (hasError) {
            e.target.value = '';
            return;
        }

        setPhotos(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        Array.from(photos).forEach(photo => data.append('photos', photo));

        try {
            await api.post('/listings', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(t.listingSubmitSuccess);
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">{t.newSalesListing}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.productName}</label>
                            <input 
                                type="text" required 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t.egFish}
                                value={formData.productName}
                                onChange={(e) => setFormData({...formData, productName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.category}</label>
                            <select 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary h-[50px]"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                {categories.map(c => (
                                    <option key={c} value={c}>
                                        {c === 'Fish' ? t.categoryFish : 
                                         c === 'Spawn' ? t.categorySpawn : 
                                         c === 'Fingerling' ? t.categoryFingerling : 
                                         c === 'Feed' ? t.categoryFeed : 
                                         c === 'Medicine' ? t.categoryMed : 
                                         t.categoryEquip}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex gap-2">
                            <div className="flex-1 space-y-1">
                                <label className="text-sm font-bold text-gray-700">{t.qtyOptional}</label>
                                <input 
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                    placeholder={t.egQty}
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                />
                            </div>
                            <div className="w-24 space-y-1">
                                <label className="text-sm font-bold text-gray-700">{t.unit}</label>
                                <select 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary h-[50px]"
                                    value={formData.unit}
                                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                                >
                                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.priceCurrency}</label>
                            <input 
                                type="text" required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t.egPrice}
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.district}</label>
                            <select 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary h-[50px]"
                                value={formData.district}
                                onChange={(e) => {
                                    setFormData({...formData, district: e.target.value, localDistrict: ''})
                                }}
                                required
                            >
                                <option value="">{t.selectBtn}</option>
                                {districtsEn.map((d, index) => <option key={d} value={d}>{t.districtsList?.[index]}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.localDistrict || 'District'}</label>
                            <select 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary h-[50px]"
                                value={formData.localDistrict}
                                onChange={(e) => setFormData({...formData, localDistrict: e.target.value})}
                                required
                                disabled={!formData.district}
                            >
                                <option value="">{t.selectBtn}</option>
                                {formData.district && stateDistricts[formData.district]?.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.policeStation}</label>
                            <input 
                                type="text" required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary h-[50px]"
                                placeholder={t.policeStationPlaceholder}
                                value={formData.policeStation}
                                onChange={(e) => setFormData({...formData, policeStation: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.mobileNumberLabel}</label>
                            <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent bg-white">
                                <select className="bg-gray-50 border-r border-gray-200 px-3 py-3 outline-none text-gray-700 text-sm font-medium cursor-pointer h-[50px]">
                                    <option value="+91">🇮🇳 +91</option>
                                </select>
                                <input 
                                    type="tel" required
                                    maxLength={10}
                                    className="w-full px-4 py-3 outline-none bg-transparent"
                                    placeholder="98XXXXXXXX"
                                    value={formData.phoneNumber}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 10) setFormData({...formData, phoneNumber: val});
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">{t.detailedDesc}</label>
                        <textarea 
                            required rows="3"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                            placeholder={t.writeProductDetails}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">Photo / Video Upload (Max 3 files, Video max 10s)</label>
                        <div className="relative h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer overflow-hidden">
                            <input 
                                type="file" multiple accept="image/*,video/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handlePhotoChange}
                            />
                            <div className="text-center">
                                <Upload className="mx-auto text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">
                                    {photos.length > 0 ? `${formatDigit(photos.length)} ${t.filesSelectedSuffix}` : t.clickToUpload}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        {loading ? t.submitting : <><Plus size={20} /> {t.publishListing}</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateListingModal;
