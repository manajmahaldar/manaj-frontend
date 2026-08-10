import React, { useState, useEffect } from 'react';
import {
    Bot, BookOpen, Plus, Trash2, Edit, CheckCircle, BarChart3,
    FileText, Upload, Sparkles, Filter, Search, Tag, Eye
} from 'lucide-react';
import {
    getAdminFarmingAIKnowledge,
    createAdminFarmingAIKnowledge,
    deleteAdminFarmingAIKnowledge,
    getAdminFarmingAIAnalytics
} from '../api/farmingAIApi';

const FarmingAIAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('knowledge'); // 'knowledge' | 'analytics'
    const [knowledgeItems, setKnowledgeItems] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'general',
        sourceType: 'custom_guideline',
        pdfUrl: '',
        tags: ''
    });

    useEffect(() => {
        if (activeTab === 'knowledge') loadKnowledge();
        if (activeTab === 'analytics') loadAnalytics();
    }, [activeTab]);

    const loadKnowledge = async () => {
        setLoading(true);
        try {
            const res = await getAdminFarmingAIKnowledge();
            if (res.data.success) {
                setKnowledgeItems(res.data.data);
            }
        } catch (err) {
            console.error('Error loading AI knowledge:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const res = await getAdminFarmingAIAnalytics();
            if (res.data.success) {
                setAnalytics(res.data.data);
            }
        } catch (err) {
            console.error('Error loading AI analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createAdminFarmingAIKnowledge(formData);
            if (res.data.success) {
                setShowForm(false);
                setFormData({ title: '', content: '', category: 'general', sourceType: 'custom_guideline', pdfUrl: '', tags: '' });
                loadKnowledge();
            }
        } catch (err) {
            console.error('Failed to create AI knowledge item:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this AI knowledge item?')) return;
        try {
            await deleteAdminFarmingAIKnowledge(id);
            loadKnowledge();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    return (
        <div className="p-6 space-y-6 bg-background text-text-primary min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-xs">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-text-primary">Farming AI Knowledge & Analytics</h1>
                        <p className="text-xs text-text-tertiary">Manage AI knowledge base sources, approved guidelines, and usage telemetry</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab('knowledge')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeTab === 'knowledge' ? 'bg-primary text-white shadow-sm' : 'bg-surface-subtle border border-border text-text-secondary'
                        }`}
                    >
                        <BookOpen size={14} />
                        Knowledge Base ({knowledgeItems.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeTab === 'analytics' ? 'bg-primary text-white shadow-sm' : 'bg-surface-subtle border border-border text-text-secondary'
                        }`}
                    >
                        <BarChart3 size={14} />
                        Telemetry Analytics
                    </button>
                </div>
            </div>

            {/* TAB 1: KNOWLEDGE BASE MANAGEMENT */}
            {activeTab === 'knowledge' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-base font-bold text-text-primary">Approved AI Knowledge Sources</h2>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover transition-all"
                        >
                            <Plus size={16} />
                            Add Knowledge Item
                        </button>
                    </div>

                    {/* New Item Form */}
                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-2xl border border-border space-y-4 shadow-sm animate-in fade-in duration-200">
                            <h3 className="font-bold text-sm text-text-primary">New Knowledge Entry</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-text-tertiary">Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Biofloc Water Quality & C:N Ratio Guidelines"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full text-xs p-2.5 rounded-xl border border-border bg-surface-subtle mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-tertiary">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full text-xs p-2.5 rounded-xl border border-border bg-surface-subtle mt-1"
                                    >
                                        <option value="general">General</option>
                                        <option value="basics">Farming Basics</option>
                                        <option value="pond_management">Pond Management</option>
                                        <option value="water_quality">Water Quality</option>
                                        <option value="fish_health">Fish Health & Diseases</option>
                                        <option value="feed_nutrition">Feed & Nutrition</option>
                                        <option value="biofloc_ras">Biofloc & RAS</option>
                                        <option value="government_schemes">Government Schemes</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-text-tertiary">Content / Advice text</label>
                                <textarea
                                    rows={4}
                                    required
                                    placeholder="Enter accurate educational content for AI response generation..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full text-xs p-2.5 rounded-xl border border-border bg-surface-subtle mt-1"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-text-tertiary">PDF Resource Link (Optional)</label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/guide.pdf"
                                        value={formData.pdfUrl}
                                        onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                                        className="w-full text-xs p-2.5 rounded-xl border border-border bg-surface-subtle mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-tertiary">Tags (comma-separated)</label>
                                    <input
                                        type="text"
                                        placeholder="biofloc, water, disease, rohu"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full text-xs p-2.5 rounded-xl border border-border bg-surface-subtle mt-1"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold border border-border text-text-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover"
                                >
                                    Save Knowledge Source
                                </button>
                            </div>
                        </form>
                    )}

                    {/* List Table */}
                    <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-surface-subtle border-b border-border text-text-tertiary font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Source Type</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {knowledgeItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-text-tertiary">
                                            No custom knowledge items found. Published Learning Hub content is also automatically indexed.
                                        </td>
                                    </tr>
                                ) : (
                                    knowledgeItems.map((item) => (
                                        <tr key={item._id} className="hover:bg-surface-subtle/50 transition-colors">
                                            <td className="p-4 font-bold text-text-primary">
                                                {item.title}
                                                <p className="text-[11px] font-normal text-text-tertiary line-clamp-1">{item.content}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2.5 py-1 bg-primary-muted text-primary rounded-full font-bold">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="p-4 font-semibold text-text-secondary capitalize">{item.sourceType}</td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                                                    <CheckCircle size={10} />
                                                    Active
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-1.5 text-text-tertiary hover:text-red-500 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 2: TELEMETRY ANALYTICS */}
            {activeTab === 'analytics' && analytics && (
                <div className="space-y-6">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs">
                            <div className="text-xs font-bold text-text-tertiary">Total AI Inquiries</div>
                            <div className="text-2xl font-extrabold text-primary mt-1">{analytics.totalQueries}</div>
                        </div>
                        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs">
                            <div className="text-xs font-bold text-text-tertiary">Image Analysis Requests</div>
                            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{analytics.imageQueries}</div>
                        </div>
                        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs">
                            <div className="text-xs font-bold text-text-tertiary">Voice Inquiries</div>
                            <div className="text-2xl font-extrabold text-amber-600 mt-1">{analytics.voiceQueries}</div>
                        </div>
                    </div>

                    {/* Popular Topics */}
                    <div className="bg-surface p-6 rounded-2xl border border-border space-y-4 shadow-xs">
                        <h3 className="font-bold text-sm text-text-primary">Popular Query Categories</h3>
                        <div className="space-y-2">
                            {(analytics.popularTopics || []).map((t, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-surface-subtle rounded-xl text-xs font-semibold">
                                    <span className="capitalize">{t._id || 'general'}</span>
                                    <span className="px-3 py-1 bg-primary text-white rounded-full font-extrabold">{t.count} queries</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FarmingAIAdminDashboard;
