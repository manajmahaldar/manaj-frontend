import React, { useState, useEffect } from 'react';
import { getGovernmentSchemes } from '../api/learningApi';
import { Landmark, ArrowRight, ShieldCheck } from 'lucide-react';

const GovernmentSchemes = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [search, setSearch] = useState('');

    const fetchSchemes = async () => {
        try {
            setLoading(true);
            const res = await getGovernmentSchemes({
                category: category || undefined,
                search: search || undefined
            });
            if (res.data.success) {
                setSchemes(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchemes();
    }, [category, search]);

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <Landmark className="w-6 h-6 text-primary" />
                    Government Schemes & Subsidies
                </h1>
                <p className="text-xs font-semibold text-gray-500">
                    Find PMMSY subsidies, fishery loans, legal guidelines, and insurance policies.
                </p>
            </div>

            {/* Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <input
                    type="text"
                    placeholder="Search schemes e.g. PMMSY, loan, subsidy..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:border-primary/50 text-sm"
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full md:w-64 px-4 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:border-primary/50 text-sm font-bold text-gray-700 bg-white"
                >
                    <option value="">All Categories</option>
                    <option value="pmmsy">PMMSY Schemes</option>
                    <option value="subsidy">Subsidies</option>
                    <option value="loan">Loans</option>
                    <option value="insurance">Insurance</option>
                    <option value="training_program">Training Programs</option>
                    <option value="notification">Government Notifications</option>
                </select>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-32 bg-gray-100 rounded-3xl" />
                    ))}
                </div>
            ) : schemes.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                    <p className="text-gray-400 font-bold text-sm">No schemes found matching your search.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {schemes.map(scheme => (
                        <div key={scheme._id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                            <div className="space-y-2 flex-1">
                                <span className="px-3 py-1 bg-blue-50 text-primary border border-blue-100 text-[10px] font-extrabold uppercase rounded-full">
                                    {scheme.category === 'pmmsy' ? 'PMMSY Scheme' : scheme.category}
                                </span>
                                <h3 className="font-extrabold text-gray-900 text-lg leading-snug">{scheme.title}</h3>
                                <p className="text-xs text-gray-400 font-bold">{scheme.ministry}</p>
                                <p className="text-xs text-gray-500 line-clamp-2 max-w-3xl">{scheme.description}</p>
                            </div>

                            <div className="flex flex-col gap-2 w-full md:w-auto self-stretch md:self-auto justify-center">
                                {scheme.applicationLink && (
                                    <a
                                        href={scheme.applicationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-blue-700 text-center transition-all flex items-center justify-center gap-1.5 active:scale-95"
                                    >
                                        Apply Online
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </a>
                                )}
                                {scheme.eligibility && (
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold justify-center">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        Eligibility: {scheme.eligibility}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GovernmentSchemes;
