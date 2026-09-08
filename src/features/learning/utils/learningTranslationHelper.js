// Learning Hub Multi-Language Dynamic Content Translation Engine
// Supports English ('en'), Bengali ('bn'), Hindi ('hi'), and Odia ('or')

// 1. Categories Dictionary
export const CATEGORY_TRANSLATIONS = {
    'fish-farming-basics': {
        bn: { name: 'মাছ চাষের প্রাথমিক ধারণা', description: 'জলজ পালন এবং মাছ চাষের মৌলিক ধারণা ও আধুনিক নিয়মাবলী।' },
        hi: { name: 'मत्स्य पालन की मूल बातें', description: 'जलीय कृषि और मछली पालन की मूलभूत अवधारणाएं एवं दिशानिर्देश।' },
        or: { name: 'ମାଛ ଚାଷର ମୌଳିକ ତଥ୍ୟ', description: 'ଜଳଜ ଚାଷ ଏବଂ ମାଛ ପାଳନର ମୌଳିକ ଧାରଣା ଓ ପରାମର୍ଶ।' }
    },
    'fish-species': {
        bn: { name: 'মাছের প্রজাতি পরিচিতি', description: 'রুই, কাতলা, মৃগেল, তেলাপিয়া, মাগুর ও চিংড়ি চাষের বিস্তারিত।' },
        hi: { name: 'मछली की प्रमुख प्रजातियाँ', description: 'रोहू, कतला, तिलापिया, मांगुर और झींगा प्रजातियों का संपूर्ण विवरण।' },
        or: { name: 'ପ୍ରମୁଖ ମାଛ ପ୍ରଜାତି', description: 'ରୋହି, ଭାକୁର, ମିର୍ଗାଳି, ତେଲାପିଆ ଏବଂ ଚିଙ୍ଗୁଡ଼ି ପ୍ରଜାତିର ବିବରଣୀ।' }
    },
    'pond-preparation': {
        bn: { name: 'পুকুর খনন ও প্রস্তুতি', description: 'চুন প্রয়োগ, জৈব সার প্রয়োগ ও পোনা মজুদের জন্য পুকুর প্রস্তুতকরণ।' },
        hi: { name: 'तालाब निर्माण एवं तैयारी', description: 'चूना, जैविक खाद डालना और फिंगरलिंग स्टॉकिंग के नियम।' },
        or: { name: 'ପୋଖରୀ ନିର୍ମାଣ ଓ ପ୍ରସ୍ତୁତି', description: 'ଚୂନ ପ୍ରୟୋଗ, ଖତ ସାର ଏବଂ ପୋନା ମହଜୁଦ ପ୍ରସ୍ତୁତି ନିର୍ଦ୍ଦେଶାବଳୀ।' }
    },
    'water-quality': {
        bn: { name: 'জলের গুণমান ব্যবস্থাপনা', description: 'দ্রবীভূত অক্সিজেন (DO), পিএইচ (pH), ক্ষারত্ব ও অ্যামোনিয়া পর্যবেক্ষণ।' },
        hi: { name: 'जल गुणवत्ता प्रबंधन', description: 'घुलित ऑक्सीजन (DO), पीएच (pH), अमोनिया और क्षारीयता की निगरानी।' },
        or: { name: 'ଜଳ ଗୁଣମାନ ପରିଚାଳନା', description: 'ଅମ୍ଳଜାନ (DO), pH, ଆମୋନିଆ ଏବଂ କ୍ଷାରୀୟତା ନିରୀକ୍ଷଣ।' }
    },
    'feed-management': {
        bn: { name: 'খাদ্য ও পুষ্টি ব্যবস্থাপনা', description: 'এফসিআর (FCR) হ্রাস, সুষম খাদ্যের সময়সূচী ও পুষ্টির চাহিদা।' },
        hi: { name: 'आहार एवं पोषण प्रबंधन', description: 'एफसीआर (FCR) अनुकूलन, चारा खिलाने की अनुसूची और पोषण आवश्यकता।' },
        or: { name: 'ଖାଦ୍ୟ ଓ ପୁଷ୍ଟି ପରିଚାଳନା', description: 'FCR ସନ୍ତୁଳନ, ସମୟସାରଣୀ ଏବଂ ପୁଷ୍ଟିକର ଖାଦ୍ୟ ଚାହିଦା।' }
    },
    'fish-diseases': {
        bn: { name: 'মাছের রোগ ও চিকিৎসা', description: 'ব্যাকটেরিয়াল, ভাইরাল ও পরজীবী সংক্রমণ শনাক্তকরণ এবং প্রতিরোধ।' },
        hi: { name: 'मछली के रोग एवं उपचार', description: 'जीवाणु, विषाणु और परजीवी संक्रमण की त्वरित पहचान और रोकथाम।' },
        or: { name: 'ମାଛ ରୋଗ ଓ ନିରାକରଣ', description: 'ବ୍ୟାକ୍ଟେରିଆଲ, ଭାଇରାଲ ଓ ପରଜୀବୀ ସଂକ୍ରମଣ ଚିହ୍ନଟ ଏବଂ ଚିକିତ୍ସା।' }
    },
    'biofloc-farming': {
        bn: { name: 'বায়োফ্লক মাছ চাষ', description: 'কম জমিতে ও কম জলে শূন্য-জল-পরিবর্তন বায়োফ্লক প্রযুক্তির কৌশল।' },
        hi: { name: 'बायोफ्लोक मत्स्य पालन', description: 'कम जगह में शून्य जल परिवर्तन बायोफ्लोक तकनीक से सघन मछली पालन।' },
        or: { name: 'ବାୟୋଫ୍ଲୋକ ମାଛ ଚାଷ', description: 'କମ୍ ସ୍ଥାନରେ ଶୂନ୍ୟ-ଜଳ-ପରିବର୍ତ୍ତନ ବାୟୋଫ୍ଲୋକ ପ୍ରଯୁକ୍ତିରେ ନିବିଡ଼ ଚାଷ।' }
    },
    'ras-farming': {
        bn: { name: 'আরএএস (RAS) চাষ পদ্ধতি', description: 'নিয়ন্ত্রিত ইনডোর কালচারের জন্য আধুনিক রিকার্কুলেটিং একুয়াকালচার।' },
        hi: { name: 'आरएएस (RAS) आधुनिक प्रणाली', description: 'नियंत्रित इनडोर खेती के लिए आधुनिक रीसर्क्युलेटिंग एक्वाकल्चर सिस्टम।' },
        or: { name: 'ଆରଏଏସ୍ (RAS) ପ୍ରଣାଳୀ', description: 'ନିୟନ୍ତ୍ରିତ ଘରୋଇ ଚାଷ ପାଇଁ ରିସର୍କ୍ୟୁଲେଟିଂ ଆକ୍ୱାକଲଚର ସିଷ୍ଟମ।' }
    },
    'hatchery-management': {
        bn: { name: 'হ্যাচারি ও পোনা উৎপাদন', description: 'উন্নত ব্রুডস্টক নির্বাচন, ডিম ফোটানো ও সুস্থ লার্ভা লালন-পালন।' },
        hi: { name: 'हैचरी एवं बीज उत्पादन', description: 'गुणवत्तापूर्ण ब्रूडस्टॉक चयन, अंडे सेना और स्वस्थ लार्वा पालन।' },
        or: { name: 'ହ୍ୟାଚେରୀ ଓ ପୋନା ଉତ୍ପାଦନ', description: 'ଉତ୍ତମ ବ୍ରୁଡ଼ଷ୍ଟକ ଚୟନ, ଅଣ୍ଡା ଫୁଟାଇବା ଓ ସୁସ୍ଥ ପୋନା ପାଳନ।' }
    },
    'harvesting': {
        bn: { name: 'মাছ আহরণ ও পরিবহন', description: 'সঠিক সময়ে আহরণ, গ্রেডিং, অক্সিজেনযুক্ত ব্যাগে জীবন্ত মাছ পরিবহন।' },
        hi: { name: 'फसल कटाई एवं परिवहन', description: 'सही समय पर मछली निकासी, ग्रेडिंग और जीवित परिवहन तकनीक।' },
        or: { name: 'ମାଛ ଅମଳ ଓ ପରିବହନ', description: 'ସଠିକ୍ ସମୟରେ ଅମଳ, ଗ୍ରେଡିଂ ଏବଂ ଜୀବନ୍ତ ମାଛ ପରିବହନ କୌଶଳ।' }
    },
    'fish-marketing': {
        bn: { name: 'মাছ বিপণন ও মুনাফা বৃদ্ধি', description: 'পাইকারি আড়ত, খুচরা বাজার ও সরাসরি ক্রেতার কাছে ভালো দামে বিক্রয়।' },
        hi: { name: 'मछली विपणन एवं लाभ', description: 'थोक मंडी, खुदरा बाजार और सीधे ग्राहकों को सर्वोत्तम मूल्य पर बेचना।' },
        or: { name: 'ମାଛ ବିପଣନ ଓ ଲାଭ ବୃଦ୍ଧି', description: 'ପାଇକାରୀ ବଜାର, ଖୁଚୁରା ଏବଂ ସିଧାସଳଖ ଉପଯୁକ୍ତ ମୂଲ୍ୟରେ ବିକ୍ରି।' }
    },
    'government-schemes-cat': {
        bn: { name: 'সরকারি প্রকল্প ও অনুদান', description: 'পিএমএমএসওয়াই (PMMSY), রাজ্য ভর্তুকি এবং সহজ ঋণ সহায়তা।' },
        hi: { name: 'सरकारी योजनाएं एवं सब्सिडी', description: 'पीएमएमएसवाई (PMMSY), राज्य सब्सिडी और आसान ऋण सहायता पैकेज।' },
        or: { name: 'ସରକାରୀ ଯୋଜନା ଓ ସବସିଡି', description: 'PMMSY ରିହାତି, ରାଜ୍ୟ ଅନୁଦାନ ଏବଂ ସୁଲଭ ଋଣ ସହାୟତା।' }
    },
    'sustainable-farming': {
        bn: { name: 'টেকসই ও পরিবেশবান্ধব চাষ', description: 'পরিবেশের ক্ষতি না করে আধুনিক জলবায়ু-সহনশীল মৎস্যচাষ।' },
        hi: { name: 'सतत एवं पर्यावरण-अनुकूल खेती', description: 'पर्यावरण को नुकसान पहुंचाए बिना टिकाऊ और जलवायु-अनुकूल खेती।' },
        or: { name: 'ସ୍ଥାୟୀ ଓ ପରିବେଶ-ଅନୁକୂଳ ଚାଷ', description: 'ପରିବେଶକୁ କ୍ଷତି ନପହଞ୍ଚାଇ ସ୍ଥାୟୀ ଏବଂ ଜଳବାୟୁ-ଅନୁକୂଳ ଚାଷ।' }
    },
    'business-management': {
        bn: { name: 'খামার ব্যবসায়িক পরিকল্পনা', description: 'পুঁজি বিনিয়োগ, খামারের লাভ-লোকসান হিসাব ও পরিচালন ব্যয় নিয়ন্ত্রণ।' },
        hi: { name: 'फार्म व्यापार एवं लेखा प्रबंधन', description: 'पूंजी निवेश, लाभ-हानि विश्लेषण और फार्म संचालन बजट।' },
        or: { name: 'ଫାର୍ମ ବ୍ୟବସାୟ ପରିଚାଳନା', description: 'ପୁଞ୍ଜି ବିନିଯୋଗ, ଲାଭ-କ୍ଷତି ହିସାବ ଏବଂ ବଜେଟ୍ ନିୟନ୍ତ୍ରଣ।' }
    },
    'technology-aquaculture': {
        bn: { name: 'মৎস্যচাষে আধুনিক প্রযুক্তি', description: 'স্বয়ংক্রিয় ফিডার, আইওটি সেন্সর এবং এআই-চালিত পর্যবেক্ষণ।' },
        hi: { name: 'जलीय कृषि में आधुनिक तकनीक', description: 'स्वचालित फीडर, IoT सेंसर और AI आधारित जल निगरानी प्रणाली।' },
        or: { name: 'ଜଳଜ କୃଷିରେ ଆଧୁନିକ ପ୍ରଯୁକ୍ତି', description: 'ସ୍ୱୟଂଚାଳିତ ଫିଡର, IoT ସେନସର ଏବଂ AI ଆଧାରିତ ନିରୀକ୍ଷଣ।' }
    }
};

