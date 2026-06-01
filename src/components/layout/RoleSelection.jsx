import { Sprout, Store, Search, ArrowRight, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const RoleSelection = () => {
    const { t, language } = useLanguage();
    
    const roles = [
        {
            title: t.roleSelection.farmer,
            desc: t.roleSelection.farmerDesc,
            icon: <Sprout size={40} />,
            color: 'text-white md:text-green-600',
            bgColor: 'bg-green-500 md:bg-green-100',
            link: '/register?role=farmer'
        },
        {
            title: t.roleSelection.seller,
            desc: t.roleSelection.sellerDesc,
            icon: <Store size={40} />,
            color: 'text-white md:text-blue-600',
            bgColor: 'bg-blue-500 md:bg-blue-100',
            link: '/register?role=seller'
        },
        {
            title: t.roleSelection.trader,
            desc: t.roleSelection.traderDesc,
            icon: <Search size={40} />,
            color: 'text-white md:text-orange-600',
            bgColor: 'bg-orange-500 md:bg-orange-100',
            link: '/register?role=trader'
        },
        {
            title: t.roleSelection.hatchery || t.hatchery,
            desc: t.roleSelection.hatcheryDesc || "Sell high-quality fish seed and spawn directly to farmers.",
            icon: <Droplets size={40} />,
            color: 'text-white md:text-teal-600',
            bgColor: 'bg-teal-500 md:bg-teal-100',
            link: '/register?role=hatchery'
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 py-4 md:py-8">
            <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                    {t.roleSelection.title.split(' ')[0]} {t.roleSelection.title.split(' ')[1]} <span className="text-blue-600">{t.roleSelection.title.split(' ').slice(2).join(' ')}</span>
                </h2>
                <p className="text-gray-600 font-medium">{t.roleSelection.subtitle}</p>
            </div>

            <div className="grid grid-cols-4 gap-2 md:gap-8 px-1 md:px-0">
                {roles.map((role, idx) => (
                    <Link key={idx} to={role.link} className="bg-transparent md:bg-white rounded-none md:rounded-[2.5rem] p-0 md:p-10 shadow-none md:shadow-xl border-none md:border md:border-gray-100 hover:border-blue-200 transition-all hover:scale-[1.02] group relative overflow-hidden text-center md:text-left flex flex-col items-center md:items-start cursor-pointer w-full">
                        {/* Decorative background element */}
                        <div className={`hidden md:block absolute -top-10 -right-10 w-32 h-32 ${role.bgColor} rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700`}></div>
                        
                        <div className={`${role.bgColor} ${role.color} w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-20 md:h-20 rounded-[14px] md:rounded-3xl flex items-center justify-center mb-1 md:mb-8 shadow-sm md:shadow-lg shadow-current/10 group-hover:rotate-6 transition-transform relative z-10 mx-auto md:-ml-2 md:mx-0`}>
                            <div className="scale-[0.55] sm:scale-75 md:scale-100 flex items-center justify-center">
                                {role.icon}
                            </div>
                        </div>
                        
                        <div className="relative z-10 w-full flex flex-col h-full items-center md:items-start">
                            <h3 className="text-[11px] sm:text-[13px] md:text-2xl font-medium md:font-bold text-gray-800 md:text-gray-900 mb-0 md:mb-6 text-center md:text-left leading-tight md:leading-normal w-full truncate md:whitespace-normal">{role.title}</h3>
                            
                            <p className="hidden md:block text-base text-gray-600 mb-10 leading-relaxed font-medium flex-grow">
                                {role.desc}
                            </p>

                            <div 
                                className={`hidden md:inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black transition-all ${role.bgColor} ${role.color} hover:shadow-xl hover:shadow-current/20 active:scale-95 group/btn mx-auto md:mx-0 w-fit mt-auto`}
                            >
                                {t.roleSelection.startNow}
                                <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RoleSelection;
