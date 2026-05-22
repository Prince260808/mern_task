// routes/storyRoutes.js
// Story endpoints — mix of public and protected routes

const express = require("express");
const router = express.Router();
const {
  scrapeAndSaveStories,
  getAllStories,
  getStoryById,
  toggleBookmark,
  getBookmarkedStories,
} = require("../controllers/storyController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/stories/scrape — trigger a fresh scrape
router.post("/scrape", scrapeAndSaveStories);

// GET /api/stories/bookmarks — MUST come before /:id to avoid "bookmarks" being treated as an ID
router.get("/bookmarks", protect, getBookmarkedStories);

// GET /api/stories
router.get("/", getAllStories);

// GET /api/stories/:id
router.get("/:id", getStoryById);

// POST /api/stories/:id/bookmark
router.post("/:id/bookmark", protect, toggleBookmark);

module.exports = router;
