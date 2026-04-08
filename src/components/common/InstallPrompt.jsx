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
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-8 fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-4 md:p-6 overflow-hidden relative">
                {/* Decorative background */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full mix-blend-multiply opacity-70 blur-2xl"></div>
                
                <button 
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors z-10"
                >
                    <X size={18} />
                </button>

                <div className="flex items-start gap-4 relative z-10">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
                        <Download size={24} />
                    </div>
                    
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                            Install Matsyalink
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Add our app to your home screen for quick access and a better experience.
                        </p>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={handleInstallClick}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-bold shadow-md shadow-blue-600/20 transition-colors"
                            >
                                Install Now
                            </button>
                            <button 
                                onClick={handleDismiss}
                                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold border border-gray-200 transition-colors"
                            >
                                Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
