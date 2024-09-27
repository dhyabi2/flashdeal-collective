import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Flash Deals</h1>
        <p className="text-xl text-gray-600 mb-8">Discover amazing deals that won't last long!</p>
        <div className="space-x-4">
          <Link to="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            View Deals
          </Link>
          <Link to="/upload" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
            Upload Deal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;