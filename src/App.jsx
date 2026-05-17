import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ScrollToTopButton from './components/common/ScrollToTopButton';
import InstallPrompt from './components/common/InstallPrompt';
import NetworkStatus from './components/common/NetworkStatus';
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "613301631751-4m4t7be6u5cc37j651lco62j2p57564n.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <HelmetProvider>
        <GlobalErrorBoundary>
          <LanguageProvider>
            <AuthProvider>
              <Router>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen font-sans">
                  <Toaster position="top-center" />
                  <InstallPrompt />
                  <NetworkStatus />
                  <Navbar />
                  <main className="flex-grow">
                    <AppRoutes />
                  </main>
                  <ScrollToTopButton />
                  <Footer />
                </div>
              </Router>
            </AuthProvider>
          </LanguageProvider>
        </GlobalErrorBoundary>
      </HelmetProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
