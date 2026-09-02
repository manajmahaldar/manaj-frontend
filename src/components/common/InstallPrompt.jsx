import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            
            // Check if user has already dismissed it recently
            const hasDismissed = sessionStorage.getItem('installPromptDismissed');
            if (!hasDismissed) {
                // Show the custom prompt after a small delay
                setTimeout(() => setShowPrompt(true), 2000);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            setShowPrompt(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setShowPrompt(false);
        }
        
        // We no longer need the prompt. Clear it up
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Save to session storage so we don't nag them again in this session
        sessionStorage.setItem('installPromptDismissed', 'true');
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-[74px] md:bottom-6 left-3 right-20 md:left-6 md:right-auto md:w-96 z-40 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100/80 p-2.5 sm:p-3 md:p-4 relative overflow-hidden flex items-center justify-between gap-2 sm:gap-3">
                {/* Subtle gradient glow decoration */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-400/10 rounded-full blur-xl pointer-events-none" />

                {/* Left: App Icon */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
                        <Download size={20} className="stroke-[2.5]" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-gray-900 truncate">
                                {t.installMatsyalink || 'Install Matsyalink'}
                            </h4>
                            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                                App
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                            {t.installPromptSub || 'Add app to home screen for fast access'}
                        </p>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button 
                        onClick={handleInstallClick}
                        className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center gap-1.5"
                    >
                        <span>{t.install || 'Install'}</span>
                    </button>
                    
                    <button 
                        onClick={handleDismiss}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-xl transition-colors"
                        title="Dismiss"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;

