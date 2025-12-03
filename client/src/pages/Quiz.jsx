
// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../utils/api';
// import Navbar from '../components/Navbar';
// import './Quiz.css';

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

//   // 🔥 Fetch Questions
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await api.get('/quiz/questions');
//         const fetched = res.data?.questions || [];

//         if (fetched.length === 0) {
//           setError('No questions available in the database.');
//           return;
//         }

//         setQuestions(fetched);
//         startTimeRef.current = Date.now();
//       } catch (error) {
//         setError(error.response?.data?.msg || 'Failed to load questions.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, []);

//   // 🔥 Submit Quiz
//   const submitQuiz = async (finalAnswers) => {
//     setSubmitting(true);
//     try {
//       const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);

//       const questionIds = questions.map(q => q._id);

//       const response = await api.post('/quiz/submit', {
//         answers: finalAnswers,
//         questionIds,
//         timeTaken
//       });

//       const result = {
//         score: response.data.result.score,
//         total: response.data.result.total,
//         correct: response.data.result.correct,
//         percentage: response.data.result.percentage,
//         timeTaken: response.data.result.timeTaken,
//       };

//       localStorage.setItem('lastResult', JSON.stringify(result));
//       navigate('/result');
//     } catch (err) {
//       alert(err.response?.data?.msg || 'Failed to submit quiz.');
//       setSubmitting(false);
//     }
//   };

//   // 🔥 When user selects an option
//   const handleAnswerSelect = (key) => {
//     setSelectedAnswer(key);
//     setShowResult(true);

//     if (key === currentQuestion.answer) {
//       setIsCorrect(true);
//     } else {
//       setIsCorrect(false);
//     }

//     setCorrectAnswer(currentQuestion.answer);
//   };

//   // 🔥 Move to next question
//   const handleNext = () => {
//     const newAnswers = [...answers, selectedAnswer];
//     setAnswers(newAnswers);

//     setShowResult(false);
//     setSelectedAnswer(null);

//     if (current < questions.length - 1) {
//       setCurrent(current + 1);
//       setTimer(15);
//     } else {
//       submitQuiz(newAnswers);
//     }
//   };

//   // 🔥 Auto Timer
//   useEffect(() => {
//     if (loading || submitting || questions.length === 0 || showResult) return;

//     if (timer === 0) {
//       handleNext();
//       return;
//     }

//     const t = setTimeout(() => setTimer(prev => prev - 1), 1000);
//     return () => clearTimeout(t);
//   }, [timer, loading, submitting, showResult]);

//   if (loading) {
//     return (
//       <div className="quiz">
//         <Navbar me={me} />
//         <div className="quiz-loading">
//           <div className="spinner"></div>
//           <p>Loading questions...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="quiz">
//         <Navbar me={me} />
//         <h2>Error: {error}</h2>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="quiz">
//         <Navbar me={me} />
//         <h2>No questions available.</h2>
//       </div>
//     );
//   }

//   const currentQuestion = questions[current];
//   const optionEntries = Object.entries(currentQuestion.options || {});

//   const progress = ((current + 1) / questions.length) * 100;

//   return (
//     <div className="quiz">
//       <Navbar me={me} />

//       <div className="quiz-container">
        
//         {/* Progress Bar */}
//         <div className="card quiz-progress-card">
//           <div className="quiz-progress-header">
//             <span>Question {current + 1} / {questions.length}</span>
//             <span>{Math.round(progress)}%</span>
//           </div>
//           <div className="quiz-progress-bar">
//             <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
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
//                 else if (key === selectedAnswer) optionClass += " quiz-option-wrong";
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
//                     <div className="quiz-option-letter">
//                       {String.fromCharCode(65 + index)}
//                     </div>
//                     <span className="quiz-option-text">{text}</span>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* Correct / Incorrect Box */}
//           {showResult && (
//   <div className="quiz-result-box">
//     {isCorrect ? (
//       <p className="correct-text">
//         ✅ Correct Answer!
//       </p>
//     ) : (
//       <p className="wrong-text">
//         ❌ Wrong Answer <br />
//          {currentQuestion.options[currentQuestion.answer]}
//       </p>
//     )}

//     <button
//       onClick={handleNext}
//       className="btn btn-primary quiz-nav-btn"
//     >
//       {current === questions.length - 1 ? "Submit Quiz" : "Next Question →"}
//     </button>
//   </div>
// )}

//         </div>
//       </div>
//     </div>
//   );
// }




// // import { useState, useEffect, useRef } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import api from '../utils/api';
// // import Navbar from '../components/Navbar';
// // import './Quiz.css';

