import { useState, useEffect, useContext, useMemo, memo } from 'react';
import api from '../../utils/api';
import { ShoppingBag, ShoppingCart, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ListingCard from '../../features/product/components/ListingCard';
import BuyingPostCard from '../trader/BuyingPostCard';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const FeaturedListings = memo(() => {
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
            const res = await api.get('/listings/home-summary').catch(e => {
                console.error('Home Summary API failed:', e);
                return { data: { fishListings: [], feedMedicineListings: [], buyingPosts: [] } };
            });

            const { fishListings = [], feedMedicineListings = [], buyingPosts = [] } = res.data || {};

            setFishListings(fishListings.slice(0, 4));
            setFeedMedicineListings(feedMedicineListings.slice(0, 4));
            setBuyingPosts(buyingPosts.slice(0, 3));
        } catch (err) {
            console.error('Error in fetchData:', err);
        } finally {
            setLoading(false);
        }
    };

    const tabs = useMemo(() => [
        { id: 'fish',  label: t.tabFishSeed,   icon: <ShoppingBag size={16} /> },
        { id: 'feed',  label: t.tabFeedMed,    icon: <ShoppingBag size={16} /> },
        { id: 'posts', label: t.tabBuyingPosts, icon: <ShoppingCart size={16} /> },
    ], [t.tabFishSeed, t.tabFeedMed, t.tabBuyingPosts]);

    return (
        <section id="featured-listings" className="max-w-7xl mx-auto px-4 py-10 md:py-16">
            {/* Section header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-3 text-center md:text-left">
                    <div className="inline-flex items-center gap-1.5 section-eyebrow mx-auto md:mx-0">
                        <Sparkles size={13} />
                        {t.topUpdates}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
                        {t.featuredListingsTitle}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            {t.featuredListingsTitleColor}
                        </span>
                    </h2>
                    <p className="text-text-secondary font-medium max-w-lg mx-auto md:mx-0">
                        {t.featuredSubtitle}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-surface-1 p-1 rounded-xl gap-1 border border-border self-start md:self-end w-full md:w-auto overflow-x-auto scrollbar-hide">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 whitespace-nowrap flex-1 md:flex-none ${
                                activeTab === tab.id
                                    ? 'bg-white text-primary shadow-xs border border-border'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-white/60'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-28 space-y-4 bg-white rounded-xl border border-dashed border-border">
                    <Loader2 className="animate-spin text-primary" size={36} />
                    <p className="text-text-tertiary text-sm font-medium">{t.loadingData}</p>
                </div>
            ) : (
                <div className="space-y-10">
                    <div className="min-h-[400px]">
                        {activeTab === 'fish' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

                    {/* View all button */}
                    <div className="flex justify-center pt-4">
                        <Link
                            to={activeTab === 'posts' ? '/posts' : '/listings'}
                            className="btn btn-ghost border border-border text-text-primary hover:bg-surface-2 btn-lg group"
                        >
                            {activeTab === 'posts' ? t.exploreAllPosts : t.exploreAllListings}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            )}
        </section>
    );
});

const EmptyState = ({ message, t }) => (
    <div className="col-span-full empty-state py-20">
        <div className="empty-state-icon">
            <ShoppingBag size={28} />
        </div>
        <p className="text-text-secondary font-semibold">{message}</p>
        <p className="text-text-tertiary text-sm mt-1.5">{t.noListingsDesc || 'Explore other categories meanwhile!'}</p>
    </div>
);

FeaturedListings.displayName = 'FeaturedListings';

export default FeaturedListings;
