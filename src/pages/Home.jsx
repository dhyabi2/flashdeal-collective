import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllDeals, generateDummyData } from '../utils/indexedDB';
import DealCard from '../components/DealCard';

const Home = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const fetchedDeals = await getAllDeals();
        setDeals(fetchedDeals.length > 0 ? fetchedDeals : generateDummyData());
      } catch (error) {
        console.error('Error fetching deals:', error);
        setDeals(generateDummyData());
      }
    };

    fetchDeals();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Flash Deals</h1>
      <Link to="/upload" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-8 inline-block">
        Upload New Deal
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
};

export default Home;