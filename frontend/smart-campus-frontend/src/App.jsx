import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import Layout from './pages/Layout';
import EventPage from './pages/EventPage';
import SchedulerPage from './pages/SchedularPage';
import ModulesPage from './pages/ModulesPage';
import ModuleDetailsPage from './pages/ModuleDetailsPage';
import ProfilePage from './pages/ProfilePage';
import ResourcePage from './pages/ResourcePage';
import Analytics from './pages/Analytics';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* HomePage without Navbar and Sidebar */}
        <Route path="/" element={<HomePage />} />

        {/* LoginPage and RegisterPage remain the same */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Wrap DashboardPage with Layout to include Navbar and Sidebar */}
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />
        <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
        <Route path="/event" element={<Layout><EventPage /></Layout>} />
        <Route path="/scheduler" element={<Layout><SchedulerPage /></Layout>} />
        <Route path="/modules" element={<Layout><ModulesPage /></Layout>} />
        <Route path="/modules/:moduleId" element={<Layout><ModuleDetailsPage /></Layout>} />
        <Route path="/resource" element={<Layout><ResourcePage /></Layout>} />
        <Route path="/profile" element={<ProfilePage />} />       
      </Routes>
    </Router>
  );
};

export default App;
