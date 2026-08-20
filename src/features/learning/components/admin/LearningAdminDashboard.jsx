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
    sendBroadcastNotification,
    uploadLearningVideo
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

    // Video upload state
    const [videoUpload, setVideoUpload] = useState({ uploading: false, progress: 0, error: '' });

    // Selection & Filter State
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
    const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState([]);
    const [mediaSearch, setMediaSearch] = useState('');
    const [selectedFolder, setSelectedFolder] = useState('');

    // Editing State
    const [editingContentId, setEditingContentId] = useState(null);

    // Structured Q&A Parts builder state
    const [parts, setParts] = useState([{ id: Date.now(), title: '', qas: [{ id: Date.now() + 1, question: '', answer: '' }] }]);


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

            // Core data — always available (public or user-level auth)
            const [analRes, catRes, contentRes, schemeRes] = await Promise.all([
                getLearningAnalytics().catch(() => null),
                getCategories().catch(() => null),
                getAllContentAdmin({ limit: 200 }).catch(() => null),
                getGovernmentSchemes().catch(() => null),
            ]);

            if (analRes?.data?.success) setAnalytics(analRes.data.data);
            if (catRes?.data?.success) setCategories(catRes.data.data);
            if (contentRes?.data?.success) setContents(contentRes.data.data || []);
            if (schemeRes?.data?.success) setSchemes(schemeRes.data.data || []);

            // Admin-only endpoints — gracefully skip on 401/403 (e.g. token not yet set)
            const [mediaRes, courseRes, webinarRes] = await Promise.all([
                getMediaAssets({ folder: selectedFolder, search: mediaSearch }).catch(() => null),
                getCourses().catch(() => null),
                getWebinars().catch(() => null),
            ]);

            if (mediaRes?.data?.success) {
                setMediaAssets(mediaRes.data.data || []);
                setFolders(mediaRes.data.folders || []);
            }
            if (courseRes?.data?.success) setCourses(courseRes.data.data || []);
            if (webinarRes?.data?.success) setWebinars(webinarRes.data.data || []);

        } catch (err) {
            console.error('Error loading admin CMS data', err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadAdminData();
    }, [selectedFolder, mediaSearch]);

    // ── Part / Q&A helpers ──────────────────────────────────────────────────
    const serializeParts = (partsData) => {
        return partsData
            .filter(p => p.title.trim() || p.qas.some(qa => qa.question.trim()))
            .map((part, pi) => {
                const header = `🟢 PART ${pi + 1} — ${part.title}`;
                const qaLines = part.qas
                    .filter(qa => qa.question.trim())
                    .map((qa, qi) => `${qi + 1}. ${qa.question}\n\nans:\n${qa.answer}`)
                    .join('\n\n');
                return `${header}\n\n${qaLines}`;
            })
            .join('\n\n');
    };

    // Reverse of serializeParts — parses saved content string back into parts array
    const deserializeContent = (text) => {
        if (!text || !text.trim()) return [{ id: Date.now(), title: '', qas: [{ id: Date.now() + 1, question: '', answer: '' }] }];

        // Split on PART headers (🟢 PART N — Title  OR  PART N — Title  OR  Part N)
        const partSections = text.split(/(?=(?:🟢\s*)?PART\s+\d+\s*[—-])/i).filter(s => s.trim());

        if (partSections.length === 0) {
            // No PART markers — treat the whole thing as one part with one Q&A
            return [{ id: Date.now(), title: '', qas: [{ id: Date.now() + 1, question: text.trim(), answer: '' }] }];
        }

        return partSections.map((section, pi) => {
            const lines = section.split('\n');
            // First line is the part header — extract the title after the dash
            const headerLine = lines[0] || '';
            const titleMatch = headerLine.match(/(?:🟢\s*)?PART\s+\d+\s*[—-]\s*(.*)/i);
            const partTitle = titleMatch ? titleMatch[1].trim() : headerLine.trim();

            // Remaining lines contain Q&A pairs
            const body = lines.slice(1).join('\n').trim();

            // Split on numbered questions: `1.`, `2.`, `qn1`, `qn2`, etc.
            const qaPairs = body.split(/\n(?=\d+\.\s|qn\d+)/i).filter(s => s.trim());

            const qas = qaPairs.map((pair, qi) => {
                // Split on `ans:` or `ans\n` (with optional whitespace)
                const ansMatch = pair.split(/\bans\s*:?\s*\n?/i);
                const questionRaw = ansMatch[0] || '';
                const answerRaw = ansMatch.slice(1).join('').trim();

                // Strip leading number from question (e.g. `1. ` or `qn1 `)
                const question = questionRaw.replace(/^(?:\d+\.\s*|qn\d+\s*)/i, '').trim();

                return { id: Date.now() + pi * 100 + qi, question, answer: answerRaw };
            }).filter(qa => qa.question);

            return {
                id: Date.now() + pi * 1000,
                title: partTitle,
                qas: qas.length > 0 ? qas : [{ id: Date.now() + pi * 100, question: '', answer: '' }]
            };
        });
    };

    const addPart = () => setParts(prev => [...prev, { id: Date.now(), title: '', qas: [{ id: Date.now() + 1, question: '', answer: '' }] }]);
    const deletePart = (pid) => setParts(prev => prev.filter(p => p.id !== pid));
    const updatePartTitle = (pid, val) => setParts(prev => prev.map(p => p.id === pid ? { ...p, title: val } : p));

    const addQA = (pid) => setParts(prev => prev.map(p => p.id === pid ? { ...p, qas: [...p.qas, { id: Date.now(), question: '', answer: '' }] } : p));
    const deleteQA = (pid, qid) => setParts(prev => prev.map(p => p.id === pid ? { ...p, qas: p.qas.filter(q => q.id !== qid) } : p));
    const updateQA = (pid, qid, field, val) => setParts(prev => prev.map(p => p.id === pid ? { ...p, qas: p.qas.map(q => q.id === qid ? { ...q, [field]: val } : q) } : p));

    // ── Content Handlers ────────────────────────────────────────────────────
    const handleContentSubmit = async (e) => {
        e.preventDefault();
        try {
            const serializedContent = serializeParts(parts);
            const payload = {
                ...contentForm,
                content: serializedContent || contentForm.content,
                categories: Array.isArray(contentForm.categories) && contentForm.categories.length > 0 
                    ? contentForm.categories 
                    : (categories[0]?._id ? [categories[0]._id] : []),
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

    const resetContentForm = (presetType) => {
        setEditingContentId(null);
        setParts([{ id: Date.now(), title: '', qas: [{ id: Date.now() + 1, question: '', answer: '' }] }]);
        setContentForm({
            title: '', 
            type: presetType || (['article', 'video', 'success_story', 'problems_story'].includes(activeTab) ? activeTab : 'article'), 
            categories: [], subcategory: '', language: 'en', level: 'beginner',
            status: 'published', content: '', videoUrl: '', videoSource: 'youtube', pdfUrl: '', mediaUrl: '',
            thumbnail: '', duration: 0, readingTime: 0, featured: false, pinned: false, isTrending: false, isRecommended: false,
            authorName: 'MatsyaLink Expert', authorBio: '', tags: ''
        });
    };

    const handleEditContent = (item) => {
        setEditingContentId(item._id);
        // Parse existing content string back into the structured parts builder
        setParts(deserializeContent(item.content || ''));
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
        setActiveTab(item.type);
        // Scroll to top of form
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    { id: 'article', label: editingContentId && contentForm.type === 'article' ? 'Edit Article' : 'Upload Article', icon: <Plus className="w-4 h-4" /> },
                    { id: 'video', label: editingContentId && contentForm.type === 'video' ? 'Edit Video' : 'Upload Video', icon: <Video className="w-4 h-4" /> },
                    { id: 'success_story', label: editingContentId && contentForm.type === 'success_story' ? 'Edit Success Story' : 'Upload Success Story', icon: <Star className="w-4 h-4" /> },
                    { id: 'problems_story', label: editingContentId && contentForm.type === 'problems_story' ? 'Edit Problems Story' : 'Upload Problems Story', icon: <HelpCircle className="w-4 h-4" /> },
                    { id: 'webinars', label: 'Upload Webinar', icon: <Calendar className="w-4 h-4" /> },
                    { id: 'schemes', label: 'Upload Govt Scheme', icon: <Landmark className="w-4 h-4" /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            const isContentTab = ['article', 'video', 'success_story', 'problems_story'].includes(tab.id);
                            const wasEditingOther = editingContentId && contentForm.type !== tab.id;
                            
                            if (isContentTab) {
                                if (wasEditingOther) {
                                    resetContentForm(tab.id);
                                } else {
                                    setContentForm(prev => ({ ...prev, type: tab.id }));
                                }
                            } else if (editingContentId) {
                                resetContentForm();
                            }
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
                                <option value="article">Articles</option>
                                <option value="video">Videos</option>
                                <option value="success_story">Success Stories</option>
                                <option value="problems_story">Problems Story (Videos)</option>
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
            {['article', 'video', 'success_story', 'problems_story'].includes(activeTab) && (
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
                                <label className="block font-bold text-gray-700 mb-1">Resource Type</label>
                                <div className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl font-bold text-gray-700 capitalize">
                                    {contentForm.type?.replace('_', ' ')}
                                </div>
                            </div>
                        </div>

        {/* Hidden inputs with default values */}

                        {/* ── Video Upload ── */}
                        {(contentForm.type === 'video' || contentForm.type === 'problems_story' || contentForm.type === 'success_story') && (
                            <div className="bg-sky-50/60 border border-sky-100 p-4 rounded-2xl space-y-3">
                                <label className="block font-bold text-gray-800 text-sm">🎬 Video File</label>

                                {/* Drop zone / file picker */}
                                <label
                                    htmlFor="video-file-input"
                                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                                        videoUpload.uploading
                                            ? 'border-sky-300 bg-sky-50'
                                            : contentForm.videoUrl
                                            ? 'border-emerald-300 bg-emerald-50'
                                            : 'border-sky-200 bg-white hover:border-sky-400 hover:bg-sky-50'
                                    }`}
                                >
                                    {videoUpload.uploading ? (
                                        <div className="flex flex-col items-center gap-2 w-full px-6">
                                            <div className="w-full bg-sky-100 rounded-full h-2">
                                                <div
                                                    className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${videoUpload.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-sky-600">Uploading... {videoUpload.progress}%</span>
                                        </div>
                                    ) : contentForm.videoUrl ? (
                                        <div className="flex flex-col items-center gap-1">
                                            <Video className="w-7 h-7 text-emerald-500" />
                                            <span className="text-xs font-bold text-emerald-600">✅ Video uploaded</span>
                                            <span className="text-[10px] text-gray-400 max-w-xs truncate px-2">{contentForm.videoUrl}</span>
                                            <span className="text-[10px] text-sky-500 font-semibold mt-0.5">Click to replace</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1">
                                            <Upload className="w-7 h-7 text-sky-400" />
                                            <span className="text-xs font-bold text-sky-600">Click to upload video</span>
                                            <span className="text-[10px] text-gray-400">MP4, MOV, WebM — max 200MB</span>
                                        </div>
                                    )}
                                </label>
                                <input
                                    id="video-file-input"
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    disabled={videoUpload.uploading}
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setVideoUpload({ uploading: true, progress: 0, error: '' });
                                        try {
                                            const res = await uploadLearningVideo(file, (pct) =>
                                                setVideoUpload(prev => ({ ...prev, progress: pct }))
                                            );
                                            if (res.data.success) {
                                                setContentForm(prev => ({
                                                    ...prev,
                                                    videoUrl: res.data.url,
                                                    duration: res.data.duration ? Math.round(res.data.duration / 60) : prev.duration
                                                }));
                                                setVideoUpload({ uploading: false, progress: 100, error: '' });
                                            }
                                        } catch (err) {
                                            setVideoUpload({ uploading: false, progress: 0, error: err.response?.data?.msg || 'Upload failed' });
                                        }
                                        e.target.value = '';
                                    }}
                                />

                                {videoUpload.error && (
                                    <p className="text-xs text-rose-600 font-semibold">{videoUpload.error}</p>
                                )}

                                {/* Fallback: paste a YouTube / external URL */}
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Or paste a YouTube / external URL</label>
                                    <input
                                        type="url"
                                        value={contentForm.videoUrl}
                                        onChange={(e) => setContentForm({...contentForm, videoUrl: e.target.value})}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                                        placeholder="https://youtube.com/watch?v=..."
                                    />
                                </div>

                                {/* Duration override */}
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Video Duration (minutes)</label>
                                    <input
                                        type="number"
                                        value={contentForm.duration}
                                        onChange={(e) => setContentForm({...contentForm, duration: Number(e.target.value)})}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
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

                        {/* ── Structured Part → Q&A Builder ── */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block font-bold text-gray-800 text-sm">📚 Content Parts &amp; Q&amp;A</label>
                                <button
                                    type="button"
                                    onClick={addPart}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Part
                                </button>
                            </div>

                            <div className="space-y-5">
                                {parts.map((part, pi) => (
                                    <div key={part.id} className="border-2 border-sky-100 rounded-2xl overflow-hidden">
                                        {/* Part Header */}
                                        <div className="flex items-center gap-3 bg-sky-50 px-4 py-3">
                                            <span className="flex-shrink-0 w-7 h-7 bg-sky-600 text-white rounded-lg flex items-center justify-center text-xs font-black">
                                                {pi + 1}
                                            </span>
                                            <input
                                                type="text"
                                                value={part.title}
                                                onChange={(e) => updatePartTitle(part.id, e.target.value)}
                                                placeholder={`Part ${pi + 1} title (e.g. মাছ চাষের Basic)`}
                                                className="flex-1 px-3 py-1.5 bg-white border border-sky-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-sky-500"
                                            />
                                            {parts.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => deletePart(part.id)}
                                                    className="flex-shrink-0 p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Delete Part"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Q&A List */}
                                        <div className="p-4 space-y-4">
                                            {part.qas.map((qa, qi) => (
                                                <div key={qa.id} className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex-shrink-0 w-5 h-5 bg-amber-500 text-white rounded text-[10px] font-black flex items-center justify-center">{qi + 1}</span>
                                                        <input
                                                            type="text"
                                                            value={qa.question}
                                                            onChange={(e) => updateQA(part.id, qa.id, 'question', e.target.value)}
                                                            placeholder="Question..."
                                                            className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-amber-400"
                                                        />
                                                        {part.qas.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteQA(part.id, qa.id)}
                                                                className="flex-shrink-0 p-1 text-rose-300 hover:text-rose-500 rounded transition-colors"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <textarea
                                                        rows={3}
                                                        value={qa.answer}
                                                        onChange={(e) => updateQA(part.id, qa.id, 'answer', e.target.value)}
                                                        placeholder="Answer..."
                                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-sky-400 resize-y"
                                                    />
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={() => addQA(part.id)}
                                                className="w-full py-2 border-2 border-dashed border-sky-200 hover:border-sky-400 text-sky-500 hover:text-sky-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                                            >
                                                <Plus className="w-3.5 h-3.5" /> Add Q&amp;A
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Live Preview toggle */}
                            <details className="mt-4">
                                <summary className="text-xs font-bold text-gray-500 cursor-pointer hover:text-gray-800 select-none">🔍 Preview raw content (what will be saved)</summary>
                                <pre className="mt-2 p-3 bg-gray-900 text-green-300 rounded-xl text-[10px] whitespace-pre-wrap font-mono overflow-auto max-h-48">
                                    {serializeParts(parts) || '(empty — add parts and Q&As above)'}
                                </pre>
                            </details>
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
                            <select
                                value={schemeForm.category}
                                onChange={(e) => setSchemeForm({...schemeForm, category: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 bg-white"
                            >
                                <option value="subsidy">Subsidy</option>
                                <option value="pmmsy">PMMSY Scheme</option>
                                <option value="loan">Loan</option>
                                <option value="insurance">Insurance</option>
                                <option value="training_program">Training Program</option>
                                <option value="notification">Government Notification</option>
                            </select>
                            <input 
                                type="text" placeholder="Ministry / Department"
                                value={schemeForm.ministry} onChange={(e) => setSchemeForm({...schemeForm, ministry: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <textarea 
                                rows={3} required placeholder="Description (Required)"
                                value={schemeForm.description} onChange={(e) => setSchemeForm({...schemeForm, description: e.target.value})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <textarea 
                                rows={2} placeholder="Eligibility Criteria"
                                value={schemeForm.eligibility} onChange={(e) => setSchemeForm({...schemeForm, eligibility: e.target.value})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <textarea 
                                rows={2} placeholder="Benefits"
                                value={schemeForm.benefits} onChange={(e) => setSchemeForm({...schemeForm, benefits: e.target.value})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <input 
                                type="url" placeholder="Official Application Link (URL)"
                                value={schemeForm.applicationLink} onChange={(e) => setSchemeForm({...schemeForm, applicationLink: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
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
