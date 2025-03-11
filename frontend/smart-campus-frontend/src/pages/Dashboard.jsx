import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";
import Layout from '../pages/Layout';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  const navigateToResourcePage = () => {
    navigate("/resource");
  };

  const navigateToRegisterPage = () => {
    navigate("/register");
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="welcome-message">
          <h1>Welcome to the Smart Campus Dashboard</h1>

          {/* Show this button only for Admin */}
          {role === "admin" && (
            <div>
              <button
                className="navigate-button1"
                onClick={navigateToRegisterPage}
              >
                Register Students & Lecturers
              </button>
            </div>
          )}

          <button className="navigate-button" onClick={navigateToResourcePage}>
            Go to Resource Page
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
