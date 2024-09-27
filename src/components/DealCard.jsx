import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { updateDeal } from '../utils/indexedDB';
import { motion } from 'framer-motion';

const DealCard = ({ deal }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [likes, setLikes] = useState(deal.likes || 0);
  const [dislikes, setDislikes] = useState(deal.dislikes || 0);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
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

  const handleLike = async () => {
    try {
      const updatedDeal = await updateDeal(deal.id, { likes: likes + 1 });
      setLikes(updatedDeal.likes);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <img src={deal.imageBase64} alt={deal.title} className="w-full h-48 object-cover" />
      <div className="p-4 bg-gray-50">
        <h2 className="text-xl font-semibold mb-2 font-serif">{deal.title}</h2>
        <div className="flex items-center mb-4">
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          <p className="text-sm text-gray-600">{timeLeft}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={handleLike}
            className="flex items-center text-green-500 hover:text-green-600 transition-colors duration-200"
          >
            <ThumbsUp className="mr-1" size={18} /> {likes}
          </button>
          <button
            onClick={handleDislike}
            className="flex items-center text-red-500 hover:text-red-600 transition-colors duration-200"
          >
            <ThumbsDown className="mr-1" size={18} /> {dislikes}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DealCard;