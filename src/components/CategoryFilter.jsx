import React from 'react';
import { Home, Smartphone, ShoppingBag, Shirt, Dumbbell } from 'lucide-react';

const categories = [
  { name: 'All', icon: Home },
  { name: 'Electronics', icon: Smartphone },
  { name: 'Fashion', icon: Shirt },
  { name: 'Home', icon: ShoppingBag },
  { name: 'Sports', icon: Dumbbell },
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
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
          {name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;