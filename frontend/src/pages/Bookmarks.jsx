// src/pages/Bookmarks.jsx
// Protected page — shows all stories bookmarked by the logged-in user.
// Accessible only when authenticated (enforced by ProtectedRoute).

import { useState, useEffect } from "react";
import api from "../utils/api";
import StoryCard from "../components/StoryCard";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";

const Bookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/stories/bookmarks");
      setBookmarks(data);
    } catch (err) {
      setError("Failed to load bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  // Remove a story from the displayed list when un-bookmarked
  const handleBookmarkChange = (storyId, isNowBookmarked) => {
    if (!isNowBookmarked) {
      setBookmarks((prev) => prev.filter((s) => s._id !== storyId));
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          <i className="bi bi-bookmark-fill text-warning me-2"></i>
          My Bookmarks
        </h2>
        <p className="text-muted mb-0">
          Saved stories for{" "}
          <span className="fw-semibold text-dark">{user?.username}</span>
        </p>
      </div>

      {error && (
        <div className="alert alert-danger py-2 small">
          <i className="bi bi-exclamation-circle me-1"></i>
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchBookmarks}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <Spinner message="Loading bookmarks..." />
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-bookmark display-4 text-muted"></i>
          <p className="text-muted mt-3">
            No bookmarks yet. Go to{" "}
            <a href="/" className="text-warning fw-semibold">
              Stories
            </a>{" "}
            and click the bookmark icon on any story.
          </p>
        </div>
      ) : (
        <>
          <p className="text-muted small mb-3">
            {bookmarks.length} bookmarked {bookmarks.length === 1 ? "story" : "stories"}
          </p>
          {bookmarks.map((story) => (
            <StoryCard
              key={story._id}
              story={story}
              isBookmarked={true}
              onBookmarkChange={handleBookmarkChange}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Bookmarks;
