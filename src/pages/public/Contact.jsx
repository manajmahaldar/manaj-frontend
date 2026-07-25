import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Contact = () => {
    const { t, formatDigit, language } = useLanguage();


    const handleSubmit = (e) => {
        e.preventDefault();
        alert(t.successAlert);
    };

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="bg-primary text-white py-20 px-4 text-center">
                <h1 className="text-4xl font-black mb-4 uppercase tracking-tight">{t.contactUs}</h1>
                <p className="max-w-2xl mx-auto text-lg opacity-90 font-medium">
                    {t.contactDescMain}
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 space-y-8">
                            <h3 className="text-2xl font-black text-gray-900 border-b border-gray-50 pb-4">{t.contactInfo}</h3>

                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.callUs}</p>
                                    <p className="text-lg font-black text-gray-900">{formatDigit('+91 7432879256')}</p>
                                    <p className="text-sm text-gray-500 font-medium">{t.officeHours}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.emailUs}</p>
                                    <p className="text-lg font-black text-gray-900">support@monaj.com</p>
                                    <p className="text-sm text-gray-500 font-medium">{t.support247}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.officeAddress}</p>
                                    <p className="text-lg font-black text-gray-900 leading-tight">{t.kolkataAddress}</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links Placeholder */}
                        <div className="bg-gray-900 p-8 rounded-[2rem] shadow-xl text-white">
                            <h4 className="text-xl font-black mb-4">{t.followUs}</h4>
                            <div className="flex gap-4">
                                {['FB', 'WA', 'YT'].map(s => (
                                    <div key={s} className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-bold hover:bg-blue-600 transition-colors cursor-pointer">
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl border border-gray-100">
                            <h3 className="text-3xl font-black text-gray-900 mb-8">{t.sendMessage}</h3>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">{t.yourName}</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none font-bold text-gray-900 transition-all"
                                        placeholder={t.namePlaceholder}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">{t.yourPhone}</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none font-bold text-gray-900 transition-all"
                                        placeholder={formatDigit('+91 ...')}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">{t.message}</label>
                                    <textarea
                                        required
                                        rows="5"
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none font-bold text-gray-900 transition-all"
                                        placeholder={t.writeMessage}
                                    ></textarea>
                                </div>
                                <div className="md:col-span-2 pt-4">
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20 group"
                                    >
                                        {t.sendBtn}
                                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