// 2. Specific Seeded Content Overrides
export const CONTENT_TRANSLATIONS = {
    'intro-to-biofloc-parameters': {
        bn: {
            title: 'বায়োফ্লক সিস্টেমের প্রয়োজনীয় পরামিতি পরিচিতি',
            description: 'বায়োফ্লক ট্যাঙ্কে অ্যামোনিয়া, ফ্লোক ভলিউম, সি:এন রেশিও এবং দ্রবীভূত অক্সিজেন (DO) নিয়ন্ত্রণের মূল নির্দেশিকা।'
        },
        hi: {
            title: 'बायोफ्लोक प्रणाली के मुख्य पैरामीटर का परिचय',
            description: 'बायोफ्लोक टैंकों में अमोनिया, फ्लोक वॉल्यूम, सी:एन अनुपात और घुलित ऑक्सीजन (DO) नियंत्रण के लिए बुनियादी दिशा-निर्देश।'
        },
        or: {
            title: 'ବାୟୋଫ୍ଲୋକ ପ୍ରଣାଳୀର ଆବଶ୍ୟକୀୟ ମାନଦଣ୍ଡ ପରିଚୟ',
            description: 'ବାୟୋଫ୍ଲୋକ ଟ୍ୟାଙ୍କରେ ଆମୋନିଆ, ଫ୍ଲୋକ ପରିମାଣ, C:N ଅନୁପାତ ଏବଂ ଅମ୍ଳଜାନ (DO) ନିୟନ୍ତ୍ରଣର ଗାଇଡ୍।'
        }
    },
    'construct-prepare-fish-ponds': {
        bn: {
            title: 'কীভাবে মাছের পুকুর তৈরি ও প্রস্তুত করবেন',
            description: 'মাটি নির্বাচন, চুন ও সার প্রয়োগ এবং পোনা মজুদের জন্য আদর্শ বাণিজ্যিক পুকুর তৈরির সহজ উপায়।',
            content: `<h3>পুকুর তৈরির মূল ধাপসমূহ</h3><p>একটি লাভজনক বাণিজ্যিক মাছের পুকুর তৈরির জন্য সঠিক লেআউট পরিকল্পনা, মাটির পরীক্ষা এবং জল নিষ্কাশন ব্যবস্থা প্রয়োজন।</p><h4>১. মাটি পরীক্ষা</h4><p>জল ধরে রাখার জন্য মাটিতে অন্তত ২০-৩০% এঁটেল বা কাদা থাকা জরুরি। বেলে মাটি পরিহার করুন যা দিয়ে জল চুইয়ে বেরিয়ে যায়।</p><h4>২. চুন ও জৈব সার প্রয়োগ</h4><p>জলের পিএইচ ঠিক রাখতে এবং প্রাকৃতিক প্লাঙ্কটন জন্মানোর জন্য চুন প্রয়োগ করুন। পোনা ছাড়ার ২ সপ্তাহ আগে হেক্টর প্রতি ২৫০ কেজি কৃষি চুন দিন।</p><h4>৩. জল ভর্তি ও পর্যবেক্ষণ</h4><p>পুকুরে পরিষ্কার জল দিয়ে ১.২ থেকে ১.৫ মিটার গভীর করুন। পোনা ছাড়ার আগে অন্তত ৩ দিন দ্রবীভূত অক্সিজেনের মাত্রা পর্যবেক্ষণ করুন।</p>`
        },
        hi: {
            title: 'मछली तालाब का निर्माण और तैयारी कैसे करें',
            description: 'वाणिज्यिक मछली तालाब के लिए मिट्टी का परीक्षण, चूना डालना और स्टॉकिंग की पूरी तैयारी।',
            content: `<h3>तालाब निर्माण के चरण</h3><p>व्यावसायिक मछली तालाब के निर्माण के लिए उचित योजना, मिट्टी के परीक्षण और जल निकासी की आवश्यकता होती है।</p><h4>1. मिट्टी का विश्लेषण</h4><p>पानी रोकने के लिए मिट्टी में कम से कम 20-30% चिकनी मिट्टी (क्ले) होनी चाहिए। बलुई मिट्टी से बचें।</p><h4>2. चूना और खाद</h4><p>पीएच को स्थिर करने और प्राकृतिक प्लवक बढ़ाने के लिए चूना डालें। स्टॉकिंग से 2 सप्ताह पहले 250 किग्रा/हेक्टेयर चूना डालें।</p><h4>3. पानी भरना</h4><p>तालाब में 1.2-1.5 मीटर तक साफ पानी भरें। फिंगरलिंग डालने से पहले 3 दिन तक घुलित ऑक्सीजन की निगरानी करें।</p>`
        },
        or: {
            title: 'ମାଛ ପୋଖରୀ କିପରି ନିର୍ମାଣ ଓ ପ୍ରସ୍ତୁତ କରିବେ',
            description: 'ମାଟି ପରୀକ୍ଷା, ଚୂନ ପ୍ରୟୋଗ ଏବଂ ପୋନା ଛାଡ଼ିବା ପାଇଁ ବାଣିଜ୍ୟିକ ପୋଖରୀ ପ୍ରସ୍ତୁତିର ସମ୍ପୂର୍ଣ୍ଣ ଗାଇଡ୍।',
            content: `<h3>ପୋଖରୀ ନିର୍ମାଣ ପଦ୍ଧତି</h3><p>ବାଣିଜ୍ୟିକ ମାଛ ପୋଖରୀ ପାଇଁ ସଠିକ୍ ଯୋଜନା, ମାଟି ପରୀକ୍ଷା ଏବଂ ଜଳ ନିଷ୍କାସନ ନିତାନ୍ତ ଆବଶ୍ୟକ।</p><h4>୧. ମାଟି ପରୀକ୍ଷା</h4><p>ପାଣି ଧରି ରଖିବା ପାଇଁ ମାଟିରେ ଅତିକମରେ ୨୦-୩୦% ମଟିକାଡ଼ (Clay) ରହିବା ଉଚିତ୍। ବାଲିଆ ମାଟିରୁ ଦୂରେଇ ରୁହନ୍ତୁ।</p><h4>୨. ଚୂନ ଓ ଖତ ପ୍ରୟୋଗ</h4><p>ପାଣିର pH ସ୍ଥିର ରଖିବା ଏବଂ ପ୍ରାକୃତିକ ପ୍ଲାଙ୍କଟନ୍ ବୃଦ୍ଧି ପାଇଁ ଚୂନ ପ୍ରୟୋଗ କରନ୍ତୁ। ପୋନା ଛାଡ଼ିବାର ୨ ସପ୍ତାହ ପୂର୍ବରୁ ହେକ୍ଟର ପ୍ରତି ୨୫୦ କେଜି ଚୂନ ଦିଅନ୍ତୁ।</p><h4>୩. ଜଳ ଭର୍ତ୍ତି</h4><p>ପୋଖରୀରେ ୧.୨ ରୁ ୧.୫ ମିଟର ପର୍ଯ୍ୟନ୍ତ ସ୍ୱଚ୍ଛ ପାଣି ଭରନ୍ତୁ ଏବଂ ଅମ୍ଳଜାନ ମାତ୍ରା ଯାଞ୍ଚ କରନ୍ତୁ।</p>`
        }
    },
    'rohu-disease-identification-guide': {
        bn: {
            title: 'রুই মাছের রোগ শনাক্তকরণ ও চিকিৎসা নির্দেশিকা',
            description: 'রুই মাছের পাখনা পচা, ফুলকা পচা এবং ক্ষত রোগ প্রতিরোধের চিকিৎসাগত পরামর্শ ও ঔষধ নির্দেশিকা।'
        },
        hi: {
            title: 'रोहू मछली रोग पहचान एवं उपचार मार्गदर्शिका',
            description: 'रोहू में गलफड़ा सड़न, पंख सड़न और अल्सर रोग के लक्षण व उपचार के आसान उपाय।'
        },
        or: {
            title: 'ରୋହି ମାଛ ରୋଗ ଚିହ୍ନଟ ଓ ନିରାକରଣ ମାର୍ଗଦର୍ଶିକା',
            description: 'ରୋହି ମାଛର ଡେଣା ପଚା, ଗାଲି ପଚା ଏବଂ ଘା\' ରୋଗ ଚିହ୍ନଟ ଓ ନିୟନ୍ତ୍ରଣ ପଦ୍ଧତି।'
        }
    }
};

