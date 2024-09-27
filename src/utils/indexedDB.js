import { openDB } from 'idb';

const dbName = 'FlashDealsDB';
const storeName = 'deals';

const initDB = async () => {
  return openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        store.createIndex('title', 'title', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    },
  });
};

export const addDeal = async (deal) => {
  const db = await initDB();
  return db.add(storeName, { 
    ...deal, 
    createdAt: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
    likesIPs: [],
    dislikesIPs: []
  });
};

export const getAllDeals = async () => {
  const db = await initDB();
  return db.getAllFromIndex(storeName, 'createdAt');
};

export const updateDeal = async (id, updates) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  const deal = await store.get(id);
  if (!deal) throw new Error('Deal not found');
  const updatedDeal = { ...deal, ...updates };
  await store.put(updatedDeal);
  await tx.done;
  return updatedDeal;
};

// Generate dummy data if IndexedDB fails
export const generateDummyData = () => {
  const dummyDeals = [
    { id: 1, title: 'Amazing 50% off on Electronics', imageUrl: 'https://picsum.photos/200/300', expiresAt: new Date(Date.now() + 86400000).toISOString(), likes: 10, dislikes: 2, likesIPs: [], dislikesIPs: [] },
    { id: 2, title: 'Buy 1 Get 1 Free on All Shoes', imageUrl: 'https://picsum.photos/200/301', expiresAt: new Date(Date.now() + 172800000).toISOString(), likes: 15, dislikes: 1, likesIPs: [], dislikesIPs: [] },
    { id: 3, title: 'Flash Sale: 70% off on Fashion', imageUrl: 'https://picsum.photos/200/302', expiresAt: new Date(Date.now() + 259200000).toISOString(), likes: 20, dislikes: 3, likesIPs: [], dislikesIPs: [] },
  ];
  return dummyDeals;
};