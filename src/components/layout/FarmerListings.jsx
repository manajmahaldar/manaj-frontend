import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ListingCard from '../../features/product/components/ListingCard';
import ListingSkeleton from '../common/ListingSkeleton';
import { useLanguage } from '../../context/LanguageContext';
import { Fish, ArrowRight } from 'lucide-react';

const FarmerListings = () => {
    const { t } = useLanguage();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFishListings();
    }, []);

    const fetchFishListings = async () => {
        try {
            // Updated to use the correct API endpoint and filter by Fish category only
            const res = await api.get('/listings?category=Fish');
            // Show only first 4 fish listings for the home page section
            setListings(res.data.listings ? res.data.listings.slice(0, 4) : res.data.slice(0, 4));
        } catch (err) {
            console.error('Error fetching fish listings:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
                <div className="bg-blue-50/30 rounded-[3rem] p-6 md:p-16 border border-blue-100/30">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(n => <ListingSkeleton key={n} />)}
                    </div>
                </div>
            </section>
        );
    }

    if (listings.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
            <div className="bg-blue-50/50 rounded-[3rem] p-6 md:p-16 border border-blue-100/50">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start w-full md:w-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mx-auto md:mx-0 w-fit">
                            <Fish size={14} />
                            {t.farmerDirect}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight w-full">
                            {t.farmerDirect} <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                {t.freshFish}
                            </span>
                        </h2>
                        <p className="text-gray-500 font-medium max-w-lg leading-relaxed text-lg mx-auto md:mx-0">
                            {t.farmerDirectDesc}
                        </p>
                    </div>

                    <Link
                        to="/listings?category=Fish"
                        className="group hidden md:flex items-center gap-3 px-10 py-5 bg-white hover:bg-blue-600 text-blue-600 hover:text-white border-2 border-blue-100 hover:border-blue-600 rounded-2xl font-black transition-all hover:scale-105 shadow-sm hover:shadow-blue-600/20 whitespace-nowrap"
                    >
                        {t.exploreDirectFish}
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
                        to="/listings?category=Fish"
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-600/20"
                    >
                        {t.viewAllFish}
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FarmerListings;
