import React, { useEffect, useState } from 'react';
import { getMyBookings } from '../../../API/bookingAPI';
import BookingCard from '../../../components/client/bookings/BookingCard';
import '../../../style/Bookings/MyBookingsPage.css'; // ייבוא הסטייל החדש

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch (err) {
        setError(err.message );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="bookings-loading">טוען את ההזמנות שלך...</div>;
  if (error) return <div className="bookings-error">⚠️ {error}</div>;

  return (
    <div className="my-bookings-container">
      <h2>🧳 ההזמנות שלי ({bookings.length})</h2>
      <p className="my-bookings-subtitle">כאן תוכל לצפות בהיסטוריית הטיסות המאושרות והמבוטלות שלך.</p>
      <hr className="my-bookings-divider" />
      
      {bookings.length === 0 ? (
        <p className="no-bookings-message">לא נמצאו הזמנות במערכת.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <BookingCard key={booking.booking_id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}