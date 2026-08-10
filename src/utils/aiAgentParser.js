import { stateDistricts, getPoliceStations } from './districtsData';

/**
 * Natural Language Parser for MatsyaLink AI Marketplace Agent
 * Supports intent detection, category identification, entity extraction,
 * auto-generating title & description, and generating targeted follow-up questions.
 */

// Supported Categories
export const CATEGORIES = {
    FISH: 'Fish',
    FEED: 'Feed',
    MEDICINE: 'Medicine',
    EQUIPMENT: 'Equipment',
    SEED: 'Fingerling', // or Spawn
};

// All available states from districtsData
const ALL_STATES = Object.keys(stateDistricts);

// Normalize text for matching
const normalize = (text) => text.toLowerCase().trim();

const convertIndicDigitsToAscii = (str = '') => {
    return (str || '')
        .replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d))
        .replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d))
        .replace(/[୦-୯]/g, d => '୦୧୨୩୪୫୬୭୮୯'.indexOf(d));
};

/**
 * Main parse function
 * @param {string} text Input string from text or voice
 * @param {Object} existingData Previously extracted data context
 * @param {Object} user Profile context (user.district, user.localDistrict, user.phone, etc.)
 */
export function parseMarketplaceIntent(text = '', existingData = {}, user = {}) {
    const raw = text.trim();
    const norm = normalize(raw);
    const normAscii = convertIndicDigitsToAscii(norm);

    const activeField = existingData.nextField;

    const result = {
        actionType: existingData.actionType || null, // 'selling' | 'buying'
        category: existingData.category || null,     // 'Fish' | 'Feed' | 'Medicine' | 'Equipment' | 'Spawn' | 'Fingerling'
        productName: existingData.productName || '',
        quantity: existingData.quantity || '',
        unit: existingData.unit || 'kg',
        price: existingData.price || '',             // Selling price or Buying budget
        district: existingData.district || user?.district || '',           // State
        localDistrict: existingData.localDistrict || user?.localDistrict || '', // District
        policeStation: existingData.policeStation || user?.policeStation || '', // Police station
        phoneNumber: existingData.phoneNumber || user?.phone || '',
        size: existingData.size || '',               // Spec / size for buying posts or equipment
        title: existingData.title || '',
        description: existingData.description || '',
        isComplete: false,
        missingFields: [],
        nextQuestion: null
    };

    if (!norm) {
        return generateNextState(result, user);
    }

    // 1. INTENT DETECTION (Selling vs Buying)
    if (!result.actionType) {
        const buyingKeywords = [
            'buy', 'buying', 'need', 'require', 'requirement', 'purchase', 'want to buy', 'looking for',
            'kinte chai', 'kinbo', 'lagbe', 'chai', 'dorkar',
            'kharedna', 'chahiye', 'khareedna', 'mangal', 'kini',
            'ক্রয়', 'কিনতে', 'কিনব', 'ক্রয় পোস্ট', 'দরকার', 'লাগবে', 'চাই', 'কেনা',
            'खरीदना', 'खरीद', 'चाहिए', 'क्रय', 'खरीदना है',
            'କିଣିବା', 'କ୍ରୟ', 'ଦରକାର'
        ];
        const sellingKeywords = [
            'sell', 'selling', 'sale', 'offer', 'available for sale', 'want to sell', 'listing', 'list',
            'bechna', 'bechbo', 'bikri', 'bikry', 'bechunga', 'bechne', 'bikroy', 'bechuchi',
            'বিক্রয়', 'বিক্রি', 'বেচবো', 'বিক্রয় তালিকা', 'বেচা', 'বিক্রি করতে', 'তালিকা', 'বেচব', 'তালিকা তৈরি',
            'बेचना', 'बिक्री', 'विक्रय', 'बिक्री सूची', 'बेचना है', 'बेचूंगा',
            'ବିକ୍ରୟ', 'ବିକ୍ରି', 'ବିକ୍ରି ତାଲିକା'
        ];

        const isBuying = buyingKeywords.some(kw => norm.includes(kw));
        const isSelling = sellingKeywords.some(kw => norm.includes(kw));

        if (isBuying && !isSelling) {
            result.actionType = 'buying';
        } else if (isSelling && !isBuying) {
            result.actionType = 'selling';
        } else if (isBuying && isSelling) {
            // First keyword found
            const firstBuyIdx = Math.min(...buyingKeywords.map(k => norm.indexOf(k)).filter(i => i !== -1));
            const firstSellIdx = Math.min(...sellingKeywords.map(k => norm.indexOf(k)).filter(i => i !== -1));
            result.actionType = firstBuyIdx < firstSellIdx ? 'buying' : 'selling';
        } else if (activeField === 'actionType') {
            result.actionType = 'selling';
        }
    }

    // 2. CATEGORY DETECTION
    if (!result.category) {
        const fishKeywords = ['rohu', 'ruhi', 'rui', 'katla', 'katol', 'mrigal', 'pabda', 'tangra', 'tilapia', 'hilsa', 'ilish', 'prawn', 'shrimp', 'chingri', 'koi', 'singhi', 'magur', 'pangas', 'carp', 'fish', 'mach', 'machli', 'maach', 'macha', 'মাছ', 'मछली', 'ମାଛ'];
        const feedKeywords = ['feed', 'food', 'khabar', 'dana', 'pellet', 'khol', 'khadya', 'খাবার', 'चारा', 'ଖାଦ୍ୟ'];
        const medKeywords = ['medicine', 'med', 'drug', 'dawa', 'dawai', 'aushadh', 'lime', 'chuna', 'ওষুধ', 'दवा', 'ଔଷଧ'];
        const equipKeywords = ['equipment', 'aerator', 'pump', 'net', 'jaal', 'yantra', 'যন্ত্রপাতি', 'উপকরণ', 'ଉପକରଣ'];
        const seedKeywords = ['spawn', 'fingerling', 'seed', 'pona', 'dani', 'chara', 'bija', 'beej', 'পোনা', 'बीज', 'ପୋନା'];

        if (seedKeywords.some(k => norm.includes(k))) result.category = norm.includes('spawn') ? 'Spawn' : 'Fingerling';
        else if (feedKeywords.some(k => norm.includes(k))) result.category = 'Feed';
        else if (medKeywords.some(k => norm.includes(k))) result.category = 'Medicine';
        else if (equipKeywords.some(k => norm.includes(k))) result.category = 'Equipment';
        else if (fishKeywords.some(k => norm.includes(k))) result.category = 'Fish';
        else if (activeField === 'category') result.category = 'Fish';
    }

    // 3. PHONE NUMBER EXTRACTION
    const phoneMatch = normAscii.match(/(?:\+91[\s-]?)?([6-9]\d{9})/);
    if (phoneMatch) {
        result.phoneNumber = phoneMatch[1];
    } else if (!result.phoneNumber && activeField === 'phoneNumber') {
        const digitsOnly = normAscii.replace(/\D/g, '');
        if (digitsOnly.length >= 10) result.phoneNumber = digitsOnly.slice(-10);
    }

    // 4. PRICE / BUDGET EXTRACTION
    const priceMatch = normAscii.match(/(?:rs\.?|₹|taka|inr|price|budget|rate|mullo|dam|টাকা|রুপये|ଟଙ୍କା|মূল্য|দাম)\s*[:=]?\s*(\d+(?:\.\d+)?)/) ||
                       normAscii.match(/(\d+(?:\.\d+)?)\s*(?:rs|taka|inr|\/kg|per kg|rupees|টাকা|রুপয়ে|ଟଙ୍କା|প্রতি|কেজি)/) ||
                       normAscii.match(/^(\d+(?:\.\d+)?)$/);
    if (priceMatch) {
        result.price = priceMatch[1];
    } else if (!result.price) {
        const standaloneNum = normAscii.match(/(\d+(?:\.\d+)?)/);
        if (standaloneNum && (activeField === 'price' || norm.includes('টাকা') || norm.includes('মূল্য') || norm.includes('দাম'))) {
            result.price = standaloneNum[1];
        }
    }

    // 5. QUANTITY AND UNIT EXTRACTION
    const qtyMatch = normAscii.match(/(\d+(?:\.\d+)?)\s*(kg|kilo|kilogram|gm|gram|piece|pcs|pc|mound|ton|tons|bag|bags|quintal|কেজি|গ্রাম|পিস|টন|বস্তা)/);
    if (qtyMatch) {
        result.quantity = qtyMatch[1];
        let unitRaw = qtyMatch[2];
        if (['kg', 'kilo', 'kilogram', 'কেজি'].includes(unitRaw)) result.unit = 'kg';
        else if (['gm', 'gram', 'গ্রাম'].includes(unitRaw)) result.unit = 'gm';
        else if (['piece', 'pcs', 'pc', 'পিস'].includes(unitRaw)) result.unit = 'piece';
        else if (['mound'].includes(unitRaw)) result.unit = 'mound';
        else if (['ton', 'tons', 'টন'].includes(unitRaw)) result.unit = 'ton';
        else result.unit = 'kg';
    } else if (!result.quantity) {
        const standaloneNum = normAscii.match(/(\d+(?:\.\d+)?)/);
        if (standaloneNum && activeField === 'quantity') {
            result.quantity = standaloneNum[1];
        }
    }

    // 6. LOCATION EXTRACTION (State, District, Police Station)
    // Check states
    for (const state of ALL_STATES) {
        if (norm.includes(normalize(state))) {
            result.district = state; // State field is mapped to `district` in the form schema
            break;
        }
    }

    // Check local districts
    for (const [state, districts] of Object.entries(stateDistricts)) {
        for (const dist of districts) {
            if (norm.includes(normalize(dist))) {
                result.localDistrict = dist;
                if (!result.district) {
                    result.district = state;
                }
                break;
            }
        }
    }

    // Check police stations if district is known
    if (result.localDistrict) {
        const psList = getPoliceStations(result.localDistrict);
        for (const ps of psList) {
            if (norm.includes(normalize(ps))) {
                result.policeStation = ps;
                break;
            }
        }
    }

    // 7. PRODUCT NAME EXTRACTION
    if (!result.productName) {
        // Clean out noise words
        let cleaned = norm
            .replace(/(?:i want to|want to|need to|looking to|please|sell|buy|buying|selling|listing|post|require|requirement|in|at|for|price|rate|budget|rs|taka|rupees|kg|kilo|ton|piece|pcs|bags|dist|district|police station|call|phone|mobile|\d+)/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (cleaned.length > 2) {
            // Capitalize each word
            result.productName = cleaned.split(' ')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');
        }
    }

    // 8. GENERATE TITLE AND DESCRIPTION IF FEASIBLE
    if (result.productName || result.category) {
        const catLabel = result.category || 'Product';
        const pName = result.productName || catLabel;
        const qStr = result.quantity ? `${result.quantity} ${result.unit}` : '';
        const prStr = result.price ? `₹${result.price}` : '';
        const locStr = result.localDistrict ? `in ${result.localDistrict}` : '';

        if (!result.title) {
            if (result.actionType === 'buying') {
                result.title = `Urgent Requirement: ${pName} ${qStr}`.trim();
            } else {
                result.title = `${pName} ${qStr} Available ${locStr}`.trim();
            }
        }

        if (!result.description) {
            const verb = result.actionType === 'buying' ? 'Looking to purchase' : 'High quality';
            result.description = `${verb} ${pName}. ${qStr ? `Quantity: ${qStr}.` : ''} ${prStr ? `Price/Budget: ${prStr}.` : ''} Location: ${result.localDistrict || ''} ${result.district || ''}. Contact: ${result.phoneNumber || ''}.`.trim();
        }
    }

    return generateNextState(result, user);
}

    // Correction Intent Check (if user says "change price to 200", "district is Tamluk", "make quantity 600")
    const isCorrection = /(?:change|correct|update|instead|fix|make|set|paltao|bodlao|badlo|noy|paltao|bodla|নয়|পাল্টাও|বদল|পরিবর্তন|দাম|মূল্য|জেলা|থানা|পরিমাণ)/i.test(norm);

    if (isCorrection) {
        // If price is mentioned in correction
        const priceMatchCorrection = normAscii.match(/(?:price|budget|rate|dam|mullo|dam|টাকা|মূল্য|দাম)\s*[:=]?\s*(\d+(?:\.\d+)?)/) ||
                               normAscii.match(/(\d+(?:\.\d+)?)\s*(?:rs|taka|inr|\/kg|per kg|rupees|টাকা|রুপয়ে|টাকা)/);
        if (priceMatchCorrection) result.price = priceMatchCorrection[1];

        // If qty is mentioned in correction
        const qtyMatchCorrection = normAscii.match(/(\d+(?:\.\d+)?)\s*(kg|kilo|kilogram|gm|gram|piece|pcs|pc|mound|ton|tons|bag|bags|quintal|কেজি|গ্রাম|পিস|টন|বস্তা)/);
        if (qtyMatchCorrection) result.quantity = qtyMatchCorrection[1];

        // If phone is mentioned in correction
        const phoneMatchCorrection = normAscii.match(/(?:\+91[\s-]?)?([6-9]\d{9})/);
        if (phoneMatchCorrection) result.phoneNumber = phoneMatchCorrection[1];
    }

    return generateNextState(result, user, isCorrection);
}

