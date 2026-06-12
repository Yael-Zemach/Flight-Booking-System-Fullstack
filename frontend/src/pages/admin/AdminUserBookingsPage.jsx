import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminGetUserBookings } from '../../API/bookingAPI';
import AdminBookingList from '../../components/admin/Bookings/AdminBookingList';
import AdminEditBookingModal from '../../components/admin/Bookings/AdminEditBookingModal';
import { io } from 'socket.io-client';
import '../../style/Admin/AdminUserBookingsPage.css';
    
export default function AdminUserBookingsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // סטייט לניהול המודאל עריכה
  const [editingBooking, setEditingBooking] = useState(null);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const data = await adminGetUserBookings(userId, page, 9); // שליפה של 9 פריטים לעמוד
      setBookings(data.bookings || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1. אפקט לשליפת נתונים ראשונית ובעת מעבר עמוד
  useEffect(() => {
    fetchUserBookings();
  }, [userId, page]);

  // 2. 🌟 הבלוק החדש: האזנה לסוקט בזמן אמת כדי לרענן את המסך כשהלקוח מבצע שינוי
  useEffect(() => {
    // התחברות לשרת ה-Backend שלך (שני את הפורט ל-3000 או למה שאת משתמשת בשרת)
    const socket = io('http://localhost:3000');

    // א) האזנה לאירוע ביטול/מחיקת הזמנה על ידי הלקוח
    socket.on('booking_cancelled', (data) => {
      console.log("התקבל עדכון: הזמנה בוטלה. מרענן נתונים...");
      fetchUserBookings(); // 🔥 מפעיל מחדש את השליפה ומעדכן את הסטייט, מה שגורם לרינדור מחדש אוטומטי!
    });

    // ב) האזנה לאירוע יצירת/תשלום הזמנה חדשה על ידי הלקוח
    socket.on('new_booking_created', (data) => {
      console.log("התקבל עדכון: הזמנה חדשה נוצרה במערכת. מרענן נתונים...");
      fetchUserBookings(); // 🔥 מפעיל מחדש את השליפה ומעדכן את הסטייט
    });

    // ג) פונקציית ניקוי (Cleanup) - מתנתקת מהסוקט כשהאדמין עוזב את העמוד כדי למנוע כפל האזנות
    return () => {
      socket.disconnect();
    };
  }, [userId, page]); // 🌟 חשוב! יתחבר מחדש בבטחה אם האדמין יעבור לקוח או עמוד בדפדוף

  return (
    <div className="admin-dashboard-container">
      <header className="bookings-page-header">
        <div className="bookings-page-titles">
          <h1>ניהול הזמנות עבור משתמש: {userId}</h1>
          <p>סה"כ הזמנות במערכת: {totalCount}</p>
        </div>
        <button className="back-to-search-btn" onClick={() => navigate('/admin/users-service')}>
          חזרה לחיפוש לקוח ⬅️
        </button>
      </header>


      {error && <div className="alert-message error">{error}</div>}

      {loading ? (
        <p>טוען נתונים...</p>
      ) : (
        <AdminBookingList
          bookings={bookings}
          userId={userId}
          onRefresh={fetchUserBookings}
          onEditClick={(booking) => setEditingBooking(booking)} // פותח את המודאל
        />
      )}

      {/* 🌟 תוקן מ-10 ל-9 כדי להתאים בדיוק לעיצוב ולשליפה שלך מה-API */}
      {Math.ceil(totalCount / 9) > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            ⬅️ הקודם
          </button>

          <span className="pagination-info">
            עמוד {page} מתוך {Math.ceil(totalCount / 9)}
          </span>

          <button
            className="pagination-btn"
            onClick={() => setPage(prev => Math.min(prev + 1, Math.ceil(totalCount / 9)))}
            disabled={page === Math.ceil(totalCount / 9)}
          >
            הבא ➡️
          </button>
        </div>
      )}
      {/* מודאל העריכה ירונדר רק אם נבחרה הזמנה לעריכה */}
      {editingBooking && (
        <AdminEditBookingModal
          userId={userId}
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSuccess={() => {
            setEditingBooking(null);
            fetchUserBookings(); // ריענון הרשימה אחרי עריכה מוצלחת
          }}
        />
      )}
    </div>
  );
}