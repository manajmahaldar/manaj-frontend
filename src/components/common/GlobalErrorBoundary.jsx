import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center space-y-6 border border-gray-100">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto">
                            <AlertTriangle size={40} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-gray-900">Something went wrong</h2>
                            <p className="text-gray-500 font-medium">We encountered an unexpected error. Don't worry, it's not your fault.</p>
                        </div>
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                        >
                            <RefreshCw size={20} />
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