// 3. Government Scheme Overrides
export const SCHEME_TRANSLATIONS = {
    'pmmsy-scheme-details': {
        bn: {
            title: 'প্রধানমন্ত্রী মৎস্য সম্পদ যোজনা (PMMSY)',
            ministry: 'মৎস্য অধিদপ্তর, মৎস্য, পশুপালন ও দুগ্ধ মন্ত্রণালয়',
            description: 'টেকসই মৎস্যচাষ, প্রযুক্তিগত আধুনিকায়ন এবং মৎস্যচাষীদের পরিকাঠামো নির্মাণে ৬০% পর্যন্ত সরকারি অনুদান সহায়তা।',
            eligibility: 'সকল নিবন্ধিত মৎস্যচাষী, সমবায় সমিতি, স্বনির্ভর গোষ্ঠী এবং হ্যাচারি মালিক।'
        },
        hi: {
            title: 'प्रधानमंत्री मत्स्य संपदा योजना (PMMSY)',
            ministry: 'मत्स्य पालन विभाग, मत्स्य पालन, पशुपालन एवं डेयरी मंत्रालय',
            description: 'सतत जलीय कृषि, तकनीकी आधुनिकीकरण और मछली किसानों के लिए 60% तक सरकारी सब्सिडी सहायता।',
            eligibility: 'सभी पंजीकृत मछली किसान, सहकारी समितियां, स्वयं सहायता समूह और हैचरी मालिक।'
        },
        or: {
            title: 'ପ୍ରଧାନମନ୍ତ୍ରୀ ମତ୍ସ୍ୟ ସମ୍ପଦ ଯୋଜନା (PMMSY)',
            ministry: 'ମତ୍ସ୍ୟ ପାଳନ ବିଭାଗ, ମତ୍ସ୍ୟ ପାଳନ, ପଶୁପାଳନ ଓ ଦୁଗ୍ଧ ମନ୍ତ୍ରଣାଳୟ',
            description: 'ସ୍ଥାୟୀ ମତ୍ସ୍ୟ ଚାଷ, ପ୍ରଯୁକ୍ତିର ବିକାଶ ଏବଂ ମାଛ ଚାଷୀଙ୍କ ପାଇଁ ୬୦% ପର୍ଯ୍ୟନ୍ତ ସରକାରୀ ରିହାତି ସହାୟତା।',
            eligibility: 'ସମସ୍ତ ପଞ୍ଜୀକୃତ ମାଛ ଚାଷୀ, ସମବାୟ ସମିତି, SHG ଏବଂ ହ୍ୟାଚେରୀ ମାଲିକ।'
        }
    }
};

