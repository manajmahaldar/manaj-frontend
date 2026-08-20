import React, { useState, useEffect, useRef } from 'react';
import {
    Bot, Send, Mic, Image as ImageIcon, Plus, Trash2, Copy, Check,
    Sparkles, AlertTriangle, ExternalLink, ChevronRight, HelpCircle,
    BookOpen, Video, FileText, Award, RefreshCw, X, Sliders, Volume2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    sendFarmingAIChat,
    getFarmingAIConversations,
    getFarmingAIConversationById,
    deleteFarmingAIConversation,
    clearAllFarmingAIConversations,
    trackFarmingAIResourceClick
} from '../api/farmingAIApi';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';

const SUGGESTED_QUESTIONS = [
    "🐟 My fish are gasping at the surface. What should I do?",
    "🧪 How do I check and maintain ideal pond water pH & Oxygen?",
    "🌾 What is the recommended feed percentage for Catla fingerlings?",
    "🦐 How does Biofloc technology work for shrimp/fish farming?",
    "📜 What government schemes are available for pond construction?"
];

const FarmingAIAssistant = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [conversations, setConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [isListening, setIsListening] = useState(false);

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

    // Fetch conversation list on mount
    useEffect(() => {
        loadConversations();
    }, []);

    // Auto-scroll messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

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

    // Send Message Handler
    const handleSend = async (overrideText = null) => {
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
                farmContext,
                language
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

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-background text-text-primary overflow-hidden">
            {/* ─── LEFT SIDEBAR: Conversation History ─── */}
            <aside className="w-80 bg-surface border-r border-border flex flex-col hidden md:flex">
                <div className="p-4 border-b border-border space-y-3">
                    <button
                        onClick={startNewChat}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-all shadow-sm"
                    >
                        <Plus size={18} />
                        New Farming Inquiry
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    <div className="text-xs font-bold text-text-tertiary px-3 py-1 uppercase tracking-wider">
                        Recent History
                    </div>
                    {conversations.length === 0 ? (
                        <div className="text-center py-8 text-xs text-text-tertiary px-4">
                            No past inquiries yet. Ask a question to start!
                        </div>
                    ) : (
                        conversations.map((c) => (
                            <div
                                key={c._id}
                                onClick={() => selectConversation(c._id)}
                                className={`group flex items-center justify-between p-3 rounded-lg text-sm cursor-pointer transition-all ${
                                    currentConversationId === c._id
                                        ? 'bg-primary-muted text-primary font-medium'
                                        : 'hover:bg-surface-subtle text-text-secondary'
                                }`}
                            >
                                <div className="truncate flex-1 pr-2">
                                    <div className="font-semibold truncate">{c.title}</div>
                                    <div className="text-[10px] text-text-tertiary">
                                        {new Date(c.updatedAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteSingle(c._id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 rounded transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {conversations.length > 0 && (
                    <div className="p-3 border-t border-border">
                        <button
                            onClick={handleClearAll}
                            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-text-tertiary hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={14} />
                            Clear All History
                        </button>
                    </div>
                )}
            </aside>

            {/* ─── MAIN CHAT AREA ─── */}
            <main className="flex-1 flex flex-col bg-background relative overflow-hidden">
                {/* Header Bar */}
                <header className="h-14 bg-surface border-b border-border px-6 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-teal-500 flex items-center justify-center text-white shadow-sm">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-base leading-tight flex items-center gap-2">
                                MatsyaLink Farming AI Assistant
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                                    Aquaculture Expert
                                </span>
                            </h1>
                            <p className="text-xs text-text-tertiary">Fish Health • Pond Guidance • Water Analysis • Learning Hub</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFarmContext(!showFarmContext)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                showFarmContext
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-surface border-border text-text-secondary hover:bg-surface-subtle'
                            }`}
                        >
                            <Sliders size={14} />
                            Farm Context
                        </button>
                    </div>
                </header>

                {/* Optional Farm Context Drawer */}
                {showFarmContext && (
                    <div className="bg-surface-subtle border-b border-border p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 animate-in slide-in-from-top duration-200">
                        <div>
                            <label className="text-[10px] font-bold text-text-tertiary">Fish Species</label>
                            <input
                                type="text"
                                placeholder="e.g. Rohu, Catla"
                                value={farmContext.fishSpecies}
                                onChange={(e) => setFarmContext({ ...farmContext, fishSpecies: e.target.value })}
                                className="w-full text-xs p-2 rounded border border-border bg-surface"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-tertiary">Pond Size (Bigha/Acre)</label>
                            <input
                                type="text"
                                placeholder="e.g. 2 Bigha"
                                value={farmContext.pondSize}
                                onChange={(e) => setFarmContext({ ...farmContext, pondSize: e.target.value })}
                                className="w-full text-xs p-2 rounded border border-border bg-surface"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-tertiary">pH Level</label>
                            <input
                                type="text"
                                placeholder="e.g. 7.8"
                                value={farmContext.ph}
                                onChange={(e) => setFarmContext({ ...farmContext, ph: e.target.value })}
                                className="w-full text-xs p-2 rounded border border-border bg-surface"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-tertiary">Dissolved Oxygen</label>
                            <input
                                type="text"
                                placeholder="e.g. 5.5 mg/L"
                                value={farmContext.dissolvedOxygen}
                                onChange={(e) => setFarmContext({ ...farmContext, dissolvedOxygen: e.target.value })}
                                className="w-full text-xs p-2 rounded border border-border bg-surface"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-tertiary">Water Temp (°C)</label>
                            <input
                                type="text"
                                placeholder="e.g. 28°C"
                                value={farmContext.waterTemp}
                                onChange={(e) => setFarmContext({ ...farmContext, waterTemp: e.target.value })}
                                className="w-full text-xs p-2 rounded border border-border bg-surface"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => alert('Farm context updated!')}
                                className="w-full py-2 bg-primary text-white rounded text-xs font-bold"
                            >
                                Save Context
                            </button>
                        </div>
                    </div>
                )}

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.length === 0 ? (
                        <div className="max-w-2xl mx-auto text-center py-12 space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-primary-muted text-primary mx-auto flex items-center justify-center shadow-inner">
                                <Sparkles size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-text-primary">How can I assist your fish farm today?</h2>
                                <p className="text-sm text-text-secondary mt-1 max-w-md mx-auto">
                                    Ask aquaculture questions, record voice notes, or upload fish & water photos for visual analysis.
                                </p>
                            </div>

                            {/* Suggested Questions */}
                            <div className="space-y-2 text-left max-w-lg mx-auto">
                                <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Suggested Questions</span>
                                <div className="space-y-2">
                                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSend(q)}
                                            className="w-full text-left p-3 bg-surface border border-border rounded-xl text-xs font-medium hover:border-primary hover:bg-primary-muted transition-all flex items-center justify-between group"
                                        >
                                            <span>{q}</span>
                                            <ChevronRight size={14} className="text-text-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        messages.map((m, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-4 max-w-3xl ${
                                    m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                                }`}
                            >
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                                        m.role === 'user'
                                            ? 'bg-primary text-white'
                                            : 'bg-emerald-600 text-white'
                                    }`}
                                >
                                    {m.role === 'user' ? user?.name?.charAt(0) || 'U' : <Bot size={20} />}
                                </div>

                                <div className="space-y-3 max-w-2xl">
                                    <div
                                        className={`p-4 rounded-2xl text-sm leading-relaxed ${
                                            m.role === 'user'
                                                ? 'bg-primary text-white rounded-tr-none'
                                                : 'bg-surface border border-border shadow-xs text-text-primary rounded-tl-none'
                                        }`}
                                    >
                                        {/* Image Attachments */}
                                        {m.imageUrls && m.imageUrls.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {m.imageUrls.map((img, i) => (
                                                    <img
                                                        key={i}
                                                        src={img}
                                                        alt="Upload"
                                                        className="w-32 h-32 object-cover rounded-lg border border-border"
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Response Text formatted */}
                                        <div className="whitespace-pre-line font-sans">{m.text}</div>

                                        {/* Visual Assessment Confidence Pill */}
                                        {m.role === 'assistant' && m.confidence && (
                                            <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-xs">
                                                <span className="text-text-tertiary font-semibold">Confidence:</span>
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

                                    {/* Recommended MatsyaLink Resources */}
                                    {m.recommendations && m.recommendations.length > 0 && (
                                        <div className="bg-primary-muted/40 border border-primary-border p-4 rounded-xl space-y-2">
                                            <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                                                <BookOpen size={14} />
                                                Recommended MatsyaLink Learning Resources:
                                            </div>
                                            <div className="grid gap-2 sm:grid-cols-2">
                                                {m.recommendations.map((rec, i) => (
                                                    <Link
                                                        key={i}
                                                        to={rec.link || '/learning'}
                                                        onClick={() => handleResourceClick(rec)}
                                                        className="p-2.5 bg-surface border border-border rounded-lg text-xs font-semibold hover:border-primary hover:text-primary transition-all flex items-center justify-between group"
                                                    >
                                                        <span className="truncate pr-2">{rec.title}</span>
                                                        <ExternalLink size={12} className="shrink-0 text-text-tertiary group-hover:text-primary" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action bar for assistant response */}
                                    {m.role === 'assistant' && (
                                        <div className="flex items-center gap-2 text-xs text-text-tertiary">
                                            <button
                                                onClick={() => copyToClipboard(m.text, idx)}
                                                className="flex items-center gap-1 hover:text-text-primary transition-colors"
                                            >
                                                {copiedIndex === idx ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                                <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    {loading && (
                        <div className="flex gap-3 items-center text-xs text-text-tertiary italic animate-pulse">
                            <Bot size={18} className="text-primary" />
                            Evaluating farming parameters & Learning Hub knowledge...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-surface border-t border-border">
                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                            {images.map((img, i) => (
                                <div key={i} className="relative group">
                                    <img src={img} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-border" />
                                    <button
                                        onClick={() => removeImage(i)}
                                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-sm"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-end gap-2 bg-surface-subtle p-2 rounded-2xl border border-border focus-within:border-primary transition-all">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2.5 text-text-tertiary hover:text-primary rounded-xl transition-colors"
                            title="Upload fish or water photo"
                        >
                            <ImageIcon size={20} />
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
                            className={`p-2.5 rounded-xl transition-all ${
                                isListening ? 'bg-red-500 text-white animate-pulse' : 'text-text-tertiary hover:text-primary'
                            }`}
                            title="Speak question"
                        >
                            <Mic size={20} />
                        </button>

                        <textarea
                            rows={1}
                            placeholder="Ask about fish disease, feed, pond water, Biofloc, RAS..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            className="flex-1 bg-transparent text-sm p-2 outline-none resize-none max-h-32 text-text-primary placeholder:text-text-tertiary"
                        />

                        <button
                            onClick={() => handleSend()}
                            disabled={loading || (!input.trim() && images.length === 0)}
                            className="p-2.5 bg-primary text-white rounded-xl disabled:opacity-40 hover:bg-primary-hover transition-all"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FarmingAIAssistant;
