import React, { useState, useEffect } from "react";
import axios from "axios"; // Axios for API requests
import { useNavigate } from "react-router-dom"; // Redirect to other pages after successful event creation
import "./EventPage.css";
import { ToastContainer, toast } from 'react-toastify';
import './ReactToastify.css';

const EventPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null); // State for image
  const [error, setError] = useState('');
  const [locations, setLocations] = useState([]);  // State to store locations
  const navigate = useNavigate(); // To navigate to other pages

  // Fetch available locations from the backend
  const fetchLocations = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/api/resources/locations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLocations(response.data.locations);  // Set locations in state
    } catch (error) {
      toast.error("Error fetching locations:", error);
      setError("Failed to load locations.");
    }
  };

  useEffect(() => {
    fetchLocations(); // Fetch locations when the component mounts
  }, []);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set the selected image
    }
  };

 // Handle form submission
 const handleSubmit = async (e) => {
  e.preventDefault();

  // Ensure dateTime and location are selected
  if (!dateTime || !location) {
    setError('Please select a date, time, and location.');
    return;
  }

  // Extract date and time from dateTime input
  const [date, time] = dateTime.split('T');  // Splits "2024-02-27T14:30" into ["2024-02-27", "14:30"]

  const token = localStorage.getItem('token'); // Get the auth token

  // Prepare form data for upload
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('date', date);
  formData.append('time', time);
  formData.append('location', location);
  if (image) formData.append('image', image); // Append image if available

  try {
    const response = await axios.post('http://localhost:5000/api/events/', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });

    if (response.status === 200 || response.status === 201) {
      toast.success('Event created successfully!');
      // navigate('/dashboard'); // Redirect user
    }
  } catch (err) {
    setError('Failed to create the event. Please try again.');
    toast.error(err);
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
              {location}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="image">Event Image</label>
        <input
          type="file"
          id="image"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      <button type="submit" className="submit-btn">Create Event</button>
    </form>
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />
  </div>
);
};

export default EventPage;
