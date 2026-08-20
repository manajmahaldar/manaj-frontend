import { useState, useEffect, useContext, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import ListingCard from '../components/ListingCard';
import BuyingPostCard from '../../../components/trader/BuyingPostCard';
import { CardSkeleton, PostSkeleton } from '../../../components/common/Skeletons';
import { Search, ArrowUpRight, ArrowDownRight, Mic } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { AuthContext } from '../../../context/AuthContext';
import SEO from '../../../components/common/SEO';
import toast from 'react-hot-toast';
import AIAssistantButton from '../../../components/ai/AIAssistantButton';
import AIMarketplaceAgentModal from '../../../components/ai/AIMarketplaceAgentModal';
import CreateListingModal from '../components/CreateListingModal';
import CreatePostModal from '../../../components/trader/CreatePostModal';

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
        }, 300);

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

    const clearFilters = useCallback(() => {
        setCategory('');
        setSearch('');
        setDistrict('');
        setMinPrice('');
        setMaxPrice('');
        setPage(1);
    }, []);

    const navigate = useNavigate();
    const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);
    const [isListingModalOpen, setIsListingModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [aiInitialData, setAiInitialData] = useState(null);

    const handleLaunchFormFromAI = useCallback((data) => {
        if (!user) {
            navigate('/login');
            return;
        }
        setAiInitialData(data);
        if (data.actionType === 'buying') {
            setIsPostModalOpen(true);
        } else {
            setIsListingModalOpen(true);
        }
    }, [user, navigate]);

    const handleViewTypeChange = (newType) => {
        setViewType(newType);
        setPage(1);
    };

    return (
        <div className="pb-16 bg-surface-1 min-h-screen">
            <SEO 
                title={viewType === 'selling' ? t.premiumSales : t.traderDemands}
                description={viewType === 'selling' ? t.browseVerifiedDesc : t.exploreTraderDesc}
            />
            {/* Header Hero Banner */}
            <section className="relative bg-text-primary text-white py-12 md:py-20 px-4 overflow-hidden mb-8">
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'url(/listings-hero.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                
                <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                        {viewType === 'selling' ? t.premiumSales : t.traderDemands}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary-light">
                            {t.marketplaceHub}
                        </span>
                    </h1>
                    <p className="max-w-xl mx-auto text-sm md:text-base text-white/70 font-medium leading-relaxed">
                        {viewType === 'selling' 
                            ? t.browseVerifiedDesc
                            : t.exploreTraderDesc
                        }
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 space-y-6">
                {/* View Tabs & Search Bar */}
                <div className="space-y-4">
                    <div className="flex bg-white p-1.5 rounded-xl border border-border max-w-md mx-auto sm:mx-0">
                        <button 
                            onClick={() => handleViewTypeChange('selling')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                viewType === 'selling' 
                                ? 'bg-primary text-white shadow-xs' 
                                : 'text-text-secondary hover:text-text-primary hover:bg-surface-1'
                            }`}
                        >
                            <ArrowUpRight size={16} />
                            {t.forSaleTab}
                        </button>
                        <button 
                            onClick={() => handleViewTypeChange('buying')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                viewType === 'buying' 
                                ? 'bg-secondary text-white shadow-xs' 
                                : 'text-text-secondary hover:text-text-primary hover:bg-surface-1'
                            }`}
                        >
                            <ArrowDownRight size={16} />
                            {t.buyingDemandsTab}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                            <input 
                                type="text" 
                                placeholder={t.findProduct || "Search..."} 
                                className="form-input pl-10 pr-10 py-3"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button 
                                onClick={startListening}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-primary transition-colors p-1"
                                title={t.voiceSearch || "Search by voice"}
                            >
                                <Mic size={18} />
                            </button>
                        </div>
                        <AIAssistantButton onClick={() => setIsAIAgentOpen(true)} variant="inline" />
                    </div>
                </div>

                {/* Listings Grid */}
                {loading && (viewType === 'selling' ? listings.length === 0 : buyingPosts.length === 0) ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[1,2,3,4,5,6,7,8].map(n => (
                            <div key={n}>
                                {viewType === 'selling' ? <CardSkeleton /> : <PostSkeleton />}
                            </div>
                        ))}
                    </div>
                ) : (viewType === 'selling' ? listings.length > 0 : buyingPosts.length > 0) ? (
                    <div>
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-opacity duration-200 ${loading ? 'opacity-70' : 'opacity-100'}`}>
                            {viewType === 'selling' 
                                ? listings.map(l => <ListingCard key={l._id} item={l} userRole={user?.role} />)
                                : buyingPosts.map(p => <BuyingPostCard key={p._id} post={p} />)
                            }
                        </div>
                        
                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button 
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="btn btn-ghost btn-sm border border-border disabled:opacity-40"
                                >
                                    {t.previous}
                                </button>
                                <span className="text-sm font-semibold text-text-secondary px-3">
                                    {formatDigit(page)} / {formatDigit(pagination.pages)}
                                </span>
                                <button 
                                    disabled={page === pagination.pages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="btn btn-ghost btn-sm border border-border disabled:opacity-40"
                                >
                                    {t.next}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="empty-state py-24">
                        <div className="empty-state-icon">
                            <Search size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary mb-1">{t.noDataFound}</h3>
                        <p className="text-text-secondary text-sm mb-4">{t.tryDifferentFilters}</p>
                        <button 
                            onClick={clearFilters}
                            className="btn btn-ghost border border-border btn-sm"
                        >
                            {t.clearAllFilters}
                        </button>
                    </div>
                )}
            </div>

            {/* AI Assistant Modal */}
            <AIMarketplaceAgentModal
                isOpen={isAIAgentOpen}
                onClose={() => setIsAIAgentOpen(false)}
                onLaunchForm={handleLaunchFormFromAI}
            />

            <CreateListingModal
                isOpen={isListingModalOpen}
                onClose={() => setIsListingModalOpen(false)}
                onSuccess={() => fetchData()}
                initialData={aiInitialData}
            />
            <CreatePostModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onSuccess={() => fetchData()}
                initialData={aiInitialData}
            />
        </div>
    );
};

export default Listings;
