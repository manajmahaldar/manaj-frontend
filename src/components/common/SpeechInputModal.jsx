/**
 * SpeechInputModal — A high-quality speech-to-text modal.
 *
 * Features:
 * - Live interim (real-time) transcript display while speaking
 * - Continuous mode: keeps listening across multiple sentences until manually stopped
 * - Editable transcript before accepting
 * - Confidence indicator
 * - Clear visual recording state (animated mic)
 * - Language-aware (en-IN / bn-BD / hi-IN)
 *
 * Usage:
 *   <SpeechInputModal
 *     isOpen={showSpeech}
 *     onClose={() => setShowSpeech(false)}
 *     onAccept={(text) => setValue(prev => prev ? prev + ' ' + text : text)}
 *     language="en"        // 'en' | 'bn' | 'hi'
 *     placeholder="Describe the reason..."
 *   />
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Check, X, Trash2, RotateCcw, Volume2 } from 'lucide-react';

const SpeechInputModal = ({ isOpen, onClose, onAccept, language = 'en', placeholder = 'Start speaking...' }) => {
    const [isListening, setIsListening] = useState(false);
    const [finalText, setFinalText] = useState('');
    const [interimText, setInterimText] = useState('');
    const [error, setError] = useState('');
    const [confidence, setConfidence] = useState(null);
    const recognitionRef = useRef(null);
    const finalTextRef = useRef(''); // keeps latest value without closure issues

    const langCode = language === 'bn' ? 'bn-BD' : language === 'hi' ? 'hi-IN' : 'en-IN';

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
        setInterimText('');
    }, []);

    const startListening = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Speech recognition is not supported in this browser. Please use Google Chrome.');
            return;
        }

        setError('');
        const recognition = new SpeechRecognition();
        recognition.lang = langCode;
        recognition.continuous = true;         // ← keeps listening between pauses
        recognition.interimResults = true;     // ← shows live typing as you speak
        recognition.maxAlternatives = 3;       // ← considers multiple interpretations

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            let interim = '';
            let finalChunk = '';
            let bestConfidence = 0;

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                // Pick the best alternative by confidence
                let bestAlt = result[0];
                for (let j = 1; j < result.length; j++) {
                    if (result[j].confidence > bestAlt.confidence) {
                        bestAlt = result[j];
                    }
                }

                if (result.isFinal) {
                    finalChunk += bestAlt.transcript;
                    if (bestAlt.confidence > bestConfidence) {
                        bestConfidence = bestAlt.confidence;
                    }
                } else {
                    interim += bestAlt.transcript;
                }
            }

            if (finalChunk) {
                const newText = finalTextRef.current
                    ? finalTextRef.current + ' ' + finalChunk.trim()
                    : finalChunk.trim();
                finalTextRef.current = newText;
                setFinalText(newText);
                if (bestConfidence > 0) setConfidence(Math.round(bestConfidence * 100));
            }
            setInterimText(interim);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech') {
                setError('No speech detected. Please try again.');
            } else if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                setError('Microphone access denied. Please allow microphone access in your browser settings.');
            } else if (event.error === 'network') {
                setError('Network error. Check your internet connection.');
            } else {
                setError(`Error: ${event.error}. Please try again.`);
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            // If still supposed to be listening (user didn't manually stop), restart
            if (recognitionRef.current) {
                try {
                    recognition.start();
                } catch (e) {
                    setIsListening(false);
                }
            }
        };

        recognitionRef.current = recognition;
        recognition.start();
    }, [langCode]);

    // Clean up on close
    useEffect(() => {
        if (!isOpen) {
            stopListening();
            setFinalText('');
            setInterimText('');
            setError('');
            setConfidence(null);
            finalTextRef.current = '';
        }
    }, [isOpen, stopListening]);

    // Auto-start when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => startListening(), 300);
        }
    }, [isOpen]);

    const handleAccept = () => {
        const text = finalText.trim();
        if (text) {
            onAccept(text);
        }
        onClose();
    };

    const handleClear = () => {
        setFinalText('');
        setInterimText('');
        setConfidence(null);
        finalTextRef.current = '';
    };

    const handleEditChange = (e) => {
        setFinalText(e.target.value);
        finalTextRef.current = e.target.value;
    };

    if (!isOpen) return null;

    const displayText = finalText + (interimText ? (finalText ? ' ' : '') + interimText : '');

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) { stopListening(); onClose(); } }}
        >
            <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="px-7 pt-7 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                            isListening
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 animate-pulse'
                                : 'bg-gray-100 text-gray-500'
                        }`}>
                            {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                        </div>
                        <div>
                            <p className="font-black text-gray-900 text-base">Voice Input</p>
                            <p className="text-xs text-gray-400 font-medium">
                                {isListening ? '🔴 Recording — speak clearly' : 'Tap the mic to start'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => { stopListening(); onClose(); }}
                        className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Language tag */}
                <div className="px-7 pb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                        Language: {langCode}
                    </span>
                </div>

                {/* Transcript display + editable */}
                <div className="px-7 pb-4">
                    <div className="relative bg-gray-50 rounded-2xl border border-gray-200 min-h-[120px] overflow-hidden">
                        {/* Live waveform / pulsing dots while listening */}
                        {isListening && (
                            <div className="absolute top-3 right-3 flex items-center gap-1">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 bg-red-400 rounded-full animate-bounce"
                                        style={{
                                            height: `${10 + Math.random() * 14}px`,
                                            animationDelay: `${i * 0.15}s`,
                                            animationDuration: '0.8s'
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Editable confirmed text */}
                        <textarea
                            className="w-full p-4 bg-transparent outline-none text-gray-900 font-medium text-sm resize-none leading-relaxed"
                            rows={4}
                            value={finalText}
                            onChange={handleEditChange}
                            placeholder={displayText ? '' : (isListening ? 'Listening… start speaking now' : placeholder)}
                        />

                        {/* Live interim text overlay (grayed) */}
                        {interimText && (
                            <p className="px-4 pb-3 text-sm text-gray-400 font-medium italic leading-relaxed">
                                {interimText}
                            </p>
                        )}
                    </div>

                    {/* Confidence indicator */}
                    {confidence !== null && (
                        <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        confidence >= 80 ? 'bg-green-400' :
                                        confidence >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                                    }`}
                                    style={{ width: `${confidence}%` }}
                                />
                            </div>
                            <span className={`text-xs font-black ${
                                confidence >= 80 ? 'text-green-600' :
                                confidence >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>{confidence}% accurate</span>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="mt-3 flex items-start gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-2xl text-xs font-medium border border-red-100">
                            <span className="shrink-0 mt-0.5">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Tips */}
                <div className="px-7 pb-4">
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                        💡 <strong>Tips for better accuracy:</strong> Speak slowly and clearly. Pause briefly between sentences. Use Chrome browser for best results. Avoid background noise.
                    </p>
                </div>

                {/* Controls */}
                <div className="px-7 pb-7 flex flex-wrap gap-3">
                    {/* Mic toggle */}
                    <button
                        onClick={isListening ? stopListening : startListening}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all ${
                            isListening
                                ? 'bg-red-600 text-white shadow-lg shadow-red-500/30 hover:bg-red-700'
                                : 'bg-gray-900 text-white hover:bg-gray-700'
                        }`}
                    >
                        {isListening ? <><MicOff size={16} /> Stop</> : <><Mic size={16} /> Start</>}
                    </button>

                    {/* Clear */}
                    {(finalText || interimText) && (
                        <button
                            onClick={handleClear}
                            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-100 text-gray-600 font-black text-sm hover:bg-gray-200 transition-all"
                        >
                            <Trash2 size={16} /> Clear
                        </button>
                    )}

                    {/* Restart listening */}
                    {!isListening && !error && (
                        <button
                            onClick={() => { stopListening(); setTimeout(startListening, 100); }}
                            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-blue-50 text-blue-600 font-black text-sm hover:bg-blue-100 transition-all"
                        >
                            <RotateCcw size={16} /> Retry
                        </button>
                    )}

                    {/* Accept — right side */}
                    <button
                        onClick={handleAccept}
                        disabled={!finalText.trim()}
                        className={`ml-auto flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all ${
                            finalText.trim()
                                ? 'bg-green-600 text-white shadow-lg shadow-green-500/20 hover:bg-green-700'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <Check size={16} /> Use This Text
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpeechInputModal;
