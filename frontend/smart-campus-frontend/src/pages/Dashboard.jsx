import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaUsers, FaBook, FaChartPie } from "react-icons/fa";
import "./DashboardPage.css";
import Layout from '../pages/Layout';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  // Sample analytics data
  const [analytics, setAnalytics] = useState({
    totalStudents: 500,
    totalLecturers: 50,
    totalUsers: 550,
    enrolledModules: 120,
    moduleWiseEnrollment: "View Details"
  });

  const [moduleEnrollments, setModuleEnrollments] = useState([
    { module: "Software Development Practice", students: 45, lecturer: "Dr. John Doe" },
    { module: "Patterns and Algorithms", students: 38, lecturer: "Prof. Alice Smith" },
    { module: "Database Management", students: 50, lecturer: "Dr. David Johnson" },
    { module: "Mathematics and Statistics", students: 42, lecturer: "Dr. Emily Brown" },
    { module: "Cloud Computing", students: 36, lecturer: "Dr. Michael White" },
    { module: "Machine Learning", students: 48, lecturer: "Prof. Sophia Green" },
    { module: "Software Quality Assurance", students: 40, lecturer: "Dr. Robert Black" },
    { module: "Networking", students: 39, lecturer: "Dr. Laura Wilson" },
    { module: "English", students: 55, lecturer: "Prof. James Lee" },
    { module: "Aesthetic", students: 30, lecturer: "Dr. Olivia Taylor" },
    { module: "Digital Entrepreneurship", students: 28, lecturer: "Prof. William Harris" }
]);

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

        {/* Analytics Section */}
        <div className="analytics-container">
          <div className="dashboard-card">
            <FaUserGraduate className="icon" />
            <h3>Total Students</h3>
            <p>{analytics.totalStudents}</p>
          </div>

          <div className="dashboard-card">
            <FaChalkboardTeacher className="icon" />
            <h3>Total Lecturers</h3>
            <p>{analytics.totalLecturers}</p>
          </div>

          <div className="dashboard-card">
            <FaUsers className="icon" />
            <h3>Total Users</h3>
            <p>{analytics.totalUsers}</p>
          </div>

          <div className="dashboard-card">
            <FaBook className="icon" />
            <h3>Enrolled Modules</h3>
            <p>{analytics.enrolledModules}</p>
          </div>

           {/* Module-wise Enrollment Table */}
        <div className="module-enrollment-container">
          <h2><FaChartPie className="icon" /> Module-wise Enrollment</h2>
          <table className="module-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Student Count</th>
                <th>Lecturer</th>
              </tr>
            </thead>
            <tbody>
              {moduleEnrollments.map((module, index) => (
                <tr key={index}>
                  <td>{module.module}</td>
                  <td>{module.students}</td>
                  <td>{module.lecturer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
