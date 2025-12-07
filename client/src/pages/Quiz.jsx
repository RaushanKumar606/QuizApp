
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
    const correctKey = String(currentQuestion.answer); 
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
                <p className="correct-text"> Correct Answer!</p>
              ) : (
                <p className="wrong-text">
                   Wrong Answer <br />
                   {currentQuestion.options[correctAnswer]}
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
