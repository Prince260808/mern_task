// models/Story.js
// Mongoose schema for HackerNews stories scraped from the front page.

const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
      default: "", // Some HN posts are "Ask HN" with no external URL
    },
    points: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    postedTime: {
      type: String, // Stored as HN's relative string, e.g. "3 hours ago"
      default: "",
    },
    hnId: {
      type: String,
      unique: true, // HN's own numeric ID — prevents duplicate scrapes
      required: true,
    },
    commentsUrl: {
      type: String,
      default: "",
    },
    rank: {
      type: Number, // 1-10 ranking on HN front page
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Story", storySchema);
