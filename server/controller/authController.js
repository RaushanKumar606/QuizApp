// backend/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

export const signup = async (req, res) => {
  try {
     // Check if req.body exists
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ 
        msg: "Invalid request. Please send JSON data with Content-Type: application/json" 
      });
    }

    const { name, email, password } = req.body;
    console.log(name,email,password);
    // Validation - check if fields exist
    if (!name || !email || !password) {
      return res.status(400).json({ 
        msg: "Missing required fields: name, email, and password are required",
        received: { 
          hasName: !!name, 
          hasEmail: !!email, 
          hasPassword: !!password 
        }
      });
    }

    // Trim and validate name
    const trimmedName = String(name).trim();
    if (trimmedName.length < 2) {
      return res.status(400).json({ msg: "Name must be at least 2 characters long" });
    }
    if (trimmedName.length > 50) {
      return res.status(400).json({ msg: "Name must be less than 50 characters" });
    }

    // Email validation
    const trimmedEmail = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // Password validation
    const passwordStr = String(password);
    if (passwordStr.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters long" });
    }

    // Check if user exists (check with lowercase email since model uses lowercase)
    const exists = await User.findOne({ email: trimmedEmail });
    if (exists) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Hash password
    const hash = await bcrypt.hash(passwordStr, 10);

    // Create user
    const user = await User.create({ 
      name: trimmedName, 
      email: trimmedEmail, 
      password: hash 
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.status(201).json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        scores: user.scores || []
      },
    });
  } catch (err) {
    console.error("signup error:", err);
    
    // Handle duplicate key error (MongoDB unique constraint)
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Email already registered" });
    }
    
    // Handle mongoose validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message).join(", ");
      return res.status(400).json({ msg: `Validation error: ${errors}` });
    }
    
    // Return detailed error in development, generic in production
    res.status(500).json({ 
      msg: process.env.NODE_ENV === "development" 
        ? `Server error: ${err.message}` 
        : "Server error. Please try again later." 
    });
  }
};

export const login = async (req, res) => {
  try {
    // Check if req.body exists
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ 
        msg: "Invalid request. Please send JSON data with Content-Type: application/json" 
      });
    }

    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // Find user - explicitly select password field since it's set to select: false
    const trimmedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail })
      .select("+password")
      .populate("scores");
    
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Verify password
    const isValid = await bcrypt.compare(String(password), user.password);
    if (!isValid) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        scores: user.scores || []
      },
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ 
      msg: process.env.NODE_ENV === "development" 
        ? `Server error: ${err.message}` 
        : "Server error. Please try again later." 
    });
  }
};
// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("scores")
      .lean();
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ 
      msg: process.env.NODE_ENV === "development" 
        ? `Server error: ${err.message}` 
        : "Server error. Please try again later." 
    });
  }
};
