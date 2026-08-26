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

const TRANSLATIONS = {
    en: {
        newInquiry: 'New Farming Inquiry',
        recentHistory: 'Recent History',
        noPastInquiries: 'No past inquiries yet. Ask a question to start!',
        clearAllHistory: 'Clear All History',
        headerTitle: 'MatsyaLink Farming AI Assistant',
        headerBadge: 'Aquaculture Expert',
        headerSubtitle: 'Fish Health • Pond Guidance • Water Analysis • Learning Hub',
        farmContext: 'Farm Context',
        fishSpecies: 'Fish Species',
        fishSpeciesPlaceholder: 'e.g. Rohu, Catla',
        pondSize: 'Pond Size (Bigha/Acre)',
        pondSizePlaceholder: 'e.g. 2 Bigha',
        phLevel: 'pH Level',
        phPlaceholder: 'e.g. 7.8',
        dissolvedOxygen: 'Dissolved Oxygen',
        doPlaceholder: 'e.g. 5.5 mg/L',
        waterTemp: 'Water Temp (°C)',
        waterTempPlaceholder: 'e.g. 28°C',
        saveContext: 'Save Context',
        welcomeHeading: 'How can I assist your fish farm today?',
        welcomeSubtitle: 'Ask aquaculture questions, record voice notes, or upload fish & water photos for visual analysis.',
        suggestedLabel: 'Suggested Questions',
        inputPlaceholder: 'Ask about fish disease, feed, pond water, Biofloc, RAS...',
        loadingText: 'Evaluating farming parameters & Learning Hub knowledge...',
        confidence: 'Confidence',
        recommendedResources: 'Recommended MatsyaLink Learning Resources:',
        copied: 'Copied',
        copy: 'Copy',
        clearAllConfirm: 'Clear all conversation history?',
        speechNotSupported: 'Speech recognition is not supported in your browser.',
        suggestedQuestions: [
            "🐟 My fish are gasping at the surface. What should I do?",
            "🧪 How do I check and maintain ideal pond water pH & Oxygen?",
            "🌾 What is the recommended feed percentage for Catla fingerlings?",
            "🦐 How does Biofloc technology work for shrimp/fish farming?",
            "📜 What government schemes are available for pond construction?"
        ]
    },
    bn: {
        newInquiry: 'নতুন কৃষি জিজ্ঞাসা',
        recentHistory: 'সাম্প্রতিক ইতিহাস',
        noPastInquiries: 'এখনো কোনো জিজ্ঞাসা নেই। শুরু করতে একটি প্রশ্ন করুন!',
        clearAllHistory: 'সব ইতিহাস মুছুন',
        headerTitle: 'MatsyaLink কৃষি AI সহকারী',
        headerBadge: 'জলকৃষি বিশেষজ্ঞ',
        headerSubtitle: 'মাছের স্বাস্থ্য • পুকুর পরামর্শ • জল বিশ্লেষণ • শেখার কেন্দ্র',
        farmContext: 'খামার প্রসঙ্গ',
        fishSpecies: 'মাছের প্রজাতি',
        fishSpeciesPlaceholder: 'যেমন: রুই, কাতলা',
        pondSize: 'পুকুরের আকার (বিঘা/একর)',
        pondSizePlaceholder: 'যেমন: ২ বিঘা',
        phLevel: 'pH মাত্রা',
        phPlaceholder: 'যেমন: ৭.৮',
        dissolvedOxygen: 'দ্রবীভূত অক্সিজেন',
        doPlaceholder: 'যেমন: ৫.৫ mg/L',
        waterTemp: 'জলের তাপমাত্রা (°C)',
        waterTempPlaceholder: 'যেমন: ২৮°C',
        saveContext: 'প্রসঙ্গ সংরক্ষণ করুন',
        welcomeHeading: 'আজ আপনার মাছের খামারে আমি কীভাবে সাহায্য করতে পারি?',
        welcomeSubtitle: 'জলকৃষি প্রশ্ন করুন, ভয়েস নোট রেকর্ড করুন, বা দৃশ্যমান বিশ্লেষণের জন্য মাছ ও জলের ছবি আপলোড করুন।',
        suggestedLabel: 'প্রস্তাবিত প্রশ্ন',
        inputPlaceholder: 'মাছের রোগ, খাবার, পুকুরের জল, বায়োফ্লক, RAS সম্পর্কে জিজ্ঞেস করুন...',
        loadingText: 'কৃষি পরামিতি এবং শেখার কেন্দ্রের জ্ঞান মূল্যায়ন করা হচ্ছে...',
        confidence: 'নির্ভরযোগ্যতা',
        recommendedResources: 'প্রস্তাবিত MatsyaLink শিক্ষামূলক সংস্থান:',
        copied: 'কপি হয়েছে',
        copy: 'কপি করুন',
        clearAllConfirm: 'সব কথোপকথনের ইতিহাস মুছবেন?',
        speechNotSupported: 'আপনার ব্রাউজারে স্পিচ রিকগনিশন সমর্থিত নয়।',
        suggestedQuestions: [
            "🐟 আমার মাছ জলের উপরে শ্বাস নিচ্ছে। কী করব?",
            "🧪 পুকুরের জলের pH ও অক্সিজেন আদর্শ রাখতে কীভাবে পরীক্ষা করব?",
            "🌾 কাতলা আঙুলি মাছের জন্য প্রস্তাবিত খাদ্য শতাংশ কত?",
            "🦐 চিংড়ি/মাছ চাষে বায়োফ্লক প্রযুক্তি কীভাবে কাজ করে?",
            "📜 পুকুর নির্মাণে কোন সরকারি প্রকল্প পাওয়া যায়?"
        ]
    },
    hi: {
        newInquiry: 'नई कृषि पूछताछ',
        recentHistory: 'हाल का इतिहास',
        noPastInquiries: 'अभी तक कोई पूछताछ नहीं। शुरू करने के लिए एक प्रश्न पूछें!',
        clearAllHistory: 'सभी इतिहास साफ़ करें',
        headerTitle: 'MatsyaLink कृषि AI सहायक',
        headerBadge: 'जलकृषि विशेषज्ञ',
        headerSubtitle: 'मछली स्वास्थ्य • तालाब मार्गदर्शन • जल विश्लेषण • लर्निंग हब',
        farmContext: 'फार्म संदर्भ',
        fishSpecies: 'मछली प्रजाति',
        fishSpeciesPlaceholder: 'जैसे: रोहू, कतला',
        pondSize: 'तालाब का आकार (बीघा/एकड़)',
        pondSizePlaceholder: 'जैसे: 2 बीघा',
        phLevel: 'pH स्तर',
        phPlaceholder: 'जैसे: 7.8',
        dissolvedOxygen: 'घुलित ऑक्सीजन',
        doPlaceholder: 'जैसे: 5.5 mg/L',
        waterTemp: 'पानी का तापमान (°C)',
        waterTempPlaceholder: 'जैसे: 28°C',
        saveContext: 'संदर्भ सहेजें',
        welcomeHeading: 'आज मैं आपके मछली फार्म में कैसे सहायता कर सकता हूँ?',
        welcomeSubtitle: 'जलकृषि प्रश्न पूछें, वॉइस नोट रिकॉर्ड करें, या दृश्य विश्लेषण के लिए मछली और पानी की तस्वीरें अपलोड करें।',
        suggestedLabel: 'सुझाए गए प्रश्न',
        inputPlaceholder: 'मछली रोग, चारा, तालाब का पानी, बायोफ्लॉक, RAS के बारे में पूछें...',
        loadingText: 'खेती के मापदंड और लर्निंग हब ज्ञान का मूल्यांकन हो रहा है...',
        confidence: 'विश्वास',
        recommendedResources: 'अनुशंसित MatsyaLink शिक्षण संसाधन:',
        copied: 'कॉपी हो गया',
        copy: 'कॉपी करें',
        clearAllConfirm: 'सभी बातचीत का इतिहास साफ़ करें?',
        speechNotSupported: 'आपके ब्राउज़र में वाक् पहचान समर्थित नहीं है।',
        suggestedQuestions: [
            "🐟 मेरी मछलियाँ पानी की सतह पर हाँफ रही हैं। मुझे क्या करना चाहिए?",
            "🧪 तालाब के पानी का आदर्श pH और ऑक्सीजन कैसे जाँचें और बनाए रखें?",
            "🌾 कतला फिंगरलिंग के लिए अनुशंसित फ़ीड प्रतिशत क्या है?",
            "🦐 झींगा/मछली पालन में बायोफ्लॉक तकनीक कैसे काम करती है?",
            "📜 तालाब निर्माण के लिए कौन सी सरकारी योजनाएं उपलब्ध हैं?"
        ]
    },
    or: {
        newInquiry: 'ନୂଆ କୃଷି ଅନୁସନ୍ଧାନ',
        recentHistory: 'ସମ୍ପ୍ରତି ଇତିହାସ',
        noPastInquiries: 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଅନୁସନ୍ଧାନ ନାହିଁ। ଆରମ୍ଭ କରିବାକୁ ଏକ ପ୍ରଶ୍ନ କରନ୍ତୁ!',
        clearAllHistory: 'ସମସ୍ତ ଇତିହାସ ସଫା କରନ୍ତୁ',
        headerTitle: 'MatsyaLink କୃଷି AI ସହାୟକ',
        headerBadge: 'ଜଳକୃଷି ବିଶେଷଜ୍ଞ',
        headerSubtitle: 'ମାଛ ସ୍ୱାସ୍ଥ୍ୟ • ପୋଖରୀ ମାର୍ଗଦର୍ଶନ • ଜଳ ବିଶ୍ଳେଷଣ • ଶିକ୍ଷା କେନ୍ଦ୍ର',
        farmContext: 'ଫାର୍ମ ପ୍ରସଙ୍ଗ',
        fishSpecies: 'ମାଛ ପ୍ରଜାତି',
        fishSpeciesPlaceholder: 'ଯଥା: ରୋହୁ, କାତଳ',
        pondSize: 'ପୋଖରୀ ଆକାର (ବିଘା/ଏକର)',
        pondSizePlaceholder: 'ଯଥା: ୨ ବିଘା',
        phLevel: 'pH ସ୍ତର',
        phPlaceholder: 'ଯଥା: ୭.୮',
        dissolvedOxygen: 'ଦ୍ରବୀଭୂତ ଅମ୍ଳଜାନ',
        doPlaceholder: 'ଯଥା: ୫.୫ mg/L',
        waterTemp: 'ଜଳ ତାପମାତ୍ରା (°C)',
        waterTempPlaceholder: 'ଯଥା: ୨୮°C',
        saveContext: 'ପ୍ରସଙ୍ଗ ସଂରକ୍ଷଣ କରନ୍ତୁ',
        welcomeHeading: 'ଆଜି ଆପଣଙ୍କ ମାଛ ଫାର୍ମରେ ମୁଁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?',
        welcomeSubtitle: 'ଜଳକୃଷି ପ୍ରଶ୍ନ କରନ୍ତୁ, ଭଏସ ନୋଟ ରେକର୍ଡ କରନ୍ତୁ, କିମ୍ବା ଦୃଶ୍ୟ ବିଶ୍ଳେଷଣ ପାଇଁ ମାଛ ଓ ଜଳ ଫଟୋ ଅପଲୋଡ କରନ୍ତୁ।',
        suggestedLabel: 'ପ୍ରସ୍ତାବିତ ପ୍ରଶ୍ନ',
        inputPlaceholder: 'ମାଛ ରୋଗ, ଖାଦ୍ୟ, ପୋଖରୀ ଜଳ, ବାୟୋଫ୍ଲକ, RAS ବିଷୟରେ ପଚାରନ୍ତୁ...',
        loadingText: 'କୃଷି ପ୍ୟାରାମିଟର ଓ ଶିକ୍ଷା କେନ୍ଦ୍ରର ଜ୍ଞାନ ମୂଲ୍ୟାୟନ ହେଉଛି...',
        confidence: 'ଆତ୍ମବିଶ୍ୱାସ',
        recommendedResources: 'ପ୍ରସ୍ତାବିତ MatsyaLink ଶିକ୍ଷା ସଂସ୍ଥାନ:',
        copied: 'କପି ହୋଇଗଲା',
        copy: 'କପି କରନ୍ତୁ',
        clearAllConfirm: 'ସମସ୍ତ କଥୋପକଥନ ଇତିହାସ ସଫା କରିବେ?',
        speechNotSupported: 'ଆପଣଙ୍କ ବ୍ରାଉଜରରେ ସ୍ପିଚ ରିକଗ୍ନିଶନ ସମର୍ଥିତ ନୁହେଁ।',
        suggestedQuestions: [
            "🐟 ମୋ ମାଛ ଜଳ ଉପରେ ଶ୍ୱାସ ନେଉଛି। ମୁଁ କ'ଣ କରିବି?",
            "🧪 ପୋଖରୀ ଜଳର ଆଦର୍ଶ pH ଓ ଅମ୍ଳଜାନ କିପରି ଯାଞ୍ଚ କରିବି?",
            "🌾 କାତଳ ଆଙ୍ଗୁଳି ମାଛ ପାଇଁ ଖାଦ୍ୟ ପ୍ରତିଶତ କ'ଣ ହେବା ଉଚିତ?",
            "🦐 ଚିଙ୍ଗୁଡ଼ି/ମାଛ ଚାଷରେ ବାୟୋଫ୍ଲକ ପ୍ରଯୁକ୍ତି କିପରି କାମ କରେ?",
            "📜 ପୋଖରୀ ନିର୍ମାଣ ପାଇଁ କେଉଁ ସରକାରୀ ଯୋଜନା ଉପଲବ୍ଧ?"
        ]
    }
};

