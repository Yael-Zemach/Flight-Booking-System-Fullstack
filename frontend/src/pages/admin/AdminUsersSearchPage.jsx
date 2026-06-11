import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserIdByEmail } from '../../API/userAPI'; 
import '../../style/AdminUserSearchPage.css'; // ייבוא קובץ העיצוב החדש



export default function AdminUsersSearchPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await getUserIdByEmail(email); 
      // ✅ התיקון: ניגשים ישירות ל-userId מתוך התשובה
      const userId = response.userId;
      
      navigate(`/admin/users-service/${userId}/bookings`);
      
    } catch (err) {
      // ✅ התיקון: ה-api.js שלך זורק Error רגיל, אז ניגשים ישירות ל-err.message
      const message = err.message || "שגיאת תקשורת עם השרת";
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