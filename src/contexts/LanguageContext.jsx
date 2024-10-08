import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'ar'; // Default to Arabic if no saved preference
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.body.className = language === 'ar' ? 'font-arabic font-bold' : 'font-sans';
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'ar' ? 'en' : 'ar');
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
      all: 'All',
      addedBy: 'Added By',
      enterAddedBy: 'Enter your name',
      titleTooLong: 'Title must be 10 words or less',
      titleAndImageRequired: 'Title and image are mandatory',
      failedToAddDeal: 'Failed to add deal. Please try again.',
      changeLanguage: 'Change Language',
      optional: 'Optional',
      maxTenWords: 'max 10 words',
    },
    ar: {
      home: 'الرئيسية',
      addDeal: 'إضافة صفقة',
      createFlashDeal: 'إنشاء ديسكاونت سريع', // Updated text here
      title: 'العنوان',
      enterDealTitle: 'أدخل عنوان الصفقة',
      category: 'الفئة',
      image: 'الصورة',
      uploadFile: 'تحميل ملف',
      dragDrop: 'أو اسحب وأفلت',
      imageTypes: 'PNG، JPG، GIF حتى 10 ميجابايت',
      location: 'الموقع',
      enterLocation: 'أدخل الموقع',
      duration: 'المدة (بالساعات)',
      create: 'أضف', // Updated button text here
      newest: 'الأحدث',
      expiringSoon: 'تنتهي قريبًا',
      mostLiked: 'الأكثر إعجابًا',
      noMoreDeals: 'لا توجد المزيد من الصفقات لعرضها',
      electronics: 'إلكترونيات',
      fashion: 'أزياء',
      home: 'المنزل',
      beauty: 'الجمال',
      sports: 'رياضة',
      all: 'الكل',
      addedBy: 'أضيف بواسطة',
      enterAddedBy: 'أدخل اسمك',
      titleTooLong: 'يجب أن يكون العنوان 10 كلمات أو أقل',
      titleAndImageRequired: 'العنوان والصورة إلزاميان',
      failedToAddDeal: 'فشل في إضافة الصفقة. يرجى المحاولة مرة أخرى.',
      changeLanguage: 'تغيير اللغة',
      optional: 'اختياري',
      maxTenWords: 'بحد أقصى 10 كلمات',
    },
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, translations: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};