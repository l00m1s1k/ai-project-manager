import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <div className="text-lg font-semibold">
        <Link to="/">AI Project Manager</Link>
      </div>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Головна</Link>
        <Link to="/assistant" className="hover:underline">Помічник</Link>
        <Link to="/about" className="hover:underline">Про нас</Link>
        <Link to="/login" className="hover:underline">Вхід</Link>
        <Link to="/register" className="hover:underline">Реєстрація</Link>
      </div>
    </nav>
  );
}

export default Navbar;