// 4. Common Aquaculture Keywords for Dynamic Title Fallback
const KEYWORD_MAP = {
    bn: [
        { en: /biofloc/gi, tr: 'বায়োফ্লক' },
        { en: /water quality/gi, tr: 'জলের গুণমান' },
        { en: /pond preparation/gi, tr: 'পুকুর প্রস্তুতি' },
        { en: /fish farming/gi, tr: 'মাছ চাষ' },
        { en: /aquaculture/gi, tr: 'জলজ পালন' },
        { en: /parameters/gi, tr: 'পরামিতি' },
        { en: /guide/gi, tr: 'নির্দেশিকা' },
        { en: /disease/gi, tr: 'রোগ' },
        { en: /management/gi, tr: 'ব্যবস্থাপনা' },
        { en: /feed/gi, tr: 'খাদ্য' },
        { en: /harvesting/gi, tr: 'আহরণ' },
        { en: /hatchery/gi, tr: 'হ্যাচারি' },
        { en: /rohu/gi, tr: 'রুই' },
        { en: /catla/gi, tr: 'কাতলা' },
        { en: /tilapia/gi, tr: 'তেলাপিয়া' },
        { en: /shrimp/gi, tr: 'চিংড়ি' },
        { en: /construction/gi, tr: 'নির্মাণ' },
        { en: /ammonia/gi, tr: 'অ্যামোনিয়া' },
        { en: /oxygen/gi, tr: 'অক্সিজেন' },
        { en: /basics/gi, tr: 'মৌলিক ধারণা' }
    ],
    hi: [
        { en: /biofloc/gi, tr: 'बायोफ्लोक' },
        { en: /water quality/gi, tr: 'जल गुणवत्ता' },
        { en: /pond preparation/gi, tr: 'तालाब की तैयारी' },
        { en: /fish farming/gi, tr: 'मछली पालन' },
        { en: /aquaculture/gi, tr: 'जलीय कृषि' },
        { en: /parameters/gi, tr: 'पैरामीटर' },
        { en: /guide/gi, tr: 'मार्गदर्शिका' },
        { en: /disease/gi, tr: 'रोग' },
        { en: /management/gi, tr: 'प्रबंधन' },
        { en: /feed/gi, tr: 'आहार' },
        { en: /harvesting/gi, tr: 'निकासी' },
        { en: /hatchery/gi, tr: 'हैचरी' },
        { en: /rohu/gi, tr: 'रोहू' },
        { en: /catla/gi, tr: 'कतला' },
        { en: /tilapia/gi, tr: 'तिलापिया' },
        { en: /shrimp/gi, tr: 'झींगा' },
        { en: /construction/gi, tr: 'निर्माण' },
        { en: /ammonia/gi, tr: 'अमोनिया' },
        { en: /oxygen/gi, tr: 'ऑक्सीजन' },
        { en: /basics/gi, tr: 'मूल बातें' }
    ],
    or: [
        { en: /biofloc/gi, tr: 'ବାୟୋଫ୍ଲୋକ' },
        { en: /water quality/gi, tr: 'ଜଳ ଗୁଣମାନ' },
        { en: /pond preparation/gi, tr: 'ପୋଖରୀ ପ୍ରସ୍ତୁତି' },
        { en: /fish farming/gi, tr: 'ମାଛ ଚାଷ' },
        { en: /aquaculture/gi, tr: 'ଜଳଜ ଚାଷ' },
        { en: /parameters/gi, tr: 'ମାନଦଣ୍ଡ' },
        { en: /guide/gi, tr: 'ଗାଇଡ୍' },
        { en: /disease/gi, tr: 'ରୋଗ' },
        { en: /management/gi, tr: 'ପରିଚାଳନା' },
        { en: /feed/gi, tr: 'ଖାଦ୍ୟ' },
        { en: /harvesting/gi, tr: 'ଅମଳ' },
        { en: /hatchery/gi, tr: 'ହ୍ୟାଚେରୀ' },
        { en: /rohu/gi, tr: 'ରୋହି' },
        { en: /catla/gi, tr: 'ଭାକୁର' },
        { en: /tilapia/gi, tr: 'ତେଲାପିଆ' },
        { en: /shrimp/gi, tr: 'ଚିଙ୍ଗୁଡ଼ି' },
        { en: /construction/gi, tr: 'ନିର୍ମାଣ' },
        { en: /ammonia/gi, tr: 'ଆମୋନିଆ' },
        { en: /oxygen/gi, tr: 'ଅମ୍ଳଜାନ' },
        { en: /basics/gi, tr: 'ମୌଳିକ ତଥ୍ୟ' }
    ]
};

