import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

const TopNav = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background border-b border-border z-10">
      <div className="container mx-auto px-4 py-2 flex justify-end">
        <div className="space-x-2 flex items-center">
          <button
            onClick={() => setTheme('light')}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Light mode"
          >
            <Sun size={20} />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Dark mode"
          >
            <Moon size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;