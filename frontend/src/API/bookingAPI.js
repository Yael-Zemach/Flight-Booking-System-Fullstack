import { api } from "./api";
import API_ROUTES from "../constants/apiRoutes.js";

// שליפת כל ההזמנות של המשתמש המחובר

export const getMyBookings = (page = 1, limit = 10) => 
    api.get(`${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.MY_BOOKINGS}?page=${page}&limit=${limit}`);
export const getBookingById = (bookingId) =>
    api.get(`${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.MY_BOOKINGS}/${bookingId}`);
// יצירת הזמנה חדשה למשתמש המחובר (מערך הנוסעים נשלח בתוך ה-body)
// יצירת הזמנה חדשה למשתמש המחובר (מערך הנוסעים נשלח בתוך ה-body)
export const createBooking = (bookingData) =>
    api.post(`${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.MY_BOOKINGS}`, {
        flightId: bookingData.flightId,
        returnFlightId: bookingData.returnFlightId, // 🌟 הוספנו את המשתנה החדש כאן
        totalPrice: bookingData.totalPrice,
        passengers: bookingData.passengers, // מערך של אובייקטים (נוסעים)
    });
// שליפת הזמנות של משתמש ספציפי לפי ה-ID שלו
export const adminGetUserBookings = (userId, page = 1, limit = 10) =>
    api.get(`${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.ADMIN_USER_BOOKINGS.replace(':id', userId)}?page=${page}&limit=${limit}`);
// יצירת הזמנה עבור משתמש ספציפי על ידי האדמין
export const adminCreateUserBooking = (userId, bookingData) =>
    api.post(`${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.ADMIN_USER_BOOKINGS.replace(':id', userId)}`, {
        flightId: bookingData.flightId,
        returnFlightId: bookingData.returnFlightId,
        totalPrice: bookingData.totalPrice,
        passengers: bookingData.passengers,
    });

// עדכון סטטוס הזמנה בלבד (אדמין - משתמש ב-PATCH)
export const adminUpdateBookingStatus = (bookingId, status) =>
    api.patch(
        `${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.ADMIN_BOOKING_BY_ID.replace(':bookingId', bookingId)}/status` ,
        {
            status, // למשל 'CONFIRMED' או 'CANCELLED'
        }
    );

// עדכון מלא של הזמנה ופרטי הנוסעים שלה (אדמין - משתמש ב-PUT)
// עדכון מלא של הזמנה ופרטי הנוסעים שלה (אדמין - משתמש ב-PUT)
// // 🌟 הוספנו את userId לפרמטרים ול-replace ב-URL
// export const adminUpdateBookingFull = (userId, bookingId, bookingData) =>
//     api.put(${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.ADMIN_BOOKING_BY_ID.replace(':id', userId).replace(':bookingId', bookingId)}, {
//         flightId: bookingData.flightId,
//         returnFlightId: bookingData.returnFlightId, // 🌟 וידאנו שזה נשלח לשרת
//         totalPrice: bookingData.totalPrice,
//         status: bookingData.status,
//         passengers: bookingData.passengers,
//     });



    // עדכון מלא של הזמנה ופרטי הנוסעים שלה (אדמין - משתמש ב-PUT)
export const adminUpdateBookingFull = (userId, bookingId, bookingData) =>
    api.put(`${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.ADMIN_BOOKING_BY_ID.replace(':id', userId).replace(':bookingId', bookingId)}`, {
        flightId: bookingData.flightId,             // מוודא שה-ID של טיסת ההלוך נשלח
        returnFlightId: bookingData.returnFlightId, // מוודא שה-ID של טיסת החזור נשלח
        totalPrice: bookingData.totalPrice,
        status: bookingData.status,
        passengers: bookingData.passengers,
    });
    export const payForBooking = (bookingId) =>
    api.post(`${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.MY_BOOKINGS}/${bookingId}/pay`, {});
    // הוסיפי את הפונקציה הזו לקובץ ה-API שלך בפרונטנד
export const cancelOwnBooking = (bookingId) =>
    api.patch(`${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.MY_BOOKINGS}/${bookingId}/cancel`);
// עדכון נתיב ביטול של אדמין - שולח בקשה לנתיב שיצרנו בשרת
export const adminCancelBooking = (userId, bookingId) =>
    api.patch(`${API_ROUTES.BOOKINGS.BASE}${API_ROUTES.BOOKINGS.ADMIN_BOOKING_BY_ID.replace(':id', userId).replace(':bookingId', bookingId)}/cancel`);