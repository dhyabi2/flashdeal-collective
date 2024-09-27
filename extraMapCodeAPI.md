# Backend API Code for Map Integration

This file contains the backend API code necessary for handling location data in the Flash Deals application.

```javascript
const express = require('express');
const router = express.Router();

// Add location to a deal
router.post('/api/deals/:id/location', async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;

    // Assuming you have a deals array or database connection set up
    const deal = deals.find(d => d.id === id);

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    deal.location = `${lat},${lng}`;

    // If using a database, you would update the deal here
    // await Deal.findByIdAndUpdate(id, { location: `${lat},${lng}` });

    res.json(deal);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get deals within a certain radius
router.get('/api/deals/nearby', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    // This is a simplified version. In a real application, you would use
    // a spatial query or the Haversine formula to find nearby deals
    const nearbyDeals = deals.filter(deal => {
      if (!deal.location) return false;
      const [dealLat, dealLng] = deal.location.split(',');
      const distance = calculateDistance(lat, lng, dealLat, dealLng);
      return distance <= radius;
    });

    res.json(nearbyDeals);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Implementation of Haversine formula
  // ... (implement the distance calculation here)
}

module.exports = router;
```

To use this API:

1. Include this router in your main Express app:
   ```javascript
   const mapRoutes = require('./path/to/this/file');
   app.use(mapRoutes);
   ```

2. Ensure you have proper error handling and input validation in a production environment.

3. If using a database, replace the in-memory operations with appropriate database queries.

This API provides endpoints for adding location data to deals and fetching nearby deals. The nearby deals functionality is a simplified version and would need to be optimized for production use, possibly using a spatial database or more efficient algorithms.