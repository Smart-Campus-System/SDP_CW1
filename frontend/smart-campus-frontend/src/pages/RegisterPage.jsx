import React, { useState, useEffect } from 'react';
import axios from '../api/axios.js';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [selectedModules, setSelectedModules] = useState([]);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // List of Available Modules
    setModules([
      "Software Development Practice", "Patterns and Algorithms", "Database Management",
      "Mathematics and Statistics", "Cloud Computing", "Machine Learning",
      "Software Quality Assurance", "Networking", "English", "Aesthetic"
    ]);
  }, []);

  const handleModuleSelection = (moduleName) => {
    setSelectedModules((prevModules) =>
      prevModules.includes(moduleName)
        ? prevModules.filter((m) => m !== moduleName) 
        : [...prevModules, moduleName] 
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Get token from localStorage
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        role,
        modules: selectedModules
      }, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      alert("User Registered Successfully!");
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error("Registration Error:", err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Admin Panel - Register User</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <label>Select Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
          </select>

          <label>Enroll in Modules:</label>
          <div className="modules-checkbox">
            {modules.map((module, index) => (
              <label key={index} className="checkbox-label">
                <input
                  type="checkbox"
                  value={module}
                  checked={selectedModules.includes(module)}
                  onChange={() => handleModuleSelection(module)}
                />
                {module}
              </label>
            ))}
          </div>

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
