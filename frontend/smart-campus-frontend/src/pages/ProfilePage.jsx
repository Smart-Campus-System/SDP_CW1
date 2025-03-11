import React, { useState, useEffect } from 'react';
import './ProfilePage.css'; // Import custom CSS for styling

const ProfilePage = () => {
  const token = localStorage.getItem('token');  // Get token from localStorage
  const userName = localStorage.getItem('userName');  // Get user name from localStorage
  const userEmail = localStorage.getItem('userEmail');  // Get user email from localStorage

  const [profile, setProfile] = useState({
    firstName: userName || '',
    email: userEmail || '',
    bio: '',
    profilePicture: null,
  });

  const [isEditable, setIsEditable] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Optionally, you can fetch user data from the backend if you need to
    // and update the profile state with that data
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create URL for the uploaded image
      setProfile({ ...profile, profilePicture: imageUrl });

      // Save the profile picture URL to localStorage
      localStorage.setItem('profilePicture', imageUrl);
    }
  };


  const handleSave = () => {
    setIsEditable(false);
    setIsSaved(true);
  };

  // Handle account deletion
  const handleDelete = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/register'; // Redirect to register page after deletion
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        <div className="profile-photo">
          <img
            src={profile.profilePicture || 'https://via.placeholder.com/120'}
            alt="Profile"
          />
          {isEditable && <input type="file" accept="image/*" onChange={handleImageUpload} />}
        </div>

        <div className="profile-form">
          <input
            type="text"
            name="firstName"
            value={profile.firstName}
            onChange={handleInputChange}
            disabled={!isEditable}
            placeholder="Full Name"
          />
          {/* <input
            type="text"
            name="lastName"
            value={profile.lastName}
            onChange={handleInputChange}
            disabled={!isEditable}
            placeholder="Last Name"
          /> */}
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            disabled={!isEditable}
            placeholder="Email"
          />
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
            disabled={!isEditable}
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="actions">
          <button className="save-btn" onClick={handleSave} disabled={!isEditable}>
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            Delete Account
          </button>
          <button className="sign-out-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
