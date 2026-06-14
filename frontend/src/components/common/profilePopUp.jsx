import { useState } from "react";
import { useAuth } from "../../Hooks/authContext.jsx";
import { UI_MESSAGES } from "../../constants/messages.js";
import ProfileEditForm from "./profileEditForm.jsx";
import "../../style/profilePopUp.css";

export default function ProfilePopup({ onClose }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="profile-popup-container">
      {!isEditing ? (
        <div className="profile-details-view" style={{ textAlign: 'left' }}>
          <h3 className="profile-popup-title">My Profile</h3>
          <p className="profile-info-text"><strong>Name:</strong> {user?.name}</p>
          <p className="profile-info-text"><strong>Email:</strong> {user?.email}</p>
          
          <div className="profile-popup-actions">
            <button onClick={() => setIsEditing(true)} className="profile-edit-trigger-btn">Edit Details</button>
            <button onClick={onClose} className="profile-close-btn">Close</button>
          </div>
        </div>
      ) : (
        <ProfileEditForm 
          onCancel={() => setIsEditing(false)} 
          onComplete={() => setIsEditing(false)} 
        />
      )}
    </div>
  );
}