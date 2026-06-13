
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../Hooks/authContext.jsx";
import { UI_MESSAGES } from "../../constants/messages.js";
import ProfilePopup from "./profilePopUp.jsx";
import "../../style/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="app-header-nav">
      {/* צד שמאל - ניווט */}
      <nav className="nav-links-container">
        <NavLink to="/" className="nav-link-item">Search Flights</NavLink>
        <NavLink to="/destinations" className="nav-link-item">Destinations</NavLink>
        {user && <NavLink to="/my-bookings" className="nav-link-item">My Bookings</NavLink>}
      </nav>

      {/* צד ימין - פרופיל בלבד */}
      <div className="nav-user-actions">
        {user ? (
          /* מצב: משתמש מחובר (בלי ה-Welcome Message הישן) */
          <>
            <div className="profile-menu-wrapper">
              <button 
                onClick={() => setShowProfile(!showProfile)} 
                className="nav-avatar-btn logged-in"
                title="Profile Menu"
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>
              
              {showProfile && <ProfilePopup onClose={() => setShowProfile(false)} />}
            </div>

            <button onClick={handleLogout} className="nav-logout-btn">
              Logout
            </button>
          </>
        ) : (
          /* מצב: אורח מנותק */
          <button 
            onClick={() => navigate("/login")} 
            className="nav-avatar-btn guest"
            title="Login / Register"
          >
            👤
          </button>
        )}
      </div>
    </header>
  );
}