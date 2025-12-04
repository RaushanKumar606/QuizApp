// backend/routes/authRoutes.js
import express from "express";
import { signup, login, getProfile } from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);

router.get("/me", authMiddleware, getProfile); // optional: get current user profile

export default router;
