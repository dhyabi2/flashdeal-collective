import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { updateDeal } from '../utils/indexedDB';

const DealCard = ({ deal }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [likes, setLikes] = useState(deal.likes || 0);
  const [dislikes, setDislikes] = useState(deal.dislikes || 0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const expiration = new Date(deal.expiresAt);
      const difference = expiration - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('Expired');
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deal.expiresAt]);

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
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img src={deal.imageUrl} alt={deal.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{deal.title}</h2>
        <p className="text-sm text-gray-600 mb-4">Time left: {timeLeft}</p>
        <div className="flex justify-between items-center">
          <button onClick={handleLike} className="flex items-center text-green-500">
            <ThumbsUp className="mr-1" size={18} /> {likes}
          </button>
          <button onClick={handleDislike} className="flex items-center text-red-500">
            <ThumbsDown className="mr-1" size={18} /> {dislikes}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealCard;