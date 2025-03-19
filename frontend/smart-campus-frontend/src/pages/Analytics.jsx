import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaUsers, FaBook, FaChartPie } from "react-icons/fa";
import "./DashboardPage.css";
import Layout from '../pages/Layout';
import axios from "axios"; // For making API calls

const Analytics = () => {
  const [role, setRole] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    totalLecturers: 0,
    totalUsers: 0,
    enrolledModules: 0,
    moduleWiseEnrollment: "View Details",
  });

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);

    // Fetch dashboard data on mount
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/api/users/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAnalytics({
        totalStudents: response.data.totalStudents,
        totalLecturers: response.data.totalLecturers,
        totalUsers: response.data.totalUsers,
        enrolledModules: response.data.enrolledModules,
        moduleWiseEnrollment: "View Details",
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

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

  

  return (
    <Layout>
      <div className="dashboard-container">
      


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
            <p>{analytics.totalUsers > 0 ? analytics.totalUsers - 1 : 0}</p>
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

export default Analytics;
