import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BottomNav = () => {
  const location = useLocation();
  const { language, toggleLanguage, translations } = useLanguage();

  const navItems = [
    { path: '/', icon: Home, label: translations.home },
    { path: '/upload', icon: PlusCircle, label: translations.addDeal },
    { path: '#', icon: Globe, label: translations.changeLanguage, onClick: toggleLanguage },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, icon: Icon, label, onClick }) => (
          <React.Fragment key={path}>
            {onClick ? (
              <button
                onClick={onClick}
                className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label={label}
              >
                <Icon size={28} />
                <span className="sr-only">{label}</span>
              </button>
            ) : (
              <Link
                to={path}
                className={`p-2 rounded-full ${
                  location.pathname === path
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                } transition-colors duration-200`}
              >
                <Icon size={28} />
                <span className="sr-only">{label}</span>
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;