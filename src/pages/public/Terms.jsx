import React from 'react';
import { Scale, ShieldAlert, CheckCircle2, UserCheck, AlertTriangle, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Terms = () => {
    const { t } = useLanguage();

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-gray-900 to-blue-950 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
                        <Scale size={14} /> {t.termsPage?.badge || 'Legally Binding Agreement'}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t.termsPage?.title || 'Terms & Conditions'}</h1>
                    <p className="text-gray-300 text-sm font-medium">{t.termsPage?.version || 'Version 2.0.0 • Last Updated: January 1, 2026'}</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
                {/* Section 1 */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <UserCheck className="text-blue-600" size={20} /> {t.termsPage?.section1Title || '1. User Eligibility & Registration'}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {t.termsPage?.section1Desc || 'By creating an account on MatsyaLink, you represent that you are at least 18 years of age and legally competent under the Indian Contract Act, 1872. You agree to provide accurate, complete registration details and maintain the security of your credentials.'}
                    </p>
                </div>

                {/* Section 2 */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <Scale className="text-blue-600" size={20} /> {t.termsPage?.section2Title || '2. Marketplace & Role Responsibilities'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <h3 className="font-extrabold text-blue-900 text-sm mb-1">Fish Farmers & Hatcheries</h3>
                            <p className="text-gray-600 leading-relaxed">{t.termsPage?.farmersDesc || 'Must ensure accurate representation of fish species, seed size (lines per kg), health status, pricing, and upload authentic 10-second verification videos.'}</p>
                        </div>
                        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                            <h3 className="font-extrabold text-emerald-900 text-sm mb-1">Traders & Feed Sellers</h3>
                            <p className="text-gray-600 leading-relaxed">{t.termsPage?.tradersDesc || 'Must honor posted buying prices, verify quality upon pickup, and ensure feed/medicine complies with FSSAI & fisheries regulatory standards.'}</p>
                        </div>
                    </div>
                </div>

                {/* Section 3 */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="text-amber-500" size={20} /> {t.termsPage?.section3Title || '3. Prohibited Activities & Account Action'}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {t.termsPage?.section3Desc || 'Users are strictly prohibited from posting fraudulent listings, misrepresenting seed quality, engaging in price manipulation, or uploading illegal/unauthorized media. Violation will lead to immediate account suspension and referral to law enforcement under IT Act Section 66D.'}
                    </p>
                </div>

                {/* Section 4 */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <ShieldAlert className="text-blue-600" size={20} /> {t.termsPage?.section4Title || '4. Limitation of Liability & Dispute Resolution'}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {t.termsPage?.section4Desc || 'MatsyaLink provides a commission-free discovery marketplace connecting buyers and sellers directly. MatsyaLink shall not be liable for quality discrepancies during direct physical trades. All legal disputes are subject to the exclusive jurisdiction of the courts in West Bengal, India.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
