import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from "../api";
import './Dashboard.css';

export default function Dashboard({ me, }) {
  const [user, setUser] = useState(me);
  const [latestScore , setLatestScore] = useState([])
  console.log("all detiles for user ",user)
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('me')) || me);

    const fetchLatestScore = async()=>{
    try {
       const res = await api.get("/quiz/getLatestScore")  
    const fetched = res.data?.latestScore || [];   
       setLatestScore(fetched);
    } catch (error) {
      alert(error.response?.data?.msg || 'Failed to load questions.');
    }
    }
    fetchLatestScore();
  }, []);

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("me");
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="dashboard-empty">
        <div className="dashboard-empty-content">
          <p className="dashboard-empty-text">Please login to access your dashboard.</p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar me={user} onLogout={onLogout} />
      
      
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="card dashboard-welcome">
          <h1 className="dashboard-title">
            Welcome To, {user.name}! 👋
          </h1>
          <p className="dashboard-subtitle">{user.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-label">Total Attempts</div>
            <div className="dashboard-stat-value dashboard-stat-value-blue">
              {user.scores?.length || 0}
            </div>
          </div>
          
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-label">Latest Score</div>
            <div className="dashboard-stat-value dashboard-stat-value-green">
              {user.scores?.[user.scores.length - 1]?.score ?? 'N/A'}
            </div>
          </div>
          
          <div className="dashboard-stat-card dashboard-stat-card-action">
            <Link to="/quiz" className="btn btn-primary dashboard-quiz-btn">
              Start New Quiz 🚀
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card dashboard-actions">
          <h3 className="dashboard-history-title">Quick Actions</h3>
          <div className="dashboard-actions-grid">
            <Link to="/quiz-categary" className="dashboard-action-btn">
              <span className="dashboard-action-icon">📝</span>
              <span className="dashboard-action-text">Take Quiz</span>
            </Link>
            <Link to="/add-question" className="dashboard-action-btn">
              <span className="dashboard-action-icon">➕</span>
              <span className="dashboard-action-text">Add Question</span>
            </Link>
          </div>
        </div>

        {/* Score History */}
        <div className="card">
          <h3 className="dashboard-history-title">Score History</h3>
          
          {user.scores && user.scores.length > 0 ? (
            <div className="dashboard-history-list">
              {user.scores.slice().reverse().map((s, index) => (
                <div
                  key={s._id || s.date || index}
                  className="dashboard-history-item"
                >
                  <div className="dashboard-history-date">
                    {new Date(s.date).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="dashboard-history-score">
                    <span className="dashboard-history-score-value">
                      {s.score}/{s.total}
                    </span>
                    <span className="dashboard-history-score-percentage">
                      ({Math.round((s.score / s.total) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-history-empty">
              <p>No quiz attempts yet.</p>
              <Link to="/quiz" className="btn btn-primary">
                Take Your First Quiz
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
