import { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { ShoppingBag, ShoppingCart, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ListingCard from '../listing/ListingCard';
import BuyingPostCard from '../trader/BuyingPostCard';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const FeaturedListings = () => {
    const { user } = useContext(AuthContext);
    const { t } = useLanguage();
    const [fishListings, setFishListings] = useState([]);
    const [feedMedicineListings, setFeedMedicineListings] = useState([]);
    const [buyingPosts, setBuyingPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('fish');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const postsRes = await api.get('/posts').catch(e => {
                console.error('Buying Posts API failed:', e);
                return { data: [] };
            });
            const listingsRes = await api.get('/listings').catch(e => {
                console.error('Listings API failed:', e);
                return { data: [] };
            });

            const allListings = Array.isArray(listingsRes.data) ? listingsRes.data : [];
            const allPosts = Array.isArray(postsRes.data) ? postsRes.data : [];

            // Get latest 4 fish and spawn/seed listings
            setFishListings(allListings.filter(l => ['Fish', 'Spawn/Seed', 'মাছ', 'পোনা'].includes(l.category)).reverse().slice(0, 4));
            // Get latest 4 feed/medicine listings
            setFeedMedicineListings(allListings.filter(l => ['Feed', 'Medicine', 'ফিড', 'ওষুধ'].includes(l.category)).reverse().slice(0, 4));
            // Get latest 3 buying posts
            setBuyingPosts([...allPosts].reverse().slice(0, 3));
        } catch (err) {
            console.error('Error in fetchData:', err);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'fish', label: t.tabFishSeed, icon: <ShoppingBag size={18} /> },
        { id: 'feed', label: t.tabFeedMed, icon: <ShoppingBag size={18} /> },
        { id: 'posts', label: t.tabBuyingPosts, icon: <ShoppingCart size={18} /> },
    ];

    return (
        <section id="featured-listings" className="max-w-7xl mx-auto px-4 py-8 md:py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 md:mb-12">
                <div className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start w-full md:w-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mx-auto md:mx-0 w-fit">
                        <Sparkles size={14} />
                        {t.topUpdates}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                        {t.featuredListingsTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">{t.featuredListingsTitleColor}</span>
                    </h2>
                    <p className="text-gray-500 font-medium max-w-lg mx-auto md:mx-0">
                        {t.featuredSubtitle}
                    </p>
                </div>

                <div className="flex bg-gray-100/80 p-1.5 rounded-2xl gap-1 self-start md:self-end w-full md:w-auto overflow-x-auto no-scrollbar snap-x">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 snap-start flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap flex-1 md:flex-none ${
                                activeTab === tab.id 
                                ? 'bg-white text-blue-600 shadow-lg shadow-blue-600/5' 
                                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                    <Loader2 className="animate-spin text-blue-500" size={48} />
                    <p className="text-gray-400 font-bold animate-pulse tracking-widest">{t.loadingData}</p>
                </div>
            ) : (
                <div className="space-y-12">
                    <div className="min-h-[400px]">
                        {activeTab === 'fish' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {fishListings.length > 0 ? (
                                    fishListings.map(item => (
                                        <ListingCard key={item._id} item={item} userRole={user?.role} />
                                    ))
                                ) : (
                                    <EmptyState message={t.noFishFound} t={t} />
                                )}
                            </div>
                        )}

                        {activeTab === 'feed' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {feedMedicineListings.length > 0 ? (
                                    feedMedicineListings.map(item => (
                                        <ListingCard key={item._id} item={item} userRole={user?.role} />
                                    ))
                                ) : (
                                    <EmptyState message={t.noFeedFound} t={t} />
                                )}
                            </div>
                        )}

                        {activeTab === 'posts' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {buyingPosts.length > 0 ? (
                                    buyingPosts.map(post => (
                                        <BuyingPostCard key={post._id} post={post} />
                                    ))
                                ) : (
                                    <EmptyState message={t.noPostsFound} t={t} />
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center pt-8">
                        <Link 
                            to={activeTab === 'posts' ? '/posts' : '/listings'}
                            className="group flex items-center gap-4 px-12 py-5 bg-gray-900 text-white rounded-[2rem] font-black hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-gray-900/20"
                        >
                            {activeTab === 'posts' ? t.exploreAllPosts : t.exploreAllListings}
                            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </section>
    );
};

const EmptyState = ({ message, t }) => (
    <div className="col-span-full py-24 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <ShoppingBag size={40} />
        </div>
        <p className="text-gray-500 text-lg font-bold">{message}</p>
        <p className="text-gray-400 text-sm mt-3 font-medium">{t.noListingsDesc || 'Explore other categories meanwhile!'}</p>
    </div>
);

export default FeaturedListings;
