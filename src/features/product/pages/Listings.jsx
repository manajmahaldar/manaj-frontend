import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../../utils/api';
import ListingCard from '../components/ListingCard';
import BuyingPostCard from '../../../components/trader/BuyingPostCard';
import { CardSkeleton, PostSkeleton } from '../../../components/common/Skeletons';
import { Search, Filter, MapPin, X, ShoppingBag, ArrowUpRight, ArrowDownRight, Mic } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { AuthContext } from '../../../context/AuthContext';
import SEO from '../../../components/common/SEO';
import toast from 'react-hot-toast';

const Listings = () => {
    const { t, formatDigit, language } = useLanguage();
    const { user } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [listings, setListings] = useState([]);
    const [buyingPosts, setBuyingPosts] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
    const [loading, setLoading] = useState(true);
    
    // Filter States
    const [viewType, setViewType] = useState(searchParams.get('view') || 'selling');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [district, setDistrict] = useState(searchParams.get('district') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error(t.voiceSearchNotSupported || 'Voice search is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            toast.success(t.listening || 'Listening...', { icon: '🎙️' });
        };

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            setSearch(speechResult);
            toast.success(speechResult);
        };

        recognition.onerror = (event) => {
            if (event.error !== 'no-speech') {
                toast.error('Voice search failed. Please try again.');
            }
        };

        recognition.start();
    };

    const districtKeys = Object.keys(t.districts || {});
    const categoryKeys = ['Spawn/Seed', 'Feed', 'Medicine', 'Fish', 'Equipment'];


    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
            const params = {};
            if (viewType !== 'selling') params.view = viewType;
            if (category) params.category = category;
            if (search) params.search = search;
            if (district) params.district = district;
            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;
            if (page > 1) params.page = page;
            setSearchParams(params);
        }, 500);

        return () => clearTimeout(timer);
    }, [viewType, category, district, search, minPrice, maxPrice, page]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (viewType === 'selling') {
                const res = await api.get(`/listings?category=${category}&district=${district}&search=${search}&page=${page}&limit=12`);
                setListings(res.data.listings);
                setPagination(res.data.pagination);
            } else {
                const res = await api.get(`/posts?category=${category}&district=${district}&search=${search}&page=${page}&limit=12`);
                setBuyingPosts(res.data.posts);
                setPagination(res.data.pagination);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setCategory('');
        setSearch('');
        setDistrict('');
        setMinPrice('');
        setMaxPrice('');
        setPage(1);
    };

    return (
        <div className="pb-20 bg-gray-50/30 min-h-screen">
            <SEO 
                title={viewType === 'selling' ? t.premiumSales : t.traderDemands}
                description={viewType === 'selling' ? t.browseVerifiedDesc : t.exploreTraderDesc}
            />
            {/* Hero Section */}
            <section className="relative bg-gray-900 text-white py-10 md:py-32 px-4 overflow-hidden mb-8">
                <div 
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: 'url(/listings-hero.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-950/40 to-gray-900/60"></div>
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3">
                    <h1 className="text-2xl md:text-6xl font-black leading-tight tracking-tight">
                        {viewType === 'selling' ? t.premiumSales : t.traderDemands} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                            {t.marketplaceHub}
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-sm md:text-xl text-blue-100 font-medium leading-relaxed opacity-90">
                        {viewType === 'selling' 
                            ? t.browseVerifiedDesc
                            : t.exploreTraderDesc
                        }
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 space-y-8">
            {/* View Statistics & Tabs */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100">
                    <button 
                        onClick={() => setViewType('selling')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black transition-all ${
                            viewType === 'selling' 
                            ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <ArrowUpRight size={20} />
                        {t.forSaleTab}
                    </button>
                    <button 
                        onClick={() => setViewType('buying')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black transition-all ${
                            viewType === 'buying' 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <ArrowDownRight size={20} />
                        {t.buyingDemandsTab}
                    </button>
                </div>
            </div>


            <div className="flex flex-col md:flex-row items-center gap-3 mb-8 max-w-3xl">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder={t.findProduct || "Search..."} 
                        className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 focus:border-primary rounded-2xl outline-none transition-all font-medium shadow-sm text-gray-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button 
                        onClick={startListening}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors z-10 p-2 cursor-pointer"
                        title={t.voiceSearch || "Search by voice"}
                    >
                        <Mic size={20} />
                    </button>
                </div>
                <button 
                    className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                    {t.search || "Search"}
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 pb-4 w-full">
                    {[1,2,3,4,5,6,7,8].map(n => (
                        <div key={n} className="w-full">
                            {viewType === 'selling' ? <CardSkeleton /> : <PostSkeleton />}
                        </div>
                    ))}
                </div>
            ) : (viewType === 'selling' ? listings : buyingPosts).length > 0 ? (
                <div className="space-y-12">
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 pb-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {viewType === 'selling' ? (
                            listings.map(item => (
                                <div key={item._id} className="w-full">
                                    <ListingCard 
                                        item={item} 
                                        userRole={user?.role} 
                                    />
                                </div>
                            ))
                        ) : (
                            buyingPosts.map(post => (
                                <div key={post._id} className="w-full">
                                <BuyingPostCard 
                                    post={post} 
                                />
                            </div>
                            ))
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-center gap-4 py-8">
                            <button 
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-6 py-2 bg-white border border-gray-200 rounded-xl font-bold disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                                {t.previous}
                            </button>
                            <span className="font-black text-gray-900">
                                {formatDigit(page)} / {formatDigit(pagination.pages)}
                            </span>
                            <button 
                                disabled={page === pagination.pages}
                                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                className="px-6 py-2 bg-white border border-gray-200 rounded-xl font-bold disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                                {t.next}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                        <Search size={48} />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.noDataFound}</h3>
                        <p className="text-gray-500 font-medium">{t.tryDifferentFilters}</p>
                    </div>
                    <button 
                        onClick={clearFilters}
                        className="btn bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                    >
                        {t.clearAllFilters}
                    </button>
                </div>
            )}
        </div>
    </div>
);
};

export default Listings;

