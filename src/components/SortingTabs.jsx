import React from 'react';
import { Clock, ThumbsUp, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SortingTabs = ({ activeSort, onSortChange }) => {
  const { translations } = useLanguage();

  const sortOptions = [
    { id: 'newest', icon: Sparkles, label: translations.newest },
    { id: 'expiringSoon', icon: Clock, label: translations.expiringSoon },
    { id: 'mostLiked', icon: ThumbsUp, label: translations.mostLiked },
  ];

  return (
    <div className="flex justify-center space-x-2 mb-6">
      {sortOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => onSortChange(option.id)}
          className={`flex items-center px-4 py-2 rounded-full transition-colors duration-200 ${
            activeSort === option.id
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <option.icon className="w-5 h-5 mr-2" />
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SortingTabs;