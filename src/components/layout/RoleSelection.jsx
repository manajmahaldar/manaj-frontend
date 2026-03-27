import { Sprout, Store, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const RoleSelection = () => {
    const { t, language } = useLanguage();
    
    const roles = [
        {
            title: t.roleSelection.farmer,
            desc: t.roleSelection.farmerDesc,
            icon: <Sprout size={40} />,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            link: '/register?role=farmer'
        },
        {
            title: t.roleSelection.seller,
            desc: t.roleSelection.sellerDesc,
            icon: <Store size={40} />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            link: '/register?role=seller'
        },
        {
            title: t.roleSelection.trader,
            desc: t.roleSelection.traderDesc,
            icon: <Search size={40} />,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            link: '/register?role=trader'
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 py-6 md:py-12">
            <div className="text-center mb-8 md:mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                    {t.roleSelection.title.split(' ')[0]} {t.roleSelection.title.split(' ')[1]} <span className="text-blue-600">{t.roleSelection.title.split(' ').slice(2).join(' ')}</span>
                </h2>
                <p className="text-gray-600 font-medium">{t.roleSelection.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {roles.map((role, idx) => (
                    <div key={idx} className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 hover:border-blue-200 transition-all hover:scale-[1.02] group relative overflow-hidden text-center md:text-left flex flex-col items-center md:items-start">
                        {/* Decorative background element */}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 ${role.bgColor} rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700`}></div>
                        
                        <div className={`${role.bgColor} ${role.color} w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-current/10 group-hover:rotate-6 transition-transform relative z-10 md:-ml-2 mx-auto md:mx-0`}>
                            {role.icon}
                        </div>
                        
                        <div className="relative z-10 w-full">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">{role.title}</h3>
                            
                            <p className="text-gray-600 mb-10 leading-relaxed font-medium">
                                {role.desc}
                            </p>

                            <Link 
                                to={role.link}
                                className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all ${role.bgColor} ${role.color} hover:shadow-xl hover:shadow-current/20 active:scale-95 group/btn mx-auto md:mx-0 w-fit`}
                            >
                                {t.roleSelection.startNow}
                                <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RoleSelection;
