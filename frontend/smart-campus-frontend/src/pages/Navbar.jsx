import React, { useState, useEffect } from "react";
import { FaBell, FaUserCircle, FaComments } from "react-icons/fa"; // Importing icons
import { Link } from "react-router-dom";

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
        padding: "15px 20px",
        backgroundColor: "#4caf50",
        color: "white",
        position: "",
        top: 0,
        width: "98%",
        zIndex: 1000,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
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
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              transition: "color 0.3s ease",
            }}
          >
            {/* If profile picture exists, display it, otherwise show default icon */}
            <img
              src={profilePicture || "https://via.placeholder.com/50"}
              alt="Profile"
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ffffff",
              }}
            />
          </button>
        </Link>
      </div>

      {/* Right Section: Display User Name */}
      <div style={{ color: "white", marginRight: "20px", fontSize: "20px", fontWeight: "bold" }}>
        Welcome, {localStorage.getItem("userName")}!
      </div>
    </div>
  );
};

export default Navbar;
