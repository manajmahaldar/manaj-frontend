import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowLeft, ShieldCheck, Ruler, Box, IndianRupee, Building2, Map } from 'lucide-react';
import api from '../../../utils/api';
import { useLanguage } from '../../../context/LanguageContext';
import { AuthContext } from '../../../context/AuthContext';
import SEO from '../../../components/common/SEO';
import OptimizedImage from '../../../components/common/OptimizedImage';
import ContactButtons from '../../../components/common/ContactButtons';
import OrderModal from '../components/OrderModal';
import { PageLoaderSkeleton } from '../../../components/common/Skeletons';

const ProductDetails = () => {
    const { type, id } = useParams(); // type is either 'selling' or 'buying'
    const navigate = useNavigate();
    const { t, formatDigit, language } = useLanguage();
    const { user } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const endpoint = type === 'selling' ? `/listings/${id}` : `/posts/${id}`;
                const res = await api.get(endpoint);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
                setError(t.noDataFound || 'Product not found');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id, type]);

    if (loading) return <PageLoaderSkeleton />;
    if (error || !product) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-700">{error}</h2>
            <button onClick={() => navigate(-1)} className="text-primary font-medium hover:underline flex items-center gap-2">
                <ArrowLeft size={16} /> {t.back || 'Back'}
            </button>
        </div>
    );

    const isOwner = user?.id === (type === 'selling' ? product.sellerId?._id : product.traderId?._id);
    const owner = type === 'selling' ? product.sellerId : product.traderId;

    const media = [];
    if (product.video) media.push({ type: 'video', url: product.video });
    if (product.photos && product.photos.length > 0) {
        product.photos.forEach(p => media.push({ type: 'image', url: p }));
    }
    if (media.length === 0) {
        media.push({ type: 'image', url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800' });
    }

    const formatPostDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    };


    return (
        <div className="pb-20 bg-gray-50 min-h-screen">
            <SEO 
                title={`${type === 'selling' ? product.productName : product.fishName} | ${t.marketplaceHub || 'Marketplace'}`}
                description={product.description || ''}
            />

            <div className="max-w-6xl mx-auto px-4 pt-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-semibold bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100"
                >
                    <ArrowLeft size={20} />
                    {t.back || 'Back'}
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ── Media Gallery ── */}
                    <div className="space-y-4">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg bg-black">
                            {media[currentMediaIndex].type === 'video' ? (
                                <video 
                                    src={media[currentMediaIndex].url}
                                    controls
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <OptimizedImage 
                                    src={media[currentMediaIndex].url}
                                    alt={type === 'selling' ? product.productName : product.fishName}
                                    className="w-full h-full object-contain"
                                />
                            )}
                            
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-black shadow-md ${
                                    type === 'selling' ? 'bg-primary text-white' : 'bg-blue-600 text-white'
                                }`}>
                                    {t.categories?.[product.category] || product.category}
                                </span>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {media.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {media.map((item, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setCurrentMediaIndex(idx)}
                                        className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                                            currentMediaIndex === idx ? 'border-primary shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        {item.type === 'video' ? (
                                            <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">
                                                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">▶</div>
                                            </div>
                                        ) : (
                                            <img loading="lazy" src={item.url} alt="thumbnail" className="w-full h-full object-cover" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ── Location Card ── */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center gap-2">
                                <MapPin size={18} className="text-primary" />
                                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">
                                    {t.location || 'Location Details'}
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {/* State */}
                                <div className="flex items-center gap-4 px-6 py-4">
                                    <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                                        <Map size={16} className="text-violet-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                                            {t.district || 'State'}
                                        </p>
                                        <p className="font-bold text-gray-900">
                                            {t.districts?.[product.district] || product.district || '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* District */}
                                <div className="flex items-center gap-4 px-6 py-4">
                                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <MapPin size={16} className="text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                                            {t.localDistrict || 'District'}
                                        </p>
                                        <p className="font-bold text-gray-900">
                                            {t.districts?.[product.localDistrict] || product.localDistrict || '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* Police Station */}
                                <div className="flex items-center gap-4 px-6 py-4">
                                    <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <Building2 size={16} className="text-green-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                                            {t.policeStation || 'Police Station'}
                                        </p>
                                        <p className="font-bold text-gray-900">
                                            {t.policeStations?.[product.policeStation] || product.policeStation || '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Details Section ── */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start gap-4 mb-4">
                                <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
                                    {type === 'selling' ? product.productName : product.fishName}
                                </h1>
                                {type === 'buying' && (
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap border border-blue-100">
                                        {t.buyingDemand || 'Buying Demand'}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-end gap-2 mb-6">
                                <span className="text-4xl font-black text-primary">
                                    {language === 'bn' ? 'টাকা' : '₹'} {formatDigit(type === 'selling' ? product.price : product.buyingPrice)}
                                </span>
                                {type === 'selling' && (
                                    <span className="text-lg text-gray-500 font-bold mb-1">
                                        / {t.per} {product.unit}
                                    </span>
                                )}
                            </div>

                            {/* Quick info chips */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">{t.postedOn || 'Posted On'}</p>
                                        <p className="font-semibold text-gray-900">{formatPostDate(product.createdAt)}</p>
                                    </div>
                                </div>

                                {/* Quantity (selling) */}
                                {type === 'selling' && product.quantity && (
                                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Box size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">{t.quantity || 'Available'}</p>
                                            <p className="font-semibold text-gray-900">{formatDigit(product.quantity)} {product.unit}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Size & required qty (buying) */}
                                {type === 'buying' && (
                                    <>
                                        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Ruler size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase">{product.category === 'fish' ? (t.size || 'Size') : (t.packingSize || 'Pack Size')}</p>
                                                <p className="font-semibold text-gray-900">{formatDigit(product.size)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Box size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase">{t.quantity || 'Required Qty'}</p>
                                                <p className="font-semibold text-gray-900">{formatDigit(product.requiredQuantity)}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Description */}
                            {type === 'selling' && product.description && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-black text-gray-900 mb-3">{t.description || 'Description'}</h3>
                                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 whitespace-pre-line">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* ── Seller / Buyer Info ── */}
                            {owner && (
                                <div className="border-t border-gray-100 pt-6 mt-6">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                        {type === 'selling' ? (t.sellerDetails || 'Seller Details') : (t.buyerDetails || 'Buyer Details')}
                                    </h3>
                                    <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                                        <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                                            {owner.profilePicture ? (
                                                <img loading="lazy" src={owner.profilePicture} alt={owner.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl font-bold text-gray-400">{owner.name?.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                                {owner.name}
                                                {owner.verifiedStatus === true && (
                                                    <ShieldCheck className="text-green-500" size={18} title="Verified User" />
                                                )}
                                            </h4>
                                            <p className="text-sm text-gray-500 capitalize font-medium">{owner.role}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Action Buttons ── */}
                            <div className="mt-8">
                                {!isOwner ? (
                                    user?.role === 'trader' && type === 'selling' ? (
                                        <button 
                                            onClick={() => setIsOrderModalOpen(true)}
                                            className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:scale-[0.98]"
                                        >
                                            <Box size={24} /> {t.orderNow || 'Order Now'}
                                        </button>
                                    ) : (
                                        <ContactButtons 
                                            phone={product.phoneNumber} 
                                            message={t.contactMessageTemplate?.replace('{fishName}', type === 'selling' ? product.productName : product.fishName)}
                                            variant="dark"
                                        />
                                    )
                                ) : (
                                    <div className="bg-orange-50 text-orange-700 p-4 rounded-2xl text-center font-bold border border-orange-100">
                                        {t.ownListingWarning || "This is your own listing"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {type === 'selling' && (
                <OrderModal 
                    isOpen={isOrderModalOpen} 
                    onClose={() => setIsOrderModalOpen(false)} 
                    listing={product}
                    onSuccess={() => {}}
                />
            )}
        </div>
    );
};

export default ProductDetails;
