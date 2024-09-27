import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center p-2 ${
            location.pathname === '/' ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/upload"
          className={`flex flex-col items-center p-2 ${
            location.pathname === '/upload' ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <PlusCircle size={24} />
          <span className="text-xs mt-1">Add Deal</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center p-2 ${
            location.pathname === '/profile' ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;