import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Contact = () => {
    const { t, formatDigit } = useLanguage();

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(t.successAlert);
    };

    return (
        <div className="pb-16 bg-surface-1 min-h-screen">
            {/* Header */}
            <div className="bg-primary text-white py-14 px-4 text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">{t.contactUs}</h1>
                <p className="max-w-xl mx-auto text-sm md:text-base text-white/80 font-medium leading-relaxed">
                    {t.contactDescMain}
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="card p-6 space-y-6">
                            <h3 className="text-xl font-bold text-text-primary border-b border-border pb-3">{t.contactInfo}</h3>

                            <div className="flex items-start gap-3.5 group">
                                <div className="w-10 h-10 rounded-lg bg-primary-muted text-primary flex items-center justify-center shrink-0 shadow-xs">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-2xs font-semibold text-text-tertiary uppercase mb-0.5">{t.callUs}</p>
                                    <p className="text-base font-bold text-text-primary">{formatDigit('+91 7432879256')}</p>
                                    <p className="text-xs text-text-secondary font-medium">{t.officeHours}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5 group">
                                <div className="w-10 h-10 rounded-lg bg-secondary-muted text-secondary flex items-center justify-center shrink-0 shadow-xs">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-2xs font-semibold text-text-tertiary uppercase mb-0.5">{t.emailUs}</p>
                                    <p className="text-base font-bold text-text-primary">support@monaj.com</p>
                                    <p className="text-xs text-text-secondary font-medium">{t.support247}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5 group">
                                <div className="w-10 h-10 rounded-lg bg-surface-2 text-text-primary flex items-center justify-center shrink-0 shadow-xs">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-2xs font-semibold text-text-tertiary uppercase mb-0.5">{t.officeAddress}</p>
                                    <p className="text-base font-bold text-text-primary leading-tight">{t.kolkataAddress}</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="card p-6 bg-text-primary text-white space-y-3">
                            <h4 className="text-base font-bold mb-2">{t.followUs}</h4>
                            <div className="flex gap-2">
                                {['FB', 'WA', 'YT'].map(s => (
                                    <div key={s} className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold hover:bg-primary transition-colors cursor-pointer">
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="card p-6 md:p-8 space-y-6">
                            <h3 className="text-2xl font-bold text-text-primary">{t.sendMessage}</h3>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="form-label">{t.yourName}</label>
                                    <input
                                        type="text"
                                        required
                                        className="form-input"
                                        placeholder={t.namePlaceholder}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="form-label">{t.yourPhone}</label>
                                    <input
                                        type="tel"
                                        required
                                        className="form-input"
                                        placeholder={formatDigit('+91 ...')}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="form-label">{t.message}</label>
                                    <textarea
                                        required
                                        rows="4"
                                        className="form-input"
                                        placeholder={t.writeMessage}
                                    />
                                </div>
                                <div className="md:col-span-2 pt-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg w-full md:w-auto group gap-2"
                                    >
                                        {t.sendBtn}
                                        <Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
