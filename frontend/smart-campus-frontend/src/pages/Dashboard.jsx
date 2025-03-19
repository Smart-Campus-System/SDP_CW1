import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { FaUserGraduate, FaChalkboardTeacher, FaUsers, FaBook, FaChartPie } from "react-icons/fa";
import "./DashboardPage.css";
import Layout from '../pages/Layout';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [, setAnalytics] = useState({
    totalStudents: 0,
    totalLecturers: 0,
    totalUsers: 0,
    enrolledModules: 0,
    moduleWiseEnrollment: "View Details",
  });

 

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);

    // In the future, fetch actual data from API
    // fetchAnalyticsData();
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

       
      </div>
    </Layout>
  );
};

export default DashboardPage;
