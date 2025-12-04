// backend/routes/quizRoutes.js
import express from "express";
import { 
  getQuestions, 
  submitQuiz,
  saveScore, 
  getUserScores,
  addQuestion,
  getLatestScore

} from "../controller/quizController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/questions", getQuestions);

// Protected routes (require authentication)
router.post("/submit", authMiddleware, submitQuiz);
router.post("/save-score", authMiddleware, saveScore);
router.get("/my-scores", authMiddleware, getUserScores);
router.get("/getLatestScore",authMiddleware,getLatestScore)
router.post("/add-question", addQuestion); // Public for now, can add admin auth later

export default router;
