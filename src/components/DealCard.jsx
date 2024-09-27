import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Share } from 'lucide-react';
import { updateDeal } from '../utils/indexedDB';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { calculateTimeLeft, calculatePopularity } from '../utils/dealUtils';

const DealCard = ({ deal }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [likes, setLikes] = useState(deal.likes || 0);
  const [dislikes, setDislikes] = useState(deal.dislikes || 0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showShareIcons, setShowShareIcons] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeftString = calculateTimeLeft(deal.expiresAt);
      setTimeLeft(timeLeftString);
    }, 1000);

    return () => clearInterval(timer);
  }, [deal.expiresAt]);

  const handleLike = async () => {
    try {
      const updatedDeal = await updateDeal(deal.id, { likes: likes + 1 });
      setLikes(updatedDeal.likes);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const updatedDeal = await updateDeal(deal.id, { dislikes: dislikes + 1 });
      setDislikes(updatedDeal.dislikes);
    } catch (error) {
      console.error('Error updating dislikes:', error);
    }
  };

  const popularity = calculatePopularity(likes, dislikes);
  const isHotDeal = likes > 50;

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl ${
        popularity >= 0.7 ? 'border-4 border-green-500' : 
        popularity >= 0.4 ? 'border-4 border-yellow-500' : 
        'border-4 border-red-500'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative" onClick={() => setIsFlipped(!isFlipped)}>
        {isHotDeal && (
          <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 rounded-br-lg z-10">
            Hot Deal!
          </div>
        )}
        <AnimatePresence>
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: -90 }}
              transition={{ duration: 0.3 }}
            >
              <img src={deal.imageBase64} alt={deal.title} className="w-full h-48 object-cover" />
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 90 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-white dark:bg-gray-800 p-4"
            >
              <h3 className="text-lg font-semibold mb-2">Deal Details</h3>
              <p>{deal.description || "No additional details available."}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{deal.title}</h2>
        <p className={`text-sm ${timeLeft === 'Expired' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'} mb-4 animate-pulse`}>
          Time left: {timeLeft}
        </p>
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${popularity * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button onClick={handleLike} className="flex items-center text-green-500">
            <ThumbsUp className="mr-1" size={18} /> {likes}
          </button>
          <button onClick={handleDislike} className="flex items-center text-red-500">
            <ThumbsDown className="mr-1" size={18} /> {dislikes}
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowShareIcons(!showShareIcons)} 
              className="flex items-center text-blue-500"
            >
              <Share className="mr-1" size={18} />
            </button>
            <AnimatePresence>
              {showShareIcons && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute right-0 mt-2 p-2 bg-white dark:bg-gray-800 rounded shadow-lg"
                >
                  {/* Add your social media share icons here */}
                  <div className="flex space-x-2">
                    <span className="cursor-pointer">📘</span>
                    <span className="cursor-pointer">🐦</span>
                    <span className="cursor-pointer">📸</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DealCard;