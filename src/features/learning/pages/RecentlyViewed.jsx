import React, { useState, useEffect } from 'react';
import { getRecentlyViewed } from '../api/learningApi';
import ContentCard from '../components/ContentCard';
import SkeletonCard from '../components/SkeletonCard';
import { History } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecentlyViewed = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const res = await getRecentlyViewed();
                if (res.data.success) {
                    setItems(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <History className="w-6 h-6 text-primary" />
                    Recently Viewed History
                </h1>
                <p className="text-xs font-semibold text-gray-500">
                    Review history of recently opened videos, articles, and guidelines.
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : items.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center max-w-md mx-auto shadow-sm space-y-4">
                    <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center text-2xl mx-auto">
                        ⏳
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-base">History Empty</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Articles, video courses, or schemes will show up here as you click and read them.
                    </p>
                    <Link
                        to="/learning"
                        className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs inline-block hover:bg-blue-700 transition-colors"
                    >
                        Browse Courses
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                        <Link to={`/learning/${item.type}s/${item.slug}`} key={item._id} className="block">
                            <ContentCard content={item} />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentlyViewed;
