import React, { useState, useEffect } from "react";
import { FaBell, FaUserCircle, FaComments } from "react-icons/fa"; // Importing icons
import { Link } from "react-router-dom";
import './Navbar.css'; // Importing the CSS file
import DefaultAvatar from "../assets/avatar.png";
import LogoWhite from "../assets/LogoWhite.png";
import axios from "axios";



const Navbar = () => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null); // State to store profile picture
  const [notifications, setNotifications] = useState([]); // State to store fetched notifications


  useEffect(() => {
    // Fetch the profile picture from localStorage
    const storedProfilePicture = localStorage.getItem('profilePicture');
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture); // Set the profile picture if available
    }
    fetchNotifications(); // Fetch event notifications on component mount

  }, []);

  // Fetch event data from backend API
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setNotifications(response.data); // Set events as notifications
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

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
          gap: "10px",
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
          marginLeft: "0px"
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
            color: "black",
            padding: "10px",
            fontFamily: "Arial",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            width: "250px",
            zIndex: 1000
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "bold" }}>Notifications</h4>
              {notifications.length > 0 ? (
                notifications.map((event, index) => (
                  <div key={index} style={{ borderBottom: "1px solid #ddd", padding: "5px 0" }}>
                    <p style={{ margin: "0", fontSize: "13px" }}>
                      📌 <strong>{event.title}</strong><br />
                      📅 {event.date} | ⏰ {event.time}<br />
                      📍 {event.location}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "13px", textAlign: "center", margin: "10px 0" }}>No new notifications</p>
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
