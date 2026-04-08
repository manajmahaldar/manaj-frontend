import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ScrollToTopButton from './components/common/ScrollToTopButton';
import InstallPrompt from './components/common/InstallPrompt';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID_PLACEHOLDER";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen font-sans">
              <Toaster position="top-center" />
              <InstallPrompt />
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
    </GoogleOAuthProvider>
  );
}

export default App;
