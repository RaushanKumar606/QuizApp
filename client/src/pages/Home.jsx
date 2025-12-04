import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function HomePage() {
  return (
    <div className="homepage">

      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Smart Quiz App</h1>
        <p>Test your knowledge, improve your skills, and challenge yourself.</p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn primary">Get Started</Link>
          <Link to="/quiz" className="btn secondary">Take a Quiz</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Our Quiz App?</h2>
        <div className="features-grid">

          <div className="feature-card">
            <h3>Multiple Question Types</h3>
            <p>MCQ, True/False, Fill in the Blanks & more!</p>
          </div>

          <div className="feature-card">
            <h3>Timed Quiz</h3>
            <p>Challenge yourself with countdown-timer based quizzes.</p>
          </div>

          <div className="feature-card">
            <h3>Instant Results</h3>
            <p>Get score, accuracy & performance breakdown instantly.</p>
          </div>

          <div className="feature-card">
            <h3>Admin Controls</h3>
            <p>Manage categories, add questions & track users.</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2>Popular Quiz Categories</h2>
        <div className="category-list">

          <div className="category-card">
            <h3>General Knowledge</h3>
            <p>Boost your GK with daily updated questions.</p>
          </div>

          <div className="category-card">
            <h3>Science & Tech</h3>
            <p>Perfect for school & competitive exam preparation.</p>
          </div>

          <div className="category-card">
            <h3>Programming</h3>
            <p>JavaScript, Python, Java, DSA & more.</p>
          </div>

          <div className="category-card">
            <h3>History & Geography</h3>
            <p>Improve your knowledge of the world.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to Start Your Quiz Journey?</h2>
        <Link to="/quiz" className="btn primary big">Start Now</Link>
      </section>

    </div>
  );
}
