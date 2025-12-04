
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js"; 
dotenv.config();
const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
  origin: ["*","http://localhost:5173","https://quiz-app-nine-plum-46.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
// Environment variables
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI; 
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


  


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(` API URL: http://localhost:${PORT}`);
});

