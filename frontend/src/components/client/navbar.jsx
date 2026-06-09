import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../Hooks/authContext.jsx";
import ProfilePopup from "./profilePopUp.jsx";
import "../../style/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header-nav">
      {/* Left side - Navigation */}
      <nav className="nav-links-container">
        <NavLink to="/" className="nav-link-item">Search Flights</NavLink>
        <NavLink to="/my-bookings" className="nav-link-item">My Bookings</NavLink>
      </nav>

      {/* Right side - User and actions */}
      <div className="nav-user-actions">
        <span className="user-welcome-msg">Hello, {user?.name}</span>
        
        <div className="profile-menu-wrapper">
          <button 
            onClick={() => setShowProfile(!showProfile)} 
            className="nav-profile-btn"
          >
            Profile
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