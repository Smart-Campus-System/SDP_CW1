import React, { useState, useEffect } from "react";
import axios from "axios"; // Axios for API requests
import { ToastContainer, toast } from 'react-toastify'; // Toast notifications
import './ReactToastify.css';
import './ResourcePage.css'; // Import custom CSS for styling
import { FaMicrophone, FaChalkboard, FaPen, FaProjectDiagram } from "react-icons/fa"; // Import icons from react-icons


const ResourcePage = () => {
  const token = localStorage.getItem("token");
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [loading, setLoading] = useState(false);
  const [halls, setHalls] = useState([]); // State to store hall names

  // For modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);

  // For equipment booking modal
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [equipment, setEquipment] = useState({
    mic: 0,
    markerPen: 0,
    whiteBoard: 0,
    projectors: 0
  });

  // Fetch hall names from the backend
  const fetchHalls = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/resources/hallNames", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data.hallNames)) {
        setHalls(response.data.hallNames); // Set hall names directly
      } else {
        console.error("Expected hallNames array but got:", response.data);
        setHalls([]); // If response format is incorrect, reset to an empty array
      }
    } catch (error) {
      console.error("Error fetching halls:", error);
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

      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/resources/availability/${hallName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAvailableSeats(response.data.seats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching availability:", error);
      setLoading(false);
    }
  };

  // Book a seat with additional data (date & time)
  const bookSeat = async (hallName, seatNumber, bookingDate, startTime, endTime) => {
    try {
      await axios.post(
        "http://localhost:5000/api/resources/book",
        { hallName, seatNumber, bookingDate, startTime, endTime },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Seat booked successfully!");
      fetchAvailability(hallName); // Refresh availability after booking
      setShowModal(false); // Close the modal after booking
    } catch (error) {
      toast.error("Failed to book seat.");
    }
  };

  // Book entire hall with additional data (date, start time, and end time)
  const bookEntireHall = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/resources/bookHall",
        { hallName: selectedHall, bookingDate, startTime, endTime },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Entire hall booked successfully!");
      setShowBookingModal(false); // Close the modal after booking
      fetchAvailability(selectedHall); // Refresh availability after booking
    } catch (error) {
      toast.error("Failed to book entire hall.");
    }
  };

  // Handle equipment booking
  const handleEquipmentBooking = async () => {
    try {
      const equipmentData = {
        mic: equipment.mic,
        markerPen: equipment.markerPen,
        whiteBoard: equipment.whiteBoard
      };

      await axios.post(
        "http://localhost:5000/api/resources/bookEquipment",
        { equipment: equipmentData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Equipment booked successfully!");
      setShowEquipmentModal(false); // Close the modal after booking
    } catch (error) {
      toast.error("Failed to book equipment.");
    }
  };

  // Handle hall selection
  const handleHallSelect = (hallName) => {
    setSelectedHall(hallName);
    fetchAvailability(hallName); // Fetch available seats for selected hall
  };

  // Handle seat click, open modal
  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    setShowModal(true); // Show the modal when seat is clicked
  };

  // Cancel seat reservation
  const cancelSeat = async (hallName, seatNumber) => {
    try {
      await axios.post(
        "http://localhost:5000/api/resources/cancel",
        { hallName, seatNumber },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Booking canceled successfully!");
      fetchAvailability(hallName); // Refresh availability and seat status
    } catch (error) {
      toast.error("Error canceling seat.");
    }
  };

  // Handle the modal input change for booking details (date, start time, end time)
  const handleBookingDetailsChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({
      ...bookingDetails,
      [name]: value,
    });
  };

  // Handle book entire hall button click
  const handleBookEntireHall = (hallName) => {
    setShowBookingModal(true); // Show the booking modal when the button is clicked
    setSelectedHall(hallName); // Store the selected hall
  };

  return (
    <div className="resource-page">
      <h2 className="heading">Lecture Hall Reservations</h2>

      {/* Dropdown for Hall Selection */}
      <div className="hall-selection">
        <select onChange={(e) => handleHallSelect(e.target.value)} className="hall-dropdown">
          <option value="">Select a Hall</option>
          {halls &&
            halls.map((hallName, index) => (
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
                      backgroundColor: seat.isBooked ? "#b1f0b7" : "#4caf50", // Green for available, light green for booked
                    }}
                  >
                    <span>Seat {seat.seatNumber}</span>
                    {!seat.isBooked ? (
                      <button
                        className="seat-action-button"
                        onClick={() => handleSeatClick(seat)} // Open modal to book seat
                      >
                        Book Seat
                      </button>
                    ) : (
                      <button
                        className="seat-action-button"
                        onClick={() => cancelSeat(selectedHall, seat.seatNumber)}
                      >
                        Cancel Booking
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



      {showModal && (
        <div className="seat-booking-modal">
          <div className="modal-form">
            <label htmlFor="date">Select Date</label>
            <input
              type="date"
              id="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
            />

            <label htmlFor="startTime">Select Start Time</label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />

            <label htmlFor="endTime">Select End Time</label>
            <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />

            <button
              className="seat-action-button"
              onClick={() => bookSeat(selectedHall, selectedSeat.seatNumber, bookingDate, startTime, endTime)}
            >
              Confirm Booking
            </button>
            <button
              className="cancel-action-button"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}



      {/* Equipment Booking Modal */}
      {showEquipmentModal && (
        <div className="equipment-booking-modal">
          <div className="eq-modal-content">
            <h3>Book Equipment</h3>

            <div className="eq-form-group">
              <label htmlFor="mic">
                <FaMicrophone style={{ marginRight: "8px" }} />
                Mic:
              </label>
              <input
                type="number"
                id="mic"
                value={equipment.mic}
                onChange={(e) => setEquipment({ ...equipment, mic: e.target.value })}
                min="0"
              />
            </div>

            {/* Marker Pen Field */}
            <div className="eq-form-group">
              <label htmlFor="markerPen">
                <FaPen style={{ marginRight: "8px" }} />
                Marker Pen:
              </label>
              <input
                type="number"
                id="markerPen"
                value={equipment.markerPen}
                onChange={(e) => setEquipment({ ...equipment, markerPen: e.target.value })}
                min="0"
              />
            </div>

            {/* Whiteboard Field */}
            <div className="eq-form-group">
              <label htmlFor="whiteBoard">
                <FaChalkboard style={{ marginRight: "8px" }} />
                Whiteboard:
              </label>
              <input
                type="number"
                id="whiteBoard"
                value={equipment.whiteBoard}
                onChange={(e) => setEquipment({ ...equipment, whiteBoard: e.target.value })}
                min="0"
              />
            </div>

            {/* Projector Field */}
            <div className="eq-form-group">
              <label htmlFor="projector">
                <FaProjectDiagram style={{ marginRight: "8px" }} />
                Projectors:
              </label>
              <input
                type="number"
                id="projector"
                value={equipment.projectors}
                onChange={(e) => setEquipment({ ...equipment, projectors: e.target.value })}
                min="0"
              />
            </div>

            <button className="eq-submit-btn2" onClick={handleEquipmentBooking}>
              Confirm Booking
            </button>
            <button className="eq-cancel-btn2" onClick={() => setShowEquipmentModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Equipment Booking Button */}
      {["lecturer", "admin"].includes(localStorage.getItem("role")) && (
        <div className="button-container">
          <button
            className="book-hall-button"
            onClick={() => handleBookEntireHall(selectedHall)}
          >
            Book Entire Hall
          </button>

          <button
            className="book-equipment-button"
            onClick={() => setShowEquipmentModal(true)}
          >
            Book Equipment
          </button>
        </div>
      )}

      {/* Book Entire Hall Button (Lecturers/Admin only) */}
      {/* {["lecturer", "admin"].includes(localStorage.getItem("role")) && (
        <div className="book-entire-hall">
          <button
            className="book-hall-button"
            onClick={() => handleBookEntireHall(selectedHall)}
          >
            Book Entire Hall
          </button>
        </div>
      )} */}

      {/* Modal for Entire Hall Booking */}
      {showBookingModal && (
        <div className="booking-modal">
          <div className="modal-content">
            <h3>Book Entire Hall: {selectedHall}</h3>
            <div className="form-group">
              <label htmlFor="bookingDate">Date</label>
              <input
                type="date"
                id="bookingDate"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
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
            <button className="submit-btn1" onClick={bookEntireHall}>
              Confirm Booking
            </button>
            <button className="cancel-btn" onClick={() => setShowBookingModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />
    </div>
  );
};

export default ResourcePage;
