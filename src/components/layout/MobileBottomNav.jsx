import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, ShoppingBag, Package, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getDashboardPath } from '../../utils/roleUtils';

const MobileBottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useContext(AuthContext);

  const navItems = [
    { name: t.home, path: '/', icon: Home },
    { name: 'Listings', path: '/profile/listings', icon: ShoppingBag },
    { name: 'Orders', path: '/profile/orders', icon: Package },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex overflow-x-auto items-center justify-start h-16 px-4 gap-4 scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-shrink-0 w-16 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}
              title={item.name}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
              <span className="text-[10px] mt-1 font-medium leading-tight text-center">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
