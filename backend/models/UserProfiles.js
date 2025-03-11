import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Ensure it's stored as ObjectId
    ref: 'User', // Reference to the User collection
    required: true,
    unique: true
  },
  bio: {
    type: String,
    default: ''
  },
  profilePhoto: {
    type: String,
    default: '/default-avatar.png'
  }
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;


