import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllContent } from '../api/learningApi';
import ContentCard from '../components/ContentCard';
import FilterBar from '../components/FilterBar';
import SkeletonCard from '../components/SkeletonCard';
import { BookOpen } from 'lucide-react';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ type: 'article', sort: 'newest' });
    const [searchQuery, setSearchQuery] = useState('');

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const res = await getAllContent({
                ...filters,
                type: 'article',
                search: searchQuery || undefined
            });
            if (res.data.success) {
                setArticles(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [filters, searchQuery]);

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    Educational Articles
                </h1>
                <p className="text-xs font-semibold text-gray-500">
                    Deep dive into aquaculture water quality, seed stocking, and biofloc biology.
                </p>
            </div>

            <FilterBar 
                onSearch={setSearchQuery} 
                onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} 
            />

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : articles.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                    <p className="text-gray-400 font-bold text-sm">No articles found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map(item => (
                        <Link to={`/learning/articles/${item.slug}`} key={item._id} className="block">
                            <ContentCard content={item} />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Articles;
