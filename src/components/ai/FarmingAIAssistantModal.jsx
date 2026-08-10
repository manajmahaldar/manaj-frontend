import React, { useState, useEffect, useRef } from 'react';
import {
    Bot, Send, Mic, Image as ImageIcon, Plus, Trash2, Copy, Check,
    Sparkles, AlertTriangle, ExternalLink, ChevronRight, HelpCircle,
    BookOpen, RefreshCw, X, Sliders, Maximize2, Minimize2, History, MessageSquare,
    LogIn
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
    sendFarmingAIChat,
    getFarmingAIConversations,
    getFarmingAIConversationById,
    deleteFarmingAIConversation,
    clearAllFarmingAIConversations,
    trackFarmingAIResourceClick
} from '../../features/farmingAI/api/farmingAIApi';
import { useAuth } from '../../context/AuthContext';

const SUGGESTED_QUESTIONS = [
    "🐟 My fish are gasping at the surface. What should I do?",
    "🧪 How do I check and maintain ideal pond water pH & Oxygen?",
    "🌾 What is the recommended feed percentage for Catla fingerlings?",
    "🦐 How does Biofloc technology work for shrimp/fish farming?",
    "📜 What government schemes are available for pond construction?"
];

const FarmingAIAssistantModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Farm context state
    const [showFarmContext, setShowFarmContext] = useState(false);
    const [farmContext, setFarmContext] = useState({
        fishSpecies: '',
        pondSize: '',
        numberOfFish: '',
        waterTemp: '',
        ph: '',
        dissolvedOxygen: ''
    });

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Fetch conversation list on open — only when authenticated
    useEffect(() => {
        if (isOpen && user) {
            loadConversations();
        }
    }, [isOpen, user]);

    // Auto-scroll messages
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading, isOpen]);

    if (!isOpen) return null;

    const loadConversations = async () => {
        try {
            const res = await getFarmingAIConversations();
            if (res.data.success) {
                setConversations(res.data.data);
            }
        } catch (err) {
            console.error('Failed to load conversations:', err);
        }
    };

    const selectConversation = async (id) => {
        try {
            setLoading(true);
            const res = await getFarmingAIConversationById(id);
            if (res.data.success) {
                setCurrentConversationId(id);
                setMessages(res.data.data.messages || []);
                if (res.data.data.farmContext) {
                    setFarmContext(res.data.data.farmContext);
                }
                setShowHistory(false);
            }
        } catch (err) {
            console.error('Failed to load conversation details:', err);
        } finally {
            setLoading(false);
        }
    };

    const startNewChat = () => {
        setCurrentConversationId(null);
        setMessages([]);
        setImages([]);
        setInput('');
        setShowHistory(false);
    };

    const handleClearAll = async () => {
        if (!window.confirm('Clear all conversation history?')) return;
        try {
            await clearAllFarmingAIConversations();
            startNewChat();
            loadConversations();
        } catch (err) {
            console.error('Clear error:', err);
        }
    };

    const handleDeleteSingle = async (id, e) => {
        e.stopPropagation();
        try {
            await deleteFarmingAIConversation(id);
            if (currentConversationId === id) startNewChat();
            loadConversations();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    // Handle Image Upload
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB limit');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // Speech Recognition (Voice)
    const toggleSpeechToText = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        if (isListening) {
            setIsListening(false);
            return;
        }

        recognition.lang = 'en-IN';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    // Send Message Handler — guard against unauthenticated state
    const handleSend = async (overrideText = null) => {
        if (!user) {
            onClose();
            navigate('/login');
            return;
        }
        const queryText = overrideText || input;
        if (!queryText.trim() && images.length === 0) return;

        const userMsg = {
            role: 'user',
            text: queryText,
            imageUrls: [...images],
            hasAudio: isListening
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setImages([]);
        setLoading(true);

        try {
            const res = await sendFarmingAIChat({
                message: queryText,
                imageUrls: userMsg.imageUrls,
                hasVoice: userMsg.hasAudio,
                conversationId: currentConversationId,
                farmContext
            });

            if (res.data.success) {
                if (!currentConversationId && res.data.conversationId) {
                    setCurrentConversationId(res.data.conversationId);
                }
                setMessages(prev => [...prev, res.data.message]);
                loadConversations();
            }
        } catch (err) {
            console.error('Failed to send AI message:', err);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    text: '⚠️ Sorry, there was an issue processing your aquaculture request. Please try again.',
                    confidence: 'uncertain'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleResourceClick = (resItem) => {
        try {
            trackFarmingAIResourceClick({
                resourceId: resItem.id,
                resourceTitle: resItem.title
            });
        } catch (err) { }
    };

    // ─── Not logged in: show login gate inside the modal ───────────────────
    if (!user) {
        return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-all duration-300">
                <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden w-full sm:w-[480px]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white px-5 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-2xl border border-white/20">
                                <Bot size={22} className="text-emerald-300" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-white">Ask Farming AI</h3>
                                <p className="text-xs text-emerald-200/80">Smart Aquaculture Advisor</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl text-emerald-100 hover:bg-red-500/30 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Login Gate Body */}
                    <div className="p-8 flex flex-col items-center text-center gap-5">
                        <div className="p-5 bg-gradient-to-tr from-emerald-50 to-teal-50 rounded-3xl">
                            <Bot size={48} className="text-emerald-600" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-800 mb-1">Login to Use Farming AI</h4>
                            <p className="text-sm text-slate-500 max-w-xs">
                                Get expert aquaculture advice, fish disease diagnosis, and personalised pond management tips — for free.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <Link
                                to="/login"
                                onClick={onClose}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
                            >
                                <LogIn size={18} />
                                Login to Continue
                            </Link>
                            <Link
                                to="/register"
                                onClick={onClose}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 border-2 border-emerald-600 text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all active:scale-95"
                            >
                                Register Free
                            </Link>
                        </div>
                        <p className="text-[11px] text-slate-400">Free forever · No credit card required</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-all duration-300">
            {/* Main Floating Modal Window */}
            <div
                className={`bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-100 flex flex-col transition-all duration-300 overflow-hidden ${
                    isExpanded
                        ? 'w-full h-full max-w-6xl max-h-[95vh]'
                        : 'w-full sm:w-[540px] md:w-[680px] lg:w-[780px] h-[92vh] sm:h-[82vh] max-h-[750px]'
                }`}
            >
                {/* ─── HEADER ─── */}
                <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white px-5 py-3.5 flex items-center justify-between shadow-md shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="relative p-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                            <Bot size={22} className="text-emerald-300" />
                            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base tracking-tight text-white">Ask Farming AI</h3>
                                <span className="text-[10px] uppercase font-extrabold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30">
                                    Aqua-Expert
                                </span>
                            </div>
                            <p className="text-xs text-emerald-200/90 font-medium">
                                Smart Aquaculture Advisor & Disease Diagnostic
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setShowHistory(prev => !prev)}
                            className={`p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-colors ${showHistory ? 'bg-white/20 text-white' : ''}`}
                            title="Conversation History"
                        >
                            <History size={18} />
                        </button>

                        <button
                            onClick={() => setShowFarmContext(prev => !prev)}
                            className={`p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-colors ${showFarmContext ? 'bg-white/20 text-white' : ''}`}
                            title="Pond & Fish Parameters"
                        >
                            <Sliders size={18} />
                        </button>

                        <button
                            onClick={() => setIsExpanded(prev => !prev)}
                            className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
                            title={isExpanded ? "Collapse View" : "Expand View"}
                        >
                            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-red-500/30 transition-colors"
                            title="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* ─── BODY CONTAINER ─── */}
                <div className="flex-1 flex overflow-hidden relative">
                    {/* ─── SIDEBAR: Conversation History (Togglable) ─── */}
                    {showHistory && (
                        <aside className="absolute inset-y-0 left-0 z-20 w-72 bg-emerald-950 text-emerald-100 border-r border-emerald-800/50 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
                            <div className="p-3.5 border-b border-emerald-800/50 flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                                    <History size={14} /> History
                                </span>
                                <button
                                    onClick={startNewChat}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                                >
                                    <Plus size={14} /> New Chat
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {conversations.length === 0 ? (
                                    <p className="text-xs text-emerald-400/60 p-4 text-center">No past chats yet</p>
                                ) : (
                                    conversations.map(conv => (
                                        <div
                                            key={conv._id}
                                            onClick={() => selectConversation(conv._id)}
                                            className={`group p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all ${
                                                currentConversationId === conv._id
                                                    ? 'bg-emerald-800/80 text-white font-semibold shadow-sm'
                                                    : 'hover:bg-emerald-900/60 text-emerald-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate pr-2">
                                                <MessageSquare size={14} className="shrink-0 text-emerald-400" />
                                                <span className="truncate">{conv.title || 'Aquaculture Inquiry'}</span>
                                            </div>
                                            <button
                                                onClick={(e) => handleDeleteSingle(conv._id, e)}
                                                className="opacity-0 group-hover:opacity-100 text-emerald-400 hover:text-red-300 p-1 rounded transition-opacity"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {conversations.length > 0 && (
                                <div className="p-2 border-t border-emerald-800/50">
                                    <button
                                        onClick={handleClearAll}
                                        className="w-full py-1.5 text-xs text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <Trash2 size={13} /> Clear All History
                                    </button>
                                </div>
                            )}
                        </aside>
                    )}

                    {/* ─── MAIN CHAT AREA ─── */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                        {/* Farm Parameters Accordion */}
                        {showFarmContext && (
                            <div className="p-4 bg-emerald-50/80 border-b border-emerald-100 text-xs space-y-3 animate-in slide-in-from-top duration-200">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                                        <Sliders size={14} className="text-emerald-600" />
                                        Pond & Water Context (Optional for higher accuracy)
                                    </span>
                                    <button
                                        onClick={() => setShowFarmContext(false)}
                                        className="text-emerald-700 hover:text-emerald-900"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    <input
                                        type="text"
                                        placeholder="Species (e.g. Rohu, Shrimp)"
                                        value={farmContext.fishSpecies}
                                        onChange={e => setFarmContext({ ...farmContext, fishSpecies: e.target.value })}
                                        className="p-2 bg-white border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 text-xs"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Pond Size (e.g. 1 Acre)"
                                        value={farmContext.pondSize}
                                        onChange={e => setFarmContext({ ...farmContext, pondSize: e.target.value })}
                                        className="p-2 bg-white border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 text-xs"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Stocking Count"
                                        value={farmContext.numberOfFish}
                                        onChange={e => setFarmContext({ ...farmContext, numberOfFish: e.target.value })}
                                        className="p-2 bg-white border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 text-xs"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Water Temp (°C)"
                                        value={farmContext.waterTemp}
                                        onChange={e => setFarmContext({ ...farmContext, waterTemp: e.target.value })}
                                        className="p-2 bg-white border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 text-xs"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Pond pH Level"
                                        value={farmContext.ph}
                                        onChange={e => setFarmContext({ ...farmContext, ph: e.target.value })}
                                        className="p-2 bg-white border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 text-xs"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Dissolved Oxygen (ppm)"
                                        value={farmContext.dissolvedOxygen}
                                        onChange={e => setFarmContext({ ...farmContext, dissolvedOxygen: e.target.value })}
                                        className="p-2 bg-white border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 text-xs"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Message Feed */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-4">
                                    <div className="p-4 bg-gradient-to-tr from-emerald-100 to-teal-100 rounded-3xl text-emerald-700 mb-3 shadow-inner">
                                        <Bot size={42} />
                                    </div>
                                    <h4 className="text-base font-bold text-slate-800">
                                        Ask MatsyaLink AI Farming Assistant
                                    </h4>
                                    <p className="text-xs text-slate-500 max-w-md mt-1 mb-5">
                                        Get instant recommendations on fish health, feed ratios, pond parameters, Biofloc, RAS, and government schemes.
                                    </p>

                                    {/* Suggested Prompts */}
                                    <div className="w-full max-w-lg space-y-2 text-left">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            Suggested Questions:
                                        </p>
                                        {SUGGESTED_QUESTIONS.map((q, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSend(q)}
                                                className="w-full text-left p-2.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs text-slate-700 hover:text-emerald-800 transition-all font-medium flex items-center justify-between group shadow-xs"
                                            >
                                                <span>{q}</span>
                                                <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                messages.map((m, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {m.role === 'assistant' && (
                                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                                                <Bot size={16} />
                                            </div>
                                        )}

                                        <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                                            <div
                                                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                                    m.role === 'user'
                                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md'
                                                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                                                }`}
                                            >
                                                {/* Images */}
                                                {m.imageUrls && m.imageUrls.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {m.imageUrls.map((img, i) => (
                                                            <img
                                                                key={i}
                                                                src={img}
                                                                alt="Uploaded sample"
                                                                className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                                                            />
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="whitespace-pre-line font-sans">{m.text}</div>

                                                {m.role === 'assistant' && m.confidence && (
                                                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px]">
                                                        <span className="text-slate-400 font-medium">Confidence:</span>
                                                        <span
                                                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                                m.confidence === 'high'
                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                    : m.confidence === 'medium'
                                                                    ? 'bg-amber-100 text-amber-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                            }`}
                                                        >
                                                            {(m.confidence || 'medium').toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Recommended Resources */}
                                            {m.recommendations && m.recommendations.length > 0 && (
                                                <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-xl space-y-1.5">
                                                    <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                                                        <BookOpen size={13} />
                                                        Recommended Learning Hub Articles:
                                                    </div>
                                                    <div className="grid gap-1.5 sm:grid-cols-2">
                                                        {m.recommendations.map((rec, i) => (
                                                            <Link
                                                                key={i}
                                                                to={rec.link || '/learning'}
                                                                onClick={() => {
                                                                    handleResourceClick(rec);
                                                                    onClose();
                                                                }}
                                                                className="p-2 bg-white border border-emerald-100 rounded-lg text-xs font-semibold hover:border-emerald-400 hover:text-emerald-700 transition-all flex items-center justify-between group shadow-2xs"
                                                            >
                                                                <span className="truncate pr-1 text-slate-700 group-hover:text-emerald-700">{rec.title}</span>
                                                                <ExternalLink size={11} className="shrink-0 text-slate-400 group-hover:text-emerald-600" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Copy action */}
                                            {m.role === 'assistant' && (
                                                <div className="flex items-center gap-2 text-[11px] text-slate-400 px-1">
                                                    <button
                                                        onClick={() => copyToClipboard(m.text, idx)}
                                                        className="flex items-center gap-1 hover:text-slate-600 transition-colors"
                                                    >
                                                        {copiedIndex === idx ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                                                        <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}

                            {loading && (
                                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/60 p-3 rounded-2xl max-w-[80%] animate-pulse">
                                    <Bot size={18} className="text-emerald-600 shrink-0" />
                                    <span>Analyzing parameters & Learning Hub knowledge base...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* ─── INPUT FOOTER ─── */}
                        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
                            {images.length > 0 && (
                                <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                                    {images.map((img, i) => (
                                        <div key={i} className="relative group">
                                            <img src={img} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-slate-300" />
                                            <button
                                                onClick={() => removeImage(i)}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-2 bg-slate-100 p-1.5 sm:p-2 rounded-2xl border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white transition-all">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-slate-400 hover:text-emerald-600 rounded-xl transition-colors shrink-0"
                                    title="Upload photo of fish disease or pond"
                                >
                                    <ImageIcon size={18} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageSelect}
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                />

                                <button
                                    onClick={toggleSpeechToText}
                                    className={`p-2 rounded-xl transition-all shrink-0 ${
                                        isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-emerald-600'
                                    }`}
                                    title="Voice input"
                                >
                                    <Mic size={18} />
                                </button>

                                <textarea
                                    rows={1}
                                    placeholder="Ask about fish disease, feed, pond water pH, DO..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    className="flex-1 bg-transparent text-xs sm:text-sm p-1.5 outline-none resize-none max-h-28 text-slate-800 placeholder:text-slate-400"
                                />

                                <button
                                    onClick={() => handleSend()}
                                    disabled={loading || (!input.trim() && images.length === 0)}
                                    className="p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl disabled:opacity-40 hover:from-emerald-700 hover:to-teal-700 transition-all shrink-0 shadow-xs"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmingAIAssistantModal;
