import React from 'react';
import { Home, Smartphone, ShoppingBag, Shirt, Dumbbell } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const categories = [
  { name: 'all', icon: Home },
  { name: 'electronics', icon: Smartphone },
  { name: 'fashion', icon: Shirt },
  { name: 'home', icon: ShoppingBag },
  { name: 'sports', icon: Dumbbell },
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  const { translations } = useLanguage();

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {categories.map(({ name, icon: Icon }) => (
        <button
          key={name}
          onClick={() => onSelectCategory(name)}
          className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 ${
            selectedCategory === name
              ? 'bg-indigo-500 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900'
          }`}
        >
          <Icon size={18} className="mr-2" />
          {translations[name]}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;