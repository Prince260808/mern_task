// controllers/storyController.js
// Handles all story-related operations:
// - Scraping and saving to DB
// - Fetching stories
// - Bookmark management

const Story = require("../models/Story");
const User = require("../models/User");
const scrapeHackerNews = require("../utils/scraper");

// @desc    Scrape top 10 HN stories and save to DB
// @route   POST /api/stories/scrape
// @access  Public (could be secured in production with an admin key)
const scrapeAndSaveStories = async (req, res) => {
  try {
    const stories = await scrapeHackerNews();

    const savedStories = [];

    for (const story of stories) {
      // Use upsert: update if exists (by hnId), insert if new
      // This prevents duplicate stories across multiple scrape runs
      const saved = await Story.findOneAndUpdate(
        { hnId: story.hnId },
        story,
        { upsert: true, new: true, runValidators: true }
      );
      savedStories.push(saved);
    }

    res.json({
      message: `Successfully scraped and saved ${savedStories.length} stories`,
      count: savedStories.length,
      stories: savedStories,
    });
  } catch (error) {
    console.error("Scrape error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all stories from DB (sorted by rank)
// @route   GET /api/stories
// @access  Public
const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ rank: 1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stories" });
  }
};

// @desc    Get a single story by MongoDB ID
// @route   GET /api/stories/:id
// @access  Public
const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch story" });
  }
};

// @desc    Toggle bookmark for a story (add if not bookmarked, remove if bookmarked)
// @route   POST /api/stories/:id/bookmark
// @access  Private
const toggleBookmark = async (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.user._id;

    // Verify story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const user = await User.findById(userId);

    // Check if already bookmarked
    const isBookmarked = user.bookmarks.includes(storyId);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== storyId
      );
      await user.save();
      return res.json({ message: "Bookmark removed", bookmarked: false });
    } else {
      // Add bookmark — prevent duplicates via the check above
      user.bookmarks.push(storyId);
      await user.save();
      return res.json({ message: "Story bookmarked", bookmarked: true });
    }
  } catch (error) {
    console.error("Bookmark error:", error.message);
    res.status(500).json({ message: "Failed to toggle bookmark" });
  }
};

// @desc    Get all bookmarked stories for logged-in user
// @route   GET /api/stories/bookmarks
// @access  Private
const getBookmarkedStories = async (req, res) => {
  try {
    // Populate the bookmarks array with actual Story documents
    const user = await User.findById(req.user._id).populate("bookmarks");
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookmarks" });
  }
};

module.exports = {
  scrapeAndSaveStories,
  getAllStories,
  getStoryById,
  toggleBookmark,
  getBookmarkedStories,
};
