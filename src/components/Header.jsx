import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-10">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className={`text-2xl font-bold text-indigo-600 dark:text-indigo-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {language === 'ar' ? 'سوق السويق' : 'Souq Al-Suwaiq'}
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
        </button>
      </div>
    </header>
  );
};

export default Header;