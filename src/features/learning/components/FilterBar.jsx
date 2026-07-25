import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const FilterBar = ({ onSearch, onFilterChange }) => {
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const [level, setLevel] = useState('');
    const [language, setLanguage] = useState('');
    const [sort, setSort] = useState('newest');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(search);
    };

    const handleFilterUpdate = (key, value) => {
        if (key === 'type') setType(value);
        if (key === 'level') setLevel(value);
        if (key === 'language') setLanguage(value);
        if (key === 'sort') setSort(value);

        onFilterChange({
            type: key === 'type' ? value : type,
            level: key === 'level' ? value : level,
            language: key === 'language' ? value : language,
            sort: key === 'sort' ? value : sort
        });
    };

    const clearFilters = () => {
        setSearch('');
        setType('');
        setLevel('');
        setLanguage('');
        setSort('newest');
        onSearch('');
        onFilterChange({ type: '', level: '', language: '', sort: 'newest' });
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search articles, videos, PDFs, biofloc, pond construction..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:border-primary/50 text-sm transition-all"
                    />
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                </form>

                {/* Sort Option */}
                <div className="w-full md:w-48">
                    <select
                        value={sort}
                        onChange={(e) => handleFilterUpdate('sort', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:border-primary/50 text-sm font-bold text-gray-700 bg-white"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="most_viewed">Most Viewed</option>
                        <option value="most_popular">Most Popular</option>
                    </select>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Filters:</span>

                {/* Content Type */}
                <select
                    value={type}
                    onChange={(e) => handleFilterUpdate('type', e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-600 bg-white"
                >
                    <option value="">All Formats</option>
                    <option value="video">Videos</option>
                    <option value="article">Articles</option>
                    <option value="blog">Blogs</option>
                    <option value="pdf">PDFs</option>
                </select>

                {/* Learning Level */}
                <select
                    value={level}
                    onChange={(e) => handleFilterUpdate('level', e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-600 bg-white"
                >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>

                {/* Language support */}
                <select
                    value={language}
                    onChange={(e) => handleFilterUpdate('language', e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-600 bg-white"
                >
                    <option value="">All Languages</option>
                    <option value="en">English</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                </select>

                {(type || level || language || search) && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 ml-auto"
                    >
                        <X className="w-3.5 h-3.5" />
                        Clear All
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
