import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ResourcePage.css"; // Import custom CSS for styling

const ResourcePage = () => {
  const token = localStorage.getItem("token");
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [loading, setLoading] = useState(false);
  const [halls, setHalls] = useState([]); // State to store hall IDs

  // Fetch hall IDs from the backend
  const fetchHalls = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/resources/halls", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHalls(response.data.hallIds); // Update halls with the hall IDs
    } catch (error) {
      console.error("Error fetching halls:", error);
      setHalls([]); // Ensure halls is an array even if fetching fails
    }
  };

  useEffect(() => {
    fetchHalls(); // Fetch hall IDs when the component mounts
  }, []);

  // Fetch available seats for a selected hall
  const fetchAvailability = async (hallId) => {
    try {
      if (!token) {
        console.error("Token is missing or invalid.");
        return;
      }

      console.log("Fetching availability for hallId:", hallId); // Debugging log

      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/resources/availability/${hallId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Availability response:", response.data); // Debugging log
      setAvailableSeats(response.data.availableSeats); // Set the available seats
      setLoading(false);
    } catch (error) {
      console.error("Error fetching availability:", error);
      console.error("Error details:", error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  // Book a seat
  const bookSeat = async (hallId, seatNumber) => {
    try {
      console.log("Booking seat:", { hallId, seatNumber }); // Debugging log
      await axios.post(
        "http://localhost:5000/api/resources/book",
        { hallId, seatNumber },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Seat booked successfully!");
      fetchAvailability(hallId); // Refresh availability
    } catch (error) {
      console.error("Error booking seat:", error); // Debugging log
      alert("Failed to book seat.");
    }
  };

  // Cancel seat reservation
  const cancelSeat = async (hallId, seatNumber) => {
    try {
      console.log("Canceling seat:", { hallId, seatNumber }); // Debugging log
      await axios.post(
        "http://localhost:5000/api/resources/cancel",
        { hallId, seatNumber },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Booking canceled successfully!");
      fetchAvailability(hallId); // Refresh availability
    } catch (error) {
      console.error("Error canceling seat:", error); // Debugging log
      alert("Failed to cancel booking.");
    }
  };

  // Book entire hall (admin/lecturer only)
  const bookEntireHall = async (hallId) => {
    try {
      console.log("Booking entire hall:", { hallId }); // Debugging log
      await axios.post(
        "http://localhost:5000/api/resources/bookHall",
        { hallId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Hall booked successfully!");
      fetchAvailability(hallId); // Refresh availability
    } catch (error) {
      console.error("Error booking hall:", error); // Debugging log
      alert("Failed to book the hall.");
    }
  };

  // Handle hall selection
  const handleHallSelect = (hallId) => {
    setSelectedHall(hallId);
    fetchAvailability(hallId); // Fetch available seats for selected hall
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
          {halls && halls.map((hallId) => (
            <option key={hallId} value={hallId}>
              {`Hall ${hallId}`} {/* Display the hall number or name */}
            </option>
          ))}
        </select>
      </div>

      {/* Display Available Seats */}
      {selectedHall && (
        <div className="seats-availability">
          <h3>Available Seats in Hall {selectedHall}</h3>
          {loading ? (
            <p>Loading availability...</p>
          ) : (
            <div className="seats-grid">
              {availableSeats.length > 0 ? (
                availableSeats.map((seat) => (
                  <div
                    key={seat.seatNumber}
                    className={`seat ${seat.isBooked ? "booked" : "available"}`}
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
