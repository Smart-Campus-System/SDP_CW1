import React from 'react';
import Navbar from './Navbar'; // Import Navbar
import Sidebar from './Sidebar'; // Import Sidebar

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div
        style={{
          marginLeft: '250px', // Space for the Sidebar
          paddingTop: '10px', // Space for the Navbar
          paddingRight: '2px',
          paddingLeft: '20px',
        }}
      >
        {children} {/* Render the content passed to the Layout */}
      </div>
    </div>
  );
};

export default Layout;
