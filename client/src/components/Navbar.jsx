// [Riya] Navbar.jsx - Placeholder
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="p-4 bg-orange-600 text-white flex justify-between items-center shadow-md">
      <Link to="/" className="font-bold text-lg">CampusBite</Link>
      <div className="space-x-4 text-sm font-medium">
        <Link to="/menu" className="hover:underline">Menu</Link>
        <Link to="/login" className="hover:underline">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
