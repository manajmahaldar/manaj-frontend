/**
 * Auto-Translation Engine for Learning Hub
 * Uses MyMemory Free Translation API (no API key needed, ~1000 req/day)
 * Caches results in localStorage for performance (7-day TTL)
 * Supports: English (en), Bengali (bn), Hindi (hi), Odia (or)
 */

const LANG_CODES = {
    en: 'en-GB',
    bn: 'bn-BD',
    hi: 'hi-IN',
    or: 'or-IN'
};

const CACHE_KEY_PREFIX = 'ml_trans_';
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─── Cache Helpers ────────────────────────────────────────────────────────────
const getCacheKey = (text, targetLang) => {
    const hash = text.slice(0, 50).replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 30);
    return `${CACHE_KEY_PREFIX}${targetLang}_${hash}`;
};

const readCache = (key) => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const { value, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp > CACHE_MAX_AGE_MS) {
            localStorage.removeItem(key);
            return null;
        }
        return value;
    } catch {
        return null;
    }
};

const writeCache = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify({ value, timestamp: Date.now() }));
    } catch {
        // Ignore storage quota errors
    }
};

// ─── Core Translation Function ────────────────────────────────────────────────
/**
 * Translate a single text string from English to target language.
 * Returns the original text if translation fails or times out.
 */
export const translateText = async (text, targetLang) => {
    if (!text || !text.trim()) return text;
    if (targetLang === 'en') return text;

    const cacheKey = getCacheKey(text, targetLang);
    const cached = readCache(cacheKey);
    if (cached) return cached;

    const fromCode = LANG_CODES['en'];
    const toCode = LANG_CODES[targetLang] || targetLang;

    try {
        // Strip HTML tags for the API call (MyMemory works with plain text)
        const plainText = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(plainText)}&langpair=${fromCode}|${toCode}`;
        
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 6000);
        
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        
        const json = await res.json();

        if (json?.responseStatus === 200 && json?.responseData?.translatedText) {
            const translated = json.responseData.translatedText;
            writeCache(cacheKey, translated);
            return translated;
        }
    } catch {
        // Network error, timeout, or API limit reached — silently return original
    }

    return text;
};

// ─── Batch Translation ────────────────────────────────────────────────────────
/**
 * Translate multiple strings at once using Promise.all.
 * Returns an array of translated strings in the same order.
 */
export const translateBatch = async (texts, targetLang) => {
    if (targetLang === 'en') return texts;
    const results = await Promise.all(
        texts.map(t => (t && t.trim()) ? translateText(t, targetLang) : Promise.resolve(t))
    );
    return results;
};

// ─── Smart Content Translator ─────────────────────────────────────────────────
/**
 * Translate title and description fields of a content object.
 * Uses API only for content not covered by the static dictionary.
 */
export const autoTranslateContent = async (content, targetLang) => {
    if (!content || targetLang === 'en') return content;

    const [title, description] = await translateBatch(
        [content.title || '', content.description || ''],
        targetLang
    );

    return {
        ...content,
        title: title || content.title,
        description: description || content.description
    };
};

/**
 * Translate a government scheme object fields.
 */
export const autoTranslateScheme = async (scheme, targetLang) => {
    if (!scheme || targetLang === 'en') return scheme;

    const [title, description, ministry, eligibility] = await translateBatch(
        [
            scheme.title || '',
            scheme.description || '',
            scheme.ministry || '',
            scheme.eligibility || ''
        ],
        targetLang
    );

    return {
        ...scheme,
        title: title || scheme.title,
        description: description || scheme.description,
        ministry: ministry || scheme.ministry,
        eligibility: eligibility || scheme.eligibility
    };
};

/**
 * Translate a single Q&A pair (question + answer).
 */
export const autoTranslateQA = async (question, answer, targetLang) => {
    if (targetLang === 'en') return { question, answer };

    const [translatedQ, translatedA] = await translateBatch(
        [question || '', answer || ''],
        targetLang
    );

    return {
        question: translatedQ || question,
        answer: translatedA || answer
    };
};

/**
 * Translate a section/part title.
 */
export const autoTranslatePartTitle = async (title, targetLang) => {
    if (!title || targetLang === 'en') return title;
    return translateText(title, targetLang);
};

export default translateText;
