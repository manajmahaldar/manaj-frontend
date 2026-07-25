import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllContent, getCategories } from '../api/learningApi';
import ContentCard from '../components/ContentCard';
import SkeletonCard from '../components/SkeletonCard';
import { BookOpen, ChevronRight } from 'lucide-react';

const CategoryDetail = () => {
    const { slug } = useParams();
    const [category, setCategory] = useState(null);
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategoryData = async () => {
            try {
                setLoading(true);
                // Get all categories to find matching slug
                const catRes = await getCategories();
                let currentCat = null;
                if (catRes.data.success) {
                    currentCat = catRes.data.data.find(c => c.slug === slug);
                    setCategory(currentCat);
                }

                if (currentCat) {
                    const contentRes = await getAllContent({ categories: currentCat._id });
                    if (contentRes.data.success) {
                        setContents(contentRes.data.data);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadCategoryData();
    }, [slug]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-20 bg-gray-100 rounded-3xl animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 font-bold text-lg">Category not found</p>
                <Link to="/learning/categories" className="text-primary font-bold mt-2 inline-block">Back to Categories</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                <Link to="/learning" className="hover:text-primary">Learning Hub</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to="/learning/categories" className="hover:text-primary">Categories</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-gray-900">{category.name}</span>
            </div>

            {/* Banner */}
            <div 
                className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col justify-center"
                style={{ borderLeftWidth: '8px', borderLeftColor: category.color || '#0066cc' }}
            >
                <h1 className="text-2xl font-black text-gray-900 mb-2">{category.name}</h1>
                <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">
                    {category.description || `Explore detailed courses, guides, checklists, and videos focused on ${category.name}.`}
                </p>
            </div>

            {/* Catalog Grid */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Available Resources ({contents.length})
                </h2>

                {contents.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                        <p className="text-gray-400 font-bold text-sm">No courses available in this category yet.</p>
                        {category.parentCategory && (
                            <Link to="/learning/categories" className="text-primary text-xs font-bold mt-2 inline-block">
                                Explore other categories
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contents.map(item => (
                            <Link to={`/learning/${item.type}s/${item.slug}`} key={item._id} className="block">
                                <ContentCard content={item} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryDetail;
