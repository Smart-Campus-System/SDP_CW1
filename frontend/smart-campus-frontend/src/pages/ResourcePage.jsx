import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ResourcePage.css"; // Import custom CSS for styling

const ResourcePage = () => {
  const token = localStorage.getItem("token");
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [loading, setLoading] = useState(false);
  const [halls, setHalls] = useState([]); // State to store hall names

  // Fetch hall names from the backend
  const fetchHalls = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/resources/hallNames", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if response.data.hallNames exists and is an array
      if (Array.isArray(response.data.hallNames)) {
        setHalls(response.data.hallNames); // Set hall names directly
      } else {
        console.error("Expected hallNames array but got:", response.data);
        setHalls([]); // If response format is incorrect, reset to an empty array
      }
    } catch (error) {
      console.error("Error fetching halls:", error);
      setHalls([]); // Ensure halls is an array even if fetching fails
    }
  };

  useEffect(() => {
    fetchHalls(); // Fetch hall names when the component mounts
  }, []);

  // Fetch available seats for a selected hall
  const fetchAvailability = async (hallName) => {
    try {
      if (!token) {
        console.error("Token is missing or invalid.");
        return;
      }

      console.log("Fetching availability for hall:", hallName); // Debugging log

      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/resources/availability/${hallName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Availability response:", response.data); // Debugging log

      // Set all seats, including booked ones
      setAvailableSeats(response.data.seats);  // Assuming backend returns all seats with status (booked or available)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching availability:", error);
      setLoading(false);
    }
  };



  // Book a seat
  const bookSeat = async (hallName, seatNumber) => {
    try {
      console.log("Booking seat:", { hallName, seatNumber }); // Debugging log
      await axios.post(
        "http://localhost:5000/api/resources/book",
        { hallName, seatNumber },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Seat booked successfully!");
      fetchAvailability(hallName); // Refresh availability and seat status by passing hallName
    } catch (error) {
      console.error("Error booking seat:", error); // Debugging log
      alert("Failed to book seat.");
    }
  };



  // Cancel seat reservation
  const cancelSeat = async (hallName, seatNumber) => {
    try {
      console.log("Canceling seat:", { hallName, seatNumber }); // Debugging log
      await axios.post(
        "http://localhost:5000/api/resources/cancel",
        { hallName, seatNumber },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Booking canceled successfully!");
      fetchAvailability(hallName); // Refresh availability and seat status
    } catch (error) {
      console.error("Error canceling seat:", error); // Debugging log
      alert("Failed to cancel booking.");
    }
  };


  // Book entire hall (admin/lecturer only)
  const bookEntireHall = async (hallName) => {
    try {
      console.log("Booking entire hall:", { hallName }); // Debugging log
      await axios.post(
        "http://localhost:5000/api/resources/bookHall",
        { hallName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Hall booked successfully!");
      fetchAvailability(hallName); // Refresh availability
    } catch (error) {
      console.error("Error booking hall:", error); // Debugging log
      alert("Failed to book the hall.");
    }
  };

  // Handle hall selection
  const handleHallSelect = (hallName) => {
    setSelectedHall(hallName);
    fetchAvailability(hallName); // Fetch available seats for selected hall
  };

  return (
    <div className="resource-page">
      <h2 className="heading">Lecture Hall Reservations</h2>

      {/* Dropdown for Hall Selection */}
      <div className="hall-selection">
        <select
          onChange={(e) => handleHallSelect(e.target.value)}
          className="hall-dropdown"
        >
          <option value="">Select a Hall</option>
          {halls && halls.map((hallName, index) => (
            <option key={index} value={hallName}>
              {hallName} {/* Display hall name */}
            </option>
          ))}
        </select>
      </div>

      {/* Display Available Seats */}
      {selectedHall && (
        <div className="seats-availability">
          <h3>Available Seats in {selectedHall}</h3>
          {loading ? (
            <p>Loading availability...</p>
          ) : (
            <div className="seats-grid">
              {availableSeats.length > 0 ? (
                availableSeats.map((seat) => (
                  <div
                    key={seat.seatNumber}
                    className={`seat ${seat.isBooked ? "booked" : "available"}`}
                    style={{
                      backgroundColor: seat.isBooked ? '#b1f0b7' : '#4caf50', // Red for booked, green for available
                    }}
                  >
                    <span>Seat {seat.seatNumber}</span>
                    {!seat.isBooked ? (
                      <button
                        className="seat-action-button"
                        onClick={() => bookSeat(selectedHall, seat.seatNumber)}
                      >
                        Book Seat
                      </button>
                    ) : (
                      <button
                        className="seat-action-button"
                        onClick={() => cancelSeat(selectedHall, seat.seatNumber)}
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p>No available seats in this hall.</p>
              )}
            </div>
          )}
        </div>
      )}




      {/* Option for lecturers/admins to book the entire hall */}
      {["lecturer", "admin"].includes(localStorage.getItem("role")) && (
        <div className="book-entire-hall">
          <button
            className="book-hall-button"
            onClick={() => bookEntireHall(selectedHall)}
          >
            Book Entire Hall
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourcePage;