// // export default function Quiz({ me }) {
// //   const navigate = useNavigate();
// //   const [questions, setQuestions] = useState([]);
// //   const [current, setCurrent] = useState(0);
// //   const [timer, setTimer] = useState(15);
// //   const [answers, setAnswers] = useState([]);
// //   const [selectedAnswer, setSelectedAnswer] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [error, setError] = useState(null);
// //   const startTimeRef = useRef(Date.now());

// //   useEffect(() => {
// //     const fetchQuestions = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);

// //         const res = await api.get('/quiz/questions');
// //         const fetchedQuestions = res.data?.questions || [];

// //         if (fetchedQuestions.length === 0) {
// //           setError('No questions available in the database. Please add questions first.');
// //           return;
// //         }

// //         setQuestions(fetchedQuestions);
// //         startTimeRef.current = Date.now();
// //       } catch (error) {
// //         const errorMessage =
// //           error.response?.data?.msg ||
// //           error.message ||
// //           'Failed to load questions. Please try again.';
// //         setError(errorMessage);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchQuestions();
// //   }, []);

// //   const submitQuiz = async (finalAnswers) => {
// //     setSubmitting(true);
// //     try {
// //       const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
// //       const questionIds = questions.map(q => q._id);

// //       const response = await api.post('/quiz/submit', {
// //         answers: finalAnswers,
// //         questionIds,
// //         timeTaken
// //       });

// //       const result = {
// //         score: response.data.result.score,
// //         total: response.data.result.total,
// //         correct: response.data.result.correct,
// //         percentage: response.data.result.percentage,
// //         timeTaken: response.data.result.timeTaken,
// //         details: response.data.details || []
// //       };

// //       localStorage.setItem('lastResult', JSON.stringify(result));
// //       navigate('/result');
// //     } catch (error) {
// //       const errorMsg =
// //         error.response?.data?.msg ||
// //         error.message ||
// //         'Failed to submit quiz.';
// //       alert(errorMsg);
// //       setSubmitting(false);
// //     }
// //   };

// //   const handleAnswerSelect = (option) => {
// //     setSelectedAnswer(option);
// //   };

// //   const handleNext = () => {
// //     if (selectedAnswer === null && timer > 0) {
// //       alert('Please select an answer or wait for the timer.');
// //       return;
// //     }

// //     const newAnswers = [...answers, selectedAnswer];
// //     setAnswers(newAnswers);
// //     setSelectedAnswer(null);

// //     if (current < questions.length - 1) {
// //       setCurrent(current + 1);
// //       setTimer(15);
// //     } else {
// //       submitQuiz(newAnswers);
// //     }
// //   };

// //   useEffect(() => {
// //     if (questions.length === 0 || loading || submitting) return;

// //     if (timer === 0) {
// //       const newAnswers = [...answers, selectedAnswer];
// //       setAnswers(newAnswers);
// //       setSelectedAnswer(null);

// //       if (current < questions.length - 1) {
// //         setCurrent(current + 1);
// //         setTimer(15);
// //       } else {
// //         submitQuiz(newAnswers);
// //       }
// //       return;
// //     }

// //     const t = setTimeout(() => setTimer(prev => prev - 1), 1000);
// //     return () => clearTimeout(t);
// //   }, [timer, questions.length, loading, submitting]);

// //   if (loading) {
// //     return (
// //       <div className="quiz">
// //         <Navbar me={me} />
// //         <div className="quiz-loading">
// //           <div className="spinner"></div>
// //           <p>Loading questions...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="quiz">
// //         <Navbar me={me} />
// //         <div className="quiz-empty">
// //           <h2>Error Loading Questions</h2>
// //           <p className="error-message">{error}</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (questions.length === 0) {
// //     return (
// //       <div className="quiz">
// //         <Navbar me={me} />
// //         <div className="quiz-empty">
// //           <h2>No Questions Available</h2>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const currentQuestion = questions[current];

// //   // 🔥 FIX: Convert object → array
// //   const optionsArray = Object.values(currentQuestion.options || {});

// //   const progress = ((current + 1) / questions.length) * 100;

// //   return (
// //     <div className="quiz">
// //       <Navbar me={me} />

// //       <div className="quiz-container">

// //         {/* Progress Bar */}
// //         <div className="card quiz-progress-card">
// //           <div className="quiz-progress-header">
// //             <span>Question {current + 1} of {questions.length}</span>
// //             <span>{Math.round(progress)}%</span>
// //           </div>
// //           <div className="quiz-progress-bar">
// //             <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
// //           </div>
// //         </div>

// //         {/* Timer */}
// //         <div className="card quiz-timer-card">
// //           <div className="quiz-timer">
// //             <span className={timer <= 5 ? 'quiz-timer-warning' : ''}>{timer}s</span>
// //           </div>
// //         </div>

