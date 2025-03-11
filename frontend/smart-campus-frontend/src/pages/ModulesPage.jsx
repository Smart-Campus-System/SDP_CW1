import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './ModulesPage.css';

const ModulesPage = () => {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/modules');
        setModules(response.data);
      } catch (err) {
        setError('Failed to fetch modules.');
      }
    };

    fetchModules();
  }, []);

  // Colors for the pie chart
  const COLORS = ["#4CAF50", "#FF9800", "#03A9F4", "#FF5722", "#9C27B0"];
  return (
    <div className="modules-container">
      <h2 className="page-title">Enrolled Modules</h2>
      {error && <p className="error">{error}</p>}

      <div className="modules-grid">
        {modules.map((module, index) => (
          <div key={module._id} className="module-card">
            {/* Module Title */}
            <Link to={`/modules/${module._id}`} className="module-title">
              {module.title}
            </Link>

            {/* Pie Chart for Completion */}
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Completed", value: module.completionPercentage },
                      { name: "Remaining", value: 100 - module.completionPercentage },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell key={`cell-0`} fill={COLORS[index % COLORS.length]} />
                    <Cell key={`cell-1`} fill="#4caf50" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Completion Percentage */}
            <p className="completion-text">{module.completionPercentage}% Completed</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModulesPage;