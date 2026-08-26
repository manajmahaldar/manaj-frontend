import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContentDetails, trackProgress } from '../api/learningApi';
import { Calendar, User, Eye, ChevronRight, CheckCircle, Moon, Sun, Printer, Share2 } from 'lucide-react';
// Strip HTML tags and decode common HTML entities to plain text
const stripHtml = (html) => {
    if (!html) return '';
    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
};

const parseContent = (content) => {
    if (!content) return [];

    // Always strip HTML so accordion works regardless of how admin saved content
    const plainText = /<[a-z][\s\S]*>/i.test(content) ? stripHtml(content) : content;

    const lines = plainText.split('\n');
    const parts = [];
    let currentPart = { title: '', items: [] };
    let currentQ = null;
    let currentAns = null;

    const flushQ = () => {
        if (currentQ !== null) {
            currentPart.items.push({ type: 'qa', question: currentQ, answer: currentAns || '' });
            currentQ = null;
            currentAns = null;
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (!trimmed) continue;

        // Is it a Part header?
        if (/^(🟢|🔵|part\s*\d+)/i.test(trimmed)) {
            flushQ();
            if (currentPart.title || currentPart.items.length > 0) {
                parts.push(currentPart);
            }
            currentPart = { title: trimmed, items: [] };
            continue;
        }

        // Is it a Question? (e.g. "1." or "Q1" or "Qn1")
        if (/^\d+[\.\)]/.test(trimmed) || /^q(n|ues(tion)?)?\s*\d+/i.test(trimmed)) {
            flushQ();
            currentQ = trimmed;
            currentAns = null;
            continue;
        }

        // Is it an Answer line?
        if (/^ans(wer)?\s*[\:\-]?/i.test(trimmed)) {
            const colonIdx = trimmed.indexOf(':');
            const dashIdx = trimmed.indexOf('-');
            const sepIdx = colonIdx > -1 ? colonIdx : dashIdx > -1 ? dashIdx : 2;
            const ansText = trimmed.substring(sepIdx + 1).trim();
            if (currentQ !== null) {
                currentAns = ansText;
            } else {
                currentPart.items.push({ type: 'text', content: trimmed });
            }
            continue;
        }

        // Continuation of answer (line after "Ans:" that isn't a new Q or Part)
        if (currentQ !== null && currentAns !== null) {
            currentAns += ' ' + trimmed;
            continue;
        }

        // Regular paragraph / content
        flushQ();
        currentPart.items.push({ type: 'text', content: trimmed });
    }

    flushQ();
    if (currentPart.title || currentPart.items.length > 0) {
        parts.push(currentPart);
    }

    return parts;
};

