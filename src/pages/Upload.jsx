import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, Clock, ChevronDown, MapPin } from 'lucide-react';
import { addDeal } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, useMapEvents, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [duration, setDuration] = useState(24);
  const [category, setCategory] = useState('Electronics');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [mapPosition, setMapPosition] = useState([23.455757859961103, 58.51593263609126]);
  const [addedBy, setAddedBy] = useState('');
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const queryClient = useQueryClient();

  useEffect(() => {
    const savedLocation = localStorage.getItem('lastLocation');
    if (savedLocation) {
      const [lat, lng] = savedLocation.split(',').map(Number);
      setMapPosition([lat, lng]);
      setLocation(`${lat}, ${lng}`);
    }
  }, []);

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
      location: location ? `${mapPosition[0]},${mapPosition[1]}` : null,
      addedBy: addedBy || null,
    };
    addDealMutation.mutate(newDeal);
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setMapPosition([e.latlng.lat, e.latlng.lng]);
        setLocation(`${e.latlng.lat}, ${e.latlng.lng}`);
        localStorage.setItem('lastLocation', `${e.latlng.lat},${e.latlng.lng}`);
      },
    });

    useEffect(() => {
      if (!mapPosition) {
        map.locate();
      }
    }, [map]);

    useEffect(() => {
      const onLocationFound = (e) => {
        setMapPosition([e.latlng.lat, e.latlng.lng]);
        setLocation(`${e.latlng.lat}, ${e.latlng.lng}`);
        localStorage.setItem('lastLocation', `${e.latlng.lat},${e.latlng.lng}`);
        map.flyTo(e.latlng, map.getZoom());
      };

      map.on('locationfound', onLocationFound);

      return () => {
        map.off('locationfound', onLocationFound);
      };
    }, [map]);

    return mapPosition ? <Marker position={mapPosition} /> : null;
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
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{translations.location} ({translations.optional})</label>
              <div className="mt-1">
                <MapContainer center={mapPosition} zoom={6} style={{ height: '200px', width: '100%' }}>
                  <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="OpenStreetMap">
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satellite">
                      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                    </LayersControl.BaseLayer>
                  </LayersControl>
                  <LocationMarker />
                </MapContainer>
              </div>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder={translations.enterLocation}
                readOnly
              />
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
                  onChange={(e) => setDuration(Math.min(168, Math.max(1, parseInt(e.target.value))))}
                  min="1"
                  max="168"
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