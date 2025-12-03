import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Result.css';

export default function Result() {
  const navigate = useNavigate();
  const res = JSON.parse(localStorage.getItem('lastResult') || 'null');
  const user = JSON.parse(localStorage.getItem('me') || 'null');

  if (!res) {
    return (
      <div className="result-empty">
        <div className="card result-empty-card">
          <div className="result-empty-icon-wrapper">
            <svg
              className="result-empty-icon"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="result-empty-title">No Result Found</h2>
          <p className="result-empty-text">You haven't completed any quiz yet.</p>
          <div className="result-empty-actions">
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
            <Link to="/quiz" className="btn btn-gray">
              Start Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const percentage = Math.round((res.correct || res.score || 0) / res.total * 100);
  const getScoreColor = () => {
    if (percentage >= 80) return 'result-score-excellent';
    if (percentage >= 60) return 'result-score-good';
    return 'result-score-poor';
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return '🎉 Excellent Work!';
    if (percentage >= 60) return '👍 Good Job!';
    if (percentage >= 40) return '💪 Keep Trying!';
    return '📚 Study More!';
  };

  return (
    <div className="result">
      <Navbar me={user} />
      
      <div className="result-container">
        <div className="card result-card">
          {/* Score Display */}
          <div className="result-header">
            <div className="result-icon-wrapper">
              <svg
                className="result-icon"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="result-title">Quiz Completed!</h2>
            <p className="result-message">{getScoreMessage()}</p>
          </div>

          {/* Score Statistics */}
          <div className="result-score-section">
            <div className={`result-percentage ${getScoreColor()}`}>
              {percentage}%
            </div>
            <div className="result-score-text">
              <span className="result-score-bold">{res.correct || res.score || 0}</span> out of{' '}
              <span className="result-score-bold">{res.total}</span> questions correct
            </div>
            
            {/* Score Breakdown */}
            <div className="result-breakdown">
              <div className="result-breakdown-item result-breakdown-correct">
                <div className="result-breakdown-value">{res.correct || res.score || 0}</div>
                <div className="result-breakdown-label">Correct</div>
              </div>
              <div className="result-breakdown-item result-breakdown-incorrect">
                <div className="result-breakdown-value">{res.total - (res.correct || res.score || 0)}</div>
                <div className="result-breakdown-label">Incorrect</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="result-actions">
            <Link to="/dashboard" className="btn btn-primary result-action-btn">
              Back to Dashboard
            </Link>
            <button
              onClick={() => navigate('/quiz')}
              className="btn btn-gray result-action-btn"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
