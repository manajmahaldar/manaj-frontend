import { useRef, useState } from 'react';
import {
    CheckCircle2, Circle, Upload, ImagePlus, Video,
    Sparkles, Rocket, Loader2, X, Fish, ShoppingBag, Tag,
    MapPin, Phone, AlignLeft, Hash, Layers, Package, Beaker, FlaskConical
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────────────────────────────────────
// Field metadata — icons and labels
// ─────────────────────────────────────────────────────────────────────────────

const FIELD_META = {
    actionType:           { icon: ShoppingBag, label: 'Action Type' },
    category:             { icon: Layers,      label: 'Category' },
    productName:          { icon: Fish,         label: 'Product Name' },
    fishSize:             { icon: Hash,         label: 'Fish Size' },
    feedType:             { icon: Layers,       label: 'Feed Type' },
    packingSize:          { icon: Package,      label: 'Packing / Size' },
    medicineType:         { icon: Beaker,       label: 'Medicine Type' },
    strength:             { icon: FlaskConical, label: 'Strength / Dosage' },
    quantity:             { icon: Hash,         label: 'Quantity' },
    unit:                 { icon: Layers,       label: 'Unit' },
    price:                { icon: Tag,          label: 'Selling Price (₹)' },
    mrp:                  { icon: Tag,          label: 'MRP / Original Price (₹)' },
    district:             { icon: MapPin,       label: 'State' },
    localDistrict:        { icon: MapPin,       label: 'District' },
    policeStation:        { icon: MapPin,       label: 'Police Station' },
    phoneNumber:          { icon: Phone,        label: 'Contact Number' },
    additionalRequirement:{ icon: AlignLeft,    label: 'Additional Requirement' },
    description:          { icon: AlignLeft,    label: 'Description' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Category-specific step sequences
// ─────────────────────────────────────────────────────────────────────────────

const STEPS_BUY_FISH = [
    'actionType', 'category', 'productName', 'fishSize',
    'quantity', 'unit', 'price',
    'district', 'localDistrict', 'policeStation', 'phoneNumber', 'additionalRequirement'
];

const STEPS_BUY_FEED = [
    'actionType', 'category', 'productName', 'feedType', 'packingSize',
    'quantity', 'unit', 'price',
    'district', 'localDistrict', 'policeStation', 'phoneNumber', 'additionalRequirement'
];

const STEPS_BUY_MEDICINE = [
    'actionType', 'category', 'productName', 'packingSize',
    'quantity', 'unit', 'price',
    'district', 'localDistrict', 'policeStation', 'phoneNumber', 'additionalRequirement'
];

// Standard selling (Fish / Feed / Medicine / Spawn / Fingerling) — quantity + unit + price + mrp
const STEPS_SELL = [
    'actionType', 'category', 'productName',
    'quantity', 'unit', 'price', 'mrp',
    'district', 'localDistrict', 'policeStation', 'phoneNumber', 'description'
];

// Equipment selling — no quantity/unit (whole-item), but needs mrp for discount
const STEPS_SELL_EQUIPMENT = [
    'actionType', 'category', 'productName',
    'price', 'mrp',
    'district', 'localDistrict', 'policeStation', 'phoneNumber', 'description'
];

function getSteps(extractedData) {
    const isBuying = extractedData?.actionType === 'buying';
    if (!isBuying) {
        const cat = (extractedData?.category || '').toLowerCase();
        if (cat === 'equipment') return STEPS_SELL_EQUIPMENT;
        return STEPS_SELL;
    }
    const cat = (extractedData?.category || '').toLowerCase();
    if (cat === 'feed') return STEPS_BUY_FEED;
    if (cat === 'medicine') return STEPS_BUY_MEDICINE;
    return STEPS_BUY_FISH; // default + fish
}

// ─────────────────────────────────────────────────────────────────────────────
// Read a field value from extractedData for display
// ─────────────────────────────────────────────────────────────────────────────

function getFieldDisplay(data, field) {
    if (!data) return null;
    switch (field) {
        case 'actionType':
            return data.actionType ? (data.actionType === 'selling' ? '🛒 Selling' : '🛒 Buying') : null;
        case 'category':
            if (!data.category) return null;
            const catIcons = { Fish: '🐟', Feed: '🌾', Medicine: '💊' };
            return `${catIcons[data.category] || ''} ${data.category}`;
        case 'productName':
            return data.productName || null;
        case 'fishSize':
            return data.fishSize || null;
        case 'feedType':
            return data.feedType || null;
        case 'packingSize':
            return data.packingSize || null;
        case 'medicineType':
            return data.medicineType || null;
        case 'strength':
            return data.strength || null;
        case 'quantity':
            return data.quantity ? `${data.quantity} ${data.unit || ''}`.trim() : null;
        case 'unit':
            return null; // shown as part of quantity
        case 'price':
            return data.price
                ? `₹${data.price}${data.unit && (data.category || '').toLowerCase() !== 'equipment' ? `/${data.unit}` : ''}`
                : null;
        case 'mrp':
            return data.mrp ? `₹${data.mrp}` : null;
        case 'district':
            return data.district || null;
        case 'localDistrict':
            return data.localDistrict || null;
        case 'policeStation':
            return data.policeStation || null;
        case 'phoneNumber':
            return data.phoneNumber ? `+91 ${data.phoneNumber}` : null;
        case 'additionalRequirement':
            return data.additionalRequirement || null;
        case 'description':
            if (!data.description) return null;
            return data.description.length > 60 ? data.description.slice(0, 60) + '...' : data.description;
        default:
            return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const AIVoiceListingPanel = ({ extractedData, onClose, onSubmitSuccess }) => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaPreviews, setMediaPreviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const isBuying = extractedData?.actionType === 'buying';
    const allSteps = getSteps(extractedData);

    // Deduplicate to avoid showing 'unit' as a separate row (shown inside quantity)
    const displaySteps = allSteps.filter(f => f !== 'unit');

    const canSubmit = isBuying
        ? !!(extractedData?.productName && extractedData?.price && extractedData?.district)
        : !!(extractedData?.productName && extractedData?.price);

    const completedSteps = displaySteps.filter(f => !!getFieldDisplay(extractedData, f)).length;
    const progressPct = Math.round((completedSteps / displaySteps.length) * 100);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            toast.error('Max 3 files allowed (images or video).');
            return;
        }
        let valid = true;
        for (const file of files) {
            if (file.type.startsWith('video/')) {
                try {
                    await new Promise((resolve, reject) => {
                        const video = document.createElement('video');
                        video.preload = 'metadata';
                        video.src = URL.createObjectURL(file);
                        video.onloadedmetadata = () => {
                            URL.revokeObjectURL(video.src);
                            if (video.duration > 11) reject(new Error('Video must be 10 seconds or less.'));
                            else resolve();
                        };
                        video.onerror = () => reject(new Error('Failed to load video.'));
                    });
                } catch (err) {
                    toast.error(err.message);
                    valid = false;
                    break;
                }
            }
        }
        if (!valid) { e.target.value = ''; return; }
        setMediaFiles(files);
        setMediaPreviews(files.map(f => ({ url: URL.createObjectURL(f), type: f.type, name: f.name })));
    };

    const removeMedia = (idx) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== idx));
        setMediaPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async () => {
        if (!canSubmit) {
            toast.error('Please provide at least a Product Name, Budget/Price, and Location to publish.');
            return;
        }
        setSubmitting(true);
        try {
            const { default: api } = await import('../../utils/api');
            const formData = new FormData();

            if (isBuying) {
                // ── Buying Requirement ─────────────────────────────────────
                const cat = (extractedData.category || 'Fish').toLowerCase();

                formData.append('category', cat);
                formData.append('fishName', extractedData.productName || '');

                if (cat === 'fish') {
                    formData.append('size', extractedData.fishSize || '');
                }
                if (cat === 'feed') {
                    formData.append('feedType', extractedData.feedType || '');
                    formData.append('packingSize', extractedData.packingSize || '');
                    formData.append('size', extractedData.packingSize || ''); // backward compat
                }
                if (cat === 'medicine') {
                    formData.append('medicineType', extractedData.medicineType || '');
                    formData.append('strength', extractedData.strength || '');
                    formData.append('packingSize', extractedData.packingSize || '');
                    formData.append('size', extractedData.packingSize || ''); // backward compat
                }

                formData.append('requiredQuantity',
                    extractedData.quantity
                        ? `${extractedData.quantity} ${extractedData.unit || ''}`.trim()
                        : '');
                formData.append('buyingPrice', extractedData.price || '');
                formData.append('district', extractedData.district || '');
                formData.append('localDistrict', extractedData.localDistrict || '');
                formData.append('policeStation', extractedData.policeStation || '');
                formData.append('phoneNumber', extractedData.phoneNumber || '');
                formData.append('additionalRequirement', extractedData.additionalRequirement || '');

            } else {
                // ── Selling Listing ────────────────────────────────────────
                const isEquipment = (extractedData.category || '').toLowerCase() === 'equipment';
                formData.append('productName', extractedData.productName || '');
                formData.append('category', extractedData.category || 'Fish');
                formData.append('price', extractedData.price || '');
                formData.append('mrp', extractedData.mrp || '');
                // Equipment is sold as a whole item — no quantity/unit
                if (!isEquipment) {
                    formData.append('quantity', extractedData.quantity || '');
                    formData.append('unit', extractedData.unit || 'kg');
                }
                formData.append('description', extractedData.description || '');
                formData.append('district', extractedData.district || '');
                formData.append('localDistrict', extractedData.localDistrict || '');
                formData.append('policeStation', extractedData.policeStation || '');
                formData.append('phoneNumber', extractedData.phoneNumber || '');
            }

            Array.from(mediaFiles).forEach(f => formData.append('photos', f));

            const endpoint = isBuying ? '/posts' : '/listings';
            await api.post(endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

            toast.success(
                isBuying ? 'Buying requirement created successfully!' : 'Listing created successfully!',
                { duration: 4000 }
            );
            onSubmitSuccess?.();
        } catch (err) {
            console.error(err);
            toast.error((err?.response?.data?.msg) || 'Failed to create. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const activeField = extractedData?.nextField;
    const cat = (extractedData?.category || '').toLowerCase();

    const panelTitle = isBuying
        ? `${cat === 'fish' ? '🐟' : cat === 'feed' ? '🌾' : cat === 'medicine' ? '💊' : '🛒'} Buying Requirement`
        : '🛒 Selling Listing';

    return (
        <div className="w-full md:w-80 lg:w-96 bg-white flex flex-col h-auto md:h-[82vh] overflow-hidden">

            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="animate-pulse" />
                    <span className="font-bold text-sm">{panelTitle}</span>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <X size={18} />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="px-4 pt-3 pb-2 bg-white border-b border-gray-100">
                <div className="flex justify-between text-[10px] text-gray-500 font-semibold mb-1.5">
                    <span>{canSubmit ? 'Ready to submit' : 'Collecting details...'}</span>
                    <span className={canSubmit ? 'text-emerald-600' : 'text-amber-600'}>{progressPct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ${canSubmit ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-emerald-500'}`}
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            {/* Steps */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scroll-smooth">
                {displaySteps.map((field) => {
                    const value = getFieldDisplay(extractedData, field);
                    const isFilled = !!value;
                    const isActive = activeField === field;
                    const meta = FIELD_META[field] || { icon: Circle, label: field };
                    const Icon = meta.icon;

                    // Skip 'additionalRequirement' row if it's empty and not the active field (truly optional)
                    if (field === 'additionalRequirement' && !isFilled && !isActive) return null;

                    return (
                        <div
                            key={field}
                            ref={el => {
                                if (isActive && el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all duration-300 ${
                                isActive
                                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                                    : isFilled
                                        ? 'bg-emerald-50 border-emerald-200'
                                        : 'bg-gray-50 border-gray-100 opacity-60'
                            }`}
                        >
                            <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                isFilled ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                            }`}>
                                {isFilled ? <CheckCircle2 size={14} /> : <Icon size={12} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-[10px] font-bold uppercase tracking-wide ${
                                    isFilled ? 'text-emerald-700' : 'text-gray-400'
                                }`}>
                                    {meta.label}
                                </p>
                                {value
                                    ? <p className="text-xs font-semibold text-gray-800 truncate">{value}</p>
                                    : <p className="text-xs text-gray-400 italic">
                                        {isActive ? 'Listening or type now...' : 'Not yet specified'}
                                      </p>
                                }
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Media Upload + Submit */}
            <div className="p-3 border-t border-gray-100 space-y-3 bg-gradient-to-b from-white to-emerald-50/40">
                <div>
                    <p className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <ImagePlus size={14} className="text-emerald-600" />
                        Add Photos / Video
                        <span className="text-gray-400 font-normal">(optional, max 3)</span>
                    </p>
                    {mediaPreviews.length > 0 ? (
                        <div className="flex gap-2 flex-wrap mb-2">
                            {mediaPreviews.map((p, i) => (
                                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                                    {p.type.startsWith('video/') ? (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                            <Video size={20} className="text-white" />
                                        </div>
                                    ) : (
                                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                                    )}
                                    <button
                                        onClick={() => removeMedia(i)}
                                        className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                            {mediaPreviews.length < 3 && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-16 h-16 border-2 border-dashed border-emerald-300 rounded-xl flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-colors"
                                >
                                    <Upload size={18} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-16 border-2 border-dashed border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-emerald-600 hover:bg-emerald-50 transition-all hover:border-emerald-400"
                        >
                            <Upload size={18} />
                            <span className="text-xs font-semibold">Tap to upload photo or video</span>
                        </button>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={submitting || !canSubmit}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 text-sm transition-all active:scale-95"
                >
                    {submitting
                        ? <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                        : <><Rocket size={18} /> {isBuying ? 'Create Buying Requirement' : 'Create Listing'}</>
                    }
                </button>
            </div>
        </div>
    );
};

export default AIVoiceListingPanel;
