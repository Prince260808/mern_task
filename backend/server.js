// server.js
// Entry point for the Express backend.
// Sets up middleware, routes, and connects to MongoDB.

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- Middleware ---

// Allow cross-origin requests from the React frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));

// --- Routes ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stories", require("./routes/storyRoutes"));

// Health check endpoint — useful for Render deploy verification
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "HN Scraper API is running" });
});

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
