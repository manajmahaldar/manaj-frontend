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
import { useLanguage } from '../../context/LanguageContext';

const TRANSLATIONS = {
    en: {
        title: "Ask Farming AI",
        subtitle: "Smart Aquaculture Advisor & Disease Diagnostic",
        welcomeTitle: "Ask MatsyaLink AI Farming Assistant",
        welcomeDesc: "Get instant recommendations on fish health, feed ratios, pond parameters, Biofloc, RAS, and government schemes.",
        suggestedTitle: "Suggested Questions:",
        suggested1: "🐟 My fish are gasping at the surface. What should I do?",
        suggested2: "🧪 How do I check and maintain ideal pond water pH & Oxygen?",
        suggested3: "🌾 What is the recommended feed percentage for Catla fingerlings?",
        suggested4: "🦐 How does Biofloc technology work for shrimp/fish farming?",
        suggested5: "📜 What government schemes are available for pond construction?",
        farmContext: "Farm Context",
        farmContextTitle: "Pond & Water Context (Optional for higher accuracy)",
        fishSpeciesPlaceholder: "Species (e.g. Rohu, Shrimp)",
        pondSizePlaceholder: "Pond Size (e.g. 1 Acre)",
        numberOfFishPlaceholder: "Stocking Count",
        waterTempPlaceholder: "Water Temp (°C)",
        phPlaceholder: "Pond pH Level",
        dissolvedOxygenPlaceholder: "Dissolved Oxygen (ppm)",
        history: "History",
        recentHistory: "Recent History",
        newChat: "New Chat",
        clearAll: "Clear All History",
        confirmClearAll: "Clear all conversation history?",
        noPastChats: "No past chats yet",
        loginRequiredTitle: "Login to Use Farming AI",
        loginRequiredDesc: "Get expert aquaculture advice, fish disease diagnosis, and personalised pond management tips — for free.",
        loginToContinue: "Login to Continue",
        registerFree: "Register Free",
        freeForever: "Free forever · No credit card required",
        placeholder: "Ask about fish disease, feed, pond water pH, DO...",
        loading: "Evaluating farming parameters & Learning Hub knowledge...",
        confidence: "Confidence",
        recommended: "Recommended Learning Hub Articles:",
        copy: "Copy",
        copied: "Copied",
        share: "Share",
        speechNotSupported: "Speech recognition is not supported in your browser.",
    },
    bn: {
        title: "ফার্মিং এআইকে জিজ্ঞাসা করুন",
        subtitle: "স্মার্ট অ্যাকুয়াকালচার উপদেষ্টা ও রোগ নির্ণয়",
        welcomeTitle: "মৎস্যলিংক এআই ফার্মিং সহকারীকে জিজ্ঞাসা করুন",
        welcomeDesc: "মাছের স্বাস্থ্য, ফিডের অনুপাত, পুকুরের প্যারামিটার, বায়োফ্লক, আরএএস এবং সরকারি স্কিম সম্পর্কে তাৎক্ষণিক পরামর্শ পান।",
        suggestedTitle: "প্রস্তাবিত প্রশ্নাবলী:",
        suggested1: "🐟 আমার মাছ জলের উপরিভাগে খাবি খাচ্ছে। আমার কী করা উচিত?",
        suggested2: "🧪 আমি কীভাবে পুকুরের জলের আদর্শ pH এবং অক্সিজেন পরীক্ষা ও বজায় রাখব?",
        suggested3: "🌾 কাতলা পোনার জন্য প্রস্তাবিত ফিড শতাংশ কত?",
        suggested4: "🦐 চিংড়ি/মাছ চাষের জন্য বায়োফ্লক প্রযুক্তি কীভাবে কাজ করে?",
        suggested5: "📜 পুকুর তৈরির জন্য কী কী সরকারি প্রকল্প উপলব্ধ রয়েছে?",
        farmContext: "খামারের বিবরণ",
        farmContextTitle: "পুকুর এবং জলের বিবরণ (উচ্চতর নির্ভুলতার জন্য ঐচ্ছিক)",
        fishSpeciesPlaceholder: "মাছের প্রজাতি (যেমন রুই, চিংড়ি)",
        pondSizePlaceholder: "পুকুরের আকার (যেমন ১ একর)",
        numberOfFishPlaceholder: "মাছের সংখ্যা",
        waterTempPlaceholder: "জলোর তাপমাত্রা (°C)",
        phPlaceholder: "পুকুরের pH মাত্রা",
        dissolvedOxygenPlaceholder: "দ্রবীভূত অক্সিজেন (ppm)",
        history: "ইতিহাস",
        recentHistory: "সাম্প্রতিক ইতিহাস",
        newChat: "নতুন চ্যাট",
        clearAll: "সব ইতিহাস মুছুন",
        confirmClearAll: "সব চ্যাট ইতিহাস মুছে ফেলবেন কি?",
        noPastChats: "কোনো পূর্ববর্তী চ্যাট নেই",
        loginRequiredTitle: "ফার্মিং এআই ব্যবহার করতে লগইন করুন",
        loginRequiredDesc: "বিনামূল্যে বিশেষজ্ঞ অ্যাকুয়াকালচার পরামর্শ, মাছের রোগ নির্ণয় এবং ব্যক্তিগত পুকুর পরিচালনার টিप্স পান।",
        loginToContinue: "चालিয়ে যেতে লগইন করুন",
        registerFree: "বিনামূল্যে নিবন্ধন করুন",
        freeForever: "সর্বদা বিনামূল্যে · কোনো ক্রেডিট কার্ডের প্রয়োজন নেই",
        placeholder: "মাছের রোগ, খাদ্য, পুকুরের জলের pH, DO সম্পর্কে জিজ্ঞাসা করুন...",
        loading: "প্যারামিটার এবং লার্নিং হাবের তথ্য মূল্যায়ন করা হচ্ছে...",
        confidence: "নির্ভরযোগ্যতা",
        recommended: "প্রস্তাবিত লার্নিং হাব নিবন্ধসমূহ:",
        copy: "অনুলিপি করুন",
        copied: "অনুলিপি করা হয়েছে",
        share: "শেয়ার করুন",
        speechNotSupported: "আপনার ব্রাউজারে ভয়েস সনাক্তকরণ সমর্থিত নয়।",
    },
    hi: {
        title: "फार्मिंग एआई से पूछें",
        subtitle: "स्मार्ट एक्वाकल्चर सलाहकार और रोग निदान",
        welcomeTitle: "मत्स्यलिंक एआई फार्मिंग सहायक से पूछें",
        welcomeDesc: "मछली के स्वास्थ्य, फ़ीड अनुपात, तालाब के मापदंडों, बायोफ्लॉक, आरएएस और सरकारी योजनाओं पर त्वरित सुझाव प्राप्त करें।",
        suggestedTitle: "सुझाए गए प्रश्न:",
        suggested1: "🐟 मेरी मछलियां सतह पर हांफ रही हैं। मुझे क्या करना चाहिए?",
        suggested2: "🧪 मैं तालाब के पानी के आदर्श pH और ऑक्सीजन की जांच और नियंत्रण कैसे करूं?",
        suggested3: "🌾 कतला उंगलियों (फ़िंगरलिंक्स) के लिए अनुशंसित फ़ीड प्रतिशत क्या है?",
        suggested4: "🦐 झींगा/मछली पालन के लिए बायोफ्लॉक तकनीक कैसे काम करती है?",
        suggested5: "📜 तालाब निर्माण के लिए कौन सी सरकारी योजनाएं उपलब्ध हैं?",
        farmContext: "फार्म का संदर्भ",
        farmContextTitle: "तालाब और पानी का संदर्भ (बेहतर सटीकता के लिए वैकल्पिक)",
        fishSpeciesPlaceholder: "प्रजाति (जैसे रोहू, झींगा)",
        pondSizePlaceholder: "तालाब का आकार (जैसे 1 एकड़)",
        numberOfFishPlaceholder: "मछलियों की संख्या",
        waterTempPlaceholder: "पानी का तापमान (°C)",
        phPlaceholder: "तालाब का पीएच स्तर",
        dissolvedOxygenPlaceholder: "घुलनशील ऑक्सीजन (ppm)",
        history: "इतिहास",
        recentHistory: "हाल का इतिहास",
        newChat: "नया चैट",
        clearAll: "सभी इतिहास हटाएं",
        confirmClearAll: "क्या आप वाकई पूरी चैट हिस्ट्री हटाना चाहते हैं?",
        noPastChats: "कोई पुराना चैट उपलब्ध नहीं है",
        loginRequiredTitle: "फार्मिंग एआई का उपयोग करने के लिए लॉगिन करें",
        loginRequiredDesc: "मुफ्त में विशेषज्ञ एक्वाकल्चर सलाह, मछली रोग निदान और व्यक्तिगत तालाब प्रबंधन युक्तियाँ प्राप्त करें।",
        loginToContinue: "जारी रखने के लिए लॉगिन करें",
        registerFree: "मुफ्त पंजीकरण करें",
        freeForever: "हमेशा मुफ्त · किसी क्रेडिट कार्ड की आवश्यकता नहीं",
        placeholder: "मछली रोग, फ़ीड, तालाब के पानी के pH, DO के बारे में पूछें...",
        loading: "मापदंडों और ज्ञान का मूल्यांकन किया जा रहा है...",
        confidence: "विश्वास स्तर",
        recommended: "अनुशंसित लर्निंग हब लेख:",
        copy: "कॉपी करें",
        copied: "कॉपी हो गया",
        share: "साझा करें",
        speechNotSupported: "आपके ब्राउज़र में वॉयस पहचान समर्थित नहीं है।",
    },
    or: {
        title: "ଫାର୍ମିଙ୍ଗ ଏଆଇ କୁ ପଚାରନ୍ତୁ",
        subtitle: "ସ୍ମାର୍ଟ ମତ୍ସ୍ୟ ଚାଷ ପରାମର୍ଶଦାତା ଓ ରୋଗ ନିରୂପଣ",
        welcomeTitle: "ମତ୍ସ୍ୟଲିଙ୍କ ଏଆଇ ଫାର୍ମିଙ୍ଗ ସହାୟକଙ୍କୁ ପଚାରନ୍ତୁ",
        welcomeDesc: "ମାଛ ସ୍ୱାସ୍ଥ୍ୟ, ଖାଦ୍ୟ ଅନୁପାତ, ପୋଖରୀର ବିଭିନ୍ନ ମାପଦଣ୍ଡ, ବାୟୋଫ୍ଲକ, ଆରଏଏସ ଏବଂ ସରକାରୀ ଯୋଜନା ବିଷୟରେ ତୁରନ୍ତ ପରାମର୍ଶ ପାଆନ୍ତୁ।",
        suggestedTitle: "ପ୍ରସ୍ତାବିତ ପ୍ରଶ୍ନଗୁଡ଼ିକ:",
        suggested1: "🐟 ମୋର ମାଛଗୁଡ଼ିକ ପାଣି ଉପରକୁ ଆସି ବିକଳ ହେଉଛନ୍ତି। ମୁଁ କଣ କରିବି?",
        suggested2: "🧪 ମୁଁ ପୋଖରୀ ପାଣିର ଆଦର୍ଶ pH ଏବଂ ଅମ୍ଳଜାନ କିପରି ଯାଞ୍ଚ ଓ ନିୟନ୍ତ୍ରଣ କରିବି?",
        suggested3: "🌾 ଭାକୁର (କାତଲା) ଯାଆଁଳା ପାଇଁ ପ୍ରସ୍ତାବିତ ଖାଦ୍ୟ ଶତକଡ଼ା କେତେ?",
        suggested4: "🦐 ଚିଙ୍ଗୁଡ଼ି/ମାଛ ଚାଷ ପାଇଁ ବାୟୋଫ୍ଲକ ପ୍ରଣାଳୀ କିପରି କାମ କରେ?",
        suggested5: "📜 ପୋଖରୀ ଖୋଳିବା ପାଇଁ କେଉଁ ସରକାରୀ ଯୋଜନାଗୁଡ଼ିକ ଉପଲବ୍ଧ ଅଛି?",
        farmContext: "ଫାର୍ମ ବିବରଣୀ",
        farmContextTitle: "ପୋଖରୀ ଏବଂ ପାଣିର ବିବରଣୀ (ଅଧିକ ସଠିକତା ପାଇଁ ଇଚ୍ଛାଧୀନ)",
        fishSpeciesPlaceholder: "ପ୍ରଜାତି (ଯେପରି ରୋହି, ଚିଙ୍ଗୁଡ଼ି)",
        pondSizePlaceholder: "ପୋଖରୀର ଆକାର (ଯେପରି ୧ ଏକର)",
        numberOfFishPlaceholder: "ମାଛ ସଂଖ୍ୟା",
        waterTempPlaceholder: "ପାଣିର ତାପମାତ୍ରା (°C)",
        phPlaceholder: "ପୋଖରୀର pH ସ୍ତର",
        dissolvedOxygenPlaceholder: "ଦ୍ରବୀଭୂତ ଅମ୍ଳଜାନ (ppm)",
        history: "ଇତିହାସ",
        recentHistory: "ସାମ୍ପ୍ରତିକ ଇତିହାସ",
        newChat: "ନୂଆ ଚାଟ୍",
        clearAll: "ସମସ୍ତ ଇତିହାସ ଲିଭାନ୍ତୁ",
        confirmClearAll: "ଆପଣ ସମସ୍ତ ଚାଟ୍ ଇତିହାସ ଲିଭାଇବାକୁ ଚାହାଁନ୍ତି କି?",
        noPastChats: "କୌଣସି ପୂର୍ବ ଚାଟ୍ ନାହିଁ",
        loginRequiredTitle: "ଫାର୍ମିଙ୍ଗ ଏଆଇ ବ୍ୟବହାର କରିବାକୁ ଲଗଇନ୍ କରନ୍ତୁ",
        loginRequiredDesc: "ମାଗଣାରେ ବିଶେଷଜ୍ଞ ମତ୍ସ୍ୟ ଚାଷ ପରାମର୍ଶ, ମାଛ ରୋଗ ନିରୂପଣ ଏବଂ ବ୍ୟକ୍ତିଗତ ପୋଖରୀ ପରିଚାଳନା ଟିପ୍ସ ପାଆନ୍ତୁ।",
        loginToContinue: "ଆଗକୁ ବଢିବାକୁ ଲଗଇନ୍ କରନ୍ତୁ",
        registerFree: "ମାଗଣା ପଞ୍ଜିକରଣ କରନ୍ତୁ",
        freeForever: "ସର୍ବଦା ମାଗଣା · କୌଣସି କ୍ରେଡିଟ୍ କାର୍ଡର ଆବଶ୍ୟକତା ନାହିଁ",
        placeholder: "ମାଛ ରୋଗ, ଖାଦ୍ୟ, ପୋଖରୀ ପାଣିର pH, DO ବିଷୟରେ ପଚାରନ୍ତୁ...",
        loading: "ପୋଖରୀ ମାପଦଣ୍ଡ ଏବଂ ଶିକ୍ଷା ସମ୍ବଳଗୁଡ଼ିକର ମୂଲ୍ୟାଙ୍କନ କରାଯାଉଛି...",
        confidence: "ବିଶ୍ୱାସନୀୟତା",
        recommended: "ପ୍ରସ୍ତାବିତ ଶିକ୍ଷଣ ବିଷୟବସ୍ତୁ:",
        copy: "ନକଲ କରନ୍ତୁ",
        copied: "ନକଲ ହେଲା",
        share: "ସେୟାର୍ କରନ୍ତୁ",
        speechNotSupported: "ଆପଣଙ୍କ ବ୍ରାଉଜର୍‌ରେ ଭଏସ୍ ଚିହ୍ନଟ ସମର୍ଥିତ ନୁହେଁ।",
    }
};

const FarmingAIAssistantModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const { language } = useLanguage();
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

    // Active translation context
    const activeLang = ['en', 'bn', 'hi', 'or'].includes(language) ? language : 'bn';
    const t_ai = (key) => TRANSLATIONS[activeLang]?.[key] || TRANSLATIONS['en']?.[key] || key;

    const SUGGESTED_QUESTIONS = [
        t_ai('suggested1'),
        t_ai('suggested2'),
        t_ai('suggested3'),
        t_ai('suggested4'),
        t_ai('suggested5')
    ];

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
    const isSendingRef = useRef(false);

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
        if (!window.confirm(t_ai('confirmClearAll'))) return;
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

        const langMap = { bn: 'bn-IN', hi: 'hi-IN', or: 'or-IN', en: 'en-IN' };
        recognition.lang = langMap[language] || 'en-US';
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
        if (isSendingRef.current) return;

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
                                <h3 className="font-bold text-base text-white">{t_ai('title')}</h3>
                                <p className="text-xs text-emerald-200/80">{t_ai('subtitle')}</p>
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
                            <h4 className="text-lg font-bold text-slate-800 mb-1">{t_ai('loginRequiredTitle')}</h4>
                            <p className="text-sm text-slate-500 max-w-xs">
                                {t_ai('loginRequiredDesc')}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <Link
                                to="/login"
                                onClick={onClose}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
                            >
                                <LogIn size={18} />
                                {t_ai('loginToContinue')}
                            </Link>
                            <Link
                                to="/register"
                                onClick={onClose}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 border-2 border-emerald-600 text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all active:scale-95"
                            >
                                {t_ai('registerFree')}
                            </Link>
                        </div>
                        <p className="text-[11px] text-slate-400">{t_ai('freeForever')}</p>
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
                                <h3 className="font-bold text-base tracking-tight text-white">{t_ai('title')}</h3>
                                <span className="text-[10px] uppercase font-extrabold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30">
                                    Aqua-Expert
                                </span>
                            </div>
                            <p className="text-xs text-emerald-200/90 font-medium">
                                {t_ai('subtitle')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setShowHistory(prev => !prev)}
                            className={`p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-colors ${showHistory ? 'bg-white/20 text-white' : ''}`}
                            title={t_ai('history')}
                        >
                            <History size={18} />
                        </button>

                        <button
                            onClick={() => setShowFarmContext(prev => !prev)}
                            className={`p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-colors ${showFarmContext ? 'bg-white/20 text-white' : ''}`}
                            title={t_ai('farmContext')}
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
                                    <History size={14} /> {t_ai('history')}
                                </span>
                                <button
                                    onClick={startNewChat}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                                >
                                    <Plus size={14} /> {t_ai('newChat')}
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {conversations.length === 0 ? (
                                    <p className="text-xs text-emerald-400/60 p-4 text-center">{t_ai('noPastChats')}</p>
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
                                        <Trash2 size={13} /> {t_ai('clearAll')}
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
                                        {t_ai('farmContextTitle')}
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
                                        placeholder={t_ai('fishSpeciesPlaceholder')}
                                        value={farmContext.fishSpecies}
                                        onChange={e => setFarmContext({ ...farmContext, fishSpecies: e.target.value })}
                                        className="p-2 bg-white border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 text-xs"
                                    />
                                    <input
                                        type="text"
                                        placeholder={t_ai('pondSizePlaceholder')}
                                        value={farmContext.pondSize}
                                        onChange={e => setFarmContext({ ...farmContext, pondSize: e.target.value })}
                                        className="p-2 bg-white border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 text-xs"
                                    />
                                    <input
                                        type="text"
                                        placeholder={t_ai('numberOfFishPlaceholder')}
                                        value={farmContext.numberOfFish}
                                        onChange={e => setFarmContext({ ...farmContext, numberOfFish: e.target.value })}
                                        className="p-2 bg-white border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 text-xs"
                                    />
                                    <input
                                        type="text"
                                        placeholder={t_ai('waterTempPlaceholder')}
                                        value={farmContext.waterTemp}
                                        onChange={e => setFarmContext({ ...farmContext, waterTemp: e.target.value })}
                                        className="p-2 bg-white border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 text-xs"
                                    />
                                    <input
                                        type="text"
                                        placeholder={t_ai('phPlaceholder')}
                                        value={farmContext.ph}
                                        onChange={e => setFarmContext({ ...farmContext, ph: e.target.value })}
                                        className="p-2 bg-white border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 text-xs"
                                    />
                                    <input
                                        type="text"
                                        placeholder={t_ai('dissolvedOxygenPlaceholder')}
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
                                        {t_ai('welcomeTitle')}
                                    </h4>
                                    <p className="text-xs text-slate-500 max-w-md mt-1 mb-5">
                                        {t_ai('welcomeDesc')}
                                    </p>

                                    {/* Suggested Prompts */}
                                    <div className="w-full max-w-lg space-y-2 text-left">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            {t_ai('suggestedTitle')}
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
                                                        <span className="text-slate-400 font-medium">{t_ai('confidence')}:</span>
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
                                                        {t_ai('recommended')}
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
                                                        <span>{copiedIndex === idx ? t_ai('copied') : t_ai('copy')}</span>
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
                                    <span>{t_ai('loading')}</span>
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
                                    placeholder={t_ai('placeholder')}
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
