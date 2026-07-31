import { ShieldCheck, Zap, BadgeCheck, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useMemo, memo } from 'react';

const WhyChooseUs = memo(() => {
    const { t } = useLanguage();

    const features = useMemo(() => [
        {
            icon: <ShieldCheck size={28} />,
            title: t.featNoCommTitle,
            desc:  t.featNoCommDesc,
        },
        {
            icon: <Phone size={28} />,
            title: t.featDirectTitle,
            desc:  t.featDirectDesc,
        },
        {
            icon: <BadgeCheck size={28} />,
            title: t.featVerifiedTitle,
            desc:  t.featVerifiedDesc,
        },
        {
            icon: <Zap size={28} />,
            title: t.featFastTitle,
            desc:  t.featFastDesc,
        },
    ], [t.featNoCommTitle, t.featNoCommDesc, t.featDirectTitle, t.featDirectDesc, t.featVerifiedTitle, t.featVerifiedDesc, t.featFastTitle, t.featFastDesc]);

    return (
        <section className="max-w-7xl mx-auto px-4 py-10 md:py-16">
            {/* Section header */}
            <div className="text-center mb-12 space-y-3">
                <div className="inline-flex items-center gap-1.5 section-eyebrow">
                    ✦ {t.whyChooseUsBadge}
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
                    Why{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        MatsyaLink
                    </span>
                    ?
                </h2>
                <p className="text-text-secondary font-medium text-lg max-w-xl mx-auto leading-relaxed">
                    {t.whyChooseUsSubtitle}
                </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feat, idx) => (
                    <div
                        key={idx}
                        className="card card-hover p-7 space-y-4 group"
                    >
                        {/* Icon */}
                        <div className="w-14 h-14 rounded-xl bg-primary-muted text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-200">
                            {feat.icon}
                        </div>

                        {/* Text */}
                        <div className="space-y-2">
                            <h3 className="text-base font-bold text-text-primary">{feat.title}</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
});

WhyChooseUs.displayName = 'WhyChooseUs';

export default WhyChooseUs;
