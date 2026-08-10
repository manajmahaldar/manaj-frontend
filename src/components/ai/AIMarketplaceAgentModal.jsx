import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Bot, Mic, MicOff, Send, Sparkles, X, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, BookOpen } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import AIVoiceListingPanel from './AIVoiceListingPanel';

const AIMarketplaceAgentModal = ({ isOpen, onClose, onLaunchForm, onApplySearch }) => {
    const { user } = useContext(AuthContext);
    const { t, language } = useLanguage();

    const getLocalizedFieldName = (field) => {
        const map = {
            actionType: t.aiAgentActionType || 'Action Type',
            category: t.aiAgentCategory || 'Category',
            productName: t.aiAgentProductName || 'Product Name',
            price: t.aiAgentPriceBudget || 'Price / Budget',
            buyingPrice: t.aiAgentPriceBudget || 'Price / Budget',
            district: t.aiAgentLocation || 'Location'
        };
        return map[field] || field;
    };

    const getLocalizedCategory = (cat) => {
        if (!cat) return t.aiAgentNotSet || 'Not Set';
        const map = {
            Fish: language === 'bn' ? 'মাছ' : language === 'hi' ? 'मछली' : language === 'or' ? 'ମାଛ' : 'Fish',
            Feed: language === 'bn' ? 'খাবার' : language === 'hi' ? 'चारा' : language === 'or' ? 'ଖାଦ୍ୟ' : 'Feed',
            Medicine: language === 'bn' ? 'ওষুধ' : language === 'hi' ? 'दवा' : language === 'or' ? 'ଔଷଧ' : 'Medicine',
            Equipment: language === 'bn' ? 'যন্ত্রপাতি' : language === 'hi' ? 'उपकरण' : language === 'or' ? 'ଉପକରଣ' : 'Equipment',
            Fingerling: language === 'bn' ? 'পোনা' : language === 'hi' ? 'बीज' : language === 'or' ? 'ପୋନା' : 'Seed/Fingerling',
            Spawn: language === 'bn' ? 'রেণু পোনা' : language === 'hi' ? 'पिला' : language === 'or' ? 'ରେଣୁ ପୋନା' : 'Spawn'
        };
        return map[cat] || cat;
    };

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [loading, setLoading] = useState(false);
    // guidedMode = true when user is in the step-by-step voice listing creation flow
    const [guidedMode, setGuidedMode] = useState(false);
    const [extractedData, setExtractedData] = useState({
        actionType: null,
        category: null,
        productName: '',
        quantity: '',
        unit: 'kg',
        price: '',
        district: user?.district || '',
        localDistrict: user?.localDistrict || '',
        policeStation: user?.policeStation || '',
        phoneNumber: user?.phone || '',
        title: '',
        description: '',
        isComplete: false,
        missingFields: [],
        nextQuestion: null
    });

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    // Tracks whether we should auto-start mic after AI speaks (guided mode only)
    const autoListenRef = useRef(false);

    // Initial greeting when opened
    useEffect(() => {
        if (isOpen) {
            const roleGreeting = user?.role === 'admin' 
                ? (t.aiAgentGreetingAdmin || "Welcome Admin! I can summarize activity, detect fraud/spam, or help manage listings.")
                : (t.aiAgentGreetingUser || "Tell me what you'd like to buy, sell, search, or learn!");
            
            const greetingHello = t.aiAgentGreetingHello || "Hello! I am your";
            const greetingTitle = t.aiAgentTitle || "MatsyaLink AI Agent";
            const greetingExamples = t.aiAgentGreetingExamples || "Examples:";
            const exampleSell = t.aiAgentExampleSell || "Sell 500 kg Rohu fish at ₹220/kg in Purba Medinipur";
            const exampleSearch = t.aiAgentExampleSearch || "Show Rohu under ₹200";
            const exampleLearn = t.aiAgentExampleLearn || "How to grow Rohu?";

            setMessages([
                {
                    id: 1,
                    sender: 'ai',
                    text: `${greetingHello} **${greetingTitle}** 🤖✨\n\n${roleGreeting}\n\n*${greetingExamples}*\n• *"${exampleSell}"*\n• *"${exampleSearch}"*\n• *"${exampleLearn}"*`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } else {
            stopListening();
        }
    }, [isOpen, user, language, t]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const silenceTimerRef = useRef(null);

    const startListening = useCallback((onFinalTranscript) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error(t.voiceSearchNotSupported || 'Voice input is not supported in this browser.');
            return;
        }
        try {
            if (recognitionRef.current) { recognitionRef.current.stop(); }
            if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); }

            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            const langMap = { bn: 'bn-BD', hi: 'hi-IN', or: 'or-IN', en: 'en-US' };
            recognition.lang = langMap[language] || 'en-US';

            let fullTranscript = '';

            recognition.onstart = () => setIsListening(true);
            recognition.onresult = (event) => {
                let currentInterim = '';
                let currentFinal = '';

                for (let i = 0; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        currentFinal += event.results[i][0].transcript + ' ';
                    } else {
                        currentInterim += event.results[i][0].transcript;
                    }
                }

                fullTranscript = (currentFinal + currentInterim).trim();
                setInputText(fullTranscript);

                // Reset silence timer on every new speech result (waits 2.5s of complete silence before auto-submitting in guided mode)
                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                if (onFinalTranscript && fullTranscript.length > 0) {
                    silenceTimerRef.current = setTimeout(() => {
                        if (recognitionRef.current) {
                            recognitionRef.current.stop();
                        }
                    }, 2500);
                }
            };

            recognition.onerror = (e) => {
                if (e.error !== 'no-speech') {
                    console.warn('Speech recognition error:', e.error);
                }
            };

            recognition.onend = () => {
                setIsListening(false);
                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                if (fullTranscript && onFinalTranscript) {
                    onFinalTranscript(fullTranscript);
                }
            };

            recognitionRef.current = recognition;
            recognition.start();
        } catch (err) {
            console.error(err);
            setIsListening(false);
        }
    }, [language, t]);

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            if (guidedMode) {
                // In guided mode mic auto-submits on end
                startListening((transcript) => {
                    setInputText('');
                    handleSend(transcript);
                });
                toast.success('Listening... Speak now!', { icon: '🎙️', duration: 2000 });
            } else {
                startListening(null);
                toast.success('Listening... Speak now!', { icon: '🎙️', duration: 2000 });
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
    };

    const handleSend = useCallback(async (textToSend) => {
        const text = (textToSend || inputText).trim();
        if (!text || loading) return;

        stopListening();
        setInputText('');
        setLoading(true);

        // Detect guided listing intent from first message
        const sellingTriggers = ['sell', 'selling', 'list', 'listing', 'create listing', 'want to sell',
            'bechbo', 'bechna', 'bikri', 'list korte', 'listing dite', 'bechte chai',
            'bechna chahta', 'bechna chahti', 'sale karni', 'listing banana'];
        const lowerText = text.toLowerCase();
        const isSellIntent = sellingTriggers.some(kw => lowerText.includes(kw));
        if (isSellIntent && !guidedMode) {
            setGuidedMode(true);
            autoListenRef.current = true;
        }

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);

        try {
            const res = await api.post('/ai/process', {
                message: text,
                context: extractedData,
                language
            });

            const data = res.data.data;

            if ((data.type === 'form_autofill' || data.type === 'guided_creation') && data.extractedData) {
                setExtractedData(data.extractedData);
                if (data.extractedData.actionType) setGuidedMode(true);
            }

            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: data.reply || "Got it! Is there anything else I can assist with?",
                payload: data,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev.filter(m => m.id !== userMsg.id), userMsg, aiMsg]);

            // Keep guided mode active when form details are extracted
            if (data.extractedData && (data.extractedData.actionType || data.extractedData.productName)) {
                setGuidedMode(true);
            }
        } catch (err) {
            console.error(err);
            toast.error(t.aiProcessingError || 'AI Processing Error');
            autoListenRef.current = false;
        } finally {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputText, loading, messages, extractedData, language, guidedMode, startListening, t]);

    const handleReset = () => {
        autoListenRef.current = false;
        stopListening();
        setGuidedMode(false);
        setExtractedData({
            actionType: null,
            category: null,
            productName: '',
            quantity: '',
            unit: 'kg',
            price: '',
            district: user?.district || '',
            localDistrict: user?.localDistrict || '',
            policeStation: user?.policeStation || '',
            phoneNumber: user?.phone || '',
            title: '',
            description: '',
            isComplete: false,
            missingFields: [],
            nextQuestion: null
        });
        setMessages([
            {
                id: Date.now(),
                sender: 'ai',
                text: t.aiAgentResetMessage || "Conversation reset. Tell me what you'd like to buy, sell, search, or learn!",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    };

    const handleProceedToForm = () => {
        if (!extractedData.actionType) {
            toast.error(t.aiAgentSpecifySellBuy || "Please specify if you want to Sell or Buy.");
            return;
        }
        onLaunchForm(extractedData);
        onClose();
    };

    const handleListingSubmitSuccess = () => {
        handleReset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70] flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col md:flex-row shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
                
                {/* LEFT PANEL: Chat Interface */}
                <div className="flex-1 flex flex-col h-[52vh] md:h-[82vh] bg-slate-50/50 border-b md:border-b-0 md:border-r border-gray-200">
                    
                    {/* Header */}
                    <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                                <Bot size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-base leading-tight flex items-center gap-1.5">
                                    {t.aiAgentTitle || "MatsyaLink AI Agent"}
                                    <Sparkles size={16} className="text-amber-500 animate-pulse" />
                                </h3>
                                <p className="text-xs text-gray-500 font-medium">{t.aiAgentSubtitle || "Marketplace & Learning Assistant"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={handleReset} title="Reset" className="p-2 hover:bg-gray-100 text-gray-500 rounded-xl transition-colors">
                                <RefreshCw size={18} />
                            </button>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 text-gray-500 rounded-xl transition-colors md:hidden">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-3.5 shadow-xs text-sm ${
                                    msg.sender === 'user'
                                        ? 'bg-emerald-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-none'
                                }`}>
                                    <div className="whitespace-pre-line leading-relaxed">
                                        {msg.text}
                                    </div>

                                    {/* Search Results Render inside Chat */}
                                    {msg.payload?.type === 'search_results' && msg.payload?.results?.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {msg.payload.results.map(item => (
                                                <div key={item.id} className="p-2.5 bg-slate-50 border border-gray-200 rounded-xl flex items-center justify-between text-xs">
                                                    <div>
                                                        <span className="font-bold text-gray-900 block">{item.productName}</span>
                                                        <span className="text-gray-500">{item.localDistrict}, {item.district} • {item.quantity} {item.unit}</span>
                                                    </div>
                                                    <span className="font-bold text-emerald-700 text-sm">₹{item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Learning Recommendations inside Chat */}
                                    {msg.payload?.type === 'learning_qa' && (
                                        <div className="mt-3 text-xs bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-900 space-y-1">
                                            <p className="font-bold flex items-center gap-1"><BookOpen size={14} /> Recommended Learning:</p>
                                            <p>• Explore Learning Hub for full video tutorials & articles</p>
                                        </div>
                                    )}

                                    <span className={`text-[10px] block mt-1.5 font-medium ${msg.sender === 'user' ? 'text-emerald-100 text-right' : 'text-gray-400'}`}>
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-2xl p-3 text-xs text-gray-500 animate-pulse">
                                    {t.aiAgentProcessing || "AI is processing..."}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions */}
                    <div className="px-4 py-2 bg-white/70 border-t border-gray-100 flex gap-2 overflow-x-auto text-xs no-scrollbar">
                        <button onClick={() => handleSend(t.aiAgentExampleSell || "Sell 500 kg Rohu fish at ₹220/kg in Purba Medinipur")} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full font-medium whitespace-nowrap">
                            {t.aiAgentQuickSell || "🐟 Sell Rohu Fish"}
                        </button>
                        <button onClick={() => handleSend(t.aiAgentExampleBuy || "Buy 20 bags of Fish Feed 50kg in Barasat")} className="bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 px-3 py-1.5 rounded-full font-medium whitespace-nowrap">
                            {t.aiAgentQuickBuy || "🌾 Buy Feed"}
                        </button>
                        <button onClick={() => handleSend(t.aiAgentExampleSearch || "Show Rohu under ₹200")} className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1.5 rounded-full font-medium whitespace-nowrap">
                            {t.aiAgentQuickSearch || "🔍 Search Rohu"}
                        </button>
                        <button onClick={() => handleSend(t.aiAgentExampleLearn || "How to grow Rohu?")} className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full font-medium whitespace-nowrap">
                            {t.aiAgentQuickLearn || "📚 Grow Rohu Guide"}
                        </button>
                    </div>

                    {/* Input bar */}
                    <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
                        <button
                            onClick={toggleListening}
                            type="button"
                            className={`p-3 rounded-2xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-50 text-emerald-700'}`}
                            title="Voice Input"
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>

                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isListening ? (t.aiAgentListeningPlaceholder || "Listening... Speak now!") : (t.aiAgentPlaceholder || "Type what you want to buy, sell, search, or learn...")}
                            className="flex-1 px-4 py-3 bg-slate-100/80 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 font-medium"
                        />

                        <button
                            onClick={() => handleSend()}
                            disabled={!inputText.trim() || loading}
                            className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-2xl transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>

                {/* RIGHT PANEL: Voice Listing Panel (guided mode) or classic extracted data panel */}
                {guidedMode ? (
                    <AIVoiceListingPanel
                        extractedData={extractedData}
                        onClose={onClose}
                        onSubmitSuccess={handleListingSubmitSuccess}
                        user={user}
                    />
                ) : (
                    <div className="w-full md:w-80 lg:w-96 p-5 bg-white flex flex-col justify-between overflow-y-auto">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                    <Sparkles size={18} className="text-emerald-600" />
                                    {t.aiAgentExtractedDetails || "Extracted Details"}
                                </h4>
                                <button onClick={onClose} className="hidden md:block p-1.5 hover:bg-gray-100 text-gray-400 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className={`p-3 rounded-2xl border mb-4 flex items-center gap-2.5 text-xs font-semibold ${
                                extractedData.isComplete
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                    : 'bg-amber-50 border-amber-200 text-amber-800'
                            }`}>
                                {extractedData.isComplete
                                    ? <CheckCircle2 size={18} className="text-emerald-600" />
                                    : <AlertCircle size={18} className="text-amber-600" />
                                }
                                <div>
                                    <p>{extractedData.isComplete
                                        ? (t.aiAgentFormReady || 'Form Ready for Auto-fill!')
                                        : (t.aiAgentExtracting || 'Extracting Form Details...')
                                    }</p>
                                    {!extractedData.isComplete && (
                                        <p className="text-[11px] font-normal text-amber-700 mt-0.5">
                                            {(t.aiAgentMissing || 'Missing')}: {extractedData.missingFields.map(getLocalizedFieldName).join(', ') || (t.aiAgentMoreDetails || 'More details')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 text-xs">
                                {[
                                    { label: t.aiAgentActionType || 'Action Type', value: extractedData.actionType === 'selling' ? (t.aiAgentSelling || 'Selling') : extractedData.actionType === 'buying' ? (t.aiAgentBuying || 'Buying') : '—' },
                                    { label: t.aiAgentCategory || 'Category', value: getLocalizedCategory(extractedData.category) },
                                    { label: t.aiAgentProductName || 'Product Name', value: extractedData.productName || '—' },
                                    { label: t.aiAgentQuantity || 'Quantity', value: extractedData.quantity ? `${extractedData.quantity} ${extractedData.unit}` : '—' },
                                    { label: t.aiAgentPriceBudget || 'Price / Budget', value: extractedData.price ? `₹${extractedData.price}` : '—', green: true },
                                    { label: t.aiAgentLocation || 'Location', value: [extractedData.localDistrict, extractedData.district].filter(Boolean).join(', ') || '—' },
                                ].map(({ label, value, green }) => (
                                    <div key={label} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-gray-100">
                                        <span className="text-gray-500 font-medium">{label}</span>
                                        <span className={`font-bold truncate max-w-[55%] text-right ${green ? 'text-emerald-700' : ''}`}>{value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Start Guided Mode Banner */}
                            <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl">
                                <p className="text-xs text-emerald-800 font-semibold mb-2">🎤 Want to create a listing by voice?</p>
                                <button
                                    onClick={() => { setGuidedMode(true); autoListenRef.current = true; }}
                                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                                >
                                    Start Guided Voice Listing
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <button
                                onClick={handleProceedToForm}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm"
                            >
                                <span>{t.aiAgentReviewAutofill || "Review & Auto-fill Form"}</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AIMarketplaceAgentModal;
