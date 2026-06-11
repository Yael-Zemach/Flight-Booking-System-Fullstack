import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserIdByEmail } from '../../API/userAPI'; 
import '../../style/AdminUserSearchPage.css'; // ייבוא קובץ העיצוב החדש



export default function AdminUsersSearchPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

// בתוך AdminUsersSearchPage.jsx
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // כאן את צריכה להחליף את הכתובת לכתובת שקיימת בשרת שלך!
      const response = await getUserIdByEmail(email); 
      const userId = response.data.userId;
      navigate(`/admin/users-service/${userId}/bookings`);
      
    } catch (err) {
      // 🌟 התיקון: הצגת השגיאה המדויקת שמגיעה מהשרת
      const message = err.response?.data?.message || "שגיאת תקשורת עם השרת";
      setError(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <h1>ניהול לקוחות - מקרי חירום</h1>
        <p className="admin-dashboard-subtitle">הזן אימייל של לקוח כדי לצפות, לערוך או לבטל את ההזמנות שלו</p>
        <hr className="admin-dashboard-divider" />
      </header>

      <main className="admin-search-main">
        <form onSubmit={handleSearchSubmit} className="admin-search-form">
          
          <div className="form-group">
            <label htmlFor="user-email" className="form-label">חיפוש לפי אימייל לקוח:</label>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              required
              className="form-input"
            />
          </div>

          {error && <div className="form-error-msg">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className={`search-submit-btn ${loading ? 'btn-disabled' : ''}`}
          >
            {loading ? 'מחפש משתמש...' : 'המשך לניהול הזמנות הלקוח'}
          </button>
        </form>
      </main>
    </div>
  );
}