import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import React from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-lg font-bold">Wishlist</Link>
      <div className="flex gap-4">
        {user && <span className="text-gray-700">Hi, {user.name}</span>}
        {user && <button onClick={logout} className="text-blue-500">Logout</button>}
      </div>
    </nav>
  );
}