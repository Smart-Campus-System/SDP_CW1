import React, { useState, useEffect } from "react";
import { FaBell, FaUserCircle, FaComments } from "react-icons/fa"; // Importing icons
import { Link } from "react-router-dom";
import './Navbar.css'; // Importing the CSS file
import DefaultAvatar from "../assets/avatar.png";
import LogoWhite from "../assets/LogoWhite.png";


const Navbar = () => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null); // State to store profile picture

  useEffect(() => {
    // Fetch the profile picture from localStorage
    const storedProfilePicture = localStorage.getItem('profilePicture');
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture); // Set the profile picture if available
    }
  }, []);

  const toggleNotifications = () => {
    setNotificationOpen(!notificationOpen);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end", // Align items to the left
        alignItems: "center",
        padding: "2px 20px",
        backgroundColor: "#00796b",
        color: "white",
        position: "",
        top: 0,
        width: "98%",
        zIndex: 1000,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <img src={LogoWhite} alt="Campus Logo" className="logo-white" />

              <h1 className="nav-title">Smart Campus</h1>

      {/* Left Section: Profile, Chat, and Notifications */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginLeft: "10px", // Add some spacing from the left edge
        }}
      >
        {/* Chat Button */}
        <Link to='http://192.168.1.9:3000/'>
        <button
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            transition: "color 0.3s ease",
          }}
        >
          <FaComments size={24} />
        </button>
        </Link>

        {/* Notification Dropdown Button */}
        <button
          onClick={toggleNotifications}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            transition: "color 0.3s ease",
          }}
        >
          <FaBell size={24} />
        </button>
        {notificationOpen && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              left: "20px",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              width: "200px",
            }}
          >
            <p>New Notification!</p>
          </div>
        )}

        {/* Profile Button */}
        <Link to="/profile">
      <button className="profile-button">
      {/* <img src="/avatar.png" alt="Profile" className="profile-image" /> */}
        <img src={profilePicture || DefaultAvatar} alt="Profile" className="profile-image" />
      </button>
    </Link>
      </div>

      {/* Right Section: Display User Name */}
      <div style={{ color: "white", marginRight: "20px", fontSize: "20px", fontWeight: "bold", fontFamily: "Arial" }}>
        Welcome, {localStorage.getItem("userName")}!
      </div>
    </div>
  );
};

export default Navbar;
