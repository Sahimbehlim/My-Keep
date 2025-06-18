const { getUser } = require("../utils/auth");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized, please login." });
    }

    const token = authHeader.split(" ")[1];
    const user = getUser(token);

    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    req.userInfo = user;
    next();
  } catch (error) {
    console.error("❌ Authentication Error:", error.message);
    res.status(401).json({ message: "Authentication failed, please login." });
  }
};

module.exports = authMiddleware;
