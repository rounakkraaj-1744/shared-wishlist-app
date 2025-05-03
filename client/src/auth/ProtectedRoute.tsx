import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { JSX } from 'react';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}