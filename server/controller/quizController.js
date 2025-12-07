import Question from "../models/Question.js";
import Score from "../models/Scores.js";
import User from "../models/User.js";

/**
 * GET /api/quiz/questions
 * Get quiz questions (public route)
 */
// controllers/questionController.js

export const getQuestions = async (req, res) => {
  try {
    
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 100);

    const page = parseInt(req.query.page || "1", 10);
    const skip = (page - 1) * limit;

    const totalCount = await Question.countDocuments();
    const questions = await Question.find()
      .skip(skip)
      .limit(limit)
      .lean();
    if (!questions || questions.length === 0) {
      return res.json({
        questions: [],
        totalQuestions: 0,
        message: "No questions available. Please add questions to database."
      });
    }
    const publicQs = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      answer: q.answer
    }));
    res.json({
      questions: publicQs,
      currentPage: page,
      limit: limit,
      totalQuestions: totalCount,
      totalPages: Math.ceil(totalCount / limit)
    });

  } catch (err) {
    console.error("getQuestions error:", err);

    res.status(500).json({
      msg: "Failed to fetch questions",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

/**
 * POST /api/quiz/submit
 * Submit quiz answers and get results (requires authentication)
 */

export const submitQuiz = async (req, res) => {
  try {
    const userId = req.userId;
    const { answers, questionIds, timeTaken = 0 } = req.body;

    if (!answers || !Array.isArray(answers) || !questionIds || !Array.isArray(questionIds)) {
      return res.status(400).json({ msg: "Answers and questionIds arrays are required." });
    }
    if (answers.length !== questionIds.length) {
      return res.status(400).json({ msg: "Answers and question IDs must match in length" });
    }
    const questions = await Question.find({ _id: { $in: questionIds } }).lean();

    if (questions.length !== questionIds.length) {
      return res.status(400).json({ msg: "Some questions not found" });
    }

    let correctCount = 0;
    const results = questionIds.map((qId, index) => {
      const question = questions.find(q => q._id.toString() === qId.toString());
      const userAnswer = answers[index];
      const isCorrect = question.answer === userAnswer;
      if (isCorrect) correctCount++;
      return { questionId: qId, userAnswer, correctAnswer: question.answer, isCorrect };
    });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const newScore = await Score.create({
      userId,
      username: user.name,
      score: correctCount,
      totalQuestions: questionIds.length,
      correctAnswers: correctCount,
      timeTaken,
      category: "General"
    });

    user.scores.push(newScore._id);
    await user.save();

    res.json({
      msg: "Quiz submitted successfully",
      result: { score: correctCount, total: questionIds.length, correct: correctCount, percentage: Math.round((correctCount / questionIds.length) * 100), timeTaken },
      details: results,
      scoreId: newScore._id
    });

  } catch (err) {
    res.status(500).json({ msg: process.env.NODE_ENV === "development" ? err.message : "Failed to submit quiz" });
  }
};


// export const submitQuiz = async (req, res) => {
//   // It's assumed req.userId is set by an authentication middleware
//   const userId = req.userId;
//   const { answers, questionIds, timeTaken = 0 } = req.body;
//   try {
//     if (!answers || !Array.isArray(answers) || !questionIds || !Array.isArray(questionIds)) {
//       return res.status(400).json({ msg: "Invalid request format. 'answers' and 'questionIds' arrays are required." });
//     }

//     if (answers.length === 0) {
//       return res.status(400).json({ msg: "Cannot submit an empty quiz." });
//     }

//     if (answers.length !== questionIds.length) {
//       return res.status(400).json({ msg: "Answers and question IDs must match in length." });
//     }
//     // Use Promise.all to fetch both the questions and the user simultaneously
//     const [questions, user] = await Promise.all([
//       Question.find({
//         _id: { $in: questionIds }
//       }).lean(),
//       User.findById(userId)
//     ]);
//     if (!user) {
//       return res.status(404).json({ msg: "User not found." });
//     }

//     if (questions.length !== questionIds.length) {
//       const fetchedIds = new Set(questions.map(q => q._id.toString()));
//       const missingIds = questionIds.filter(qId => !fetchedIds.has(qId.toString()));
      
//       return res.status(400).json({ 
//         msg: "Some questions not found in the database. Please check question IDs.",
//         missingIds: missingIds
//       });
//     }
//     const questionAnswerMap = new Map(
//       questions.map(q => [q._id.toString(), q.answer])
//     );
    
//     let correctCount = 0;
//     const results = questionIds.map((qId, index) => {
//       const correctAnswer = questionAnswerMap.get(qId.toString());
//       const userAnswer = answers[index];
//       const isCorrect = correctAnswer && correctAnswer === userAnswer;
      
//       if (isCorrect) correctCount++;
      
//       return {
//         questionId: qId,
//         userAnswer: userAnswer || null,
//         correctAnswer: correctAnswer || null,
//         isCorrect
//       };
//     });

//     const totalQuestions = questionIds.length;
//     const percentage = Math.round((correctCount / totalQuestions) * 100);

//     const newScore = await Score.create({
//       userId,
//       username: user.name,
//       score: correctCount,
//       totalQuestions,
//       correctAnswers: correctCount,
//       timeTaken,
//       category: "General",
//     });

//     await User.findByIdAndUpdate(userId, {
//         $push: { scores: newScore._id }
//     });

//     res.json({
//       msg: "Quiz submitted successfully",
//       result: {
//         score: correctCount,
//         total: totalQuestions,
//         correct: correctCount,
//         percentage,
//         timeTaken,
//       },
//       details: results,
//       scoreId: newScore._id
//     });
    
//   } catch (err) {
//     // Consolidated error handling
//     console.error("submitQuiz error:", err);
//     res.status(500).json({ 
//       msg: "Failed to submit quiz.",
//       error: process.env.NODE_ENV === "development" ? err.message : undefined 
//     });
//   }
// };
/**
 


 * POST /api/quiz/save-score
 */
export const saveScore = async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      score, 
      totalQuestions, 
      correctAnswers, 
      timeTaken = 0, 
      category = "General" 
    } = req.body;

    if (typeof score !== "number" || typeof totalQuestions !== "number") {
      return res.status(400).json({ msg: "Invalid score payload" });
    }

    if (!correctAnswers && correctAnswers !== 0) {
      return res.status(400).json({ msg: "correctAnswers is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Create score entry
    const newScore = await Score.create({
      userId,
      username: user.name,
      score,
      totalQuestions,
      correctAnswers: correctAnswers || score,
      timeTaken,
      category,
    });

    // Add score to user
    user.scores.push(newScore._id);
    await user.save();

    res.json({ 
      msg: "Score saved successfully", 
      score: newScore 
    });
  } catch (err) {
    console.error("saveScore error:", err);
    res.status(500).json({ 
      msg: process.env.NODE_ENV === "development" ? err.message : "Failed to save score" 
    });
  }
};

/**
 * GET /api/quiz/my-scores
 * Get user's quiz scores (requires authentication)
 */
export const getUserScores = async (req, res) => {
  try {
    const userId = req.userId;
    
    const scores = await Score.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ 
      scores: scores.map(s => ({
        _id: s._id,
        score: s.score,
        total: s.totalQuestions,
        correct: s.correctAnswers,
        date: s.date || s.createdAt,
        timeTaken: s.timeTaken,
        category: s.category
      }))
    });
  } catch (err) {
    console.error("getUserScores error:", err);
    res.status(500).json({ 
      msg: process.env.NODE_ENV === "development" ? err.message : "Failed to fetch scores" 
    });
  }
};

/**
 * POST /api/quiz/add-question (Admin - for adding questions)
 * Add a new quiz question
 */
export const addQuestion = async (req, res) => {
  try {
    const { question, options, answer, category = "General" } = req.body;

    // Validation
    if (!question || !options || !answer) {
      return res.status(400).json({ msg: "Missing required fields: question, options, and answer are required" });
    }

    if (!Array.isArray(options) || options.length < 2 || options.length > 6) {
      return res.status(400).json({ msg: "Options must be an array with 2-6 items" });
    }

    if (!options.includes(answer)) {
      return res.status(400).json({ msg: "Answer must be one of the provided options" });
    }

    // Create question
    const newQuestion = await Question.create({
      question: question.trim(),
      options: options.map(opt => String(opt).trim()),
      answer: answer.trim(),
      category: category || "General"
    });

    res.status(201).json({
      msg: "Question added successfully",
      question: {
        _id: newQuestion._id,
        question: newQuestion.question,
        options: newQuestion.options,
        category: newQuestion.category
        // Don't send answer in response
      }
    });
  } catch (err) {
    console.error("addQuestion error:", err);
    res.status(500).json({ 
      msg: process.env.NODE_ENV === "development" ? err.message : "Failed to add question" 
    });
  }
};

export const getLatestScore = async (req, res) => {
  try {
    const latest = await Score.findOne({ userId: req.params.id })
      .sort({ createdAt: -1 });

    res.json(latest);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};