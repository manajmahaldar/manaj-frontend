import { ShieldCheck, Phone, BadgeCheck, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const WhyChooseUs = () => {
    const { t, language } = useLanguage();

    const features = [
        {
            icon: <ShieldCheck size={36} />,
            title: t.featNoCommTitle,
            desc: t.featNoCommDesc,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            ring: 'ring-green-100',
            gradient: 'from-green-500/10 to-transparent',
        },
        {
            icon: <Phone size={36} />,
            title: t.featDirectTitle,
            desc: t.featDirectDesc,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            ring: 'ring-blue-100',
            gradient: 'from-blue-500/10 to-transparent',
        },
        {
            icon: <BadgeCheck size={36} />,
            title: t.featVerifiedTitle,
            desc: t.featVerifiedDesc,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            ring: 'ring-purple-100',
            gradient: 'from-purple-500/10 to-transparent',
        },
        {
            icon: <Zap size={36} />,
            title: t.featFastTitle,
            desc: t.featFastDesc,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            ring: 'ring-orange-100',
            gradient: 'from-orange-500/10 to-transparent',
        },
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 py-8 md:py-16">
            {/* Header */}
            <div className="text-center mb-10 md:mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-widest">
                    ✦ {t.whyChooseUsBadge}
                </div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                        {language === 'hi' ? '' : language === 'bn' ? 'কেন ' : 'Why '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 px-2 lg:px-4">
                            Matsyalink
                        </span>
                        {language === 'hi' ? ' क्यों?' : '?'}
                    </h2>
                <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto leading-relaxed">
                    {t.whyChooseUsSubtitle}
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feat, idx) => (
                    <div
                        key={idx}
                        className={`relative bg-white rounded-[2.5rem] p-8 shadow-lg border ring-1 ${feat.ring} hover:shadow-2xl transition-all hover:scale-[1.03] group overflow-hidden text-center md:text-left flex flex-col items-center md:items-start`}
                    >
                        {/* Background gradient blob */}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${feat.gradient} rounded-full opacity-60 group-hover:scale-150 transition-transform duration-700`}></div>

                        {/* Icon */}
                        <div className={`relative z-10 ${feat.bgColor} ${feat.color} w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-6 transition-transform mx-auto md:mx-0`}>
                            {feat.icon}
                        </div>

                        {/* Text */}
                        <div className="relative z-10 space-y-3 w-full">
                            <h3 className="text-xl font-black text-gray-900">{feat.title}</h3>
                            <p className="text-gray-600 font-medium leading-relaxed text-sm">{feat.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhyChooseUs;