// Helper: Smart fallback title localization if not explicitly defined
export const translateDynamicTitle = (title, lang) => {
    if (!title || lang === 'en') return title;
    
    // Check direct slug/title matches first
    for (const key of Object.keys(CONTENT_TRANSLATIONS)) {
        if (CONTENT_TRANSLATIONS[key][lang] && title.toLowerCase().includes(key.replace(/-/g, ' '))) {
            return CONTENT_TRANSLATIONS[key][lang].title;
        }
    }

    let result = title;
    const rules = KEYWORD_MAP[lang];
    if (rules) {
        rules.forEach(({ en, tr }) => {
            result = result.replace(en, tr);
        });
    }

    // Specific common title translations
    const cleanLower = title.toLowerCase().trim();
    if (cleanLower === 'fish') {
        if (lang === 'bn') return 'মাছ চাষের নির্দেশিকা';
        if (lang === 'hi') return 'मछली पालन निर्देशिका';
        if (lang === 'or') return 'ମାଛ ଚାଷ ମାର୍ଗଦର୍ଶିକା';
    }
    if (cleanLower === 'water quality' || cleanLower === 'water-quality') {
        if (lang === 'bn') return 'জলের গুণমান ব্যবস্থাপনা';
        if (lang === 'hi') return 'जल गुणवत्ता प्रबंधन';
        if (lang === 'or') return 'ଜଳ ଗୁଣମାନ ପରିଚାଳନା';
    }

    return result;
};

