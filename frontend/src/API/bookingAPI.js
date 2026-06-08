import { api } from "./api";
import API_ROUTES from "../constants/apiRoutes.js";

// שליפת כל ההזמנות של המשתמש המחובר
export const getMyBookings = () => api.get(`${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.MY_BOOKINGS}`);

// יצירת הזמנה חדשה למשתמש המחובר (מערך הנוסעים נשלח בתוך ה-body)
export const createBooking = (bookingData) =>
    api.post(`${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.MY_BOOKINGS}`, {
        flightId: bookingData.flightId,
        totalPrice: bookingData.totalPrice,
        passengers: bookingData.passengers, // מערך של אובייקטים (נוסעים)
    });

// שליפת הזמנות של משתמש ספציפי לפי ה-ID שלו
export const adminGetUserBookings = (userId) =>
    api.get(`${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.ADMIN_USER_BOOKINGS.replace(':id', userId)}`);

// יצירת הזמנה עבור משתמש ספציפי על ידי האדמין
export const adminCreateUserBooking = (userId, bookingData) =>
    api.post(`${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.ADMIN_USER_BOOKINGS.replace(':id', userId)}`, {
        flightId: bookingData.flightId,
        totalPrice: bookingData.totalPrice,
        passengers: bookingData.passengers,
    });

// עדכון סטטוס הזמנה בלבד (אדמין - משתמש ב-PATCH)
export const adminUpdateBookingStatus = (bookingId, status) =>
    api.patch(
        `${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.ADMIN_BOOKING_BY_ID.replace(':bookingId', bookingId)}/status`,
        {
            status, // למשל 'CONFIRMED' או 'CANCELLED'
        }
    );

// עדכון מלא של הזמנה ופרטי הנוסעים שלה (אדמין - משתמש ב-PUT)
export const adminUpdateBookingFull = (bookingId, bookingData) =>
    api.put(`${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.ADMIN_BOOKING_BY_ID.replace(':bookingId', bookingId)}`, {
        flightId: bookingData.flightId,
        totalPrice: bookingData.totalPrice,
        status: bookingData.status,
        passengers: bookingData.passengers, // כולל ה-passenger_id לכל נוסע קיים
    });