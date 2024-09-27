import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const FAB = () => {
  return (
    <Link to="/upload" className="fixed bottom-20 right-6 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors">
      <Plus size={24} />
    </Link>
  );
};

export default FAB;