// Helper: Smart fallback description localization
export const translateDynamicDescription = (desc, lang) => {
    if (lang === 'en') return desc || 'MatsyaLink expert resources for aquaculture and sustainable fish farming.';

    const defaultEn = 'matsyalink expert resources for aquaculture and sustainable fish farming.';
    if (!desc || desc.toLowerCase().includes(defaultEn) || desc.toLowerCase().includes('matsyalink expert resources')) {
        if (lang === 'bn') return 'জলজ পালন এবং টেকসই মাছ চাষের জন্য মৎস্যলিংক বিশেষজ্ঞ নির্দেশিকা।';
        if (lang === 'hi') return 'जलीय कृषि और सतत मछली पालन के लिए मत्स्यलिंक विशेषज्ञ संसाधन।';
        if (lang === 'or') return 'ଜଳଜ କୃଷି ଏବଂ ସ୍ଥାୟୀ ମାଛ ଚାଷ ପାଇଁ ମତ୍ସ୍ୟଲିଙ୍କ ବିଶେଷଜ୍ଞ ସହାୟତା।';
    }

    let result = desc;
    const rules = KEYWORD_MAP[lang];
    if (rules) {
        rules.forEach(({ en, tr }) => {
            result = result.replace(en, tr);
        });
    }

    return result;
};

// 5. Level & Type Localizers
export const getLocalizedLevel = (level, lang) => {
    if (!level) return '';
    const l = level.toLowerCase();
    if (lang === 'bn') {
        if (l === 'beginner') return 'শিক্ষানবিশ';
        if (l === 'intermediate') return 'মধ্যবর্তী';
        if (l === 'advanced') return 'উন্নত';
    } else if (lang === 'hi') {
        if (l === 'beginner') return 'शुरुआती';
        if (l === 'intermediate') return 'मध्यवर्ती';
        if (l === 'advanced') return 'उन्नत';
    } else if (lang === 'or') {
        if (l === 'beginner') return 'ପ୍ରାରମ୍ଭିକ';
        if (l === 'intermediate') return 'ମଧ୍ୟବର୍ତ୍ତୀ';
        if (l === 'advanced') return 'ଉନ୍ନତ';
    }
    return level.charAt(0).toUpperCase() + level.slice(1);
};

