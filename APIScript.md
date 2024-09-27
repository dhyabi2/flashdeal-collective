# API Script for Flash Deals Application

This Node.js script provides the backend functionality for the Flash Deals application, replacing the current IndexedDB implementation. It uses a JSON file for data storage and includes features like adding deals, retrieving deals, updating deals, and automatically deleting expired deals.

```javascript
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, 'deals.json');

// Utility function to read the JSON file
async function readDealsFile() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, return an empty array
      return [];
    }
    throw error;
  }
}

// Utility function to write to the JSON file
async function writeDealsFile(deals) {
  await fs.writeFile(DATA_FILE, JSON.stringify(deals, null, 2));
}

// Add a new deal
async function addDeal(deal) {
  const deals = await readDealsFile();
  const newDeal = {
    ...deal,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
    likesIPs: [],
    dislikesIPs: []
  };
  deals.push(newDeal);
  await writeDealsFile(deals);
  return newDeal;
}

// Get all deals
async function getAllDeals() {
  return await readDealsFile();
}

// Update a deal
async function updateDeal(id, updates) {
  const deals = await readDealsFile();
  const index = deals.findIndex(deal => deal.id === id);
  if (index === -1) throw new Error('Deal not found');
  deals[index] = { ...deals[index], ...updates };
  await writeDealsFile(deals);
  return deals[index];
}

// Delete expired deals
async function deleteExpiredDeals() {
  const deals = await readDealsFile();
  const now = new Date().toISOString();
  const activeDeal = deals.filter(deal => deal.expiresAt > now);
  await writeDealsFile(activeDeal);
  return deals.length - activeDeal.length; // Return number of deleted deals
}

// Function to run daily cleanup
function setupDailyCleanup() {
  const runCleanup = async () => {
    const deletedCount = await deleteExpiredDeals();
    console.log(`Daily cleanup completed. Deleted ${deletedCount} expired deals.`);
  };

  // Run cleanup immediately when the script starts
  runCleanup();

  // Set up daily cleanup at midnight
  const now = new Date();
  const night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // tomorrow
    0, 0, 0 // at 00:00:00 hours
  );
  const msToMidnight = night.getTime() - now.getTime();

  // Run once at next midnight, then every 24 hours
  setTimeout(() => {
    runCleanup();
    setInterval(runCleanup, 24 * 60 * 60 * 1000);
  }, msToMidnight);
}

// Example usage in an Express.js API
const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/deals', async (req, res) => {
  try {
    const newDeal = await addDeal(req.body);
    res.status(201).json(newDeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/deals', async (req, res) => {
  try {
    const deals = await getAllDeals();
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/deals/:id', async (req, res) => {
  try {
    const updatedDeal = await updateDeal(req.params.id, req.body);
    res.json(updatedDeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  setupDailyCleanup();
});
```

This script now handles the location data when adding a new deal. The location will be stored as a string in the format "latitude,longitude" in the deal object.