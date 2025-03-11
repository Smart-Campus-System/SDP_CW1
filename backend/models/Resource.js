import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema({
  seatNumber: Number,
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  bookedAt: { type: Date, default: null }
});

const LectureHallSchema = new mongoose.Schema({
  hallName: String,
  seats: [SeatSchema] // Stores 25 seats per hall
});

const ResourceSchema = new mongoose.Schema({
  halls: [LectureHallSchema] // Stores 5 lecture halls
});

const Resource = mongoose.model("Resource", ResourceSchema);
export default Resource;