export const getLocalizedType = (type, lang) => {
    if (!type) return '';
    const t = type.toLowerCase();
    if (lang === 'bn') {
        if (t === 'video') return 'ভিডিও';
        if (t === 'article') return 'নিবন্ধ';
        if (t === 'blog') return 'ব্লগ';
        if (t === 'pdf') return 'পিডিএফ';
        if (t === 'problems_story') return 'সমস্যার গল্প';
    } else if (lang === 'hi') {
        if (t === 'video') return 'वीडियो';
        if (t === 'article') return 'लेख';
        if (t === 'blog') return 'ब्लॉग';
        if (t === 'pdf') return 'पीडीएफ';
        if (t === 'problems_story') return 'समस्या की कहानी';
    } else if (lang === 'or') {
        if (t === 'video') return 'ଭିଡିଓ';
        if (t === 'article') return 'ନିବନ୍ଧ';
        if (t === 'blog') return 'ବ୍ଲଗ';
        if (t === 'pdf') return 'ପିଡିଏଫ';
        if (t === 'problems_story') return 'ସମସ୍ୟା କାହାଣୀ';
    }
    return type.toUpperCase();
};

// 6. Category Localizer
export const getLocalizedCategory = (cat, lang) => {
    if (!cat) return { name: '', description: '' };
    if (lang === 'en') {
        return {
            ...cat,
            name: cat.name,
            description: cat.description
        };
    }
    const slug = cat.slug || '';
    const trans = CATEGORY_TRANSLATIONS[slug]?.[lang];
    if (trans) {
        return {
            ...cat,
            name: trans.name,
            description: trans.description || cat.description
        };
    }

    // Try finding by matching english name
    for (const key of Object.keys(CATEGORY_TRANSLATIONS)) {
        if (cat.name && cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(key)) {
            const match = CATEGORY_TRANSLATIONS[key]?.[lang];
            if (match) {
                return {
                    ...cat,
                    name: match.name,
                    description: match.description || cat.description
                };
            }
        }
    }

    return {
        ...cat,
        name: cat.name,
        description: cat.description
    };
};

// 7. Content Localizer (Articles, Videos, Blogs, Problem Stories)
export const getLocalizedContent = (content, lang) => {
    if (!content) return null;
    if (lang === 'en') return content;

    const slug = content.slug || '';
    const trans = CONTENT_TRANSLATIONS[slug]?.[lang];

    const localizedLevel = getLocalizedLevel(content.level, lang);
    const localizedType = getLocalizedType(content.type, lang);

    if (trans) {
        return {
            ...content,
            title: trans.title || content.title,
            description: trans.description || content.description,
            content: trans.content || content.content,
            displayLevel: localizedLevel,
            displayType: localizedType
        };
    }

    // Fallback: Smart Title/Description adjustments
    const fallbackTitle = translateDynamicTitle(content.title, lang);
    const fallbackDesc = translateDynamicDescription(content.description, lang);

    return {
        ...content,
        title: fallbackTitle,
        description: fallbackDesc,
        displayLevel: localizedLevel,
        displayType: localizedType
    };
};

// 8. Scheme Localizer
export const getLocalizedScheme = (scheme, lang) => {
    if (!scheme) return null;
    if (lang === 'en') return scheme;

    const slug = scheme.slug || '';
    const trans = SCHEME_TRANSLATIONS[slug]?.[lang];

    if (trans) {
        return {
            ...scheme,
            title: trans.title || scheme.title,
            ministry: trans.ministry || scheme.ministry,
            description: trans.description || scheme.description,
            eligibility: trans.eligibility || scheme.eligibility
        };
    }

    // Fallback for general PMMSY / government schemes
    const titleLower = (scheme.title || '').toLowerCase();
    if (/pmmsy|pradhan mantri|subsidy|scheme/i.test(titleLower)) {
        const pmmsyTrans = SCHEME_TRANSLATIONS['pmmsy-scheme-details']?.[lang];
        if (pmmsyTrans) {
            return {
                ...scheme,
                title: pmmsyTrans.title,
                ministry: pmmsyTrans.ministry,
                description: pmmsyTrans.description,
                eligibility: pmmsyTrans.eligibility
            };
        }
    }

    const locTitle = translateDynamicTitle(scheme.title, lang);
    const locDesc = translateDynamicDescription(scheme.description, lang);

    let locMinistry = scheme.ministry;
    if (lang === 'bn') locMinistry = 'মৎস্য অধিদপ্তর, মৎস্য, পশুপালন ও দুগ্ধ মন্ত্রণালয়';
    else if (lang === 'hi') locMinistry = 'मत्स्य पालन विभाग, मत्स्य पालन, पशुपालन एवं डेयरी मंत्रालय';
    else if (lang === 'or') locMinistry = 'ମତ୍ସ୍ୟ ପାଳନ ବିଭାଗ, ମତ୍ସ୍ୟ ପାଳନ, ପଶୁପାଳନ ଓ ଦୁଗ୍ଧ ମନ୍ତ୍ରଣାଳୟ';

    let locEligibility = scheme.eligibility;
    if (!locEligibility || /all the farm/i.test(locEligibility) || /anyone/i.test(locEligibility)) {
        if (lang === 'bn') locEligibility = 'সকল নিবন্ধিত মৎস্যচাষী ও চাষী গোষ্ঠী';
        else if (lang === 'hi') locEligibility = 'सभी पंजीकृत मछली किसान और समूह';
        else if (lang === 'or') locEligibility = 'ସମସ୍ତ ପଞ୍ଜୀକୃତ ମାଛ ଚାଷୀ ଏବଂ ଗୋଷ୍ଠୀ';
    }

    return {
        ...scheme,
        title: locTitle,
        description: locDesc,
        ministry: locMinistry,
        eligibility: locEligibility
    };
};

