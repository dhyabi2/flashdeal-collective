import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const animationStyles = [
  {
    name: 'Wave',
    variants: {
      hidden: { opacity: 0, y: 20 },
      visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.05,
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.5,
          ease: "easeInOut",
        },
      }),
    },
  },
  {
    name: 'Bounce',
    variants: {
      hidden: { opacity: 0, y: 0 },
      visible: (i) => ({
        opacity: 1,
        y: [-10, 10],
        transition: {
          delay: i * 0.05,
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.8,
          ease: "easeInOut",
        },
      }),
    },
  },
  {
    name: 'Rotate',
    variants: {
      hidden: { opacity: 0, rotate: 0 },
      visible: (i) => ({
        opacity: 1,
        rotate: [0, 360],
        transition: {
          delay: i * 0.05,
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        },
      }),
    },
  },
  {
    name: 'Scale',
    variants: {
      hidden: { opacity: 0, scale: 0 },
      visible: (i) => ({
        opacity: 1,
        scale: [1, 1.5, 1],
        transition: {
          delay: i * 0.05,
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        },
      }),
    },
  },
  {
    name: 'Flip',
    variants: {
      hidden: { opacity: 0, rotateX: 0 },
      visible: (i) => ({
        opacity: 1,
        rotateX: [0, 180, 360],
        transition: {
          delay: i * 0.05,
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        },
      }),
    },
  },
  {
    name: 'Skew',
    variants: {
      hidden: { opacity: 0, skew: 0 },
      visible: (i) => ({
        opacity: 1,
        skew: [0, 10, -10, 0],
        transition: {
          delay: i * 0.05,
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        },
      }),
    },
  },
  {
    name: 'Blur',
    variants: {
      hidden: { opacity: 0, filter: "blur(0px)" },
      visible: (i) => ({
        opacity: 1,
        filter: ["blur(0px)", "blur(4px)", "blur(0px)"],
        transition: {
          delay: i * 0.05,
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        },
      }),
    },
  },
  {
    name: 'Color',
    variants: {
      hidden: { opacity: 0, color: "#000000" },
      visible: (i) => ({
        opacity: 1,
        color: ["#ff0000", "#00ff00", "#0000ff", "#ff0000"],
        transition: {
          delay: i * 0.05,
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        },
      }),
    },
  },
  {
    name: 'Path',
    variants: {
      hidden: { opacity: 0, x: 0, y: 0 },
      visible: (i) => ({
        opacity: 1,
        x: [0, 20, 0, -20, 0],
        y: [0, 20, -20, 20, 0],
        transition: {
          delay: i * 0.05,
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        },
      }),
    },
  },
  {
    name: 'Typewriter',
    variants: {
      hidden: { opacity: 0, width: "0%" },
      visible: (i) => ({
        opacity: 1,
        width: "100%",
        transition: {
          delay: i * 0.1,
          repeat: Infinity,
          repeatType: "reverse",
          duration: 2,
          ease: "easeInOut",
        },
      }),
    },
  },
];

const AnimatedAppName = () => {
  const { language } = useLanguage();
  const [currentStyleIndex, setCurrentStyleIndex] = useState(0);
  const appName = language === 'ar' ? 'ديسكاونت' : 'Discount';

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentStyleIndex((prevIndex) => (prevIndex + 1) % animationStyles.length);
    }, 5000); // Change style every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const currentStyle = animationStyles[currentStyleIndex];

  return (
    <div className="flex justify-center items-center">
      {appName.split('').map((letter, index) => (
        <motion.span
          key={index}
          custom={index}
          variants={currentStyle.variants}
          initial="hidden"
          animate="visible"
          className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''} ${
            currentStyle.name === 'Color' ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500' : 'text-indigo-600 dark:text-indigo-400'
          }`}
          style={{ display: 'inline-block' }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedAppName;