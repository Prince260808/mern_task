// src/App.jsx
// Root component — sets up React Router and wraps app in AuthProvider.

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Stories from "./pages/Stories";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookmarks from "./pages/Bookmarks";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar is shown on all pages */}
        <Navbar />

        {/* Main content area */}
        <main className="bg-light min-vh-100">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Stories />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected route — requires authentication */}
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              }
            />

            {/* Catch-all — redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-dark text-center text-muted py-3">
          <small>
            <i className="bi bi-newspaper text-warning me-1"></i>
            HN Reader — Built with MERN Stack
          </small>
        </footer>
      </Router>
    </AuthProvider>
  );
}

export default App;
