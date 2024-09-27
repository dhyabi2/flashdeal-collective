import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const animationStyles = [
  {
    name: 'Wave',
    variants: {
      animate: {
        y: [0, -20, 0],
        transition: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        },
      },
    },
  },
  {
    name: 'Bounce',
    variants: {
      animate: {
        y: [0, -30, 0],
        transition: {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        },
      },
    },
  },
  {
    name: 'Rotate',
    variants: {
      animate: {
        rotate: [0, 360],
        transition: {
          repeat: Infinity,
          duration: 3,
          ease: "linear",
        },
      },
    },
  },
  {
    name: 'Scale',
    variants: {
      animate: {
        scale: [1, 1.2, 1],
        transition: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        },
      },
    },
  },
  {
    name: 'Flip',
    variants: {
      animate: {
        rotateX: [0, 360],
        transition: {
          repeat: Infinity,
          duration: 2.5,
          ease: "easeInOut",
        },
      },
    },
  },
  {
    name: 'Skew',
    variants: {
      animate: {
        skew: [0, 10, -10, 0],
        transition: {
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        },
      },
    },
  },
  {
    name: 'Blur',
    variants: {
      animate: {
        filter: ["blur(0px)", "blur(4px)", "blur(0px)"],
        transition: {
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        },
      },
    },
  },
  {
    name: 'Color',
    variants: {
      animate: {
        color: ["#ff0000", "#00ff00", "#0000ff", "#ff0000"],
        transition: {
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
        },
      },
    },
  },
  {
    name: 'Path',
    variants: {
      animate: {
        x: [0, 50, 0, -50, 0],
        y: [0, 50, -50, 50, 0],
        transition: {
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
        },
      },
    },
  },
  {
    name: 'Pulse',
    variants: {
      animate: {
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
        transition: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        },
      },
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
      <motion.div
        variants={currentStyle.variants}
        animate="animate"
        className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''} ${
          currentStyle.name === 'Color' ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500' : 'text-indigo-600 dark:text-indigo-400'
        }`}
      >
        {appName}
      </motion.div>
    </div>
  );
};

export default AnimatedAppName;