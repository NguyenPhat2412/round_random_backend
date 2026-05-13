const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token is required",
      });
    }

    const secret =
      process.env.JWT_SECRET || "your-secret-key-change-in-production";

    // Verify token
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        console.error("Token verification error:", err.message);
        return res.status(403).json({
          success: false,
          message: "Unauthorized: Invalid or expired token",
        });
      }

      // Attach user info to request
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = authenticateToken;
