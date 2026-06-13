import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../Hooks/authContext.jsx";
import { UI_MESSAGES } from "../../constants/messages.js";
import ProfilePopup from "../client/profilePopUp.jsx";
import "../../style/navbar.css";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header-nav">
      
      {/* צד שמאל - ניווט הנהלה */}
      <nav className="nav-links-container">
        <NavLink to="/admin/dashboard" className="nav-link-item">Dashboard</NavLink>
        <NavLink to="/admin/flights" className="nav-link-item">Manage Flights</NavLink>
        <NavLink to="/admin/airports" className="nav-link-item">Manage Airports</NavLink>
<NavLink to="/admin/users-service" className="nav-link-item">Users</NavLink>      </nav>
      {/* צד ימין - פרופיל מנהל והתנתקות */}
      <div className="nav-user-actions">
        <div className="profile-menu-wrapper">
          <button 
            onClick={() => setShowProfile(!showProfile)} 
            className="nav-avatar-btn logged-in"
            title="Admin Menu"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : '👑'}
          </button>
          
          {showProfile && <ProfilePopup onClose={() => setShowProfile(false)} />}
        </div>

        <button onClick={handleLogout} className="nav-logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
}