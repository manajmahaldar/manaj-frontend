import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, ShoppingBag, User, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useContext(AuthContext);

  const navItems = [
    { name: t.navHome || t.home || 'Home', path: '/', icon: Home },
    { name: t.navListings || 'Listings', path: '/listings', icon: ShoppingBag },
    { name: t.navAdd || 'Add', path: '/profile/listings', icon: Plus, isProminent: true },
    { name: t.navBuyers || 'Buyers', path: '/posts', icon: ShoppingCart },
    { name: t.navProfile || 'Profile', path: '/profile/settings', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 pb-safe">
      <div className="flex items-center justify-around h-16 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.isProminent) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center justify-center flex-1 h-full"
                title={item.name}
              >
                <div className="bg-primary text-white rounded-xl p-2.5 shadow-md shadow-primary/30 transition-transform active:scale-95 flex items-center justify-center">
                  <Icon size={24} className="stroke-[2.5]" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
                }`}
              title={item.name}
            >
              <Icon size={22} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'} />
              <span className="text-[10px] mt-1 font-medium leading-none text-center truncate w-full px-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
