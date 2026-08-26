import { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { X, Plus, Upload } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AuthContext } from '../../context/AuthContext';
import { stateDistricts, getPoliceStations } from '../../utils/districtsData';

const CreatePostModal = ({ isOpen, onClose, onSuccess, initialData }) => {
    const { user } = useContext(AuthContext);
    const { t, formatDigit } = useLanguage();

    const emptyForm = {
        category: 'fish',
        // Fish-specific
        fishName: '',
        size: '',           // fish size (e.g. "2-3 kg/piece")
        // Feed-specific
        feedType: '',
        // Medicine-specific
        medicineType: '',
        strength: '',
        // Feed & Medicine shared
        packingSize: '',
        // Common
        requiredQuantity: '',
        buyingPrice: '',
        phoneNumber: '',
        // Location
        district: '',
        localDistrict: '',
        policeStation: '',
        // Extra
        additionalRequirement: ''
    };

    const [formData, setFormData] = useState(emptyForm);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);

    // ── Populate from initialData (AI auto-fill) or user defaults ─────────
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const cat = (initialData.category || 'fish').toLowerCase();
                setFormData({
                    category: cat,
                    // Product name — try multiple field names
                    fishName: initialData.fishName || initialData.productName || '',
                    // Fish size — try fishSize first (AI), then size (legacy)
                    size: initialData.fishSize || initialData.size || '',
                    // Feed-specific
                    feedType: initialData.feedType || '',
                    // Medicine-specific
                    medicineType: initialData.medicineType || '',
                    strength: initialData.strength || '',
                    // Packing size — Feed & Medicine
                    packingSize: initialData.packingSize || '',
                    // Quantity — try to parse from structured or legacy string
                    requiredQuantity: initialData.requiredQuantity ||
                        (initialData.quantity ? `${initialData.quantity} ${initialData.unit || ''}`.trim() : ''),
                    // Budget
                    buyingPrice: initialData.buyingPrice || initialData.price || '',
                    phoneNumber: initialData.phoneNumber || user?.phone || '',
                    district: initialData.district || user?.district || '',
                    localDistrict: initialData.localDistrict || user?.localDistrict || '',
                    policeStation: initialData.policeStation || user?.policeStation || '',
                    additionalRequirement: initialData.additionalRequirement || ''
                });
            } else {
                setFormData(prev => ({
                    ...prev,
                    district: user?.district || '',
                    localDistrict: user?.localDistrict || '',
                    policeStation: user?.policeStation || '',
                    phoneNumber: user?.phone || ''
                }));
            }
            setPhotos([]);
        }
    }, [isOpen, user, initialData]);

    const handlePhotoChange = (e) => {
        if (e.target.files.length > 3) {
            toast.error(t.maxPhotos);
            return;
        }
        setPhotos(e.target.files);
    };

    const states = Object.keys(stateDistricts);

    const categories = [
        { id: 'fish',      label: t.categoryFish,  icon: '🐟' },
        { id: 'feed',      label: t.categoryFeed,  icon: '🌾' },
        { id: 'medicine',  label: t.categoryMed,   icon: '💊' },
        { id: 'equipment', label: t.categoryEquip, icon: '⚙️' }
    ];

    const cat = formData.category || 'fish';

    // ── Category-aware validation ──────────────────────────────────────────
    const validate = () => {
        if (!formData.fishName.trim()) {
            toast.error(
                cat === 'fish' ? (t.validationFishName || 'Please enter the fish name.') :
                cat === 'feed' ? (t.validationFeedName || 'Please enter the feed name.') :
                cat === 'equipment' ? (t.validationEquipName || 'Please enter the equipment name.') :
                (t.validationMedName || 'Please enter the medicine name.')
            );
            return false;
        }
        if (cat === 'fish' && !formData.size.trim()) {
            toast.error(t.validationFishSize || 'Please enter the fish size.');
            return false;
        }
        if ((cat === 'feed' || cat === 'medicine') && !formData.packingSize.trim()) {
            toast.error(t.validationPackingSize || 'Please enter the packing/size.');
            return false;
        }
        if (!formData.requiredQuantity.trim()) {
            toast.error(t.validationQuantity || 'Please enter the required quantity.');
            return false;
        }
        if (!formData.buyingPrice.trim()) {
            toast.error(t.validationBudget || 'Please enter your budget.');
            return false;
        }
        if (!formData.phoneNumber.trim() || formData.phoneNumber.length !== 10) {
            toast.error(t.validationPhone || 'Please enter a valid 10-digit mobile number.');
            return false;
        }
        if (!formData.district) {
            toast.error(t.validationState || 'Please select a state.');
            return false;
        }
        if (!formData.localDistrict) {
            toast.error(t.validationDistrict || 'Please select a district.');
            return false;
        }
        if (!formData.policeStation) {
            toast.error(t.validationPoliceStation || 'Please select a police station.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const data = new FormData();

        // Always include category
        data.append('category', cat);

        // Product name
        data.append('fishName', formData.fishName);

        // Fish-specific
        if (cat === 'fish') {
            data.append('size', formData.size);
        }

        // Feed-specific
        if (cat === 'feed') {
            data.append('feedType', formData.feedType);
            data.append('packingSize', formData.packingSize);
            // For backward compat — also store packingSize in size field
            data.append('size', formData.packingSize);
        }

        // Medicine-specific
        if (cat === 'medicine') {
            data.append('medicineType', formData.medicineType);
            data.append('strength', formData.strength);
            data.append('packingSize', formData.packingSize);
            // For backward compat
            data.append('size', formData.packingSize);
        }

        // Common fields
        data.append('requiredQuantity', formData.requiredQuantity);
        data.append('buyingPrice', formData.buyingPrice);
        data.append('phoneNumber', formData.phoneNumber);
        data.append('district', formData.district);
        data.append('localDistrict', formData.localDistrict);
        data.append('policeStation', formData.policeStation);
        data.append('additionalRequirement', formData.additionalRequirement);

        Array.from(photos).forEach(photo => data.append('photos', photo));

        try {
            await api.post('/posts', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success(t.postSubmitSuccess);
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.msg || t.updateFail);
        } finally {
            setLoading(false);
        }
    };

    // ── Category change — reset category-specific fields ──────────────────
    const handleCategoryChange = (newCat) => {
        setFormData(prev => ({
            ...prev,
            category: newCat,
            size: '',
            feedType: '',
            medicineType: '',
            strength: '',
            packingSize: ''
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">{t.newBuyingRequirement}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* ── Category Selector ──────────────────────────────── */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700">{t.selectCategory}</label>
                        <div className="grid grid-cols-4 gap-3">
                            {categories.map((c) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => handleCategoryChange(c.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                                        cat === c.id
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                                    }`}
                                >
                                    <span className="text-2xl mb-1">{c.icon}</span>
                                    <span className="text-xs font-bold">{c.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Product Name ───────────────────────────────────── */}
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">
                            {cat === 'fish' ? (t.fishName || 'Fish Name') :
                             cat === 'feed' ? (t.feedName || 'Feed Name') :
                             cat === 'equipment' ? (t.equipName || 'Equipment Name') :
                             (t.medName || 'Medicine Name')}
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                            placeholder={
                                cat === 'fish' ? (t.egFish || 'e.g. Rohu') :
                                cat === 'feed' ? (t.egFeedName || 'e.g. Pre-Starter Fish Feed') :
                                cat === 'equipment' ? (t.egEquipName || 'e.g. Aerator, Water Pump, Net') :
                                (t.egMedName || 'e.g. C-Pack')
                            }
                            value={formData.fishName}
                            onChange={(e) => setFormData({ ...formData, fishName: e.target.value })}
                        />
                    </div>

                    {/* ── FISH: Fish Size ────────────────────────────────── */}
                    {cat === 'fish' && (
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">
                                {t.fishSize || 'Fish Size'}
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t.egFishSize || 'e.g. 2-3 kg per piece'}
                                value={formData.size}
                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                            />
                        </div>
                    )}

                    {/* ── FEED: Feed Type ────────────────────────────────── */}
                    {cat === 'feed' && (
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">
                                {t.feedType || 'Feed Type'}
                                <span className="text-gray-400 font-normal ml-1">({t.optional || 'Optional'})</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t.egFeedType || 'e.g. Pre-Starter / Starter / Grower / Finisher'}
                                value={formData.feedType}
                                onChange={(e) => setFormData({ ...formData, feedType: e.target.value })}
                            />
                        </div>
                    )}

                    {/* ── MEDICINE: Medicine Type ────────────────────────── */}
                    {cat === 'medicine' && (
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">
                                {t.medicineType || 'Medicine Type'}
                                <span className="text-gray-400 font-normal ml-1">({t.optional || 'Optional'})</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t.egMedicineType || 'e.g. Powder / Liquid / Tablet'}
                                value={formData.medicineType}
                                onChange={(e) => setFormData({ ...formData, medicineType: e.target.value })}
                            />
                        </div>
                    )}

                    {/* ── MEDICINE: Strength / Dosage ────────────────────── */}
                    {cat === 'medicine' && (
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">
                                {t.strength || 'Strength / Dosage'}
                                <span className="text-gray-400 font-normal ml-1">({t.optional || 'Optional'})</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t.egStrength || 'e.g. 500 mg'}
                                value={formData.strength}
                                onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                            />
                        </div>
                    )}

                    {/* ── FEED & MEDICINE: Packing / Size ───────────────── */}
                    {(cat === 'feed' || cat === 'medicine') && (
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">
                                {t.packingSizeLabel || 'Packing / Size'}
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={
                                    cat === 'feed'
                                        ? (t.egPackingFeed || 'e.g. 50 kg/bag')
                                        : (t.egPackingMed || 'e.g. 1 kg pack / 500 ml bottle')
                                }
                                value={formData.packingSize}
                                onChange={(e) => setFormData({ ...formData, packingSize: e.target.value })}
                            />
                        </div>
                    )}

                    {/* ── Required Quantity & Budget ─────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">
                                {t.requiredQty || 'Required Quantity'}
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={
                                    cat === 'fish'
                                        ? (t.egReqQtyFish || 'e.g. 1000 kg')
                                        : cat === 'feed'
                                            ? (t.egReqQtyFeed || 'e.g. 100 bags')
                                            : cat === 'equipment'
                                                ? (t.egReqQtyEquip || 'e.g. 5 pieces')
                                                : (t.egReqQtyMed || 'e.g. 20 packs')
                                }
                                value={formData.requiredQuantity}
                                onChange={(e) => setFormData({ ...formData, requiredQuantity: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">
                                {t.budgetCurrency || 'Budget (₹)'}
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={
                                    cat === 'fish'
                                        ? (t.egBudgetFish || 'e.g. ₹220/kg')
                                        : cat === 'feed'
                                            ? (t.egBudgetFeed || 'e.g. ₹2500/bag')
                                            : cat === 'equipment'
                                                ? (t.egBudgetEquip || 'e.g. ₹15000/piece')
                                                : (t.egBudgetMed || 'e.g. ₹800/pack')
                                }
                                value={formData.buyingPrice}
                                onChange={(e) => setFormData({ ...formData, buyingPrice: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* ── Mobile Number ──────────────────────────────────── */}
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">{t.mobileNumberLabel || 'Mobile Number'}</label>
                        <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent bg-white">
                            <select className="bg-gray-50 border-r border-gray-200 px-3 py-3 outline-none text-gray-700 text-sm font-medium cursor-pointer h-[50px]">
                                <option value="+91">🇮🇳 +91</option>
                            </select>
                            <input
                                type="tel"
                                required
                                maxLength={10}
                                className="w-full px-4 py-3 outline-none bg-transparent"
                                placeholder="98XXXXXXXX"
                                value={formData.phoneNumber}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 10) setFormData({ ...formData, phoneNumber: val });
                                }}
                            />
                        </div>
                    </div>

                    {/* ── Location: State / District / Police Station ─────── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.district || 'State'}</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary h-[50px]"
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value, localDistrict: '', policeStation: '' })}
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
                                onChange={(e) => setFormData({ ...formData, localDistrict: e.target.value, policeStation: '' })}
                                required
                                disabled={!formData.district}
                            >
                                <option value="">{t.selectBtn || 'Select'}</option>
                                {formData.district && stateDistricts[formData.district]?.map(d => (
                                    <option key={d} value={d}>{t.districts?.[d] || d}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{t.policeStation || 'Police Station'}</label>
                            <input 
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t.enterPoliceStation || 'Enter Police Station'}
                                value={formData.policeStation}
                                onChange={(e) => setFormData({ ...formData, policeStation: e.target.value })}
                                required
                                disabled={!formData.localDistrict}
                            />
                        </div>
                    </div>

                    {/* ── Additional Requirement ─────────────────────────── */}
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">
                            {t.additionalRequirement || 'Additional Requirement'}
                            <span className="text-gray-400 font-normal ml-1">({t.optional || 'Optional'})</span>
                        </label>
                        <textarea
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary resize-none"
                            placeholder={
                                cat === 'fish'
                                    ? (t.egAdditionalFish || 'e.g. Fresh fish only, delivery required...')
                                    : cat === 'feed'
                                        ? (t.egAdditionalFeed || 'e.g. Preferred brand or delivery requirement...')
                                        : cat === 'equipment'
                                            ? (t.egAdditionalEquip || 'e.g. Prefer double impeller aerator, delivery required...')
                                            : (t.egAdditionalMed || 'e.g. Preferred brand...')
                            }
                            value={formData.additionalRequirement}
                            onChange={(e) => setFormData({ ...formData, additionalRequirement: e.target.value })}
                        />
                    </div>

                    {/* ── Photo Upload ───────────────────────────────────── */}
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">{t.photoUploadOptional}</label>
                        <div className="relative h-28 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer overflow-hidden">
                            <input
                                type="file" multiple accept="image/*"
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

                    {/* ── Submit ─────────────────────────────────────────── */}
                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                    >
                        {loading ? t.submitting : <><Plus size={20} /> {t.publishRequirement}</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
