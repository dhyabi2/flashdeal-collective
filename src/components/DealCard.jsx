import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Clock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateDeal } from '../utils/api';
import { getUserIP } from '../utils/ipUtils';
import ShareLink from './ShareLink';
import { playSoundEffect } from '../utils/soundEffects';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const DealCard = ({ deal, onUpdate }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [likes, setLikes] = useState(deal.likes || 0);
  const [dislikes, setDislikes] = useState(deal.dislikes || 0);
  const [progress, setProgress] = useState(100);
  const [userIP, setUserIP] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const queryClient = useQueryClient();

  const updateDealMutation = useMutation({
    mutationFn: (updates) => updateDeal(deal.id, updates),
    onSuccess: (updatedDeal) => {
      queryClient.setQueryData(['deals'], old => 
        old.map(d => d.id === updatedDeal.id ? updatedDeal : d)
      );
      onUpdate(updatedDeal);
    },
  });

  useEffect(() => {
    const fetchUserIP = async () => {
      const ip = await getUserIP();
      setUserIP(ip);
    };
    fetchUserIP();

    const timer = setInterval(() => {
      const now = new Date();
      const expiration = new Date(deal.expiresAt);
      const difference = expiration - now;
      const totalDuration = expiration - new Date(deal.createdAt);

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        setProgress((difference / totalDuration) * 100);
      } else {
        setTimeLeft('Expired');
        setProgress(0);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deal.expiresAt, deal.createdAt]);

  const handleVote = async (voteType) => {
    if (!userIP) return;

    try {
      const updates = { 
        [voteType]: deal[voteType] + 1,
        [`${voteType}IPs`]: [...(deal[`${voteType}IPs`] || []), userIP]
      };
      updateDealMutation.mutate(updates);
      
      if (voteType === 'likes') {
        setLikes(deal.likes + 1);
      } else {
        setDislikes(deal.dislikes + 1);
      }
      
      playSoundEffect('vote');
    } catch (error) {
      console.error(`Error updating ${voteType}:`, error);
    }
  };

  const canVote = (voteType) => {
    return !(deal[`${voteType}IPs`] || []).includes(userIP);
  };

  const shareUrl = `${window.location.origin}/deal/${deal.id}`;

  const openInGoogleMaps = () => {
    if (deal.location) {
      const [lat, lng] = deal.location.split(',');
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
    >
      <img 
        src={deal.imageBase64} 
        alt={deal.title} 
        className="w-full h-48 object-cover" 
        loading="eager" 
        fetchpriority="high"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 font-serif text-gray-800 dark:text-gray-200">{deal.title}</h2>
        <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">{deal.category}</div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 bg-indigo-100 dark:bg-indigo-900 rounded-full px-4 py-2">
            <Clock className="w-6 h-6 text-indigo-500 dark:text-indigo-400" aria-hidden="true" />
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-300">{timeLeft}</span>
          </div>
          <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            {progress > 0 ? `${Math.round(progress)}% left` : 'Expired'}
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <motion.div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => canVote('likes') && handleVote('likes')}
            className={`flex items-center justify-center w-16 h-16 rounded-full ${
              canVote('likes') ? 'bg-green-100 text-green-500 hover:bg-green-200 dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-800' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
            } transition-colors duration-200`}
            disabled={!canVote('likes')}
            aria-label={`Like (${likes})`}
          >
            <div className="flex flex-col items-center">
              <ThumbsUp className="mb-1" size={24} aria-hidden="true" />
              <motion.span
                key={likes}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="text-sm font-bold"
              >
                {likes}
              </motion.span>
            </div>
          </motion.button>
          <ShareLink title={deal.title} url={shareUrl} />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => canVote('dislikes') && handleVote('dislikes')}
            className={`flex items-center justify-center w-16 h-16 rounded-full ${
              canVote('dislikes') ? 'bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
            } transition-colors duration-200`}
            disabled={!canVote('dislikes')}
            aria-label={`Dislike (${dislikes})`}
          >
            <div className="flex flex-col items-center">
              <ThumbsDown className="mb-1" size={24} aria-hidden="true" />
              <motion.span
                key={dislikes}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="text-sm font-bold"
              >
                {dislikes}
              </motion.span>
            </div>
          </motion.button>
        </div>
        {deal.location && (
          <button
            onClick={openInGoogleMaps}
            className="mt-2 bg-blue-500 text-white p-2 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
            aria-label="Open in Google Maps"
          >
            <MapPin className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default DealCard;