// 9. Quiz Localizer
export const getLocalizedQuiz = (quiz, lang) => {
    if (!quiz) return null;
    if (lang === 'en') return quiz;

    if (quiz.title && /water|parameter/i.test(quiz.title)) {
        if (lang === 'bn') {
            return {
                ...quiz,
                title: 'জলের পরামিতি মূল্যায়ন পরীক্ষা',
                description: 'জলের পিএইচ (pH), দ্রবীভূত অক্সিজেন (DO) এবং অ্যামোনিয়া নিয়ন্ত্রণের জ্ঞান যাচাই করুন।',
                questions: (quiz.questions || []).map(q => ({
                    ...q,
                    questionText: 'মিঠা জলের মাছ চাষের জন্য সর্বোত্তম পিএইচ (pH) মাত্রা কত?',
                    options: ['৪.৫ - ৫.৫', '৬.৫ - ৮.৫', '৯.০ - ১০.৫', '১.০ - ৩.০'],
                    explanation: 'বেশিরভাগ মিঠা জলের মাছ সামান্য ক্ষারীয় থেকে নিরপেক্ষ পরিবেশে (পিএইচ ৬.৫ - ৮.৫) সবচেয়ে ভালো বৃদ্ধি পায়।'
                }))
            };
        }
        if (lang === 'hi') {
            return {
                ...quiz,
                title: 'जल पैरामीटर मूल्यांकन परीक्षा',
                description: 'पीएच (pH), घुलित ऑक्सीजन (DO) और अमोनिया संकेतकों की अपनी समझ का परीक्षण करें।',
                questions: (quiz.questions || []).map(q => ({
                    ...q,
                    questionText: 'मीठे पानी में मछली पालन के लिए इष्टतम पीएच (pH) सीमा क्या है?',
                    options: ['4.5 - 5.5', '6.5 - 8.5', '9.0 - 10.5', '1.0 - 3.0'],
                    explanation: 'अधिकांश मीठे पानी की मछलियां हल्के क्षारीय से तटस्थ वातावरण (पीएच 6.5 - 8.5) में तेजी से बढ़ती हैं।'
                }))
            };
        }
        if (lang === 'or') {
            return {
                ...quiz,
                title: 'ଜଳ ମାନଦଣ୍ଡ ମୂଲ୍ୟାଙ୍କନ ପରୀକ୍ଷା',
                description: 'ଜଳର pH, ଅମ୍ଳଜାନ (DO) ଏବଂ ଆମୋନିଆ ନିୟନ୍ତ୍ରଣ ଜ୍ଞାନ ପରୀକ୍ଷା କରନ୍ତୁ।',
                questions: (quiz.questions || []).map(q => ({
                    ...q,
                    questionText: 'ମିଠା ପାଣିରେ ମାଛ ଚାଷ ପାଇଁ ଉପଯୁକ୍ତ pH ସୀମା କେତେ?',
                    options: ['୪.୫ - ୫.୫', '୬.୫ - ୮.୫', '୯.୦ - ୧୦.୫', '୧.୦ - ୩.୦'],
                    explanation: 'ଅଧିକାଂଶ ମିଠା ପାଣି ମାଛ ନିରପେକ୍ଷରୁ ସାମାନ୍ୟ କ୍ଷାରୀୟ ପରିବେଶରେ (pH ୬.୫ - ୮.୫) ଭଲ ବଢ଼ନ୍ତି।'
                }))
            };
        }
    }

    return quiz;
};

// 10. Training Program & Webinar Localizers
export const getLocalizedTraining = (prog, lang) => {
    if (!prog) return null;
    if (lang === 'en') return prog;

    if (lang === 'bn') {
        return {
            ...prog,
            title: prog.title?.replace(/biofloc/gi, 'বায়োফ্লক') || prog.title,
            instructor: prog.instructor?.replace(/Dr\./g, 'ড.') || prog.instructor
        };
    }
    if (lang === 'hi') {
        return {
            ...prog,
            title: prog.title?.replace(/biofloc/gi, 'बायोफ्लोक') || prog.title,
            instructor: prog.instructor?.replace(/Dr\./g, 'डॉ.') || prog.instructor
        };
    }
    if (lang === 'or') {
        return {
            ...prog,
            title: prog.title?.replace(/biofloc/gi, 'ବାୟୋଫ୍ଲୋକ') || prog.title,
            instructor: prog.instructor?.replace(/Dr\./g, 'ଡ.') || prog.instructor
        };
    }
    return prog;
};
