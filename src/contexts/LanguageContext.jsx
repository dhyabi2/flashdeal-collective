import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'es' : 'en');
  };

  const translations = {
    en: {
      home: 'Home',
      addDeal: 'Add Deal',
      createFlashDeal: 'Create Flash Deal',
      title: 'Title',
      enterDealTitle: 'Enter deal title',
      category: 'Category',
      image: 'Image',
      uploadFile: 'Upload a file',
      dragDrop: 'or drag and drop',
      imageTypes: 'PNG, JPG, GIF up to 10MB',
      location: 'Location',
      enterLocation: 'Enter location',
      duration: 'Duration (hours)',
      create: 'Create Flash Deal',
      newest: 'Newest',
      expiringSoon: 'Expiring Soon',
      mostLiked: 'Most Liked',
      noMoreDeals: 'No more deals to show',
      electronics: 'Electronics',
      fashion: 'Fashion',
      home: 'Home',
      beauty: 'Beauty',
      sports: 'Sports',
    },
    es: {
      home: 'Inicio',
      addDeal: 'Añadir Oferta',
      createFlashDeal: 'Crear Oferta Relámpago',
      title: 'Título',
      enterDealTitle: 'Ingrese el título de la oferta',
      category: 'Categoría',
      image: 'Imagen',
      uploadFile: 'Subir un archivo',
      dragDrop: 'o arrastrar y soltar',
      imageTypes: 'PNG, JPG, GIF hasta 10MB',
      location: 'Ubicación',
      enterLocation: 'Ingrese la ubicación',
      duration: 'Duración (horas)',
      create: 'Crear Oferta Relámpago',
      newest: 'Más Recientes',
      expiringSoon: 'A Punto de Expirar',
      mostLiked: 'Más Gustados',
      noMoreDeals: 'No hay más ofertas para mostrar',
      electronics: 'Electrónica',
      fashion: 'Moda',
      home: 'Hogar',
      beauty: 'Belleza',
      sports: 'Deportes',
    },
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, translations: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};