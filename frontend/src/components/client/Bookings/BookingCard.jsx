import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ייבוא ה-Navigate לניווט
import { cancelOwnBooking } from '../../../API/bookingAPI.js'; // ייבוא הפונקציה לביטול הזמנה
import '../../../style/Bookings/BookingCard.css'; // ייבוא ה-CSS של כרטיס ההזמנה
export default function BookingCard({ booking, onBookingCancelled }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // הגדרת הניווט

  // ולידציה מקומית - האם נותרו יותר מ-24 שעות להמראה
  const canCancel = () => {
    if (booking.status !== 'confirmed') return false;
    
    const departureTime = new Date(booking.departure_time);
    const now = new Date();
    const hoursRemaining = (departureTime - now) / (1000 * 60 * 60);
    
    return hoursRemaining >= 24;
  };

  const handleCancelClick = async (e) => {
    e.stopPropagation(); // מונע מהלחיצה על הביטול לעבור לעמוד הפרטים!

    if (!window.confirm("האם אתה בטוח שברצונך לבטל את ההזמנה? פעולה זו סופית.")) return;

    try {
      setLoading(true);
      await cancelOwnBooking(booking.booking_id);
      alert("ההזמנה בוטלה בהצלחה.");
      
      if (onBookingCancelled) {
        onBookingCancelled(); // מרענן את העמוד
      }
    } catch (err) {
      alert(err.response?.data?.message || "שגיאה בתהליך ביטול ההזמנה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="booking-card" 
      onClick={() => navigate(`/my-bookings/${booking.booking_id}`)} // מעבר לעמוד הפרטים בלחיצה על הכרטיס
    >
      <div className="booking-card-header">
        <h3>הזמנה #{booking.booking_id}</h3>
        {/* החזרתי את הסטטוסים המקוריים שלך (confirmed / cancelled) באותיות קטנות */}
        <span className={`booking-status-tag ${booking.status}`}>
          {booking.status === 'confirmed' ? 'confirmed' : 'cancelled'}
        </span>
      </div>

      <div className="booking-card-body">
        <p><strong>טיסה מספר:</strong> {booking.flight_number}</p>
        <p><strong>מסלול:</strong> {booking.departure_city} ← {booking.arrival_city}</p>
        <p><strong>מועד המראה:</strong> {new Date(booking.departure_time).toLocaleString('he-IL')}</p>
        
        {booking.return_flight_number && (
          <>
            <p style={{ marginTop: '8px', fontWeight: 'bold' }}>✈️ טיסת חזור:</p>
            <p><strong>טיסה מספר:</strong> {booking.return_flight_number}</p>
            <p><strong>מועד המראה חזור:</strong> {new Date(booking.return_departure_time).toLocaleString('he-IL')}</p>
          </>
        )}
        
        <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#1a202c' }}>
          סך הכל שולם: ₪{booking.total_price}
        </p>

        {/* כפתור הביטול המבודד */}
        {canCancel() && (
          <button 
            className="cancel-booking-btn"
            onClick={handleCancelClick}
            disabled={loading}
          >
            {loading ? 'מבטל...' : '❌ ביטול הזמנה'}
          </button>
        )}
      </div>
    </div>
  );
}