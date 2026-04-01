import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Save, Upload } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const EditPostModal = ({ isOpen, onClose, onSuccess, post }) => {
    const { t, formatDigit } = useLanguage();
    const [formData, setFormData] = useState({
        fishName: '',
        size: '',
        requiredQuantity: '',
        buyingPrice: '',
        district: '',
        phoneNumber: ''
    });
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);

    const handlePhotoChange = (e) => {
        if (e.target.files.length > 3) {
            toast.error(t.maxPhotos);
            return;
        }
        setPhotos(e.target.files);
    };


    useEffect(() => {
        if (post) {
            setFormData({
                category: post.category || 'fish',
                fishName: post.fishName || '',
                size: post.size || '',
                requiredQuantity: post.requiredQuantity || '',
                buyingPrice: post.buyingPrice || '',
                district: post.district || '',
                phoneNumber: post.phoneNumber || ''
            });
        }
    }, [post]);

    const categories = [
        { id: 'fish', label: t.categoryFish, icon: '🐟', placeholder: t.placeholderFishPost },
        { id: 'feed', label: t.categoryFeed, icon: '🌾', placeholder: t.placeholderFeedPost },
        { id: 'medicine', label: t.categoryMed, icon: '💊', placeholder: t.placeholderMedPost }
    ];

    const currentCategory = categories.find(c => c.id === (formData.category || 'fish'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.set('category', formData.category || 'fish');
        Array.from(photos).forEach(photo => data.append('photos', photo));

        const token = localStorage.getItem('token');
        try {
            await axios.put(`https://manaj-backend.onrender.com/api/posts/${post._id}`, data, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token 
                }
            });
            toast.success(t.orderUpdateSuccess);
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
            <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">{t.updateRequirement}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700">{t.selectCategory}</label>
                        <div className="grid grid-cols-3 gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat.id })}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                                        (formData.category || 'fish') === cat.id
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                                    }`}
                                >
                                    <span className="text-2xl mb-1">{cat.icon}</span>
                                    <span className="text-xs font-bold">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">
                            {currentCategory.id === 'fish' ? t.fishName : currentCategory.id === 'feed' ? t.feedName : t.medicineName}
                        </label>
                        <input 
                            type="text" required 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                            placeholder={`${t.eg}: ${currentCategory.placeholder}`}
                            value={formData.fishName}
                            onChange={(e) => setFormData({...formData, fishName: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">
                                {currentCategory.id === 'fish' ? t.size : t.packingSize}
                            </label>
                            <input 
                                type="text" required 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={currentCategory.id === 'fish' ? t.egFishSize : t.egFeedSize}
                                value={formData.size}
                                onChange={(e) => setFormData({...formData, size: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.requiredQty}</label>
                            <input 
                                type="text" required 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t.egQty}
                                value={formData.requiredQuantity}
                                onChange={(e) => setFormData({...formData, requiredQuantity: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.budgetCurrency}</label>
                            <input 
                                type="text" required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t.egBudget}
                                value={formData.buyingPrice}
                                onChange={(e) => setFormData({...formData, buyingPrice: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.district}</label>
                            <select 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary h-[50px]"
                                value={formData.district}
                                onChange={(e) => setFormData({...formData, district: e.target.value})}
                                required
                            >
                                <option value="">{t.selectBtn}</option>
                                {t.districtsList.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">{t.phone}</label>
                        <input 
                            type="tel" required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                            placeholder="98XXXXXXXX"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">{t.uploadPhotosMax}</label>
                        <div className="relative h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer overflow-hidden">
                            <input 
                                type="file" multiple accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handlePhotoChange}
                            />
                            <div className="text-center">
                                <Upload className="mx-auto text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">
                                    {photos.length > 0 ? `${formatDigit(photos.length)} ${t.filesSelectedSuffix}` : t.clickToUploadNewFile}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                    >
                        {loading ? t.updating : <><Save size={20} /> {t.updateRequirement}</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPostModal;
