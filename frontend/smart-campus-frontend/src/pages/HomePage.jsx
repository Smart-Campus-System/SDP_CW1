import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import campusLogo from '../assets/campus-logo.png'; // Add your logo in the assets folder
import educationVideo from '../assets/education-video.mp4'; // Add your video in the assets folder

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="video-section">
        <video autoPlay loop muted className="education-video">
          <source src={educationVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="content-section">
        <img src={campusLogo} alt="Campus Logo" className="campus-logo" />
        <h1 className="smart-campus">Smart Campus</h1>
        <p className="description">
          <b>Manage your academic and campus life with ease.</b><br/>
          Stay connected | schedule your classes | and access campus resources effortlessly
        </p>
        <Link to="/login" className="cta-button">
          Login
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
