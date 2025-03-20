import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // For making API calls
import Layout from "../pages/Layout";
import "./DashboardPage.css"; // Ensure you style the event cards properly

const DashboardPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [events, setEvents] = useState([]); // State to store event data

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
    fetchEvents(); // Fetch events when the component mounts
  }, []);

  // Fetch events from API
  const fetchEvents = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setEvents(response.data); // Store the fetched events in state
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const navigateToResourcePage = () => {
    navigate("/resource");
  };

  const navigateToRegisterPage = () => {
    navigate("/register");
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="welcome-container">
          <div className="welcome-message">
            <h1>Welcome to the Smart Campus Dashboard</h1>

            {role === "admin" && (
              <div>
                <button className="navigate-button1" onClick={navigateToRegisterPage}>
                  Register Students & Lecturers
                </button>
              </div>
            )}

            <button className="navigate-button" onClick={navigateToResourcePage}>
              Go to Resource Page
            </button>
          </div>
        </div>

        {/* Event Posts Section */}
        <div className="events-section">
          <h2 className="section-title">Upcoming Events</h2>
          {events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="event-card">
                <h3 className="event-title">📌 {event.title}</h3>
                <p className="event-date">📅 {event.date} | ⏰ {event.time}</p>
                <p className="event-location">📍 {event.location}</p>
                <p className="event-description">{event.description}</p>
              </div>
            ))
          ) : (
            <p className="no-events">No upcoming events</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
