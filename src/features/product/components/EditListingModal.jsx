import { useState, useEffect, useContext } from 'react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';
import { X, Upload, Save } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { stateDistricts, getPoliceStations } from '../../../utils/districtsData';

const EditListingModal = ({ isOpen, onClose, onSuccess, listing }) => {
    const { user } = useContext(AuthContext);
    const { t, formatDigit } = useLanguage();
    const [formData, setFormData] = useState({
        productName: '',
        category: 'Fish',
        price: '',
        mrp: '',
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
    const categories = allCategories;

    const units = ['kg', 'gm', 'piece', 'mound', 'ton'];
    const states = Object.keys(stateDistricts);

    useEffect(() => {
        if (listing) {
            setFormData({
                productName: listing.productName || '',
                category: listing.category || 'Fish',
                price: listing.price || '',
                mrp: listing.mrp || '',
                district: listing.district || '',
                localDistrict: listing.localDistrict || '',
                policeStation: listing.policeStation || '',
                description: listing.description || '',
                phoneNumber: listing.phoneNumber || '',
                quantity: listing.quantity || '',
                unit: listing.unit || 'kg'
            });
        }
    }, [listing]);

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

        // Quantity is required for non-Equipment categories
        if (formData.category !== 'Equipment' && !formData.quantity.trim()) {
            toast.error(t.validationQuantity || 'Please enter the quantity.');
            setLoading(false);
            return;
        }

        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (photos.length > 0) {
            Array.from(photos).forEach(photo => data.append('photos', photo));
        }

        try {
            await api.put(`/listings/${listing._id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(t.listingUpdateSuccess);
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
                    <h2 className="text-xl font-bold text-gray-900">{t.editListing}</h2>
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
                        {formData.category !== 'Equipment' && (
                            <div className="flex gap-2">
                                <div className="flex-1 space-y-1">
                                    <label className="text-sm font-bold text-gray-700">
                                        {t.quantity} 
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input 
                                        type="text"
                                        required
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
                                         {units.map(u => <option key={u} value={u}>{t.units?.[u] || u}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}
                        <div className={`space-y-1 ${formData.category === 'Equipment' ? 'md:col-span-1' : ''}`}>
                            <label className="text-sm font-bold text-gray-700">
                                {formData.category !== 'Equipment'
                                    ? (t.pricePerKg || 'Price per kg (₹)')
                                    : t.priceCurrency}
                            </label>
                            <input 
                                type="text" required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t.egPrice}
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* MRP field — required for all categories */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                            {t.mrpLabelRequired || 'MRP / Original Price'}
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex gap-3 items-stretch">
                            <input
                                type="number"
                                min="0"
                                required
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t.egMrp || 'e.g. 800'}
                                value={formData.mrp}
                                onChange={(e) => setFormData({...formData, mrp: e.target.value})}
                            />
                            {/* Live buyer-facing price preview */}
                            {formData.price && (
                                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 flex flex-col justify-center min-w-0">
                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Buyer sees</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {formData.mrp && parseFloat(formData.mrp) > parseFloat(formData.price) ? (
                                            <>
                                                {/* Strikethrough MRP */}
                                                <span className="text-xs text-gray-400 line-through">
                                                    ₹{formData.mrp}{formData.category !== 'Equipment' ? `/${t.units?.[formData.unit] || formData.unit}` : ''}
                                                </span>
                                                {/* Selling price */}
                                                <span className="text-base font-extrabold text-primary">
                                                    ₹{formData.price}{formData.category !== 'Equipment' ? `/${t.units?.[formData.unit] || formData.unit}` : ''}
                                                </span>
                                                {/* Discount badge */}
                                                <span className="bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                                    {Math.round((1 - parseFloat(formData.price) / parseFloat(formData.mrp)) * 100)}% OFF
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-base font-extrabold text-primary">
                                                ₹{formData.price}{formData.category !== 'Equipment' ? `/${t.units?.[formData.unit] || formData.unit}` : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {formData.mrp && formData.price && parseFloat(formData.mrp) <= parseFloat(formData.price) && (
                            <p className="text-xs text-red-500 font-semibold mt-1">
                                ⚠ MRP must be higher than selling price to show a discount.
                            </p>
                        )}
                    </div>

                    {formData.category !== 'Equipment' && (!isNaN(parseFloat(formData.quantity)) && parseFloat(formData.quantity) > 0 && !isNaN(parseFloat(formData.price)) && parseFloat(formData.price) > 0) && (() => {
                        const qty = parseFloat(formData.quantity);
                        const priceKg = parseFloat(formData.price);
                        const multiplier = formData.unit === 'ton' ? 1000 : (formData.unit === 'mound' ? 40 : (formData.unit === 'gm' ? 0.001 : 1));
                        const totalKg = qty * multiplier;
                        const totalVal = totalKg * priceKg;

                        return (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs md:text-sm text-emerald-900 font-medium flex items-center justify-between shadow-xs">
                                <span>{t.totalEstimatedValue || 'Total Estimated Value'}:</span>
                                <span className="font-extrabold text-base text-emerald-700">
                                    ₹{totalVal.toLocaleString('en-IN')} 
                                    <span className="text-xs font-normal text-emerald-600 ml-1">
                                        ({formData.unit === 'kg' || formData.unit === 'piece' 
                                            ? `${formData.quantity} ${t.units?.[formData.unit] || formData.unit} × ₹${priceKg.toLocaleString('en-IN')}/kg`
                                            : `${formData.quantity} ${t.units?.[formData.unit] || formData.unit} [${totalKg.toLocaleString('en-IN')} kg] × ₹${priceKg.toLocaleString('en-IN')}/kg`})
                                    </span>
                                </span>
                            </div>
                        );
                    })()}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.district}</label>
                            <select 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary h-[50px]"
                                value={formData.district}
                                onChange={(e) => {
                                    setFormData({...formData, district: e.target.value, localDistrict: '', policeStation: ''});
                                }}
                                required
                            >
                                <option value="">{t.selectDistrictPlaceholder || 'Select State'}</option>
                                {states.map((state) => <option key={state} value={state}>{t.districts?.[state] || state}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.localDistrict || 'District'}</label>
                            <select 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary h-[50px]"
                                value={formData.localDistrict}
                                onChange={(e) => setFormData({...formData, localDistrict: e.target.value, policeStation: ''})}
                                required
                                disabled={!formData.district}
                            >
                                <option value="">{t.selectBtn}</option>
                                {formData.district && stateDistricts[formData.district]?.map(d => <option key={d} value={d}>{t.districts?.[d] || d}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.policeStation || 'Police Station'}</label>
                            <input 
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t.enterPoliceStation || 'Enter Police Station'}
                                value={formData.policeStation}
                                onChange={(e) => setFormData({...formData, policeStation: e.target.value})}
                                required
                                disabled={!formData.localDistrict}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.phone}</label>
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
                        <label className="text-sm font-bold text-gray-700">বিস্তারিত বর্ণনা</label>
                        <textarea 
                            required rows="3"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                            placeholder="পণ্য সম্পর্কে বিস্তারিত লিখুন..."
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
                                    {photos.length > 0 ? `${formatDigit(photos.length)} ${t.filesSelectedSuffix}` : t.clickToUploadNewFile}
                                </span>
                            </div>
                        </div>
                        {listing?.photos?.length > 0 && photos.length === 0 && (
                            <p className="text-xs text-gray-400">{t.keepOldPhotos}</p>
                        )}
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        {loading ? t.updating : <><Save size={20} /> {t.updateBtn}</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditListingModal;
