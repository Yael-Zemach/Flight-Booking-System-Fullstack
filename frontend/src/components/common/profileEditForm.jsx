import { useState } from "react";
import { updateMyProfile } from "../../API/userAPI.js";
import { useAuth } from "../../Hooks/authContext.jsx";
import { UI_MESSAGES } from "../../constants/messages.js";
import "../../style/profileEditForm.css";

export default function ProfileEditForm({ onCancel, onComplete }) {
  const { user, updateLocalUser } = useAuth();
  
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateMyProfile({ name });
      updateLocalUser({ name });
      onComplete();
    } catch (err) {
      setError(UI_MESSAGES.profile.updateError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="profile-edit-form">
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder={UI_MESSAGES.auth.fullNamePlaceholder}
        className="profile-input-field"
        required 
      />
      <input 
        type="email" 
        value={user?.email || ""} 
        className="profile-input-field"
        disabled 
        title={UI_MESSAGES.profile.emailDisabledTitle}
        style={{ backgroundColor: '#e2e8f0', color: '#64748b', cursor: 'not-allowed' }}
      />
      {error && <p className="profile-error-message">{error}</p>}
      
      <div className="profile-form-buttons">
        <button type="submit" disabled={loading} className="profile-save-btn">
          {loading ? UI_MESSAGES.profile.saving : UI_MESSAGES.profile.saveChanges}
        </button>
        <button type="button" onClick={onCancel} disabled={loading} className="profile-cancel-btn">
          {UI_MESSAGES.profile.cancel}
        </button>
      </div>
    </form>
  );
}