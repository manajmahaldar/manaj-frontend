import { useLanguage } from '../../context/LanguageContext';

const Terms = () => {
    const { t, formatDigit, language } = useLanguage();


    return (
        <div className="pb-20">
            {/* Header */}
            <div className="bg-primary text-white py-20 px-4 text-center">
                <h1 className="text-4xl font-black mb-4 uppercase tracking-tight">{t.termsConditions}</h1>
                <p className="max-w-2xl mx-auto text-lg opacity-90 font-medium">
                    {t.termsHeroDesc}
                </p>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-16 space-y-12">
                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-gray-900 border-l-4 border-blue-600 pl-4">{t.userAccount}</h2>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        {t.userAccountDesc}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-gray-900 border-l-4 border-blue-600 pl-4">{t.listingAd}</h2>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        {t.listingAdDesc}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-gray-900 border-l-4 border-blue-600 pl-4">{t.transactionPayment}</h2>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        {t.transactionPaymentDesc}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-gray-900 border-l-4 border-blue-600 pl-4">{t.usageLimits}</h2>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        {t.usageLimitsDesc}
                    </p>
                </section>

                <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 italic text-gray-500 text-sm">
                    {formatDigit(t.termsLastUpdated)}
                </div>
            </div>
        </div>
    );
};

export default Terms;
