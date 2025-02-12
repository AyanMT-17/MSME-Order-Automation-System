// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">MSME Order Automation</Link>
        <div className="space-x-4">
          <Link to="/login" className="hover:text-blue-200">Login</Link>
          <Link to="/register" className="hover:text-blue-200">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;