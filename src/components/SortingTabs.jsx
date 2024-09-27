import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ThumbsUp, Sparkles } from 'lucide-react';

const SortingTabs = ({ activeSort, onSortChange }) => {
  const tabs = [
    { id: 'newest', icon: Sparkles, label: 'Newest' },
    { id: 'expiringSoon', icon: Clock, label: 'Expiring Soon' },
    { id: 'mostLiked', icon: ThumbsUp, label: 'Most Liked' },
  ];

  return (
    <div className="flex justify-center mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-full shadow-md p-1 flex">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeSort === tab.id
                ? 'bg-indigo-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => onSortChange(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SortingTabs;