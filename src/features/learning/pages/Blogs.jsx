import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllContent } from '../api/learningApi';
import ContentCard from '../components/ContentCard';
import FilterBar from '../components/FilterBar';
import SkeletonCard from '../components/SkeletonCard';
import { PenTool } from 'lucide-react';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ type: 'blog', sort: 'newest' });
    const [searchQuery, setSearchQuery] = useState('');

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await getAllContent({
                ...filters,
                type: 'blog',
                search: searchQuery || undefined
            });
            if (res.data.success) {
                setBlogs(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [filters, searchQuery]);

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <PenTool className="w-6 h-6 text-primary" />
                    Success Stories & Blogs
                </h1>
                <p className="text-xs font-semibold text-gray-500">
                    Read success case studies, interviews, and aquaculture technology trends from the field.
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
            ) : blogs.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                    <p className="text-gray-400 font-bold text-sm">No blogs found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map(item => (
                        <Link to={`/learning/blogs/${item.slug}`} key={item._id} className="block">
                            <ContentCard content={item} />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blogs;
