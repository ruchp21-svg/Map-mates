import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onLogout, currentUser }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/home" className="nav-logo" onClick={closeMenu}>
          🗺️ MapMates
        </Link>
        
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
        </button>
        
        <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <Link to="/home" className="nav-link" onClick={closeMenu}>Trips</Link>
          <Link to="/explore" className="nav-link" onClick={closeMenu}>Explore</Link>
          <Link to="/my-trips-map" className="nav-link" onClick={closeMenu}>Map</Link>
          <Link to="/suggestions" className="nav-link" onClick={closeMenu}>Suggestions</Link>
          <Link to="/chat" className="nav-link" onClick={closeMenu}>Messages</Link>
          <Link to="/karma" className="nav-link" onClick={closeMenu}>Karma</Link>
          <Link to="/feedback" className="nav-link" onClick={closeMenu}>Feedback</Link>
          <Link to="/profile" className="nav-link" onClick={closeMenu}>Profile</Link>
          <button onClick={handleLogout} className="nav-link logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
