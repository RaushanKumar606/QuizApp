// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../utils/api";
// import "./Quiz.css";

// export default function Quiz({ me }) {
//   const navigate = useNavigate();

//   const [questions, setQuestions] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [timer, setTimer] = useState(15);
//   const [answers, setAnswers] = useState([]);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);

//   const [showResult, setShowResult] = useState(false);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [correctAnswer, setCorrectAnswer] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   const startTimeRef = useRef(Date.now());

//   // Fetch questions
//   useEffect(() => {
//     const loadQuestions = async () => {
//       try {
//         setLoading(true);
//         const res = await api.get("/quiz/questions?page=1&limit=20");
//         const q = res.data?.questions || [];
//         if (!q.length) {
//           setError("No questions found.");
//           return;
//         }
//         setQuestions(q);
//         startTimeRef.current = Date.now();
//       } catch (err) {
//         setError("Failed to load questions.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadQuestions();
//   }, []);

//   // Submit quiz
//   const submitQuiz = async (answers, questionIds, timeTaken) => {
//     setSubmitting(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await api.post(
//         "/quiz/submit",
//         { answers, questionIds, timeTaken },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.result) {
//         localStorage.setItem("lastResult", JSON.stringify(res.data.result));
//         navigate("/result");
//       } else {
//         alert("Quiz submitted but no result returned.");
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         alert("Unauthorized! Please login again.");
//         // localStorage.removeItem("token");
//         // navigate("/login");
//       } else {
//         alert("Failed to submit quiz. Try again.");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const currentQuestion = questions[current];

//   // User selects answer
//   const handleAnswerSelect = (key) => {
//     const correctKey = String(currentQuestion.answer);
//     setSelectedAnswer(key);
//     setShowResult(true);
//     setIsCorrect(key === correctKey);
//     setCorrectAnswer(correctKey);
//   };

//   // Move to next question
//   const handleNext = () => {
//     if (selectedAnswer === null) {
//       alert("Please select an answer first!");
//       return;
//     }

//     const newAns = [...answers, selectedAnswer];
//     setAnswers(newAns);

//     setSelectedAnswer(null);
//     setShowResult(false);

//     if (current < questions.length - 1) {
//       setCurrent(current + 1);
//       setTimer(15);
//     } else {
//       // Prepare submission
//       const questionIds = questions.map((q) => q._id);
//       const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
//       submitQuiz(newAns, questionIds, timeTaken);
//     }
//   };

//   // Timer countdown
//   useEffect(() => {
//     if (loading || submitting || !questions.length || showResult) return;

//     if (timer === 0) {
//       handleNext();
//       return;
//     }

//     const t = setTimeout(() => setTimer((t) => t - 1), 1000);
//     return () => clearTimeout(t);
//   }, [timer, showResult]);

//   if (loading)
//     return (
//       <div className="quiz">
//         <h2>Loading...</h2>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="quiz">
//         <h2>{error}</h2>
//       </div>
//     );

//   const optionEntries = Object.entries(currentQuestion.options);
//   const progress = ((current + 1) / questions.length) * 100;

//   return (
//     <div className="quiz">
//       <div className="quiz-container">
//         {/* Progress Bar */}
//         <div className="card quiz-progress-card">
//           <div className="quiz-progress-header">
//             <span>
//               Question {current + 1} / {questions.length}
//             </span>
//             <span>{Math.round(progress)}%</span>
//           </div>
//           <div className="quiz-progress-bar">
//             <div
//               className="quiz-progress-fill"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         </div>

//         {/* Timer */}
//         {!showResult && (
//           <div className="card quiz-timer-card">
//             <h3 className={timer <= 5 ? "quiz-timer-warning" : ""}>{timer}s</h3>
//           </div>
//         )}

//         {/* Question */}
//         <div className="card quiz-question-card">
//           <h2 className="quiz-question-text">{currentQuestion.question}</h2>

//           {/* OPTIONS */}
//           <div className="quiz-options">
//             {optionEntries.map(([key, text], index) => {
//               let optionClass = "quiz-option";

//               if (showResult) {
//                 if (key === correctAnswer) optionClass += " quiz-option-correct";
//                 else if (key === selectedAnswer)
//                   optionClass += " quiz-option-wrong";
//               } else if (selectedAnswer === key) {
//                 optionClass += " quiz-option-selected";
//               }

//               return (
//                 <button
//                   key={key}
//                   onClick={() => !showResult && handleAnswerSelect(key)}
//                   className={optionClass}
//                 >
//                   <div className="quiz-option-content">
//                     <div className="quiz-option-letter">{String.fromCharCode(65 + index)}</div>
//                     <span className="quiz-option-text">{text}</span>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* Show Result */}
//           {showResult && (
//             <div className="quiz-result-box">
//               {isCorrect ? (
//                 <p className="correct-text">Correct Answer!</p>
//               ) : (
//                 <p className="wrong-text">
//                   Wrong Answer <br />
//                   {currentQuestion.options[correctAnswer]}
//                 </p>
//               )}

