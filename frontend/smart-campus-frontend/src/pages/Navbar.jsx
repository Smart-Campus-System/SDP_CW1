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

  // Sample notifications
  const notifications = [
    { module: "Software Engineering", date: "March 20, 2025", time: "10:00 AM", hall: "Lecture Hall 01" },
    { module: "Database Management", date: "March 21, 2025", time: "2:00 PM", hall: "Lecture Hall 03" },
    { module: "AI & Machine Learning", date: "March 22, 2025", time: "9:00 AM", hall: "Lecture Hall 02" }
  ];

  

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end", // Align items to the left
        alignItems: "center",
        padding: "2px 20px",
        backgroundColor: "#40916C",
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
        <button
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            transition: "color 0.3s ease",
          }}
          onClick={() => console.log("Open Chat")}
        >
          <FaComments size={24} />
        </button>

        <div style={{ position: "relative", display: "inline-block" }}>
      {/* Notification Bell Button */}
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

      {/* Notification Dropdown */}
      {notificationOpen && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "0",
            backgroundColor: "white",
            color: "rgb(0, 0, 0)",
            fontFamily: "Arial",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            width: "250px",
            gap: "10px",
            zIndex: 1000
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "bold" }}>Notifications</h4>
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <div key={index} style={{ borderBottom: "1px solid #ddd", padding: "5px 0" }}>
                <p style={{ margin: "0", fontSize: "13px" }}>
                  📌 <strong>{notif.module}</strong><br />
                  📅 {notif.date} | ⏰ {notif.time}<br />
                  🏛 {notif.hall}
                </p>
              </div>
            ))
          ) : (
            <p style={{ fontSize: "13px", color: "gray" }}>No new notifications</p>
          )}
        </div>
      )}
    </div>

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
