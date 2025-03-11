import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Event title
    description: { type: String }, // Event description
    date: { type: Date, required: true }, // Event date
    time: { type: String, required: true }, // Event time
    location: { type: String, required: true }, // Event location
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin/Lecturer who created it
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Students attending the event
    notified: { type: Boolean, default: false } // New field for notification status
  },
  { timestamps: true }
);

export default mongoose.model("Event", EventSchema);
