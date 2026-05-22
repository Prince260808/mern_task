// src/components/ProtectedRoute.jsx
// Wrapper component that redirects unauthenticated users to /login.
// Usage: <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login while preserving the intended destination
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