// All 10 guided listing fields
const GUIDED_FIELDS = [
    'actionType',
    'category',
    'productName',
    'quantity',
    'price',
    'district',
    'localDistrict',
    'policeStation',
    'phoneNumber',
    'description',
];

/**
 * Determine completeness and generate review-first guidance message (No interrupting questions)
 */
function generateNextState(result, user, isCorrection = false) {
    const missing = [];

    if (!result.actionType) missing.push('actionType');
    if (!result.category) missing.push('category');
    if (!result.productName) missing.push('productName');
    if (!result.quantity) missing.push('quantity');
    if (!result.price) missing.push(result.actionType === 'buying' ? 'buyingPrice' : 'price');
    if (!result.district) missing.push('district');
    if (!result.localDistrict) missing.push('localDistrict');
    if (!result.policeStation) missing.push('policeStation');
    if (!result.phoneNumber) missing.push('phoneNumber');
    if (!result.description) missing.push('description');

    result.missingFields = missing;
    // Consider ready if core fields (productName, price, category) are set
    result.isComplete = !!(result.productName && result.price && result.actionType);

    const totalSteps = GUIDED_FIELDS.length;
    const completedSteps = GUIDED_FIELDS.filter(f => {
        if (f === 'actionType') return !!result.actionType;
        if (f === 'category') return !!result.category;
        if (f === 'productName') return !!result.productName;
        if (f === 'quantity') return !!result.quantity;
        if (f === 'price') return !!result.price;
        if (f === 'district') return !!result.district;
        if (f === 'localDistrict') return !!result.localDistrict;
        if (f === 'policeStation') return !!result.policeStation;
        if (f === 'phoneNumber') return !!result.phoneNumber;
        if (f === 'description') return !!result.description;
        return false;
    }).length;

    result.currentStep = completedSteps;
    result.totalSteps = totalSteps;

    if (isCorrection) {
        result.nextQuestion = "✅ Got it! I've updated your listing details on the preview card. Please review and tap **Create Listing Now** to publish!";
    } else if (result.isComplete) {
        result.nextQuestion = "📋 I've drafted your listing preview card! Please review the details on screen. If you'd like to make any changes, speak again or tap the mic. Tap **Create Listing Now** to publish!";
    } else {
        result.nextQuestion = "📋 Details extracted into your listing card! Please review on screen. You can tap the mic to add any missing fields or speak corrections.";
    }

    return result;
}
