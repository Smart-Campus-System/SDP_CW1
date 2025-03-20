import React, { useState, useEffect } from "react";
import axios from "axios"; // Axios for API requests
import { useNavigate } from "react-router-dom"; // Redirect to other pages after successful event creation
import './SchedulerPage.css';

const SchedulerPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState([]); // To store the available locations (from the backend)
  const [error, setError] = useState('');
  const navigate = useNavigate(); // To navigate to other pages

  // Fetch locations from the backend (available halls/locations)
  const fetchLocations = async () => {
    const token = localStorage.getItem('token'); // Get the auth token

    try {
      const response = await axios.get('http://localhost:5000/api/resources/locations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      setLocations(response.data.locations); // Set the locations in state
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError("Failed to fetch locations.");
    }
  };

  useEffect(() => {
    fetchLocations(); // Fetch locations when the component mounts
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Ensure required fields are filled
    if (!title || !description || !date || !startTime || !endTime || !location) {
      setError('All fields are required!');
      return;
    }

    const token = localStorage.getItem('token'); // Retrieve auth token

    try {
      const eventData = { title, description, date, startTime, endTime, location }; // Send date & time separately

      const response = await axios.post('http://localhost:5000/api/schedules/', eventData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ensure the user is authenticated
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert('Lecture scheduled successfully!');
        navigate('/dashboard'); // Redirect after successful scheduling
      }
    } catch (err) {
      setError('Failed to schedule the lecture. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="scheduler-container">
      <h2>Start Scheduling</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="scheduler-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter lecture title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startTime">Start Time</label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endTime">End Time</label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Event Location</label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="event-location-dropdown"
          >
            <option value="">Select Event Location</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location} {/* Display hall name */}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">Schedule Lecture</button>
      </form>
    </div>
  );
};

export default SchedulerPage;
