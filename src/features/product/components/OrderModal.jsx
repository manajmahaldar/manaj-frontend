import { useState } from 'react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';
import { X, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const OrderModal = ({ isOpen, onClose, onSuccess, listing }) => {
    const { t, formatDigit, language } = useLanguage();
    const [quantity, setQuantity] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (!listing) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/orders', {
                listingId: listing._id,
                quantity,
                message
            });
            toast.success(t.orderSuccessMessage);
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.msg || t.orderFail);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">{t.confirmOrder}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                        <p className="text-sm text-blue-700 font-bold">{listing.productName}</p>
                        <p className="text-lg font-black text-blue-900">{language === 'bn' ? 'টাকা' : '₹'} {formatDigit(listing.price)} / {t.units?.[listing.unit] || listing.unit}</p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">{t.quantity} ({t.units?.[listing.unit] || listing.unit})</label>
                        <input 
                            type="number" required min="0.1" step="0.1"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                            placeholder={t.howMuchTake}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">{t.msgOptional}</label>
                        <textarea 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary h-24"
                            placeholder={t.saySomethingToSeller}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>

                    <div className="pt-2">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <span className="text-gray-500 font-medium">{t.totalEstimatedPrice}</span>
                            <span className="text-xl font-bold text-primary">
                                {language === 'bn' ? 'টাকা' : '₹'} {quantity ? formatDigit((parseFloat(listing.price) * parseFloat(quantity)).toFixed(2)) : formatDigit('0.00')}
                            </span>
                        </div>
                        <button 
                            type="submit" disabled={loading}
                            className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                        >
                            {loading ? t.processing : <><ShoppingBag size={20} /> {t.placeOrder}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderModal;
