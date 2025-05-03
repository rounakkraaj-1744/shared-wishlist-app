import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import WishlistPage from './pages/WishlistPage';
import AddWishlistPage from './pages/AddWishlistPage';
import SharedWishlistsPage from './pages/SharedWishlistsPage';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardPage/></ProtectedRoute>} />
        <Route path="/wishlists/:id" element={<ProtectedRoute><WishlistPage/></ProtectedRoute>} />
        <Route path="/add-wishlist" element={<ProtectedRoute><AddWishlistPage/></ProtectedRoute>} />
        <Route path="/shared" element={<ProtectedRoute><SharedWishlistsPage/></ProtectedRoute>} />
      </Routes>
    </div>
  );
}