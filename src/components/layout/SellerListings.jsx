import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ListingCard from '../listing/ListingCard';
import { useLanguage } from '../../context/LanguageContext';
import { ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';

const SellerListings = () => {
    const { t } = useLanguage();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSellerListings();
    }, []);

    const fetchSellerListings = async () => {
        try {
            // Fetch both Feed and Medicine to show in this section
            const [feedRes, medRes] = await Promise.all([
                api.get('/listings?category=Feed'),
                api.get('/listings?category=Medicine')
            ]);
            
            // Combine and show top 4 supplies total
            const feedListings = feedRes.data.listings ? feedRes.data.listings : feedRes.data;
            const medListings = medRes.data.listings ? medRes.data.listings : medRes.data;
            const combined = [...feedListings, ...medListings];
            setListings(combined.slice(0, 4));
        } catch (err) {
            console.error('Error fetching seller listings:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
                <p className="text-gray-500 font-bold">{t.loadingData}</p>
            </div>
        );
    }

    if (listings.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
            <div className="bg-emerald-50/50 rounded-[3rem] p-6 md:p-16 border border-emerald-100/50">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start w-full md:w-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest mx-auto md:mx-0 w-fit">
                            <ShoppingBag size={14} />
                            {t.suppliesHub}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight w-full">
                            {t.suppliesHub} <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">
                                {t.feedAndMed}
                            </span>
                        </h2>
                        <p className="text-gray-500 font-medium max-w-lg leading-relaxed text-lg mx-auto md:mx-0">
                            {t.suppliesDesc}
                        </p>
                    </div>

                    <Link
                        to="/listings"
                        className="group hidden md:flex items-center gap-3 px-10 py-5 bg-white hover:bg-emerald-600 text-emerald-600 hover:text-white border-2 border-emerald-100 hover:border-emerald-600 rounded-2xl font-black transition-all hover:scale-105 shadow-sm hover:shadow-emerald-600/20 whitespace-nowrap"
                    >
                        {t.exploreSupplies}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {listings.map(listing => (
                        <div key={listing._id} className="hover:scale-[1.02] transition-transform">
                            <ListingCard item={listing} />
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-12 md:hidden">
                    <Link
                        to="/listings"
                        className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black transition-all shadow-lg shadow-emerald-600/20"
                    >
                        {t.viewAllSupplies}
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default SellerListings;
