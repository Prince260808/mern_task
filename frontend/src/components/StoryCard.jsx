// src/components/StoryCard.jsx
// Reusable card component for rendering a HackerNews story.
// Accepts an optional onBookmark callback for bookmark toggle.

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const StoryCard = ({ story, isBookmarked: initialBookmarked = false, onBookmarkChange }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Truncate long URLs for display
  const displayUrl = (url) => {
    if (!url) return "news.ycombinator.com";
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url.substring(0, 30);
    }
  };

  const handleBookmark = async () => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setBookmarkLoading(true);
    try {
      const res = await api.post(`/stories/${story._id}/bookmark`);
      const newBookmarked = res.data.bookmarked;
      setBookmarked(newBookmarked);
      // Notify parent component (e.g., to remove from bookmarks list)
      if (onBookmarkChange) {
        onBookmarkChange(story._id, newBookmarked);
      }
    } catch (error) {
      console.error("Bookmark failed:", error.message);
    } finally {
      setBookmarkLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-3 story-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          {/* Rank badge */}
          <span className="badge bg-warning text-dark me-2 mt-1 rank-badge">
            #{story.rank}
          </span>

          <div className="flex-grow-1">
            {/* Story title — links to original article */}
            <h6 className="card-title mb-1">
              <a
                href={story.url || story.commentsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-dark fw-semibold story-title"
              >
                {story.title}
              </a>
            </h6>

            {/* Source domain */}
            <small className="text-muted">
              <i className="bi bi-link-45deg"></i>
              {displayUrl(story.url)}
            </small>

            {/* Meta info row */}
            <div className="d-flex flex-wrap gap-3 mt-2">
              <span className="text-muted small">
                <i className="bi bi-arrow-up-circle text-success me-1"></i>
                {story.points} points
              </span>
              <span className="text-muted small">
                <i className="bi bi-person me-1"></i>
                {story.author}
              </span>
              <span className="text-muted small">
                <i className="bi bi-clock me-1"></i>
                {story.postedTime}
              </span>
              <a
                href={story.commentsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted small text-decoration-none"
              >
                <i className="bi bi-chat me-1"></i>
                Comments
              </a>
            </div>
          </div>

          {/* Bookmark button */}
          <button
            className={`btn btn-sm ms-2 mt-1 ${
              bookmarked ? "btn-warning" : "btn-outline-secondary"
            }`}
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            title={bookmarked ? "Remove bookmark" : "Bookmark this story"}
          >
            {bookmarkLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
              ></span>
            ) : (
              <i
                className={`bi ${
                  bookmarked ? "bi-bookmark-fill" : "bi-bookmark"
                }`}
              ></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
