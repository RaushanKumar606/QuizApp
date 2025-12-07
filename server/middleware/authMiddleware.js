// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET
//  || "secret123";

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: "No authorization header provided" });
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ msg: "Invalid authorization format. Use: Bearer <token>" });
    }
    const token = parts[1];
    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.userId = payload.id;

      if (!req.userId) {
        return res.status(401).json({ msg: "Invalid token payload" });
      }
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ msg: "Token has expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ msg: "Invalid token" });
      } else {
        return res.status(401).json({ msg: "Token verification failed" });
      }
    }
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res.status(500).json({ msg: "Authentication error" });
  }
}
