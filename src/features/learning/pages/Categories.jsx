import React from 'react';
import { useLearning } from '../context/LearningContext';
import { Link } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';

const Categories = () => {
    const { categories } = useLearning();

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <LayoutGrid className="w-6 h-6 text-primary" />
                    Learning Categories
                </h1>
                <p className="text-xs font-semibold text-gray-500">
                    Browse targeted aquaculture courses across 35+ professional categories.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <Link
                        to={`/learning/categories/${cat.slug}`}
                        key={cat._id}
                        className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
                        style={{ borderLeftWidth: '6px', borderLeftColor: cat.color || '#0066cc' }}
                    >
                        <div>
                            <h3 className="font-extrabold text-gray-900 text-lg mb-2">{cat.name}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                {cat.description || `Specialized resources covering ${cat.name} principles, industry practices, and yield models.`}
                            </p>
                        </div>
                        <span className="text-[10px] font-black uppercase text-primary tracking-wider mt-auto block">
                            Explore Catalog &rarr;
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categories;
