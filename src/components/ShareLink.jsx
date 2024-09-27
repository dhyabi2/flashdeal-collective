import React from 'react';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ShareLink = ({ title, url }) => {
  const [shared, setShared] = React.useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      console.log('Web Share API not supported');
      // Fallback to copy to clipboard functionality
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      className={`flex items-center justify-center p-2 rounded-full transition-colors duration-200 ${
        shared ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      {shared ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          ✓
        </motion.div>
      ) : (
        <Share2 size={18} />
      )}
    </motion.button>
  );
};

export default ShareLink;