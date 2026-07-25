import React, { useState, useEffect } from 'react';
import { 
    getLearningAnalytics, 
    getAllContentAdmin,
    createContent, 
    updateContent,
    deleteContent,
    getCategories, 
    createCategory,
    deleteCategory,
    createQuiz, 
    createScheme,
    getGovernmentSchemes,
    deleteScheme,
    getMediaAssets,
    uploadMediaAsset,
    deleteMediaAsset,
    replaceMediaAsset,
    getCourses,
    createCourse,
    deleteCourse,
    getWebinars,
    createWebinar,
    deleteWebinar,
    bulkContentAction,
    sendBroadcastNotification
} from '../../api/learningApi';
import { 
    BarChart3, Database, HelpCircle, FileText, Landmark, RefreshCw, 
    Folder, Video, FileCode, Music, Presentation, Award, Bell, 
    Search, Trash2, Edit3, Plus, CheckSquare, Layers, Calendar, 
    Upload, Pin, Flame, Star, ShieldCheck, Tag, Globe, ArrowRight, Eye, Download, UserCheck
} from 'lucide-react';

const LearningAdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [contents, setContents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [schemes, setSchemes] = useState([]);
    const [mediaAssets, setMediaAssets] = useState([]);
    const [folders, setFolders] = useState([]);
    const [courses, setCourses] = useState([]);
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('analytics');

    // Selection & Filter State
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
    const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState([]);
    const [mediaSearch, setMediaSearch] = useState('');
    const [selectedFolder, setSelectedFolder] = useState('');

    // Editing State
    const [editingContentId, setEditingContentId] = useState(null);

    // Form States
    const [contentForm, setContentForm] = useState({
        title: '', type: 'article', categories: [], subcategory: '', language: 'en', level: 'beginner',
        status: 'published', content: '', videoUrl: '', videoSource: 'youtube', pdfUrl: '', mediaUrl: '',
        thumbnail: '', duration: 0, readingTime: 0, featured: false, pinned: false, isTrending: false, isRecommended: false,
        authorName: 'MatsyaLink Expert', authorBio: '', tags: ''
    });

    const [categoryForm, setCategoryForm] = useState({
        name: '', description: '', icon: 'BookOpen', color: '#0284c7', subcategories: ''
    });

    const [courseForm, setCourseForm] = useState({
        title: '', description: '', thumbnail: '', level: 'beginner', language: 'en', status: 'published', featured: false
    });

    const [webinarForm, setWebinarForm] = useState({
        title: '', type: 'webinar', instructor: '', description: '', scheduledDate: '', durationMinutes: 60, meetingUrl: '', maxRegistrations: 100
    });

    const [quizForm, setQuizForm] = useState({
        title: '', description: '', category: '', passingScore: 70, timeLimit: 15,
        questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctIndex: 0
    });

    const [schemeForm, setSchemeForm] = useState({
        title: '', schemeName: '', description: '', ministry: '', category: 'subsidy', eligibility: '', benefits: '', applicationLink: ''
    });

    const [mediaForm, setMediaForm] = useState({
        fileName: '', fileUrl: '', fileType: 'image', folder: 'General', altText: '', tags: ''
    });

    const [notificationForm, setNotificationForm] = useState({
        title: '', message: '', targetRole: 'all', actionUrl: '/learning', type: 'announcement'
    });

    const loadAdminData = async () => {
        try {
            setLoading(true);
            const [analRes, catRes, contentRes, mediaRes, courseRes, webinarRes, schemeRes] = await Promise.all([
                getLearningAnalytics(),
                getCategories(),
                getAllContentAdmin({ limit: 200 }),
                getMediaAssets({ folder: selectedFolder, search: mediaSearch }),
                getCourses(),
                getWebinars(),
                getGovernmentSchemes()
            ]);

            if (analRes?.data?.success) setAnalytics(analRes.data.data);
            if (catRes?.data?.success) setCategories(catRes.data.data);
            if (contentRes?.data?.success) setContents(contentRes.data.data || []);
            if (mediaRes?.data?.success) {
                setMediaAssets(mediaRes.data.data || []);
                setFolders(mediaRes.data.folders || []);
            }
            if (courseRes?.data?.success) setCourses(courseRes.data.data || []);
            if (webinarRes?.data?.success) setWebinars(webinarRes.data.data || []);
            if (schemeRes?.data?.success) setSchemes(schemeRes.data.data || []);
        } catch (err) {
            console.error('Error loading admin CMS data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, [selectedFolder, mediaSearch]);

    // Content Handlers
    const handleContentSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...contentForm,
                categories: Array.isArray(contentForm.categories) && contentForm.categories.length > 0 
                    ? contentForm.categories 
                    : (contentForm.category ? [contentForm.category] : []),
                author: {
                    name: contentForm.authorName || 'MatsyaLink Expert',
                    bio: contentForm.authorBio || ''
                },
                tags: typeof contentForm.tags === 'string' ? contentForm.tags.split(',').map(t => t.trim()).filter(Boolean) : contentForm.tags
            };

            let res;
            if (editingContentId) {
                res = await updateContent(editingContentId, payload);
            } else {
                res = await createContent(payload);
            }

            if (res.data.success) {
                alert(`Content ${editingContentId ? 'updated' : 'published'} successfully!`);
                resetContentForm();
                loadAdminData();
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save content');
        }
    };

    const resetContentForm = () => {
        setEditingContentId(null);
        setContentForm({
            title: '', type: 'article', categories: [], subcategory: '', language: 'en', level: 'beginner',
            status: 'published', content: '', videoUrl: '', videoSource: 'youtube', pdfUrl: '', mediaUrl: '',
            thumbnail: '', duration: 0, readingTime: 0, featured: false, pinned: false, isTrending: false, isRecommended: false,
            authorName: 'MatsyaLink Expert', authorBio: '', tags: ''
        });
    };

    const handleEditContent = (item) => {
        setEditingContentId(item._id);
        setContentForm({
            title: item.title,
            type: item.type,
            categories: item.categories ? item.categories.map(c => c._id || c) : [],
            subcategory: item.subcategory || '',
            language: item.language || 'en',
            level: item.level || 'beginner',
            status: item.status || 'published',
            content: item.content || '',
            videoUrl: item.videoUrl || '',
            videoSource: item.videoSource || 'youtube',
            pdfUrl: item.pdfUrl || '',
            mediaUrl: item.mediaUrl || '',
            thumbnail: item.thumbnail || '',
            duration: item.duration || 0,
            readingTime: item.readingTime || 0,
            featured: !!item.featured,
            pinned: !!item.pinned,
            isTrending: !!item.isTrending,
            isRecommended: !!item.isRecommended,
            authorName: item.author?.name || 'MatsyaLink Expert',
            authorBio: item.author?.bio || '',
            tags: item.tags ? item.tags.join(', ') : ''
        });
        setActiveTab('publish');
    };

    const handleDeleteContent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this learning item?')) return;
        try {
            await deleteContent(id);
            loadAdminData();
        } catch (err) {
            alert('Failed to delete content');
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedIds.length === 0) return alert('Select at least one item');
        if (!window.confirm(`Perform bulk ${action} on ${selectedIds.length} items?`)) return;
        try {
            const res = await bulkContentAction({ action, ids: selectedIds });
            if (res.data.success) {
                alert(res.data.msg);
                setSelectedIds([]);
                loadAdminData();
            }
        } catch (err) {
            alert('Bulk action failed');
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredContents.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredContents.map(c => c._id));
        }
    };

    // Category Handlers
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...categoryForm,
                subcategories: categoryForm.subcategories.split(',').map(s => s.trim()).filter(Boolean)
            };
            const res = await createCategory(payload);
            if (res.data.success) {
                alert('Category created successfully!');
                setCategoryForm({ name: '', description: '', icon: 'BookOpen', color: '#0284c7', subcategories: '' });
                loadAdminData();
            }
        } catch (err) {
            alert('Failed to create category');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Delete category?')) return;
        try {
            await deleteCategory(id);
            loadAdminData();
        } catch (err) {
            alert('Failed to delete category');
        }
    };

    // Quiz & Government Scheme Handlers
    const handleQuizSubmit = async (e) => {
        e.preventDefault();
        try {
            const questions = [{
                questionText: quizForm.questionText || 'Default Question',
                type: 'mcq',
                options: [quizForm.optionA, quizForm.optionB, quizForm.optionC, quizForm.optionD].filter(Boolean),
                correctAnswers: [Number(quizForm.correctIndex)],
                explanation: ''
            }];
            const res = await createQuiz({
                title: quizForm.title,
                description: quizForm.description,
                category: quizForm.category || categories[0]?._id,
                questions,
                passingScore: Number(quizForm.passingScore),
                timeLimit: Number(quizForm.timeLimit)
            });
            if (res.data.success) {
                alert('Quiz created successfully!');
                setQuizForm({ title: '', description: '', category: '', passingScore: 70, timeLimit: 15, questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctIndex: 0 });
                loadAdminData();
            }
        } catch (err) {
            alert('Failed to create quiz');
        }
    };

    const handleSchemeSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createScheme(schemeForm);
            if (res.data.success) {
                alert('Government Scheme post published successfully!');
                setSchemeForm({ title: '', schemeName: '', description: '', ministry: '', category: 'subsidy', eligibility: '', benefits: '', applicationLink: '' });
                loadAdminData();
            }
        } catch (err) {
            alert('Failed to save scheme post');
        }
    };

    const handleDeleteScheme = async (id) => {
        if (!window.confirm('Delete government scheme post?')) return;
        try {
            await deleteScheme(id);
            loadAdminData();
        } catch (err) {
            alert('Failed to delete scheme');
        }
    };

    // Course & Webinar Handlers
    const handleCourseSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createCourse(courseForm);
            if (res.data.success) {
                alert('Course created successfully!');
                setCourseForm({ title: '', description: '', thumbnail: '', level: 'beginner', language: 'en', status: 'published', featured: false });
                loadAdminData();
            }
        } catch (err) {
            alert('Failed to create course');
        }
    };

    const handleWebinarSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createWebinar(webinarForm);
            if (res.data.success) {
                alert('Webinar scheduled successfully!');
                setWebinarForm({ title: '', type: 'webinar', instructor: '', description: '', scheduledDate: '', durationMinutes: 60, meetingUrl: '', maxRegistrations: 100 });
                loadAdminData();
            }
        } catch (err) {
            alert('Failed to schedule webinar');
        }
    };

    // Media Handlers
    const handleMediaSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await uploadMediaAsset(mediaForm);
            if (res.data.success) {
                alert('Media asset uploaded to library!');
                setMediaForm({ fileName: '', fileUrl: '', fileType: 'image', folder: 'General', altText: '', tags: '' });
                loadAdminData();
            }
        } catch (err) {
            alert('Failed to upload media asset');
        }
    };

    const handleReplaceMedia = async (assetId) => {
        const newUrl = prompt('Enter new URL to replace this media without breaking content links:');
        if (!newUrl) return;
        try {
            const res = await replaceMediaAsset(assetId, { newUrl });
            if (res.data.success) {
                alert('Media asset URL replaced across content!');
                loadAdminData();
            }
        } catch (err) {
            alert('Failed to replace media');
        }
    };

    // Notification Handler
    const handleNotificationSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await sendBroadcastNotification(notificationForm);
            if (res.data.success) {
                alert('Notification broadcast dispatched to all users!');
                setNotificationForm({ title: '', message: '', targetRole: 'all', actionUrl: '/learning', type: 'announcement' });
            }
        } catch (err) {
            alert('Failed to dispatch notification');
        }
    };

    const filteredContents = contents.filter(c => {
        if (selectedStatusFilter !== 'all' && c.status !== selectedStatusFilter) return false;
        if (selectedTypeFilter !== 'all' && c.type !== selectedTypeFilter) return false;
        if (selectedCategoryFilter !== 'all') {
            const catIds = (c.categories || []).map(cat => cat._id || cat);
            if (!catIds.includes(selectedCategoryFilter)) return false;
        }
        return true;
    });

    if (loading) return (
        <div className="p-16 text-center text-gray-500 font-semibold flex items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-sky-600" />
            Loading Main Admin Enterprise Learning CMS...
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider rounded-full border border-sky-400/30">
                            Super Admin Central CMS
                        </span>
                        <span className="text-xs text-sky-200/80 font-medium">Enterprise Learning Management System</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Database className="w-8 h-8 text-sky-400" />
                        Main Admin Learning CMS
                    </h1>
                    <p className="text-sm text-sky-100/80 mt-1 max-w-2xl">
                        Exclusive control center to create, publish, schedule, curate, analyze, and manage all learning content, courses, media, and notifications for Farmers, Sellers, Traders, & Hatcheries.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={loadAdminData}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs flex items-center gap-2 backdrop-blur-sm transition-colors border border-white/10"
                    >
                        <RefreshCw className="w-4 h-4" /> Sync CMS Data
                    </button>
                </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1 scrollbar-none">
                {[
                    { id: 'analytics', label: 'Analytics Insights', icon: <BarChart3 className="w-4 h-4" /> },
                    { id: 'manage', label: 'Manage Content', icon: <FileText className="w-4 h-4" /> },
                    { id: 'publish', label: editingContentId ? 'Edit Resource' : 'Create Resource', icon: <Plus className="w-4 h-4" /> },
                    { id: 'quizzes', label: 'Quizzes & Tests', icon: <HelpCircle className="w-4 h-4" /> },
                    { id: 'schemes', label: 'Government Schemes', icon: <Landmark className="w-4 h-4" /> },
                    { id: 'courses', label: 'Courses & Modules', icon: <Layers className="w-4 h-4" /> },
                    { id: 'categories', label: 'Taxonomy & Categories', icon: <Tag className="w-4 h-4" /> },
                    { id: 'media', label: 'Media Library', icon: <Folder className="w-4 h-4" /> },
                    { id: 'webinars', label: 'Webinars & Events', icon: <Calendar className="w-4 h-4" /> },
                    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            if (tab.id !== 'publish' && editingContentId) resetContentForm();
                            setActiveTab(tab.id);
                        }}
                        className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs whitespace-nowrap transition-colors ${
                            activeTab === tab.id 
                                ? 'border-sky-600 text-sky-600 bg-sky-50/50 rounded-t-xl' 
                                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB 1: ANALYTICS */}
            {activeTab === 'analytics' && analytics && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Learning Users', value: analytics.totalUsers || 0, color: 'text-sky-600', icon: <ShieldCheck /> },
                            { label: 'Total Videos', value: analytics.totalVideos || 0, color: 'text-rose-600', icon: <Video /> },
                            { label: 'Total Articles & Blogs', value: (analytics.totalArticles || 0) + (analytics.totalBlogs || 0), color: 'text-emerald-600', icon: <FileText /> },
                            { label: 'Total PDFs & Guides', value: analytics.totalPdfs || 0, color: 'text-amber-600', icon: <FileCode /> },
                            { label: 'Total Courses', value: analytics.totalCourses || 0, color: 'text-indigo-600', icon: <Layers /> },
                            { label: 'Certificates Issued', value: analytics.totalCertificates || 0, color: 'text-purple-600', icon: <Award /> },
                            { label: 'Total Bookmarks', value: analytics.totalBookmarks || 0, color: 'text-blue-600', icon: <Star /> },
                            { label: 'Quiz Pass Rate', value: `${analytics.quizCompletionRate || 0}%`, color: 'text-teal-600', icon: <CheckSquare /> }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className={`p-3 bg-gray-50 rounded-xl ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400">{stat.label}</p>
                                    <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Eye className="w-5 h-5 text-sky-600" />
                                Most Viewed Learning Content
                            </h3>
                            <div className="space-y-3">
                                {analytics.mostViewedVideos?.map((v, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-black flex items-center justify-center">{i + 1}</span>
                                            <span className="text-xs font-bold text-gray-800 line-clamp-1">{v.title}</span>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-500">{v.viewCount} views</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Download className="w-5 h-5 text-emerald-600" />
                                Most Downloaded Resource PDFs
                            </h3>
                            <div className="space-y-3">
                                {analytics.mostDownloadedPdfs?.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">{i + 1}</span>
                                            <span className="text-xs font-bold text-gray-800 line-clamp-1">{p.title}</span>
                                        </div>
                                        <span className="text-xs font-semibold text-emerald-600 font-mono">{p.downloadCount} downloads</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: MANAGE CONTENT */}
            {activeTab === 'manage' && (
                <div className="space-y-6">
                    {/* Filter & Bulk Bar */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <select 
                                value={selectedStatusFilter}
                                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                                className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-gray-700"
                            >
                                <option value="all">All Statuses</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="pending_review">Pending Review</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="archived">Archived</option>
                            </select>

                            <select 
                                value={selectedTypeFilter}
                                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                                className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-gray-700"
                            >
                                <option value="all">All Resource Types</option>
                                <option value="video">Videos</option>
                                <option value="article">Articles</option>
                                <option value="blog">Blogs</option>
                                <option value="pdf">PDF Library</option>
                                <option value="infographic">Infographics</option>
                                <option value="audio">Audio Lessons</option>
                                <option value="presentation">Presentations</option>
                            </select>

                            <select 
                                value={selectedCategoryFilter}
                                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                                className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-gray-700"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Bulk Action Buttons */}
                        {selectedIds.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-500">{selectedIds.length} selected</span>
                                <button 
                                    onClick={() => handleBulkAction('publish')}
                                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs"
                                >
                                    Publish Selected
                                </button>
                                <button 
                                    onClick={() => handleBulkAction('archive')}
                                    className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold text-xs"
                                >
                                    Archive
                                </button>
                                <button 
                                    onClick={() => handleBulkAction('delete')}
                                    className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold text-xs"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Content Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 w-10">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.length === filteredContents.length && filteredContents.length > 0} 
                                                onChange={toggleSelectAll} 
                                            />
                                        </th>
                                        <th className="p-4">Title & Type</th>
                                        <th className="p-4">Category & Subcategory</th>
                                        <th className="p-4">Author</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Flags</th>
                                        <th className="p-4">Views/Downloads</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredContents.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="p-4">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedIds.includes(item._id)}
                                                    onChange={() => {
                                                        if (selectedIds.includes(item._id)) {
                                                            setSelectedIds(selectedIds.filter(id => id !== item._id));
                                                        } else {
                                                            setSelectedIds([...selectedIds, item._id]);
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</div>
                                                <span className="uppercase text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full inline-block mt-1">
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-600 font-medium">
                                                {item.categories?.map(c => c.name || c).join(', ') || 'Uncategorized'}
                                                {item.subcategory && <span className="text-[10px] text-gray-400 block font-semibold">Sub: {item.subcategory}</span>}
                                            </td>
                                            <td className="p-4 font-bold text-gray-700">
                                                {item.author?.name || 'MatsyaLink Expert'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] uppercase ${
                                                    item.status === 'published' ? 'bg-emerald-50 text-emerald-700' :
                                                    item.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                                                    item.status === 'scheduled' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1">
                                                    {item.featured && <Star className="w-4 h-4 text-amber-500 fill-amber-500" title="Featured" />}
                                                    {item.pinned && <Pin className="w-4 h-4 text-rose-500 fill-rose-500" title="Pinned" />}
                                                    {item.isTrending && <Flame className="w-4 h-4 text-orange-500 fill-orange-500" title="Trending" />}
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-500 font-mono">
                                                👁 {item.viewCount || 0} | 📥 {item.downloadCount || 0}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleEditContent(item)}
                                                        className="p-1.5 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteContent(item._id)}
                                                        className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: CREATE / EDIT RESOURCE */}
            {activeTab === 'publish' && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm max-w-4xl">
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center justify-between">
                        <span>{editingContentId ? 'Edit Learning Resource' : 'Create & Publish Learning Resource'}</span>
                        {editingContentId && (
                            <button onClick={resetContentForm} className="text-xs text-rose-600 font-bold hover:underline">
                                Cancel Editing
                            </button>
                        )}
                    </h2>

                    <form onSubmit={handleContentSubmit} className="space-y-5 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Content Title *</label>
                                <input 
                                    type="text" 
                                    required
                                    value={contentForm.title}
                                    onChange={(e) => setContentForm({...contentForm, title: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white"
                                    placeholder="Enter descriptive title"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Resource Type *</label>
                                <select 
                                    value={contentForm.type}
                                    onChange={(e) => setContentForm({...contentForm, type: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                                >
                                    <option value="video">Video Lesson</option>
                                    <option value="article">Educational Article</option>
                                    <option value="blog">Blog Post</option>
                                    <option value="pdf">PDF Guide</option>
                                    <option value="infographic">Infographic</option>
                                    <option value="audio">Audio Lesson</option>
                                    <option value="presentation">Presentation</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Category *</label>
                                <select 
                                    value={contentForm.category || (contentForm.categories?.[0] || '')}
                                    onChange={(e) => setContentForm({...contentForm, categories: [e.target.value]})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                                >
                                    <option value="">Select Primary Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Subcategory</label>
                                <input 
                                    type="text" 
                                    value={contentForm.subcategory}
                                    onChange={(e) => setContentForm({...contentForm, subcategory: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                                    placeholder="e.g. Biofloc Tech"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Publishing Status *</label>
                                <select 
                                    value={contentForm.status}
                                    onChange={(e) => setContentForm({...contentForm, status: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sky-700"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Save as Draft</option>
                                    <option value="pending_review">Pending Review</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Target Language</label>
                                <select 
                                    value={contentForm.language}
                                    onChange={(e) => setContentForm({...contentForm, language: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                                >
                                    <option value="en">English (en)</option>
                                    <option value="bn">Bengali (bn)</option>
                                    <option value="hi">Hindi (hi)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Author Name</label>
                                <input 
                                    type="text" 
                                    value={contentForm.authorName}
                                    onChange={(e) => setContentForm({...contentForm, authorName: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Tags (Comma separated)</label>
                                <input 
                                    type="text" 
                                    value={contentForm.tags}
                                    onChange={(e) => setContentForm({...contentForm, tags: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                                    placeholder="fish, aquaculture, biofloc"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Thumbnail / Cover Image URL</label>
                                <input 
                                    type="url" 
                                    value={contentForm.thumbnail}
                                    onChange={(e) => setContentForm({...contentForm, thumbnail: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                                    placeholder="https://res.cloudinary.com/your-image-url.jpg"
                                />
                            </div>
                        </div>

                        {/* Media Links depending on type */}
                        {contentForm.type === 'video' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-sky-50/50 p-4 rounded-xl">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Video Stream URL</label>
                                    <input 
                                        type="url"
                                        value={contentForm.videoUrl}
                                        onChange={(e) => setContentForm({...contentForm, videoUrl: e.target.value})}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                        placeholder="https://youtube.com/watch?v=..."
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Video Duration (Minutes)</label>
                                    <input 
                                        type="number"
                                        value={contentForm.duration}
                                        onChange={(e) => setContentForm({...contentForm, duration: Number(e.target.value)})}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                    />
                                </div>
                            </div>
                        )}

                        {contentForm.type === 'pdf' && (
                            <div className="bg-amber-50/50 p-4 rounded-xl">
                                <label className="block font-bold text-gray-700 mb-1">PDF File Download Link</label>
                                <input 
                                    type="url"
                                    value={contentForm.pdfUrl}
                                    onChange={(e) => setContentForm({...contentForm, pdfUrl: e.target.value})}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                    placeholder="https://storage.matsyalink.com/guides/fish-feed-manual.pdf"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block font-bold text-gray-700 mb-1">Resource Body / Description Content</label>
                            <textarea 
                                rows={6}
                                value={contentForm.content}
                                onChange={(e) => setContentForm({...contentForm, content: e.target.value})}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                                placeholder="Enter detailed learning body content in markdown or plain text..."
                            />
                        </div>

                        {/* Curation Flags */}
                        <div className="flex flex-wrap items-center gap-6 p-4 bg-gray-50 rounded-xl">
                            <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={contentForm.featured}
                                    onChange={(e) => setContentForm({...contentForm, featured: e.target.checked})}
                                />
                                Featured Content
                            </label>
                            <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={contentForm.pinned}
                                    onChange={(e) => setContentForm({...contentForm, pinned: e.target.checked})}
                                />
                                Pin Content to Top
                            </label>
                            <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={contentForm.isTrending}
                                    onChange={(e) => setContentForm({...contentForm, isTrending: e.target.checked})}
                                />
                                Mark as Trending
                            </label>
                        </div>

                        <button 
                            type="submit"
                            className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-xl text-xs shadow-lg shadow-sky-600/20"
                        >
                            {editingContentId ? 'Save Changes' : 'Publish Resource Now'}
                        </button>
                    </form>
                </div>
            )}

            {/* TAB 4: QUIZZES */}
            {activeTab === 'quizzes' && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm max-w-2xl">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Create New Learning Quiz</h3>
                    <form onSubmit={handleQuizSubmit} className="space-y-4 text-xs">
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">Quiz Title *</label>
                            <input 
                                type="text" required
                                value={quizForm.title} onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">Description</label>
                            <textarea 
                                rows={2}
                                value={quizForm.description} onChange={(e) => setQuizForm({...quizForm, description: e.target.value})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Passing Score (%)</label>
                                <input 
                                    type="number"
                                    value={quizForm.passingScore} onChange={(e) => setQuizForm({...quizForm, passingScore: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Time Limit (Minutes)</label>
                                <input 
                                    type="number"
                                    value={quizForm.timeLimit} onChange={(e) => setQuizForm({...quizForm, timeLimit: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* First Question Form */}
                        <div className="p-4 bg-sky-50/50 rounded-xl space-y-3">
                            <label className="block font-bold text-gray-700">Sample Multiple Choice Question</label>
                            <input 
                                type="text" placeholder="Enter Question text" required
                                value={quizForm.questionText} onChange={(e) => setQuizForm({...quizForm, questionText: e.target.value})}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" placeholder="Option 1" required value={quizForm.optionA} onChange={(e) => setQuizForm({...quizForm, optionA: e.target.value})} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg" />
                                <input type="text" placeholder="Option 2" required value={quizForm.optionB} onChange={(e) => setQuizForm({...quizForm, optionB: e.target.value})} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg" />
                                <input type="text" placeholder="Option 3" value={quizForm.optionC} onChange={(e) => setQuizForm({...quizForm, optionC: e.target.value})} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg" />
                                <input type="text" placeholder="Option 4" value={quizForm.optionD} onChange={(e) => setQuizForm({...quizForm, optionD: e.target.value})} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg" />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl">
                            Save Quiz
                        </button>
                    </form>
                </div>
            )}

            {/* TAB 5: GOVERNMENT SCHEMES */}
            {activeTab === 'schemes' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm md:col-span-1">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Post Government Scheme</h3>
                        <form onSubmit={handleSchemeSubmit} className="space-y-4 text-xs">
                            <input 
                                type="text" required placeholder="Post Title"
                                value={schemeForm.title} onChange={(e) => setSchemeForm({...schemeForm, title: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <input 
                                type="text" required placeholder="Official Scheme Name"
                                value={schemeForm.schemeName} onChange={(e) => setSchemeForm({...schemeForm, schemeName: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <input 
                                type="text" placeholder="Ministry / Department"
                                value={schemeForm.ministry} onChange={(e) => setSchemeForm({...schemeForm, ministry: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <textarea 
                                rows={3} placeholder="Eligibility Criteria & Benefits"
                                value={schemeForm.eligibility} onChange={(e) => setSchemeForm({...schemeForm, eligibility: e.target.value})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <button type="submit" className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl">
                                Publish Scheme
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm md:col-span-2">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Government Scheme Posts</h3>
                        <div className="space-y-3">
                            {schemes.map(s => (
                                <div key={s._id} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{s.schemeName || s.title}</h4>
                                        <p className="text-gray-500 mt-0.5">{s.ministry || 'Fisheries Ministry'} | Category: {s.category}</p>
                                    </div>
                                    <button onClick={() => handleDeleteScheme(s._id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 6: COURSES & MODULES */}
            {activeTab === 'courses' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm md:col-span-1">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Create New Course</h3>
                        <form onSubmit={handleCourseSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Course Title</label>
                                <input 
                                    type="text" 
                                    required
                                    value={courseForm.title}
                                    onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Description</label>
                                <textarea 
                                    rows={3}
                                    value={courseForm.description}
                                    onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">
                                Build Course
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm md:col-span-2">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Active Learning Courses</h3>
                        <div className="space-y-4">
                            {courses.map(course => (
                                <div key={course._id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{course.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{course.description}</p>
                                    </div>
                                    <button 
                                        onClick={async () => {
                                            if (window.confirm('Delete course?')) {
                                                await deleteCourse(course._id);
                                                loadAdminData();
                                            }
                                        }}
                                        className="p-2 bg-rose-50 text-rose-600 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 7: TAXONOMY & CATEGORIES */}
            {activeTab === 'categories' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm md:col-span-1">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Add Category / Subcategory</h3>
                        <form onSubmit={handleCategorySubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Category Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Subcategories (Comma separated)</label>
                                <input 
                                    type="text" 
                                    value={categoryForm.subcategories}
                                    onChange={(e) => setCategoryForm({...categoryForm, subcategories: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                                    placeholder="Subcategory 1, Subcategory 2"
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl">
                                Save Category Taxonomy
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm md:col-span-2">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Configured Categories & Subcategories</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {categories.map(cat => (
                                <div key={cat._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-sky-600" />
                                            {cat.name}
                                        </h4>
                                        {cat.subcategories?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {cat.subcategories.map((sub, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-white text-gray-600 rounded text-[10px] font-semibold border border-gray-200">
                                                        {sub}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => handleDeleteCategory(cat._id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 8: MEDIA LIBRARY */}
            {activeTab === 'media' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Upload Asset to Media Library</h3>
                        <form onSubmit={handleMediaSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                            <input 
                                type="text" 
                                required
                                placeholder="File Name"
                                value={mediaForm.fileName}
                                onChange={(e) => setMediaForm({...mediaForm, fileName: e.target.value})}
                                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <input 
                                type="url" 
                                required
                                placeholder="File URL / Media Storage Link"
                                value={mediaForm.fileUrl}
                                onChange={(e) => setMediaForm({...mediaForm, fileUrl: e.target.value})}
                                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <select 
                                value={mediaForm.fileType}
                                onChange={(e) => setMediaForm({...mediaForm, fileType: e.target.value})}
                                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                            >
                                <option value="image">Image Asset</option>
                                <option value="video">Video File</option>
                                <option value="pdf">PDF Document</option>
                                <option value="audio">Audio File</option>
                                <option value="presentation">Presentation</option>
                            </select>
                            <button type="submit" className="py-2 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                                <Upload className="w-4 h-4" /> Save Media Asset
                            </button>
                        </form>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {mediaAssets.map(asset => (
                            <div key={asset._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-2">
                                <div className="text-xs font-bold text-gray-800 line-clamp-1">{asset.fileName}</div>
                                <span className="uppercase text-[9px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block">
                                    {asset.fileType}
                                </span>
                                <div className="flex items-center justify-between pt-2">
                                    <button onClick={() => handleReplaceMedia(asset._id)} className="text-[10px] font-bold text-sky-600 hover:underline">
                                        Replace Safe URL
                                    </button>
                                    <button onClick={() => deleteMediaAsset(asset._id).then(loadAdminData)} className="p-1 text-rose-600">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 9: WEBINARS & EVENTS */}
            {activeTab === 'webinars' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm md:col-span-1">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Schedule Webinar / Training</h3>
                        <form onSubmit={handleWebinarSubmit} className="space-y-4 text-xs">
                            <input 
                                type="text" required placeholder="Event Title"
                                value={webinarForm.title} onChange={(e) => setWebinarForm({...webinarForm, title: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <input 
                                type="text" required placeholder="Instructor Name"
                                value={webinarForm.instructor} onChange={(e) => setWebinarForm({...webinarForm, instructor: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <input 
                                type="datetime-local" required
                                value={webinarForm.scheduledDate} onChange={(e) => setWebinarForm({...webinarForm, scheduledDate: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <button type="submit" className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl">
                                Schedule Event
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm md:col-span-2">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Scheduled Webinars & Programs</h3>
                        <div className="space-y-3">
                            {webinars.map(w => (
                                <div key={w._id} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{w.title}</h4>
                                        <p className="text-gray-500 mt-0.5">Instructor: {w.instructor} | Date: {new Date(w.scheduledDate).toLocaleString()}</p>
                                    </div>
                                    <button onClick={() => deleteWebinar(w._id).then(loadAdminData)} className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 10: BROADCAST NOTIFICATIONS */}
            {activeTab === 'notifications' && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm max-w-xl">
                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-sky-600" />
                        Broadcast Learning Notification
                    </h3>
                    <form onSubmit={handleNotificationSubmit} className="space-y-4 text-xs">
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">Notification Title</label>
                            <input 
                                type="text" required
                                value={notificationForm.title} onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                                placeholder="e.g. New Aquaculture Video Course Uploaded!"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">Notification Message</label>
                            <textarea 
                                rows={3} required
                                value={notificationForm.message} onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                        </div>
                        <button type="submit" className="w-full py-3 bg-sky-600 text-white font-black rounded-xl">
                            Send Broadcast to All Users
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LearningAdminDashboard;
