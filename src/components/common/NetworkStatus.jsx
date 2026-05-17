import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-80 bg-red-600 text-white p-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-4 animate-in slide-in-from-bottom-8">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <WifiOff size={20} />
            </div>
            <div>
                <p className="font-bold">You are offline</p>
                <p className="text-xs opacity-90">Please check your internet connection.</p>
            </div>
        </div>
    );
};

export default NetworkStatus;