//               <button onClick={handleNext} className="btn btn-primary quiz-nav-btn">
//                 {current === questions.length - 1 ? "Submit Quiz" : "Next Question →"}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./Quiz.css";

export default function Quiz({ me }) {
  const navigate = useNavigate();

  // STATES
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(15);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const startTimeRef = useRef(Date.now());

  // ===============================
  // 🚀 FETCH QUESTIONS (20 PER PAGE)
  // ===============================
  const loadQuestions = async (pageNum) => {
    try {
      setLoading(true);

      const res = await api.get(`/quiz/questions?page=${pageNum}&limit=20`);

      const newQs = res.data.questions || [];

      if (newQs.length === 0) {
        setError("No questions found.");
        return;
      }

      // APPEND new questions to list
      setQuestions((prev) => [...prev, ...newQs]);

      setTotalPages(res.data.totalPages);

      if (pageNum === 1) {
        startTimeRef.current = Date.now();
      }
    } catch (err) {
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    loadQuestions(1);
  }, []);

  // ===============================
  // 🚀 SUBMIT QUIZ
  // ===============================
  const submitQuiz = async (answers, questionIds, timeTaken) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/quiz/submit",
        { answers, questionIds, timeTaken },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.result) {
        localStorage.setItem("lastResult", JSON.stringify(res.data.result));
        navigate("/result");
      } else {
        alert("Quiz submitted but no result returned.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Unauthorized! Please login again.");
      } else {
        alert("Failed to submit quiz. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = questions[current];

  // ===============================
  // 🚀 HANDLE ANSWER SELECT
  // ===============================
  const handleAnswerSelect = (key) => {
    const correctKey = String(currentQuestion.answer);
    setSelectedAnswer(key);
    setShowResult(true);
    setIsCorrect(key === correctKey);
    setCorrectAnswer(correctKey);
  };

  // ===============================
  // 🚀 NEXT QUESTION + LOAD MORE
  // ===============================
  const handleNext = () => {
    if (selectedAnswer === null) {
      alert("Please select an answer first!");
      return;
    }

    const newAns = [...answers, selectedAnswer];
    setAnswers(newAns);

    setSelectedAnswer(null);
    setShowResult(false);

    // ⭐ USER IS ON LAST LOADED QUESTION
    if (current === questions.length - 1) {
      // 👉 Load next page if exists
      if (page < totalPages) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadQuestions(nextPage);
      } else {
        // ⭐ No more questions → SUBMIT QUIZ
        const questionIds = questions.map((q) => q._id);
        const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
        submitQuiz(newAns, questionIds, timeTaken);
        return;
      }
    }

    // MOVE TO NEXT QUESTION
    setCurrent((prev) => prev + 1);
    setTimer(15);
  };

  // ===============================
  // ⏳ TIMER
  // ===============================
  useEffect(() => {
    if (loading || submitting || !questions.length || showResult) return;

    if (timer === 0) {
      handleNext();
      return;
    }

    const t = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, showResult]);

  // ===============================
  // LOADING + ERROR
  // ===============================
  if (loading)
    return (
      <div className="quiz">
        <h2>Loading...</h2>
      </div>
    );

  if (error)
    return (
      <div className="quiz">
        <h2>{error}</h2>
      </div>
    );

  const optionEntries = Object.entries(currentQuestion.options);
  const progress = ((current + 1) / questions.length) * 100;

  // ===============================
  // 🚀 UI
  // ===============================
  return (
    <div className="quiz">
      <div className="quiz-container">
        {/* Progress Bar */}
        <div className="card quiz-progress-card">
          <div className="quiz-progress-header">
            <span>
              Question {current + 1} / {questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Timer */}
        {!showResult && (
          <div className="card quiz-timer-card">
            <h3 className={timer <= 5 ? "quiz-timer-warning" : ""}>{timer}s</h3>
          </div>
        )}

        {/* QUESTION CARD */}
        <div className="card quiz-question-card">
          <h2 className="quiz-question-text">{currentQuestion.question}</h2>

          {/* OPTIONS */}
          <div className="quiz-options">
            {optionEntries.map(([key, text], index) => {
              let optionClass = "quiz-option";

              if (showResult) {
                if (key === correctAnswer) optionClass += " quiz-option-correct";
                else if (key === selectedAnswer)
                  optionClass += " quiz-option-wrong";
              } else if (selectedAnswer === key) {
                optionClass += " quiz-option-selected";
              }

              return (
                <button
                  key={key}
                  onClick={() => !showResult && handleAnswerSelect(key)}
                  className={optionClass}
                >
                  <div className="quiz-option-content">
                    <div className="quiz-option-letter">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="quiz-option-text">{text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RESULT + NEXT */}
          {showResult && (
            <div className="quiz-result-box">
              {isCorrect ? (
                <p className="correct-text">Correct Answer!</p>
              ) : (
                <p className="wrong-text">
                  Wrong Answer <br />
                  {currentQuestion.options[correctAnswer]}
                </p>
              )}

              <button onClick={handleNext} className="btn btn-primary quiz-nav-btn">
                {current === questions.length - 1
                  ? "Load More / Submit →"
                  : "Next Question →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
