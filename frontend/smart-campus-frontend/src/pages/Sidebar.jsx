import React, { useState } from 'react';
import { FaCalendar, FaTasks, FaCog, FaBook} from 'react-icons/fa'; // Calendar, Scheduler, Modules icons
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Import external CSS file

const Sidebar = () => {
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);

  // Toggles for opening and closing dropdowns
  const toggleScheduler = () => setSchedulerOpen(!schedulerOpen);
  const toggleModules = () => setModulesOpen(!modulesOpen);

  const closeSchedulerDropdown = () => {
    setSchedulerOpen(false); // Close the scheduler dropdown when an option is selected
  };

  return (
    <div className="sidebar">
      {/* Dashboard Button */}
      <Link to="/dashboard">
        <button className="sidebar-button">
          <FaTasks className="icon" />
          Dashboard
        </button>
      </Link>

      {/* Scheduler Button with hover effect */}
      <button onClick={toggleScheduler} className="sidebar-button">
        <FaCog className="icon" />
        Scheduler
      </button>

      {/* Available Options Dropdown */}
      {schedulerOpen && (
        <div className="dropdown">
          <Link to="/scheduler">
            <button className="dropdown-option" onClick={closeSchedulerDropdown}>Lecture</button>
          </Link>
          <Link to="/scheduler">
            <button className="dropdown-option" onClick={closeSchedulerDropdown}>Guest Lecture</button>
          </Link>
          <Link to="/scheduler">
            <button className="dropdown-option" onClick={closeSchedulerDropdown}>Workshop</button>
          </Link>
          <Link to="/scheduler">
            <button className="dropdown-option" onClick={closeSchedulerDropdown}>Seminar</button>
          </Link>
          <Link to="/scheduler">
            <button className="dropdown-option" onClick={closeSchedulerDropdown}>Revision</button>
          </Link>
          <Link to="/event">
            <button className="dropdown-option" onClick={closeSchedulerDropdown}>Event</button>
          </Link>
        </div>
      )}

      {/* Calendar Button with Link */}
      <Link to="/calendar">
        <button className="sidebar-button">
          <FaCalendar className="icon" />
          Calendar
        </button>
      </Link>

      {/* Modules Dropdown with Link */}
      <Link to="/modules">
        <button onClick={toggleModules} className="sidebar-button">
          <FaBook className="icon" />
          Modules
        </button>
      </Link>
      {modulesOpen && (
        <div className="dropdown">
          {/* Add additional module options here */}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
