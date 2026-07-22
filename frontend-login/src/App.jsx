import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/admin/Dashboard';

/**
 * App.jsx
 * ------------------------------------------------------------------
 * Route table, matching the spec exactly:
 *   /                 Home            (public)
 *   /login            Login           (public)
 *   /register         Register        (public)
 *   /profile          Profile         (private)
 *   /edit-profile     EditProfile     (private)
 *   /change-password  ChangePassword  (private)
 *   /forgot-password  ForgotPassword  (public)
 *   /admin            Dashboard       (private, ADMIN only)
 * ------------------------------------------------------------------
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <PrivateRoute>
                <ChangePassword />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
