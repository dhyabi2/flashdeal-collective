import { useState, useEffect } from 'react';

const useSwipe = (ref) => {
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e) => {
      setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
      if (!startX) return;

      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;

      if (Math.abs(diff) > 50) { // Threshold for swipe
        setSwipeDirection(diff > 0 ? 'left' : 'right');
      } else {
        setSwipeDirection(null);
      }
    };

    const handleTouchEnd = () => {
      setStartX(0);
      setTimeout(() => setSwipeDirection(null), 2000); // Reset after 2 seconds
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref]);

  return swipeDirection;
};

export default useSwipe;