import React, { useState } from 'react';
import { adminCancelBooking } from '../../../API/bookingAPI';
import '../../../style/Admin/AdminBookingCard.css';
export default function AdminBookingCard({ booking, userId, onRefresh, onEditClick }) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
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

  // משתמשים בקלאס דינמי במקום inline style
  const cardStatusClass = booking.status === 'confirmed' ? 'status-confirmed' : 'status-cancelled';

  return (
    <div className={`admin-card ${cardStatusClass}`}>
      <div className="admin-card-content">
        <h3>הזמנה #{booking.booking_id}</h3>
        <p><strong>סטטוס:</strong> {booking.status === 'confirmed' ? '🟢 מאושר' : '🔴 מבוטל'}</p>
        <p><strong>טיסה:</strong> {booking.flight_number} | {booking.departure_city} ⬅️ {booking.arrival_city}</p>
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