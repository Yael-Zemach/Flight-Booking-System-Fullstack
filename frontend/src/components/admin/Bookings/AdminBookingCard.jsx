import React, { useState } from 'react';
import { adminCancelBooking } from '../../../API/bookingAPI';
import '../../../style/Admin/AdminBookingCard.css';

export default function AdminBookingCard({ booking, userId, onRefresh, onEditClick }) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    // 🔥 תוקן: הטקסט נסגר בתוך Backticks כדי לאפשר שימוש ב-${}
    if (!window.confirm(`האם אתה בטוח שברצונך לבטל את ההזמנה ${booking.booking_id}? הפעולה תחזיר את המושבים לטיסה.`)) return;
    
    try {
      setIsCancelling(true);
      await adminCancelBooking(userId, booking.booking_id);
      alert('ההזמנה בוטלה בהצלחה.');
      onRefresh(); 
    } catch (error) {
      alert(error.message || 'שגיאה בביטול ההזמנה');
    } finally {
      setIsCancelling(false);
    }
  };

  // משתמשים בקלאס דינמי בצורה תקינה - תומך כעת גם ב-pending
  const cardStatusClass = 
    booking.status === 'confirmed' ? 'status-confirmed' : 
    booking.status === 'pending' ? 'status-pending' : 'status-cancelled';

  return (
    // 🔥 תוקן: הסינטקס של ה-className שונה ל-Template Literal חוקי ב-JSX
    <div className={`admin-card ${cardStatusClass}`}>
      <div className="admin-card-content">
        <h3>הזמנה #{booking.booking_id}</h3>
        <p>
          <strong>סטטוס:</strong>{' '}
          {booking.status === 'confirmed' && '🟢 מאושר'}
          {booking.status === 'cancelled' && '🔴 מבוטל'}
        </p>
        
        {/* 🛫 פרטי טיסת הלוך */}
        <p>
          <strong>🛫 טיסת הלוך:</strong> {booking.flight_number} | {booking.departure_city} ⬅️ {booking.arrival_city}
        </p>

        {/* 🌟 רינדור מותנה של טיסת חזור במידה והיא קיימת בהזמנה מה-DB */}
        {booking.return_flight_number && (
          <p className="return-flight-line">
            <strong>🛬 טיסת חזור:</strong> {booking.return_flight_number} | {booking.return_departure_city} ⬅️ {booking.return_arrival_city}
          </p>
        )}

        <p><strong>סה"כ שולם:</strong> ${booking.total_price}</p>
        <p><strong>כמות נוסעים:</strong> {booking.passengers?.length || 0}</p>
      </div>
      
      <div className="admin-card-actions">
        {booking.status !== 'cancelled' && (
          <button className="admin-btn-edit" onClick={onEditClick}>
            ✏️ עריכת הזמנה
          </button>
        )}
        
        {booking.status !== 'cancelled' && (
          <button className="admin-btn-cancel" onClick={handleCancel} disabled={isCancelling}>
            {isCancelling ? 'מבטל...' : '🛑 ביטול חירום'}
          </button>
        )}
      </div>
    </div>
  );
}