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
        <h3>✈️ טיסה {booking.flight_number}</h3>
        <span className={`booking-status-tag ${isConfirmed ? 'confirmed' : 'cancelled'}`}>
          {isConfirmed ? 'מאושרת' : 'מבוטלת'}
        </span>
      </div>
      
      <div className="booking-card-body">
        <p><strong>מסלול:</strong> {booking.departure_city} ⬅️ {booking.arrival_city}</p>
        <p><strong>תאריך יציאה:</strong> {new Date(booking.departure_time).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' })}</p>
        <p><strong>מחיר כולל:</strong> ${booking.total_price}</p>
      </div>
    </div>
  );
}