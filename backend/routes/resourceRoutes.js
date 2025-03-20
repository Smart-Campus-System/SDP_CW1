import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Resource from "../models/Resource.js";
import NotificationService from "../utils/notificationService.js"; // ✅ Import notification utility

const router = express.Router();

// GET /api/resources/hallNames - Fetch all hall names from the halls array
router.get("/hallNames", authMiddleware, async (req, res) => {
  try {
    // Fetch all resources and their halls
    const resources = await Resource.find({}, "halls.hallName"); // Fetch only hallName from halls array

    // Extract all hall names from the halls array
    const hallNames = resources.flatMap(resource => resource.halls.map(hall => hall.hallName));

    // Return hall names as response
    res.json({ hallNames });
  } catch (error) {
    console.error("Error fetching halls:", error);
    res.status(500).json({ msg: "Server error", error });
  }
});

// ✅ Get One Seat by Seat Number and Hall ID
router.get("/seat/:hallId/:seatNumber", authMiddleware, async (req, res) => {
  try {
    const { hallId, seatNumber } = req.params;

    const resource = await Resource.findOne();
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    const hall = resource.halls.id(hallId);  // Find the hall by its ObjectId
    if (!hall) return res.status(404).json({ message: "Hall not found" });

    const seat = hall.seats.find(seat => seat.seatNumber === parseInt(seatNumber));
    if (!seat) return res.status(404).json({ message: "Seat not found" });

    res.status(200).json({ seat });
  } catch (error) {
    console.error("Error fetching seat:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Get All Hall IDs
router.get("/halls", authMiddleware, async (req, res) => {
  try {
    // Fetch the resource
    const resource = await Resource.findOne();
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Extract hall IDs from the resource
    const hallIds = resource.halls.map((hall) => hall._id); // Extract only the _id of each hall
    res.status(200).json({ hallIds });
  } catch (error) {
    console.error("Error fetching hall IDs:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});


// Fetch available seats for a hall
router.get("/availability/:hallName", authMiddleware, async (req, res) => {
  try {
    const hallName = req.params.hallName;

    // Fetch the hall with its seat information
    const resource = await Resource.findOne({ "halls.hallName": hallName });

    if (!resource) {
      return res.status(404).json({ message: "Hall not found" });
    }

    const hall = resource.halls.find((h) => h.hallName === hallName);

    // Respond with all seats including their booking status
    res.status(200).json({ seats: hall.seats });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// Updated backend endpoint to handle date, start and end time for seat booking
router.post("/book", authMiddleware, async (req, res) => {
  try {
    const { hallName, seatNumber, bookingDate, startTime, endTime } = req.body;
    const userId = req.user._id; // Get the logged-in user's ID

    const resource = await Resource.findOne();
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Find the hall and the seat by seat number
    const hall = resource.halls.find(hall => hall.hallName === hallName);
    if (!hall) {
      return res.status(404).json({ message: "Hall not found" });
    }

    const seat = hall.seats.find(seat => seat.seatNumber === seatNumber);
    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    // Check if the seat is already booked
    if (seat.isBooked) {
      return res.status(400).json({ message: "Seat already booked" });
    }

    // Book the seat with the provided date and time range
    seat.isBooked = true;
    seat.bookedBy = userId;
    seat.bookedAt = new Date();
    seat.bookingDate = bookingDate; // Store the selected booking date
    seat.startTime = startTime;     // Store the start time
    seat.endTime = endTime;         // Store the end time

    await resource.save();
    res.status(200).json({ message: "Seat booked successfully!" });
  } catch (error) {
    console.error("Error booking seat:", error);
    res.status(500).json({ message: "Server error", error });
  }
});



// ✅ Cancel Seat Reservation (Students)
router.post("/cancel", authMiddleware, async (req, res) => {
  try {
    const { hallName, seatNumber } = req.body;
    const userId = req.user._id; // Get the logged-in user's ID

    const resource = await Resource.findOne();
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" }); // Resource not found
    }

    // Find the hall by its name
    const hall = resource.halls.find(hall => hall.hallName === hallName); // Find hall by name
    if (!hall) {
      return res.status(404).json({ message: "Hall not found" }); // Hall not found
    }

    // Find the seat in the selected hall by seatNumber
    const seat = hall.seats.find(seat => seat.seatNumber === seatNumber); // Find seat by number
    if (!seat) {
      return res.status(404).json({ message: "Seat not found" }); // Seat not found
    }

    // Check if the seat is booked and if the user is the one who booked it
    if (!seat.isBooked || (seat.bookedBy && seat.bookedBy.toString() !== userId.toString())) {
      return res.status(400).json({ message: "Cannot cancel this seat" }); // Seat not booked or not owned by user
    }

    // Cancel seat reservation
    seat.isBooked = false; // Mark as available
    seat.bookedBy = null; // Remove booking user
    seat.bookedAt = null; // Clear booking time
    await resource.save(); // Save changes to the database

    res.status(200).json({ message: `Seat ${seatNumber} in ${hall.hallName} canceled successfully!` });
  } catch (error) {
    console.error("Cancel Booking Error:", error); // Log the entire error object
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


// ✅ Book Entire Hall by Hall Name (Lecturer/Admin only)
router.post("/bookHall", authMiddleware, async (req, res) => {
  try {
    // Ensure the user is a lecturer or admin
    if (req.user.role !== "admin" && req.user.role !== "lecturer") {
      return res.status(403).json({ message: "Unauthorized: Only lecturers or admins can book entire halls." });
    }

    const { hallName } = req.body;  // Get hall name from the request body

    // Find the resource and the specific hall by hall name
    const resource = await Resource.findOne();
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    // Find the hall by its name
    const hall = resource.halls.find(hall => hall.hallName === hallName);
    if (!hall) return res.status(404).json({ message: "Hall not found" });

    // ✅ Book all seats in the hall
    hall.seats.forEach((seat) => {
      if (!seat.isBooked) {
        seat.isBooked = true;
        seat.bookedBy = req.user._id;
        seat.bookedAt = new Date();
      }
    });

    await resource.save();
    res.status(200).json({ message: `Hall ${hallName} booked successfully!` });
  } catch (error) {
    console.error("Hall Booking Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// GET /api/resources/locations - Fetch all hall names from the resources collection
router.get('/locations', authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findOne();
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Extract hall names from the resource data
    const locations = resource.halls.map(hall => hall.hallName);

    res.status(200).json({ locations });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: 'Server error', error });
  }
});




export default router;