const LANG_MAP = { en: 'en-IN', bn: 'bn-IN', hi: 'hi-IN', or: 'or-IN' };

const FarmingAIAssistant = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const t_ai = (key) => (TRANSLATIONS[language] || TRANSLATIONS.en)[key] ?? key;
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
    // Guard against duplicate submissions on rapid double-click
    const isSendingRef = useRef(false);

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
        if (!window.confirm(t_ai('clearAllConfirm'))) return;
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
            alert(t_ai('speechNotSupported'));
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        if (isListening) {
            setIsListening(false);
            return;
        }

        recognition.lang = LANG_MAP[language] || 'en-IN';
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
        // Prevent duplicate API calls on rapid double-click or Enter+button combo
        if (isSendingRef.current) return;

        // Capture current images before state is cleared
        const currentImages = [...images];

        const userMsg = {
            role: 'user',
            text: queryText,
            imageUrls: currentImages,
            hasAudio: isListening
        };

        isSendingRef.current = true;
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setImages([]);
        setLoading(true);

        try {
            const res = await sendFarmingAIChat({
                message: queryText,
                imageUrls: currentImages,
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
            const errMsgs = {
                en: '⚠️ Sorry, there was an issue processing your aquaculture request. Please try again.',
                bn: '⚠️ দুঃখিত, আপনার জলকৃষি অনুরোধ প্রক্রিয়া করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
                hi: '⚠️ क्षमा करें, आपके जलकृषि अनुरोध को संसाधित करने में समस्या हुई। कृपया पुनः प्रयास करें।',
                or: '⚠️ କ୍ଷମା କରନ୍ତୁ, ଆପଣଙ୍କ ଜଳକୃଷି ଅନୁରୋଧ ପ୍ରକ୍ରିୟା କରିବାରେ ସମସ୍ୟା ହୋଇଛି। ଦୟାକରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।'
            };
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    text: errMsgs[language] || errMsgs.en,
                    confidence: 'uncertain'
                }
            ]);
        } finally {
            setLoading(false);
            isSendingRef.current = false;
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
                        {t_ai('newInquiry')}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    <div className="text-xs font-bold text-text-tertiary px-3 py-1 uppercase tracking-wider">
                        {t_ai('recentHistory')}
                    </div>
                    {conversations.length === 0 ? (
                        <div className="text-center py-8 text-xs text-text-tertiary px-4">
                            {t_ai('noPastInquiries')}
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
                            {t_ai('clearAllHistory')}
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
                                {t_ai('headerTitle')}
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                                    {t_ai('headerBadge')}
                                </span>
                            </h1>
                            <p className="text-xs text-text-tertiary">{t_ai('headerSubtitle')}</p>
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
                            {t_ai('farmContext')}
                        </button>
                    </div>
                </header>

                {/* Optional Farm Context Drawer */}
                {showFarmContext && (
                    <div className="bg-surface-subtle border-b border-border p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 animate-in slide-in-from-top duration-200">
                        <div>
                            <label className="text-[10px] font-bold text-text-tertiary">{t_ai('fishSpecies')}</label>
                            <input
                                type="text"
                                placeholder={t_ai('fishSpeciesPlaceholder')}
                                value={farmContext.fishSpecies}
                                onChange={(e) => setFarmContext({ ...farmContext, fishSpecies: e.target.value })}
                                className="w-full text-xs p-2 rounded border border-border bg-surface"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-tertiary">{t_ai('pondSize')}</label>
                            <input
                                type="text"
                                placeholder={t_ai('pondSizePlaceholder')}
                                value={farmContext.pondSize}
                                onChange={(e) => setFarmContext({ ...farmContext, pondSize: e.target.value })}
                                className="w-full text-xs p-2 rounded border border-border bg-surface"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-tertiary">{t_ai('phLevel')}</label>
                            <input
                                type="text"
                                placeholder={t_ai('phPlaceholder')}
                                value={farmContext.ph}
                                onChange={(e) => setFarmContext({ ...farmContext, ph: e.target.value })}
                                className="w-full text-xs p-2 rounded border border-border bg-surface"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-tertiary">{t_ai('dissolvedOxygen')}</label>
                            <input
                                type="text"
                                placeholder={t_ai('doPlaceholder')}
                                value={farmContext.dissolvedOxygen}
                                onChange={(e) => setFarmContext({ ...farmContext, dissolvedOxygen: e.target.value })}
                                className="w-full text-xs p-2 rounded border border-border bg-surface"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-tertiary">{t_ai('waterTemp')}</label>
                            <input
                                type="text"
                                placeholder={t_ai('waterTempPlaceholder')}
                                value={farmContext.waterTemp}
                                onChange={(e) => setFarmContext({ ...farmContext, waterTemp: e.target.value })}
                                className="w-full text-xs p-2 rounded border border-border bg-surface"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => alert(t_ai('saveContext'))}
                                className="w-full py-2 bg-primary text-white rounded text-xs font-bold"
                            >
                                {t_ai('saveContext')}
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
                                <h2 className="text-xl font-bold text-text-primary">{t_ai('welcomeHeading')}</h2>
                                <p className="text-sm text-text-secondary mt-1 max-w-md mx-auto">
                                    {t_ai('welcomeSubtitle')}
                                </p>
                            </div>

                            {/* Suggested Questions */}
                            <div className="space-y-2 text-left max-w-lg mx-auto">
                                <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">{t_ai('suggestedLabel')}</span>
                                <div className="space-y-2">
                                    {(t_ai('suggestedQuestions')).map((q, idx) => (
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
                                                <span className="text-text-tertiary font-semibold">{t_ai('confidence')}:</span>
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
                                                {t_ai('recommendedResources')}
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
                                                <span>{copiedIndex === idx ? t_ai('copied') : t_ai('copy')}</span>
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
                            {t_ai('loadingText')}
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
                            placeholder={t_ai('inputPlaceholder')}
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
