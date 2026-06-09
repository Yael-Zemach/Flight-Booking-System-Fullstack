import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById } from '../../../API/bookingAPI'; // ייבוא הפונקציה המעודכנת
import '../../../style/Bookings/BookingDetailsPage.css'; // ייבוא הסטייל החדש





export default function BookingDetailsPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // סטייט ייעודי לשגיאות שרת

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null); // איפוס שגיאות ישנות לפני שליפה חדשה
        
        // קריאה ישירה וממוקדת ל-API החדש שיצרנו לפי ה-ID מה-URL
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (err) {
        // בזכות ה-Double Protection ב-api.js, הודעות השרת המקוריות שלך ינחתו פה!
        setError(err.message); 
      } finally {
        setLoading(false);
      }
    };
    
    if (bookingId) {
      fetchDetail();
    }
  }, [bookingId]);

  // 1. רינדור מצב טעינה
  if (loading) return <div className="bookings-loading">טוען פרטי הזמנה...</div>;
  
  // 2. רינדור מצב שגיאה (כאן יוצגו השגיאות המקוריות מהשרת, כמו 404 או 403)
  if (error) return (
    <div className="booking-details-container">
      <button className="back-to-bookings-btn" onClick={() => navigate('/my-bookings')}>
        🔙 חזרה לכל ההזמנות
      </button>
      <div className="bookings-error" style={{ fontSize: '1.2em', marginTop: '20px', textAlign: 'center' }}>
        ⚠️ {error}
      </div>
    </div>
  );

  // 3. הגנה כללית במידה והנתונים חזרו ריקים
  if (!booking) return <div className="bookings-loading">לא נמצא מידע עבור הזמנה זו.</div>;

  // 4. רינדור הנתונים בהצלחה (סטטוס 200 מהשרת)
  return (
    <div className="booking-details-container">
      <button className="back-to-bookings-btn" onClick={() => navigate('/my-bookings')}>
        🔙 חזרה לכל ההזמנות
      </button>

      <div className="details-card">
        <div className="details-main-header">
          <h2>📋 סיכום הזמנה מס' {booking.booking_id}</h2>
          <span className={`details-status-badge ${booking.status === 'confirmed' ? 'confirmed' : 'cancelled'}`}>
            {booking.status === 'confirmed' ? '🟢 מאושרת' : '🔴 מבוטלת'}
          </span>
        </div>

        <div className="details-section">
          <h3 className="details-section-title">✈️ פרטי הטיסה</h3>
          <p><strong>מספר טיסה:</strong> {booking.flight_number}</p>
          <p><strong>מוצא (Departure):</strong> {booking.departure_city} ({new Date(booking.departure_time).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' })})</p>
          <p><strong>יעד (Arrival):</strong> {booking.arrival_city} ({new Date(booking.arrival_time).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' })})</p>
          <p><strong>סה"כ עלות עסקאות:</strong> <span className="price-text">${booking.total_price}</span></p>
        </div>

        <div className="details-section">
          <h3 className="details-section-title">👥 נוסעים וכרטיסים בהזמנה זו ({booking.passengers?.length || 0})</h3>
          <div className="table-wrapper">
            <table className="passengers-data-table">
              <thead>
                <tr>
                  <th>שם פרטי</th>
                  <th>שם משפחה</th>
                  <th>מגדר</th>
                  <th>אימייל</th>
                  <th>טלפון</th>
                </tr>
              </thead>
              <tbody>
                {booking.passengers?.map((pax) => (
                  <tr key={pax.passenger_id}>
                    <td>{pax.first_name}</td>
                    <td>{pax.last_name}</td>
                    <td>{pax.gender === 'male' ? 'זכר' : pax.gender === 'female' ? 'נקבה' : 'אחר'}</td>
                    <td>{pax.email || '-'}</td>
                    <td>{pax.phone || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}