const ArticleDetail = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [activeQKey, setActiveQKey] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await getContentDetails(slug);
                if (res.data.success) {
                    setArticle(res.data.data);
                    if (res.data.data.userProgress) {
                        setIsCompleted(res.data.data.userProgress.completed);
                    }
                    // Trigger initial progress log at 20%
                    await trackProgress({
                        contentId: res.data.data._id,
                        progress: 20,
                        watchedSeconds: 0,
                        lastPosition: 0
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [slug]);

    const handleMarkComplete = async () => {
        if (!article) return;
        try {
            await trackProgress({
                contentId: article._id,
                progress: 100,
                watchedSeconds: 0,
                lastPosition: 0
            });
            setIsCompleted(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                url: window.location.href
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Article link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-2/3" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-64 bg-gray-100 rounded-3xl" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 font-bold">Article not found</p>
                <Link to="/learning/articles" className="text-primary font-bold mt-2 inline-block">Back to Articles</Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                    <Link to="/learning" className="hover:text-primary">Learning Hub</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link to="/learning/articles" className="hover:text-primary">Articles</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-gray-900 truncate max-w-[200px]">{article.title}</span>
                </div>

                {/* Article Header controls */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {article.author?.name || 'Expert'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(article.publishAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {article.viewCount} views</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            title="Toggle Reader Mode"
                        >
                            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <button 
                            onClick={handleShare}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            title="Share Link"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => window.print()}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            title="Print Article"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Main Article Text */}
                <article className={`p-8 rounded-3xl border transition-colors duration-300 leading-relaxed font-serif text-base print:border-0 print:p-0 ${
                    darkMode 
                        ? 'bg-gray-900 text-gray-100 border-gray-800' 
                        : 'bg-white text-gray-800 border-gray-100 shadow-sm'
                }`}>
                    <h1 className="text-3xl font-black font-sans leading-tight mb-6">{article.title}</h1>
                    
                    {article.thumbnail && (
                        <img 
                            src={article.thumbnail} 
                            alt={article.title} 
                            className="w-full rounded-2xl mb-6 aspect-video object-cover"
                        />
                    )}

                    {(() => {
                        const parsedParts = parseContent(article.content);
                        if (!parsedParts || parsedParts.length === 0) {
                            return <p className="text-sm text-gray-500 italic">No content available.</p>;
                        }
                        return (
                            <div className="space-y-6">
                                {parsedParts.map((part, partIdx) => (
                                    <div key={partIdx} className="space-y-3">
                                        {part.title && (
                                            <h2 className="text-base font-black text-primary mt-6 mb-3 pb-1 border-b border-gray-100 flex items-center gap-2">
                                                {part.title}
                                            </h2>
                                        )}
                                        <div className="space-y-3">
                                            {part.items.map((item, itemIdx) => {
                                                const qKey = `${partIdx}-${itemIdx}`;
                                                if (item.type === 'qa') {
                                                    const isOpen = activeQKey === qKey;
                                                    return (
                                                        <div key={itemIdx} className="border border-gray-100 rounded-xl overflow-hidden">
                                                            <h3
                                                                onClick={() => setActiveQKey(isOpen ? null : qKey)}
                                                                className="text-xs font-bold text-gray-900 flex items-center justify-between gap-2 bg-gray-50 p-3 rounded-xl border-l-4 border-primary cursor-pointer hover:bg-gray-100/80 transition-all select-none"
                                                            >
                                                                <span>{item.question}</span>
                                                                <span
                                                                    className="text-primary font-bold text-base transition-transform duration-200 shrink-0"
                                                                    style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}
                                                                >
                                                                    ▶
                                                                </span>
                                                            </h3>
                                                            {isOpen && (
                                                                <div className="p-4 bg-white text-xs font-semibold text-gray-600 leading-relaxed border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
                                                                    {item.answer
                                                                        ? <><strong className="text-primary mr-1">Ans:</strong>{item.answer}</>
                                                                        : <span className="italic text-gray-400">No answer provided.</span>
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <p key={itemIdx} className="text-xs font-semibold text-gray-600 leading-relaxed mb-3">
                                                        {item.content}
                                                    </p>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}

                    {/* Completion control */}
                    <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-400">Done reading? Mark it complete to earn progress.</p>
                        {isCompleted ? (
                            <span className="flex items-center gap-1 text-emerald-500 font-extrabold text-xs bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                                <CheckCircle className="w-4 h-4" />
                                Completed
                            </span>
                        ) : (
                            <button
                                onClick={handleMarkComplete}
                                className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-blue-700 transition-all active:scale-95"
                            >
                                Mark Complete
                            </button>
                        )}
                    </div>
                </article>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="font-extrabold text-gray-900 text-sm mb-4">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                        {article.categories?.map(cat => (
                            <Link 
                                to={`/learning/categories/${cat.slug}`}
                                key={cat._id}
                                className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600 hover:border-primary/20 hover:text-primary transition-colors"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 space-y-3">
                    <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                        💡 Did you know?
                    </h4>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                        Regular biological tests keep water parameters like ammonia and dissolved oxygen levels in check. Check our Quiz tab to test your biology skills!
                    </p>
                    <Link 
                        to="/learning/quizzes"
                        className="w-full text-center py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all block"
                    >
                        Try Aquaculture Quiz
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
