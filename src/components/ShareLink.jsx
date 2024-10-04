import React from 'react';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ShareLink = ({ title, url, onShare }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url
        });
        onShare();
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(url);
      onShare();
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      className="flex items-center justify-center p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
      whileTap={{ scale: 0.95 }}
      aria-label="Share"
    >
      <Share2 size={18} />
    </motion.button>
  );
};

export default ShareLink;