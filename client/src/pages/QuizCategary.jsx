import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./QuizCategories.css";

export default function QuizCategories({ me }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // If categories come from backend, use this API:
    // api.get("/quiz/categories").then(res => setCategories(res.data));
    
    // For now, static (dynamic-ready)
    setCategories(["BPSE", "RRB", "NTPC", "CETET", "RG", "MG"]);
  }, []);

  return (
    <div className="cat-container">

      {/* Header Row */}
      <div className="cat-header">
        <button className="take-quiz-btn"
         onClick={() => navigate("/quiz")}
         >
          Take A Quiz
        </button>
         
        <div className="cat-username">
          {me?.name || "User"}
          
        </div>
        <button className="take-quiz-btn" onClick={() => navigate("/dashboard")}>
         Dashboard
        </button>
      </div>

      {/* Divider */}
      <hr className="cat-divider" />

      {/* Category Grid */}
      <div className="cat-grid">
        {categories.map((cat, index) => (
          <div 
            key={index} 
            className="cat-box"
            onClick={() => navigate(`/quiz/${cat}`)}
          >
            {cat}
          </div>
        ))}
      </div>

    </div>
  );
}
