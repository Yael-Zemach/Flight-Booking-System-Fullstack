import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../style/Bookings/BookingCard.css'; // ייבוא ה-CSS של כרטיס הזמנה

export default function BookingCard({ booking }) {
  const navigate = useNavigate();
  const isConfirmed = booking.status === 'confirmed';

  return (
    <div 
      className="booking-card" 
      onClick={() => navigate(`/my-bookings/${booking.booking_id}`)}
    >
      <div className="booking-card-header">
        <h3>
          ✈️ טיסה {booking.flight_number} 
          {booking.return_flight_number && ` | 🔄 חזור: ${booking.return_flight_number}`}
        </h3>
        <span className={`booking-status-tag ${isConfirmed ? 'confirmed' : 'cancelled'}`}>
          {isConfirmed ? 'מאושרת' : 'מבוטלת'}
        </span>
      </div>
      
      <div className="booking-card-body">
        {/* פרטי הלוך */}
        <p><strong>מסלול הלוך:</strong> {booking.departure_city} ⬅️ {booking.arrival_city}</p>
        <p><strong>תאריך יציאה:</strong> {new Date(booking.departure_time).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' })}</p>
        
        {/* 🌟 פרטי חזור - יוצגו רק אם זו הזמנת הלוך ושוב */}
        {booking.return_flight_number && (
          <>
            <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px dashed #ccc' }} />
            <p><strong>מסלול חזור:</strong> {booking.return_departure_city} ⬅️ {booking.return_arrival_city}</p>
            <p><strong>תאריך חזור:</strong> {new Date(booking.return_departure_time).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' })}</p>
          </>
        )}

        <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #eee' }} />
        <p className="booking-card-total-price"><strong>מחיר כולל:</strong> ${booking.total_price}</p>
      </div>
    </div>
  );
}