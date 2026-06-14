import React from 'react';
import AdminBookingCard from './AdminBookingCard.jsx';
import '../../../style/Admin/AdminBookingList.css';
export default function AdminBookingList({ bookings, userId, onRefresh, onEditClick }) {
  if (!bookings || bookings.length === 0) {
    return <p className="no-data-msg">לא נמצאו הזמנות עבור משתמש זה.</p>;
  }

  return (
    <div className="admin-cards-grid">
      {bookings.map((booking) => (
        <AdminBookingCard 
          key={booking.booking_id} 
          booking={booking} 
          userId={userId}
          onRefresh={onRefresh}
          onEditClick={() => onEditClick(booking)}
        />
      ))}
    </div>
  );
}