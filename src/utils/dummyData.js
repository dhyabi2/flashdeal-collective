import { v4 as uuidv4 } from 'uuid';

const categories = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'];

export const generateDummyDeals = (count = 10) => {
  return Array.from({ length: count }, () => ({
    id: uuidv4(),
    title: `Dummy Deal ${Math.floor(Math.random() * 1000)}`,
    imageBase64: `https://picsum.photos/seed/${Math.random()}/300/200`,
    category: categories[Math.floor(Math.random() * categories.length)],
    expiresAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 100),
    dislikes: Math.floor(Math.random() * 20),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    location: `${(Math.random() * 180 - 90).toFixed(6)},${(Math.random() * 360 - 180).toFixed(6)}`,
    addedBy: `User${Math.floor(Math.random() * 1000)}`,
  }));
};