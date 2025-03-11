import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>Welcome to the Smart Campus!</h1>
        <p>Manage your academic and campus life with ease.</p>
        <div className="cta-buttons">
          <Link to="/login" className="cta-button login-button">
            Login
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <ul>
          <li>Schedule your classes and events.</li>
          <li>Communicate with students and staff.</li>
          <li>Reserve campus facilities easily.</li>
          <li>Stay updated with real-time announcements.</li>
        </ul>
      </div>

      <footer className="footer">
        <p>&copy; 2025 Smart Campus Management</p>
      </footer>
    </div>
  );
};

export default HomePage;

