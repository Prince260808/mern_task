// utils/generateToken.js
// Creates a signed JWT for a given user ID.
// Token expires in 7 days — adjust for stricter security requirements.

const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload — only store the user's MongoDB _id
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;
