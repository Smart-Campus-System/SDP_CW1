import express from 'express';
import mongoose from 'mongoose';
import UserProfile from '../models/UserProfiles.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/test', authMiddleware, (req, res) => {
  console.log("🔹 JWT Decoded User ID:", req.user.id);
  res.status(200).json({ userId: req.user.id });
});


// POST /profile - Create or Update Profile
router.post('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extract userId from JWT token
    console.log("🔹 Received User ID from token:", userId);

    if (!userId) {
      return res.status(400).json({ msg: 'User ID missing from token' });
    }

    // Convert userId to ObjectId (ensure correct format)
    const objectId = new mongoose.Types.ObjectId(userId);
    console.log("🔹 Converted ObjectId:", objectId);

    // Extract data from request body
    const { bio, profilePhoto } = req.body;
    console.log("🔹 Received Data - Bio:", bio, "Profile Photo:", profilePhoto);

    // Check if the profile already exists
    let userProfile = await UserProfile.findOne({ userId: objectId });
    console.log("🔹 User Profile Found:", userProfile);

    if (!userProfile) {
      // Create a new user profile
      userProfile = new UserProfile({
        userId: objectId, // Store userId as ObjectId
        bio: bio || '',
        profilePhoto: profilePhoto || '/default-avatar.png'
      });

      await userProfile.save();
      console.log("New Profile Created:", userProfile);
      return res.status(201).json({ msg: 'Profile created successfully', userProfile });
    }

    // Update the existing profile
    userProfile.bio = bio || userProfile.bio;
    userProfile.profilePhoto = profilePhoto || userProfile.profilePhoto;
    await userProfile.save();
    console.log("Profile Updated Successfully:", userProfile);

    res.status(200).json({ msg: 'Profile updated successfully', userProfile });

  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ msg: 'Server error', error });
  }
});


// Get User Profile - Fetch user's profile data
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Find user profile using the userId extracted from JWT token
    const userProfile = await UserProfile.findOne({ userId: req.user.id })
      .populate({
        path: 'userId',  // Populate from the User collection
        select: 'name email _id' // Fetch name, email, and userId
      });

    // Check if the profile exists
    if (!userProfile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    // Construct response object to send user profile data
    const response = {
      userId: userProfile.userId._id,  // Extract userId from populated data
      name: userProfile.userId.name,   // Extract name from populated data
      email: userProfile.userId.email, // Extract email from populated data
      bio: userProfile.bio,
      profilePhoto: userProfile.profilePhoto
    };

    res.status(200).json(response); // Send user profile data
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ msg: 'Server error', error });
  }
});


// Edit Bio - Save bio to UserProfile collection
router.put('/editBio', authMiddleware, async (req, res) => {
  const { bio } = req.body; // Get bio from request body
  try {
    // Ensure user profile exists using the decoded user ID
    const userProfile = await UserProfile.findOne({ userId: req.user.id });

    if (!userProfile) {
      // Create a new profile if not found
      const newProfile = new UserProfile({
        userId: req.user.id,  // Save the userId from the decoded token
        bio,                  // Save the bio
      });
      await newProfile.save();
      return res.status(200).json({ bio: newProfile.bio });
    }

    // Update existing profile if found
    userProfile.bio = bio;
    await userProfile.save();
    res.status(200).json({ bio: userProfile.bio });
  } catch (error) {
    console.error('Error updating bio:', error);
    res.status(500).json({ msg: 'Server error', error });
  }
});



// Upload Profile Photo - Save profile photo to UserProfile collection
router.post('/uploadPhoto', authMiddleware, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user.id });
    if (!userProfile) {
      const newProfile = new UserProfile({
        userId: req.user.id,
        profilePhoto: `/uploads/${req.file.filename}`,
      });
      await newProfile.save();
    } else {
      userProfile.profilePhoto = `/uploads/${req.file.filename}`;
      await userProfile.save();
    }
    res.status(200).json({ profilePhoto: userProfile.profilePhoto });
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ msg: 'Server error', error });
  }
});

export default router;
