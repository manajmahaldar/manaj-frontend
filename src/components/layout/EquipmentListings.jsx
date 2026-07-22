import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ListingCard from '../../features/product/components/ListingCard';
import ListingSkeleton from '../common/ListingSkeleton';
import { useLanguage } from '../../context/LanguageContext';
import { Wrench, ArrowRight } from 'lucide-react';

const EquipmentListings = () => {
    const { t } = useLanguage();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const res = await api.get('/listings?category=Equipment&limit=4');
                console.log('Equipment API Response:', res.data);
                const equipmentItems = res.data.listings || res.data || [];
                setItems(Array.isArray(equipmentItems) ? equipmentItems.slice(0, 4) : []);
            } catch (err) {
                console.error('Error fetching equipment listings:', err);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, []);

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
                <div className="bg-amber-50/40 rounded-[3rem] p-6 md:p-16 border border-amber-100/40">
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 pb-4 w-full">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="w-full">
                                <ListingSkeleton />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (items.length === 0) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
                <div className="bg-amber-50/50 rounded-[3rem] p-6 md:p-16 border border-amber-100/50">
                    <div className="flex flex-col items-center justify-center gap-6 py-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest">
                            <Wrench size={14} />
                            {t.equipment || 'Equipment'}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center">
                            Farm Equipment
                        </h2>
                        <p className="text-gray-500 font-medium text-center text-lg">
                            No equipment listings available yet. Check back soon!
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
            <div className="bg-amber-50/50 rounded-[3rem] p-6 md:p-16 border border-amber-100/50">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start w-full md:w-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest mx-auto md:mx-0 w-fit">
                            <Wrench size={14} />
                            {t.equipment || 'Equipment'}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight w-full">
                            Farm Equipment &nbsp;
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
                                for aquaculture
                            </span>
                        </h2>
                        <p className="text-gray-500 font-medium max-w-lg leading-relaxed text-lg mx-auto md:mx-0">
                            Pumps, nets, aerators, and other approved machinery for fish farming.
                        </p>
                    </div>

                    <Link
                        to="/listings?category=Equipment"
                        className="group hidden md:flex items-center gap-3 px-10 py-5 bg-white hover:bg-amber-600 text-amber-700 hover:text-white border-2 border-amber-100 hover:border-amber-600 rounded-2xl font-black transition-all hover:scale-105 shadow-sm hover:shadow-amber-600/20 whitespace-nowrap"
                    >
                        View all equipment
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 pb-4 w-full">
                    {items.map((item) => (
                        <div key={item._id} className="w-full hover:scale-[1.02] transition-transform">
                            <ListingCard item={item} />
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-12 md:hidden">
                    <Link
                        to="/listings?category=Equipment"
                        className="flex items-center gap-3 px-8 py-4 bg-amber-600 text-white rounded-2xl font-black transition-all shadow-lg shadow-amber-600/20"
                    >
                        View all equipment
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default EquipmentListings;
