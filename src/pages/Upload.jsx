import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, Clock, ChevronDown, MapPin } from 'lucide-react';
import { addDeal } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [duration, setDuration] = useState(24);
  const [category, setCategory] = useState('Electronics');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [addedBy, setAddedBy] = useState('');
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const queryClient = useQueryClient();

  const addDealMutation = useMutation({
    mutationFn: addDeal,
    onSuccess: () => {
      queryClient.invalidateQueries(['deals']);
      navigate('/');
    },
    onError: (error) => {
      console.error('Error adding deal:', error);
      alert(translations.failedToAddDeal);
    },
  });

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
      alert(translations.titleTooLong);
      return;
    }
    if (!title || !imageBase64) {
      alert(translations.titleAndImageRequired);
      return;
    }
    const newDeal = {
      title,
      imageBase64,
      category,
      expiresAt: new Date(Date.now() + duration * 60 * 60 * 1000).toISOString(),
      location: location.lat !== 0 && location.lng !== 0 ? `${location.lat},${location.lng}` : null,
      addedBy: addedBy || null,
    };
    addDealMutation.mutate(newDeal);
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setLocation(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return location.lat !== 0 && location.lng !== 0 ? (
      <Marker position={location} />
    ) : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-md w-full"
      >
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">{translations.createFlashDeal}</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{translations.title} ({translations.maxTenWords})</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder={translations.enterDealTitle}
              />
            </div>
            <div className="relative">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{translations.category}</label>
              <div
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white transition-all duration-200 cursor-pointer flex justify-between items-center"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{translations[category.toLowerCase()]}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
              </div>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg"
                >
                  {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'].map((cat) => (
                    <div
                      key={cat}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={() => {
                        setCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {translations[cat.toLowerCase()]}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{translations.image}</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="image" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>{translations.uploadFile}</span>
                      <input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" required />
                    </label>
                    <p className="pl-1">{translations.dragDrop}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{translations.imageTypes}</p>
                </div>
              </div>
              {imageBase64 && (
                <div className="mt-4">
                  <img src={imageBase64} alt="Preview" className="max-w-full h-auto rounded-lg" />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{translations.location}</label>
              <div className="h-64 rounded-lg overflow-hidden">
                <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                </MapContainer>
              </div>
              {location.lat !== 0 && location.lng !== 0 && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Selected: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="addedBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{translations.addedBy} ({translations.optional})</label>
              <input
                type="text"
                id="addedBy"
                value={addedBy}
                onChange={(e) => setAddedBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder={translations.enterAddedBy}
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{translations.duration}</label>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="number"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  min="1"
                  max="72"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white transition-all duration-200"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              {translations.create}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Upload;
