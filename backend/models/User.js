import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "student", "lecturer"], // Only these roles are allowed
    required: true,
  },
  modules: {
    type: [String], // Array to hold the selected modules
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
