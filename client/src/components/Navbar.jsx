import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ me, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          SmartQuiz
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu-desktop">
          {me ? (
            <>
              <span className="navbar-user">
                Hi, <strong className="navbar-user-name">{me.name}</strong>
              </span>
              <button 
                onClick={onLogout}
                className="btn btn-danger navbar-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar-link">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="navbar-menu-toggle"
        >
          <svg className="navbar-menu-icon" fill="none" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="navbar-menu-mobile">
          <div className="navbar-menu-mobile-content">
            {me ? (
              <>
                <div className="navbar-menu-mobile-user">
                  Hi, <strong className="navbar-user-name">{me.name}</strong>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="btn btn-danger w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="navbar-menu-mobile-link"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
