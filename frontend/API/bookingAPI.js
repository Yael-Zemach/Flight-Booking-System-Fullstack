BOOKING 
import { api } from "./api";



// שליפת כל ההזמנות של המשתמש המחובר
export const getMyBookings = () => 
    api.get("/api/bookings/my-bookings");

// יצירת הזמנה חדשה למשתמש המחובר (מערך הנוסעים נשלח בתוך ה-body)
export const createBooking = (bookingData) =>
    api.post("/api/bookings/my-bookings", {
        flightId: bookingData.flightId,
        totalPrice: bookingData.totalPrice,
        passengers: bookingData.passengers, // מערך של אובייקטים (נוסעים)
    });



// שליפת הזמנות של משתמש ספציפי לפי ה-ID שלו
export const adminGetUserBookings = (userId) =>
    api.get(`/api/bookings/admin/users/${userId}`);

// יצירת הזמנה עבור משתמש ספציפי על ידי האדמין
export const adminCreateUserBooking = (userId, bookingData) =>
    api.post(`/api/bookings/admin/users/${userId}`, {
        flightId: bookingData.flightId,
        totalPrice: bookingData.totalPrice,
        passengers: bookingData.passengers,
    });

// עדכון סטטוס הזמנה בלבד (אדמין - משתמש ב-PATCH)
export const adminUpdateBookingStatus = (bookingId, status) =>
    api.patch(`/api/bookings/admin/bookings/${bookingId}/status`, {
        status, // למשל 'CONFIRMED' או 'CANCELLED'
    });

// עדכון מלא של הזמנה ופרטי הנוסעים שלה (אדמין - משתמש ב-PUT)
export const adminUpdateBookingFull = (bookingId, bookingData) =>
    api.put(`/api/bookings/admin/bookings/${bookingId}`, {
        flightId: bookingData.flightId,
        totalPrice: bookingData.totalPrice,
        status: bookingData.status,
        passengers: bookingData.passengers, // כולל ה-passenger_id לכל נוסע קיים
    });