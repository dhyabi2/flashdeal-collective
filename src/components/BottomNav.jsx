import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/upload', icon: PlusCircle, label: 'Add Deal' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`p-2 rounded-full ${
              location.pathname === path
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors duration-200`}
          >
            <Icon size={28} />
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;