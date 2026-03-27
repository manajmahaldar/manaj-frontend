import { useLanguage } from '../../context/LanguageContext';

const PrivacyPolicy = () => {
    const { t, formatDigit, language } = useLanguage();


    return (
        <div className="pb-20">
            {/* Header */}
            <div className="bg-primary text-white py-20 px-4 text-center">
                <h1 className="text-4xl font-black mb-4 uppercase tracking-tight">{t.privacyPolicy}</h1>
                <p className="max-w-2xl mx-auto text-lg opacity-90 font-medium">
                    {t.privacyHeroDesc}
                </p>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-16 space-y-12">
                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-gray-900 border-l-4 border-blue-600 pl-4">{t.infoCollection}</h2>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        {t.infoCollectionDesc}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-gray-900 border-l-4 border-blue-600 pl-4">{t.infoUsage}</h2>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        {t.infoUsageDesc}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-gray-900 border-l-4 border-blue-600 pl-4">{t.security}</h2>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        {t.securityDesc}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-gray-900 border-l-4 border-blue-600 pl-4">{t.cookies}</h2>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        {t.cookiesDesc}
                    </p>
                </section>

                <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 italic text-gray-500 text-sm">
                    {formatDigit(t.lastUpdated)} <a href="/contact" className="text-blue-600 font-bold underline">{t.supportTeam}</a> {t.contactUsAbout}
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
