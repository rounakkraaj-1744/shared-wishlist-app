import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { WishlistList } from './pages/WishlistList';
import { WishlistDetail } from './pages/WishlistDetail';
import { CreateWishlist } from './pages/CreateWishlist';
import { SharedWishlists } from './pages/SharedWishlists';

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <WishlistList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/wishlists"
                element={
                  <PrivateRoute>
                    <WishlistList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/wishlists/new"
                element={
                  <PrivateRoute>
                    <CreateWishlist />
                  </PrivateRoute>
                }
              />
              <Route
                path="/wishlists/shared"
                element={
                  <PrivateRoute>
                    <SharedWishlists />
                  </PrivateRoute>
                }
              />
              <Route
                path="/wishlists/:id"
                element={
                  <PrivateRoute>
                    <WishlistDetail />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
