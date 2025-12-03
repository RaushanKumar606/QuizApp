// backend/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRouter.js";
import quizRoutes from "./routes/quizRouter.js";

dotenv.config();

const app = express();

// CORS configuration - must be first
app.use(cors({
  origin: ["https://quiz-app-nine-plum-46.vercel.app/","http://localhost:8080"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// These parse the request body and make it available in req.body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware (for debugging) - after body parsing
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
 
  }
  next();
});

// Environment variables
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI; 


// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(" MongoDB connected successfully");
    const dbName = mongoose.connection.db?.databaseName || "connected";
    console.log(" Database:", dbName);
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err.message);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "Smart Quiz API running",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// 404 handler (must be before error handler)
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  
  if (process.env.NODE_ENV === "development") {
    console.error("Error stack:", err.stack);
  }
  
  res.status(err.status || 500).json({
    msg: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { 
      stack: err.stack
    })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(` API URL: http://localhost:${PORT}`);
});
