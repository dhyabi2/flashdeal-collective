import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDeal } from '../utils/indexedDB';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [duration, setDuration] = useState(24);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.split(' ').length > 10) {
      alert('Title must be 10 words or less');
      return;
    }
    if (!title || !imageBase64) {
      alert('Title and image are mandatory');
      return;
    }
    try {
      const newDeal = {
        title,
        imageBase64,
        expiresAt: new Date(Date.now() + duration * 60 * 60 * 1000).toISOString(),
        likes: 0,
        dislikes: 0,
      };
      await addDeal(newDeal);
      navigate('/');
    } catch (error) {
      console.error('Error adding deal:', error);
      alert('Failed to add deal. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Upload New Flash Deal</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title (max 10 words)</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image (PNG only)</label>
          <input
            type="file"
            id="image"
            accept="image/png"
            onChange={handleImageChange}
            required
            className="mt-1 block w-full text-gray-700 dark:text-gray-300"
          />
          {imageBase64 && (
            <img src={imageBase64} alt="Preview" className="mt-2 max-w-full h-auto" />
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration (hours)</label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            min="1"
            max="72"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>
        <button type="submit" className="w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors">
          Upload Deal
        </button>
      </form>
    </div>
  );
};

export default Upload;