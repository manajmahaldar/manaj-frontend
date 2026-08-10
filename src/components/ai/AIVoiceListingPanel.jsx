import { useRef, useState } from 'react';
import {
    CheckCircle2, Circle, Upload, ImagePlus, Video,
    Sparkles, Rocket, Loader2, X, Fish, ShoppingBag, Tag,
    MapPin, Phone, AlignLeft, Hash, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

const STEP_ICONS = {
    actionType: ShoppingBag,
    category: Layers,
    productName: Fish,
    quantity: Hash,
    price: Tag,
    district: MapPin,
    localDistrict: MapPin,
    policeStation: MapPin,
    phoneNumber: Phone,
    description: AlignLeft,
};

const STEP_LABELS = {
    actionType: 'Action Type',
    category: 'Category',
    productName: 'Product Name',
    quantity: 'Quantity',
    price: 'Price / Budget',
    district: 'State',
    localDistrict: 'District',
    policeStation: 'Police Station',
    phoneNumber: 'Contact Number',
    description: 'Description',
};

const ALL_STEPS = Object.keys(STEP_LABELS);

function getFieldValue(data, field) {
    if (!data) return null;
    switch (field) {
        case 'actionType': return data.actionType ? (data.actionType === 'selling' ? 'Selling' : 'Buying') : null;
        case 'category': return data.category || null;
        case 'productName': return data.productName || null;
        case 'quantity': return data.quantity ? `${data.quantity} ${data.unit || 'kg'}` : null;
        case 'price': return data.price ? `Rs.${data.price}` : null;
        case 'district': return data.district || null;
        case 'localDistrict': return data.localDistrict || null;
        case 'policeStation': return data.policeStation || null;
        case 'phoneNumber': return data.phoneNumber || null;
        case 'description': return data.description ? (data.description.length > 60 ? data.description.slice(0, 60) + '...' : data.description) : null;
        default: return null;
    }
}

const AIVoiceListingPanel = ({ extractedData, onClose, onSubmitSuccess }) => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaPreviews, setMediaPreviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const canSubmit = !!(extractedData?.productName && extractedData?.price);
    const completedSteps = ALL_STEPS.filter(f => !!getFieldValue(extractedData, f)).length;
    const progressPct = Math.round((completedSteps / ALL_STEPS.length) * 100);

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
            toast.error('Please provide at least a Product Name and Price to publish.');
            return;
        }
        setSubmitting(true);
        try {
            const { default: api } = await import('../../utils/api');
            const formData = new FormData();
            const isBuying = extractedData.actionType === 'buying';
            if (isBuying) {
                formData.append('fishName', extractedData.productName || '');
                formData.append('buyingPrice', extractedData.price || '');
                formData.append('requiredQuantity', extractedData.quantity
                    ? `${extractedData.quantity} ${extractedData.unit || 'kg'}`
                    : '');
                formData.append('size', '');
                formData.append('category', (extractedData.category || 'fish').toLowerCase());
            } else {
                formData.append('productName', extractedData.productName || '');
                formData.append('category', extractedData.category || 'Fish');
                formData.append('price', extractedData.price || '');
                formData.append('quantity', extractedData.quantity || '');
                formData.append('unit', extractedData.unit || 'kg');
                formData.append('description', extractedData.description || '');
            }
            formData.append('district', extractedData.district || 'West Bengal');
            formData.append('localDistrict', extractedData.localDistrict || 'Purba Medinipur');
            formData.append('policeStation', extractedData.policeStation || 'Tamluk');
            formData.append('phoneNumber', extractedData.phoneNumber || '');
            Array.from(mediaFiles).forEach(f => formData.append('photos', f));
            const endpoint = isBuying ? '/posts' : '/listings';
            await api.post(endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Listing created successfully!', { duration: 4000 });
            onSubmitSuccess?.();
        } catch (err) {
            console.error(err);
            toast.error((err && err.response && err.response.data && err.response.data.msg) || 'Failed to create listing.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full md:w-80 lg:w-96 bg-white flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="animate-pulse" />
                    <span className="font-bold text-sm">
                        Listing Preview Card
                    </span>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <X size={18} />
                </button>
            </div>

            <div className="px-4 pt-3 pb-2 bg-white border-b border-gray-100">
                <div className="flex justify-between text-[10px] text-gray-500 font-semibold mb-1.5">
                    <span>{canSubmit ? 'Ready for review & publishing' : 'Extracting details...'}</span>
                    <span className={canSubmit ? 'text-emerald-600' : 'text-amber-600'}>{progressPct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ${canSubmit ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-emerald-500'}`}
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {ALL_STEPS.map((field) => {
                    const value = getFieldValue(extractedData, field);
                    const isFilled = !!value;
                    const Icon = STEP_ICONS[field] || Circle;
                    return (
                        <div
                            key={field}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all duration-300 ${
                                isFilled
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
                                    {STEP_LABELS[field]}
                                </p>
                                {value
                                    ? <p className="text-xs font-semibold text-gray-800 truncate">{value}</p>
                                    : <p className="text-xs text-gray-400 italic">Not specified (speak to add)</p>
                                }
                            </div>
                        </div>
                    );
                })}
            </div>

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
                                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                    className="w-16 h-16 border-2 border-dashed border-emerald-300 rounded-xl flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-colors"
                                >
                                    <Upload size={18} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
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
                        ? <><Loader2 size={18} className="animate-spin" /> Publishing...</>
                        : <><Rocket size={18} /> Create Listing Now</>
                    }
                </button>
            </div>
        </div>
    );
};

export default AIVoiceListingPanel;
