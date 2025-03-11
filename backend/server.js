import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // ✅ Ensure proper file paths
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import profileUserRoutes from './routes/profileUserRoutes.js'; // ✅ Import the profile routes


dotenv.config(); // ✅ Ensure environment variables load first

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Serve static files for uploads
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB Connection with Error Handling
mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Exit process if MongoDB fails to connect
  });

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Smart Campus API is running...");
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use('/api/users', profileUserRoutes);


// ✅ Start the Server After Defining Routes
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
