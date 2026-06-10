import React, { useEffect, useState } from 'react';
import { getMyBookings } from '../../../API/bookingAPI';
import BookingCard from '../../../components/client/Bookings/BookingCard.jsx';
import '../../../style/Bookings/MyBookingsPage.css'; 

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // סטייטים לניהול הדפדוד
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 4; 

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getMyBookings(page, LIMIT);
        
        setBookings(data.bookings || []);
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [page]); 

  // חישוב סך כל העמודים
  const totalPages = Math.ceil(totalCount / LIMIT);

  if (loading && bookings.length === 0) return <div className="bookings-loading">טוען את ההזמנות שלך...</div>;
  if (error) return <div className="bookings-error">⚠️ {error}</div>;

  return (
    <div className="my-bookings-container">
      <h2>🧳 ההזמנות שלי ({totalCount})</h2>
      <p className="my-bookings-subtitle">כאן תוכל לצפות בהיסטוריית הטיסות המאושרות והמבוטלות שלך.</p>
      <hr className="my-bookings-divider" />
      
      {bookings.length === 0 ? (
        <p className="no-bookings-message">לא נמצאו הזמנות במערכת.</p>
      ) : (
        <>
          {/* 🌟 שימוש בקלאס דינמי נקי במקום אינליין סטייל לטעינה */}
          <div className={`bookings-list ${loading ? 'is-loading' : ''}`}>
            {bookings.map(booking => (
              <BookingCard key={booking.booking_id} booking={booking} />
            ))}
          </div>

          {/* 🌟 כפתורי הניווט החדשים עם קלאסים נקיים מה-CSS */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                className="pagination-btn"
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                ⬅️ הקודם
              </button>
              
              <span className="pagination-info">
                עמוד {page} מתוך {totalPages}
              </span>

              <button 
                className="pagination-btn"
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
              >
                הבא ➡️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}