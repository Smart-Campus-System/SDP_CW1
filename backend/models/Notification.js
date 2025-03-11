import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false }, // Mark as read/unread
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
