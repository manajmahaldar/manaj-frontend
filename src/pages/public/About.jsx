import { useState, useEffect } from 'react';
import { ShieldCheck, Users, Handshake, TrendingUp, Target, Globe, Phone, Mail, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const About = () => {
    const { t, formatDigit, language } = useLanguage();
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
        <div className="pb-20 bg-gray-50/30">
            {/* 1. Hero Section */}
            <section className="relative bg-gray-900 text-white py-32 md:py-48 px-4 overflow-hidden">
                {/* Background Carousel */}
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            currentImage === idx ? 'opacity-40' : 'opacity-0'
                        }`}
                        style={{
                            backgroundImage: `url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-950/40 to-gray-900/60"></div>
                    </div>
                ))}
                
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-xs font-bold uppercase tracking-widest animate-fade-in">
                        {t.aboutOurPlatform}
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                        {t.connectingTitle.split(',')[0]} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                            {t.connectingTitle.split(',').slice(1).join(',')}
                        </span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-blue-100 font-medium leading-relaxed opacity-90">
                        {t.aboutHeroDesc}
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 mt-12 relative z-20 space-y-24">
                {/* 2. Who We Are */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                            <Users size={32} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">{t.whoWeAre}</h2>
                        <p className="text-lg text-gray-600 leading-relaxed font-medium">
                            {t.whoWeAreDesc}
                        </p>
                        <div className="flex gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl flex-1">
                                <p className="text-2xl font-black text-blue-600 italic">{t.easy}</p>
                                <p className="text-sm font-bold text-gray-400 uppercase">{t.trading}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl flex-1">
                                <p className="text-2xl font-black text-green-600 italic">{t.rural}</p>
                                <p className="text-sm font-bold text-gray-400 uppercase">{t.focused}</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full"></div>
                        <div className="relative bg-gray-50 rounded-[2.5rem] p-12 border border-gray-100">
                            <div className="text-7xl font-black text-blue-600/10 italic select-none">{t.trust}</div>
                            <div className="mt-8 space-y-4">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <ShieldCheck className="text-green-500" />
                                    {t.transparencyFirst}
                                </h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    {t.transparencyDesc}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Our Mission & 6. Our Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-12 rounded-[3rem] text-white space-y-6 shadow-xl shadow-blue-600/20">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Target size={28} />
                        </div>
                        <h2 className="text-3xl font-black">{t.ourMission}</h2>
                        <p className="text-lg text-blue-50 leading-relaxed font-medium">
                            {t.missionDesc}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900 to-black p-12 rounded-[3rem] text-white space-y-6 shadow-xl shadow-gray-900/20">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                            <TrendingUp size={28} />
                        </div>
                        <h2 className="text-3xl font-black">{t.ourVision}</h2>
                        <p className="text-lg text-gray-300 leading-relaxed font-medium">
                            {t.visionDesc}
                        </p>
                    </div>
                </div>

                {/* 4. What We Offer */}
                <section className="space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t.whatWeOffer}</h2>
                        <p className="text-gray-500 font-medium max-w-xl mx-auto">
                            {t.offerDesc}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: t.farmerDirectSales, desc: t.farmerDirectDesc, icon: <Users /> },
                            { title: t.supplyMarketplace, desc: t.supplyMarketDesc, icon: <Handshake /> },
                            { title: t.buyingDemands, desc: t.buyingDemandsDesc, icon: <Target /> },
                            { title: t.oneClickContact, desc: t.oneClickContactDesc, icon: <Phone /> },
                            { title: t.verifiedTrust, desc: t.verifiedTrustDesc, icon: <ShieldCheck /> },
                            { title: t.growthTools, desc: t.growthToolsDesc, icon: <TrendingUp /> },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-blue-200 transition-all hover:shadow-xl hover:-translate-y-1 group">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Why This Platform? */}
                <section className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black leading-tight">{t.whyThisPlatform}</h2>
                            <p className="text-xl text-blue-100 leading-relaxed font-medium">
                                {t.whyPlatformDesc}
                            </p>
                            <ul className="space-y-4">
                                {[
                                    t.noCommissions,
                                    t.realTimePrices,
                                    t.directNegotiation,
                                    t.transparentProfiles
                                ].map((step, i) => (
                                    <li key={i} className="flex items-center gap-3 font-bold">
                                        <CheckCircle2 className="text-blue-300" size={24} />
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-12 border border-white/20">
                            <div className="space-y-6">
                                <div className="p-6 bg-white rounded-2xl text-blue-600 text-center">
                                    <p className="text-4xl font-black">{t.zeroPercent}</p>
                                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400">{t.commissionFee}</p>
                                </div>
                                <p className="text-center font-medium opacity-80 leading-relaxed">
                                    {t.missionProfitDesc}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. Local Focus */}
                <section className="flex flex-col items-center text-center space-y-8 py-10">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 animate-pulse">
                        <Globe size={40} />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">{t.localFocus}</h2>
                        <p className="text-xl text-gray-600 font-medium max-w-2xl leading-relaxed">
                            {t.localFocusDesc}
                        </p>
                    </div>
                </section>

                {/* 8. Contact Section */}
                <section id="contact" className="bg-white rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-2xl shadow-gray-200/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-black text-gray-900">{t.getInTouch}</h2>
                            <p className="text-lg text-gray-500 font-medium leading-relaxed">
                                {t.contactDesc}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group transition-all hover:bg-blue-50">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm transition-transform group-hover:scale-110">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">{t.phoneNumber}</p>
                                        <p className="text-lg font-bold text-gray-900">{formatDigit('+91 9593013549')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group transition-all hover:bg-green-50">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm transition-transform group-hover:scale-110">
                                        <MessageCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">{t.whatsapp}</p>
                                        <p className="text-lg font-bold text-gray-900">{formatDigit('+91 9593013549')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group transition-all hover:bg-purple-50">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm transition-transform group-hover:scale-110">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">{t.emailAddress}</p>
                                        <p className="text-lg font-bold text-gray-900">support@monaj.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center space-y-8">
                            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-blue-600">
                                <MessageCircle size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">{t.startJourney}</h3>
                            <button className="w-full flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20 group">
                                {t.messageNow}
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
