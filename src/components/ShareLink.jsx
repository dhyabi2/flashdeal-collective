import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const ShareLink = ({ dealId }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/deal/${dealId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      className={`flex items-center justify-center p-2 rounded-full transition-colors duration-200 ${
        copied ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      {copied ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Check size={18} />
        </motion.div>
      ) : (
        <Share2 size={18} />
      )}
    </motion.button>
  );
};

export default ShareLink;