// //         {/* Question */}
// //         <div className="card quiz-question-card">
// //           <h2 className="quiz-question-text">{currentQuestion.question}</h2>

// //           {/* Options */}
// //           {optionsArray.length > 0 ? (
// //             <div className="quiz-options">
// //               {optionsArray.map((option, index) => (
// //                 <button
// //                   key={index}
// //                   onClick={() => handleAnswerSelect(option)}
// //                   className={`quiz-option ${
// //                     selectedAnswer === option ? 'quiz-option-selected' : ''
// //                   }`}
// //                 >
// //                   <div className="quiz-option-content">
// //                     <div className={`quiz-option-letter ${
// //                       selectedAnswer === option ? 'quiz-option-letter-selected' : ''
// //                     }`}>
// //                       {String.fromCharCode(65 + index)}
// //                     </div>
// //                     <span className="quiz-option-text">{option}</span>
// //                   </div>
// //                 </button>
// //               ))}
// //             </div>
// //           ) : (
// //             <p>No options available.</p>
// //           )}
// //         </div>

// //         {/* Next / Submit */}
// //         <div className="quiz-nav">
// //           <button
// //             onClick={handleNext}
// //             disabled={submitting}
// //             className="btn btn-primary quiz-nav-btn"
// //           >
// //             {submitting
// //               ? 'Submitting...'
// //               : current === questions.length - 1
// //               ? 'Submit Quiz'
// //               : 'Next Question →'}
// //           </button>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }


import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import "./Quiz.css";

export default function Quiz({ me }) {
  const navigate = useNavigate();

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

  const startTimeRef = useRef(Date.now());

  // Fetch questions
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const res = await api.get("/quiz/questions");
        const q = res.data?.questions || [];

        if (!q.length) {
          setError("No questions found.");
          return;
        }

        setQuestions(q);
        startTimeRef.current = Date.now();
      } catch (err) {
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  // Submit quiz
  const submitQuiz = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const ids = questions.map((q) => q._id);

      const res = await api.post("/quiz/submit", {
        answers: finalAnswers,
        questionIds: ids,
        timeTaken,
      });

      localStorage.setItem("lastResult", JSON.stringify(res.data.result));
      navigate("/result");
    } catch (e) {
      alert("Failed to submit quiz.");
    }
  };

  // When user selects an option
  const handleAnswerSelect = (key) => {
    const correctKey = String(currentQuestion.answer); // Always string
 console.log("all",currentQuestion)
    setSelectedAnswer(key);
    setShowResult(true);
    setIsCorrect(key === correctKey);
    setCorrectAnswer(correctKey);
  };

  // Next question
  const handleNext = () => {
    const newAns = [...answers, selectedAnswer];
    setAnswers(newAns);

    setSelectedAnswer(null);
    setShowResult(false);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setTimer(15);
    } else {
      submitQuiz(newAns);
    }
  };

  // Timer
  useEffect(() => {
    if (loading || submitting || !questions.length || showResult) return;

    if (timer === 0) {
      handleNext();
      return;
    }

    const t = setTimeout(() => setTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, showResult]);

  if (loading)
    return (
      <div className="quiz">
        <Navbar me={me} />
        <h2>Loading...</h2>
      </div>
    );

  if (error)
    return (
      <div className="quiz">
        <Navbar me={me} />
        <h2>{error}</h2>
      </div>
    );

  const currentQuestion = questions[current];
  const optionEntries = Object.entries(currentQuestion.options);
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="quiz">
      <Navbar me={me} />

      <div className="quiz-container">
        {/* Progress */}
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
            <h3 className={timer <= 5 ? "quiz-timer-warning" : ""}>
              {timer}s
            </h3>
          </div>
        )}

        {/* Question */}
        <div className="card quiz-question-card">
          <h2 className="quiz-question-text">{currentQuestion.question}</h2>

          {/* OPTIONS */}
          <div className="quiz-options">
            {optionEntries.map(([key, text], index) => {
              let optionClass = "quiz-option";

              // highlight after answer
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

          {/* SHOW RESULT */}
          {showResult && (
            <div className="quiz-result-box">
              {isCorrect ? (
                <p className="correct-text">✅ Correct Answer!</p>
              ) : (
                <p className="wrong-text">
                  ❌ Wrong Answer <br />
                  Correct: {currentQuestion.options[correctAnswer]}
                </p>
              )}

              <button onClick={handleNext} className="btn btn-primary quiz-nav-btn">
                {current === questions.length - 1
                  ? "Submit Quiz"
                  : "Next Question →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
