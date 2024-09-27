import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.5,
        ease: "easeInOut",
      },
    }),
  };

  const appName = language === 'ar' ? 'ديسكاونت' : 'Discount';

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-10">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <motion.div 
          className={`text-2xl font-bold text-indigo-600 dark:text-indigo-400 ${language === 'ar' ? 'font-arabic' : ''}`}
        >
          {appName.split('').map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
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