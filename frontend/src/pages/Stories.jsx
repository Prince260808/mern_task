// src/pages/Stories.jsx
// Main dashboard — shows top 10 HN stories with scrape + bookmark functionality.

import { useState, useEffect } from "react";
import api from "../utils/api";
import StoryCard from "../components/StoryCard";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";

const Stories = () => {
  const { isAuthenticated } = useAuth();
  const [stories, setStories] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState("");
  const [scrapeMessage, setScrapeMessage] = useState("");

  // Fetch stories and user's bookmarks on mount
  useEffect(() => {
    fetchStories();
    if (isAuthenticated) {
      fetchUserBookmarks();
    }
  }, [isAuthenticated]);

  const fetchStories = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/stories");
      setStories(data);
    } catch (err) {
      setError("Failed to load stories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user's bookmarked story IDs to pre-fill bookmark state
  const fetchUserBookmarks = async () => {
    try {
      const { data } = await api.get("/stories/bookmarks");
      setBookmarkedIds(new Set(data.map((s) => s._id)));
    } catch (err) {
      // Non-critical: silently fail
      console.error("Could not fetch bookmarks:", err.message);
    }
  };

  // Trigger a fresh scrape of HackerNews
  const handleScrape = async () => {
    setScraping(true);
    setScrapeMessage("");
    setError("");
    try {
      const { data } = await api.post("/stories/scrape");
      setScrapeMessage(`✅ ${data.message}`);
      // Reload stories after scrape
      fetchStories();
    } catch (err) {
      setError("Scraping failed. HackerNews may be temporarily unavailable.");
    } finally {
      setScraping(false);
      // Auto-hide success message after 4 seconds
      setTimeout(() => setScrapeMessage(""), 4000);
    }
  };

  // Called by StoryCard when a bookmark is toggled
  const handleBookmarkChange = (storyId, isNowBookmarked) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (isNowBookmarked) {
        next.add(storyId);
      } else {
        next.delete(storyId);
      }
      return next;
    });
  };

  return (
    <div className="container py-4">
      {/* Page header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-fire text-warning me-2"></i>
            Top Stories
          </h2>
          <p className="text-muted mb-0">
            Latest top 10 from Hacker News
          </p>
        </div>
        <button
          className="btn btn-dark"
          onClick={handleScrape}
          disabled={scraping}
        >
          {scraping ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Scraping...
            </>
          ) : (
            <>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh Stories
            </>
          )}
        </button>
      </div>

      {/* Status messages */}
      {scrapeMessage && (
        <div className="alert alert-success py-2 small">{scrapeMessage}</div>
      )}
      {error && (
        <div className="alert alert-danger py-2 small">
          <i className="bi bi-exclamation-circle me-1"></i>
          {error}
          <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchStories}>
            Retry
          </button>
        </div>
      )}

      {/* Stories list */}
      {loading ? (
        <Spinner message="Loading stories..." />
      ) : stories.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-4 text-muted"></i>
          <p className="text-muted mt-3">
            No stories yet. Click <strong>Refresh Stories</strong> to scrape HackerNews.
          </p>
        </div>
      ) : (
        <>
          {!isAuthenticated && (
            <div className="alert alert-info py-2 small mb-3">
              <i className="bi bi-info-circle me-1"></i>
              <a href="/login" className="alert-link">Sign in</a> to bookmark stories for later.
            </div>
          )}
          {stories.map((story) => (
            <StoryCard
              key={story._id}
              story={story}
              isBookmarked={bookmarkedIds.has(story._id)}
              onBookmarkChange={handleBookmarkChange}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Stories;
