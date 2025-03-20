import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import profileUserRoutes from './routes/profileUserRoutes.js';
import Message from "./models/Message.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
};

// Connect to DB before starting server
connectDB().then(() => {
  // Test Route
  app.get("/", (req, res) => {
    res.send("Smart Campus API is running...");
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/schedules", scheduleRoutes);
  app.use("/api/resources", resourceRoutes);
  app.use("/api/events", eventRoutes);
  app.use("/api/modules", moduleRoutes);
  app.use("/api/assignments", assignmentRoutes);
  app.use('/api/users', profileUserRoutes);

  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await Message.find()
        .sort({ timestamp: -1 })
        .limit(50);
      res.json(messages.reverse());
    } catch (err) {
      console.error("Error fetching messages:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Socket.IO Connection
  io.on("connection", (socket) => {
    console.log("New client connected");

    Message.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .then((messages) => socket.emit("initMessages", messages.reverse()))
      .catch((err) => console.error("Error fetching messages:", err));

    socket.on("sendMessage", async (data) => {
      console.log("Received message data:", data); // Debug log
      try {
        if (!data.username || !data.message) {
          throw new Error("Username or message is missing");
        }
        const message = new Message({
          username: data.username,
          message: data.message,
        });
        const savedMessage = await message.save();
        console.log("Message saved:", savedMessage); // Debug log
        io.emit("newMessage", savedMessage);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("disconnect", () => console.log("Client disconnected"));
  });

  // Start the Server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});