import { useState, useEffect } from 'react';
import { ShieldCheck, Users, Handshake, TrendingUp, Target, Globe, Phone, Mail, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const About = () => {
    const { t, formatDigit } = useLanguage();
    const [currentImage, setCurrentImage] = useState(0);
    const images = [
        '/about-hero-1.png',
        '/about-hero-2.png',
        '/about-hero-3.png'
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="pb-16 bg-surface-1">
            {/* 1. Hero Section */}
            <section className="relative bg-text-primary text-white py-12 md:py-24 px-4 overflow-hidden">
                {/* Background Carousel */}
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            currentImage === idx ? 'opacity-30' : 'opacity-0'
                        }`}
                        style={{
                            backgroundImage: `url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-text-primary/90 to-text-primary/70" />
                    </div>
                ))}
                
                <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4 px-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 text-white rounded-full text-xs font-semibold uppercase tracking-wider">
                        {t.aboutOurPlatform}
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                        {t.connectingTitle.split(',')[0]} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary-light">
                            {t.connectingTitle.split(',').slice(1).join(',')}
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-sm md:text-base text-white/70 font-medium leading-relaxed">
                        {t.aboutHeroDesc}
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 mt-8 space-y-12">
                {/* 2. Who We Are */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center card p-6 md:p-10">
                    <div className="space-y-4 text-center lg:text-left">
                        <div className="w-12 h-12 bg-primary-muted rounded-xl flex items-center justify-center text-primary mx-auto lg:mx-0">
                            <Users size={24} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">{t.whoWeAre}</h2>
                        <p className="text-base text-text-secondary leading-relaxed font-medium">
                            {t.whoWeAreDesc}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <div className="p-4 bg-surface-1 rounded-lg flex-1 text-center">
                                <p className="text-xl font-bold text-primary">{t.easy}</p>
                                <p className="text-xs font-semibold text-text-tertiary uppercase">{t.trading}</p>
                            </div>
                            <div className="p-4 bg-surface-1 rounded-lg flex-1 text-center">
                                <p className="text-xl font-bold text-secondary">{t.rural}</p>
                                <p className="text-xs font-semibold text-text-tertiary uppercase">{t.focused}</p>
                            </div>
                        </div>
                    </div>
                    <div className="card p-6 md:p-8 bg-surface-1 text-center lg:text-left space-y-4 border border-border">
                        <div className="text-5xl font-black text-text-tertiary/20 italic select-none">{t.trust}</div>
                        <h3 className="text-lg font-bold text-text-primary flex items-center justify-center lg:justify-start gap-2">
                            <ShieldCheck className="text-success" size={20} />
                            {t.transparencyFirst}
                        </h3>
                        <p className="text-text-secondary font-medium text-sm leading-relaxed">
                            {t.transparencyDesc}
                        </p>
                    </div>
                </section>

                {/* 3. Our Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-primary p-8 rounded-xl text-white space-y-4 shadow-sm">
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                            <Target size={24} />
                        </div>
                        <h2 className="text-2xl font-bold">{t.ourMission}</h2>
                        <p className="text-sm text-white/80 leading-relaxed font-medium">
                            {t.missionDesc}
                        </p>
                    </div>
                    <div className="bg-text-primary p-8 rounded-xl text-white space-y-4 shadow-sm">
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                            <TrendingUp size={24} />
                        </div>
                        <h2 className="text-2xl font-bold">{t.ourVision}</h2>
                        <p className="text-sm text-white/80 leading-relaxed font-medium">
                            {t.visionDesc}
                        </p>
                    </div>
                </div>

                {/* 4. What We Offer */}
                <section className="space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">{t.whatWeOffer}</h2>
                        <p className="text-text-secondary font-medium text-sm max-w-xl mx-auto">
                            {t.offerDesc}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            { title: t.farmerDirectSales, desc: t.farmerDirectDesc, icon: <Users size={20} /> },
                            { title: t.supplyMarketplace, desc: t.supplyMarketDesc, icon: <Handshake size={20} /> },
                            { title: t.buyingDemands, desc: t.buyingDemandsDesc, icon: <Target size={20} /> },
                            { title: t.oneClickContact, desc: t.oneClickContactDesc, icon: <Phone size={20} /> },
                            { title: t.verifiedTrust, desc: t.verifiedTrustDesc, icon: <ShieldCheck size={20} /> },
                            { title: t.growthTools, desc: t.growthToolsDesc, icon: <TrendingUp size={20} /> },
                        ].map((item, idx) => (
                            <div key={idx} className="card p-6 space-y-3 group hover:border-primary transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-surface-1 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="text-base font-bold text-text-primary">{item.title}</h3>
                                <p className="text-text-secondary text-xs leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Why This Platform? */}
                <section className="bg-primary rounded-xl p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6 text-center lg:text-left">
                            <h2 className="text-2xl md:text-4xl font-extrabold">{t.whyThisPlatform}</h2>
                            <p className="text-base text-white/80 leading-relaxed font-medium">
                                {t.whyPlatformDesc}
                            </p>
                            <ul className="space-y-3 inline-block lg:block text-left">
                                {[
                                    t.noCommissions,
                                    t.realTimePrices,
                                    t.directNegotiation,
                                    t.transparentProfiles
                                ].map((step, i) => (
                                    <li key={i} className="flex items-center gap-2.5 font-semibold text-sm">
                                        <CheckCircle2 className="text-secondary-light shrink-0" size={18} />
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center space-y-4">
                            <div className="p-4 bg-white rounded-lg text-primary">
                                <p className="text-3xl font-extrabold">{t.zeroPercent}</p>
                                <p className="text-2xs font-semibold uppercase text-text-tertiary">{t.commissionFee}</p>
                            </div>
                            <p className="text-sm font-medium opacity-90 leading-relaxed">
                                {t.missionProfitDesc}
                            </p>
                        </div>
                    </div>
                </section>

                {/* 7. Local Focus */}
                <section className="flex flex-col items-center text-center space-y-4 py-4">
                    <div className="w-14 h-14 bg-primary-muted rounded-full flex items-center justify-center text-primary">
                        <Globe size={28} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-text-primary">{t.localFocus}</h2>
                        <p className="text-base text-text-secondary font-medium max-w-xl leading-relaxed">
                            {t.localFocusDesc}
                        </p>
                    </div>
                </section>

                {/* 8. Contact Section */}
                <section id="contact" className="card p-6 md:p-10 border border-border">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6 text-center lg:text-left">
                            <h2 className="text-2xl font-bold text-text-primary">{t.getInTouch}</h2>
                            <p className="text-sm text-text-secondary font-medium leading-relaxed">
                                {t.contactDesc}
                            </p>
                            <div className="space-y-3 max-w-md mx-auto lg:mx-0">
                                <div className="flex items-center gap-3 p-3 bg-surface-1 rounded-lg">
                                    <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center text-primary shadow-xs">
                                        <Phone size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-2xs text-text-tertiary font-semibold uppercase">{t.phoneNumber}</p>
                                        <p className="text-sm font-bold text-text-primary">{formatDigit('+91 9593013549')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-surface-1 rounded-lg">
                                    <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center text-secondary shadow-xs">
                                        <MessageCircle size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-2xs text-text-tertiary font-semibold uppercase">{t.whatsapp}</p>
                                        <p className="text-sm font-bold text-text-primary">{formatDigit('+91 9593013549')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-surface-1 rounded-lg">
                                    <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center text-info shadow-xs">
                                        <Mail size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-2xs text-text-tertiary font-semibold uppercase">{t.emailAddress}</p>
                                        <p className="text-sm font-bold text-text-primary">support@monaj.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface-1 rounded-lg p-6 flex flex-col justify-center items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-white rounded-full shadow-xs flex items-center justify-center text-primary">
                                <MessageCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary">{t.startJourney}</h3>
                            <button className="btn btn-primary btn-md gap-2">
                                {t.messageNow}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
