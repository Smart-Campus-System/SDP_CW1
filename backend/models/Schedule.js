import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    description: { type: String }, 
    date: { type: Date, required: true }, 
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }, 
    location: { type: String }, 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  },
  { timestamps: true }
);

export default mongoose.model("Schedule", ScheduleSchema);
