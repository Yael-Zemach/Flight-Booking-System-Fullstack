import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cancelOwnBooking } from '../../../API/bookingAPI.js';
import { UI_MESSAGES } from '../../../constants/messages.js';
import '../../../style/Bookings/BookingCard.css';
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

    if (!window.confirm(UI_MESSAGES.booking.cancelConfirm)) return;

    try {
      setLoading(true);
      await cancelOwnBooking(booking.booking_id);
      alert(UI_MESSAGES.booking.cancelSuccess);
      
      if (onBookingCancelled) {
        onBookingCancelled(); // מרענן את העמוד
      }
    } catch (err) {
      alert(err.response?.data?.message || UI_MESSAGES.booking.cancelError);
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
        <h3>{UI_MESSAGES.booking.bookingLabel}{booking.booking_id}</h3>
        {/* החזרתי את הסטטוסים המקוריים שלך (confirmed / cancelled) באותיות קטנות */}
        <span className={`booking-status-tag ${booking.status}`}>
          {booking.status === 'confirmed' ? UI_MESSAGES.booking.bookingConfirmed : UI_MESSAGES.booking.bookingCancelled}
        </span>
      </div>

      <div className="booking-card-body">
        <p><strong>{UI_MESSAGES.booking.flightNumberLabel}</strong> {booking.flight_number}</p>
        <p><strong>{UI_MESSAGES.booking.routeLabel}</strong> {booking.departure_city} ← {booking.arrival_city}</p>
        <p><strong>{UI_MESSAGES.booking.departureTimeLabel}</strong> {new Date(booking.departure_time).toLocaleString('he-IL')}</p>
        
        {booking.return_flight_number && (
          <>
            <p style={{ marginTop: '8px', fontWeight: 'bold' }}>{UI_MESSAGES.booking.returnFlightLabel}</p>
            <p><strong>{UI_MESSAGES.booking.flightNumberLabel}</strong> {booking.return_flight_number}</p>
            <p><strong>{UI_MESSAGES.booking.returnDepartureLabel}</strong> {new Date(booking.return_departure_time).toLocaleString('he-IL')}</p>
          </>
        )}
        
        <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#1a202c' }}>
          {UI_MESSAGES.booking.totalPaidLabel} ${booking.total_price}
        </p>

        {/* כפתור הביטול המבודד */}
        {canCancel() && (
          <button 
            className="cancel-booking-btn"
            onClick={handleCancelClick}
            disabled={loading}
          >
            {loading ? UI_MESSAGES.booking.cancellingButton : UI_MESSAGES.booking.cancelButton}
          </button>
        )}
      </div>
    </div>
  );
}