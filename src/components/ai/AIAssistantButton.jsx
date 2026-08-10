import { Bot, Sparkles, Mic } from 'lucide-react';

const AIAssistantButton = ({ onClick, variant = 'floating' }) => {
    if (variant === 'inline') {
        return (
            <button
                onClick={onClick}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all duration-200 active:scale-95 group"
            >
                <div className="relative">
                    <Bot size={18} className="group-hover:rotate-12 transition-transform duration-200" />
                    <Sparkles size={10} className="absolute -top-1 -right-1 text-amber-300 animate-pulse" />
                </div>
                <span>Create with AI</span>
                <Mic size={15} className="ml-0.5 text-emerald-200" />
            </button>
        );
    }

    // Default: Floating Action Button (FAB)
    return (
        <button
            onClick={onClick}
            type="button"
            className="fixed bottom-20 right-5 lg:bottom-8 lg:right-8 z-40 p-3.5 bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600 text-white rounded-full shadow-2xl shadow-emerald-600/40 transition-all duration-300 active:scale-90 group flex items-center gap-2 border.2 border-white/30 backdrop-blur-md"
            title="Launch AI Marketplace Assistant"
            aria-label="Launch AI Marketplace Assistant"
        >
            <div className="relative">
                <Bot size={26} className="group-hover:scale-110 transition-transform duration-200" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
            </div>
            <span className="hidden sm:inline-block font-bold text-xs pr-1 tracking-wide uppercase">
                AI Assistant
            </span>
        </button>
    );
};

export default AIAssistantButton;
