import React, { useState } from 'react';
import axios from 'axios'; // Axios for API requests
import { useNavigate } from 'react-router-dom'; // Redirect to other pages after successful event creation

const EventPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // To navigate to other pages

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure dateTime is selected
    if (!dateTime) {
      setError('Please select a date and time.');
      return;
    }
  
    // Extract date and time from dateTime input
    const [date, time] = dateTime.split('T');  // Splits "2024-02-27T14:30" into ["2024-02-27", "14:30"]
  
    const token = localStorage.getItem('token'); // Get the auth token
  
    try {
      const eventData = { title, description, date, time, location }; // Send date & time separately
  
      const response = await axios.post('http://localhost:5000/api/events', eventData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ensure the user is authenticated
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        alert('Event created successfully!');
        navigate('/dashboard'); // Redirect user
      }
    } catch (err) {
      setError('Failed to create the event. Please try again.');
      console.error(err);
    }
  };
  
  

  return (
    <div className="event-page-container">
      <h2>Create New Event</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Event Description</label>
          <textarea
            id="description"
            placeholder="Enter event description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateTime">Event Date & Time</label>
          <input
            type="datetime-local"
            id="dateTime"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Event Location</label>
          <input
            type="text"
            id="location"
            placeholder="Enter event location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Create Event</button>
      </form>
    </div>
  );
};

export default EventPage;
