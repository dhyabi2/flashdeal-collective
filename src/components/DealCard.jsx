import React, { useState, useEffect, useRef } from 'react';
import { ThumbsUp, ThumbsDown, Clock, MapPin, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateDeal } from '../utils/indexedDB';
import { getUserIP } from '../utils/ipUtils';
import ShareLink from './ShareLink';
import useSwipe from '../hooks/useSwipe';
import { playSoundEffect } from '../utils/soundEffects';

const DealCard = ({ deal, onUpdate }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [likes, setLikes] = useState(deal.likes || 0);
  const [dislikes, setDislikes] = useState(deal.dislikes || 0);
  const [progress, setProgress] = useState(100);
  const [userIP, setUserIP] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef(null);
  const swipeDirection = useSwipe(cardRef);

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

  useEffect(() => {
    if (swipeDirection) {
      setShowDetails(true);
      playSoundEffect('swipe');
    }
  }, [swipeDirection]);

  const handleVote = async (voteType) => {
    if (!userIP) return;

    try {
      const updatedDeal = await updateDeal(deal.id, { 
        [voteType]: deal[voteType] + 1,
        [`${voteType}IPs`]: [...(deal[`${voteType}IPs`] || []), userIP]
      });
      
      if (voteType === 'likes') {
        setLikes(updatedDeal.likes);
      } else {
        setDislikes(updatedDeal.dislikes);
      }
      
      onUpdate(updatedDeal);
      playSoundEffect('vote');
    } catch (error) {
      console.error(`Error updating ${voteType}:`, error);
    }
  };

  const canVote = (voteType) => {
    return !(deal[`${voteType}IPs`] || []).includes(userIP);
  };

  const shareUrl = `${window.location.origin}/deal/${deal.id}`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
    >
      <img src={deal.imageBase64} alt={deal.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 font-serif text-gray-800 dark:text-gray-200">{deal.title}</h2>
        <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">{deal.category}</div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">{timeLeft}</span>
          </div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
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
            className={`flex items-center ${
              canVote('likes') ? 'text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300' : 'text-gray-400 dark:text-gray-500'
            } transition-colors duration-200`}
            disabled={!canVote('likes')}
          >
            <ThumbsUp className="mr-1" size={18} />
            <motion.span
              key={likes}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {likes}
            </motion.span>
          </motion.button>
          <ShareLink title={deal.title} url={shareUrl} />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => canVote('dislikes') && handleVote('dislikes')}
            className={`flex items-center ${
              canVote('dislikes') ? 'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300' : 'text-gray-400 dark:text-gray-500'
            } transition-colors duration-200`}
            disabled={!canVote('dislikes')}
          >
            <ThumbsDown className="mr-1" size={18} />
            <motion.span
              key={dislikes}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {dislikes}
            </motion.span>
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-100 dark:bg-gray-700 p-4 rounded-b-lg"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">More Details</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">{deal.description}</p>
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
              <DollarSign className="w-4 h-4 mr-2" />
              <span>{deal.price}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{deal.location}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DealCard;