const jwt = require("jsonwebtoken");
const env = require("./envalid");

// !! if token got expired or unvalid
const verifyJWTAccessToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log("authHeader", authHeader);
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    await jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET);
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired Token" });
  }
};

module.exports = verifyJWTAccessToken;
