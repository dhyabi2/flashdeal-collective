export const calculateTimeLeft = (expiresAt) => {
  const now = new Date();
  const expiration = new Date(expiresAt);
  const difference = expiration - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else {
    return 'Expired';
  }
};

export const calculatePopularity = (likes, dislikes) => {
  const total = likes + dislikes;
  if (total === 0) return 0.5; // Neutral if no votes
  return likes / total;
};