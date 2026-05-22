// utils/scraper.js
// Scrapes the top 10 stories from HackerNews front page using axios + cheerio.
// Cheerio parses HTML like jQuery — no headless browser needed.

const axios = require("axios");
const cheerio = require("cheerio");

const scrapeHackerNews = async () => {
  try {
    const { data } = await axios.get("https://news.ycombinator.com", {
      headers: {
        // Mimic a browser to avoid blocks
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);
    const stories = [];

    // HN renders stories in <tr class="athing"> elements
    // Each story row has a corresponding subtext row below it
    $("tr.athing").each((index, element) => {
      if (index >= 10) return false; // Only top 10

      const row = $(element);
      const subtextRow = row.next(); // The row with points, author, time

      // --- Extract story rank ---
      const rank = parseInt(row.find(".rank").text().replace(".", ""), 10);

      // --- Extract HN internal ID (used to deduplicate in MongoDB) ---
      const hnId = row.attr("id");

      // --- Extract title and URL ---
      const titleEl = row.find(".titleline > a").first();
      const title = titleEl.text().trim();
      let url = titleEl.attr("href") || "";

      // Some internal HN links start with "item?" — prepend base URL
      if (url.startsWith("item?")) {
        url = `https://news.ycombinator.com/${url}`;
      }

      // --- Extract subtext: points, author, time, comments link ---
      const subtext = subtextRow.find(".subtext, .subline");

      const pointsText = subtextRow.find(".score").text().trim();
      const points = parseInt(pointsText.replace(" points", ""), 10) || 0;

      const author = subtextRow.find(".hnuser").text().trim();

      const postedTime = subtextRow.find(".age").attr("title") || 
                         subtextRow.find(".age a").text().trim();

      // Build a link to the HN comments page
      const commentsUrl = `https://news.ycombinator.com/item?id=${hnId}`;

      if (title && hnId) {
        stories.push({
          rank,
          hnId,
          title,
          url,
          points,
          author,
          postedTime,
          commentsUrl,
        });
      }
    });

    console.log(`✅ Scraped ${stories.length} stories from HackerNews`);
    return stories;
  } catch (error) {
    console.error("❌ Scraping failed:", error.message);
    throw new Error(`Failed to scrape HackerNews: ${error.message}`);
  }
};

module.exports = scrapeHackerNews;
