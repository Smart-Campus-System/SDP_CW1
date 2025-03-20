import React, { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // for date click and event drag & drop
import "./CalendarPage.css";
import tippy from "tippy.js";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: null,
  });
  const [holidays, setHolidays] = useState([]);
  

  useEffect(() => {
    fetchEvents();
    fetchHolidays(); // Fetch holidays (Poya days) on component mount
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventDetails((prevDetails) => ({
        ...prevDetails,
        image: file, // Store the selected image
      }));
    }
  };

  // Fetch events from backend API
  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Fetch Sri Lankan holidays (Poya days) from an API or static data
  const fetchHolidays = () => {
    const poyaDays = [
      "2024-03-13","2024-04-06", "2024-05-05", "2024-06-04", "2024-07-03", // Example Poya days
      // Add more Poya days dynamically from a real API or database
    ];
    setHolidays(poyaDays);
  };

  // Handle the date selection
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      date: info.dateStr // Set the clicked date as event date
    }));
    setShowEventModal(true);
  };

  // Handle event submission to the backend
  const handleEventSubmit = async () => {
    if (!eventDetails.title || !eventDetails.date || !eventDetails.time || !eventDetails.location) {
      alert("All fields are required!");
      return;
    }

    const newEvent = {
      title: eventDetails.title,
      description: eventDetails.description,
      date: eventDetails.date,
      time: eventDetails.time,
      location: eventDetails.location
    };

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("http://localhost:5000/api/events", newEvent, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        alert("Event created successfully!");
        fetchEvents(); // Refresh events list
        setShowEventModal(false); // Close modal
        setEventDetails({
          title: "",
          description: "",
          date: "",
          time: "",
          location: ""
        });
      }
    } catch (err) {
      console.error("Error saving event:", err);
      alert("Failed to create event.");
    }
  };

  // Custom styling for holidays and events
  const eventColor = (info) => {
    const eventDate = info.event.start.toISOString().split("T")[0];
    if (holidays.includes(eventDate)) {
      return {
        backgroundColor: "#ffddc1" // Light red color for holidays
      };
    }
    return {}; // Default color for events
  };

   // Function to show tooltip on event hover
   const handleEventMouseEnter = (info) => {
    tippy(info.el, {
      content: `
        <strong>${info.event.title}</strong><br/>
        Date: ${info.event.start.toISOString().split("T")[0]}<br/>
        Time: ${info.event.extendedProps.time}<br/>
        Location: ${info.event.extendedProps.location}
      `,
      allowHTML: true,
      placement: "top",
      animation: "fade",
    });
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick} // Trigger modal on date click
        eventClassNames={eventColor} // Apply custom color to events
        eventMouseEnter={handleEventMouseEnter} // Tooltip on hover

      />

      {showEventModal && (
        <div className="event-modal">
          <div className="addEvent"> 
            <h3>Add Event</h3>
          </div>
          <input
            type="text"
            placeholder="Event Title"
            value={eventDetails.title}
            onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
          />
          <textarea
            placeholder="Event Description"
            value={eventDetails.description}
            onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
          />
          <input
            type="date"
            value={eventDetails.date}
            onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
          />
          <input
            type="time"
            value={eventDetails.time}
            onChange={(e) => setEventDetails({ ...eventDetails, time: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location"
            value={eventDetails.location}
            onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange} // Handle image change
          />
          <button className="save-btn" onClick={handleEventSubmit}>Save</button>
          <button className="cancel-btn" onClick={() => setShowEventModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
