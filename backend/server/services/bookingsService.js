import * as bookingsModel from '../models/bookingsModel.js';
import { BOOKING_STATUS } from '../constants/bookingStatus.js';
import { ERROR_CODES } from '../constants/errorCodes.js';





// 🌟 הפונקציה החדשה בסרביס שמנהלת את האבטחה והשגיאות
export async function getBookingDetails(bookingId, userId, userRole) {
    const booking = await bookingsModel.getBookingById(bookingId);
    
    // שגיאה 404: ההזמנה לא קיימת בכלל במערכת
    if (!booking) {
        throw new Error(ERROR_CODES.NOT_FOUND);
    }

    // שגיאה 403: המשתמש הוא לא אדמין, וההזמנה לא שייכת לו!
    if (userRole !== 'admin' && booking.user_id !== userId) {
        throw new Error('FORBIDDEN'); 
    }

    return booking;
}

export async function getUserBookings(userId, page, limit) {
    return await bookingsModel.getBookingsByUserId(userId, page, limit);
}
export async function createNewBooking(userId, flightId, returnFlightId, totalPrice, passengers) {
    if (!flightId || !passengers || passengers.length === 0) {
        throw new Error(ERROR_CODES.MISSING_DATA);
    }
    // 🌟 מעבירים את returnFlightId לתוך מודל ההזמנות
    return await bookingsModel.createBookingWithPassengers(userId, flightId, returnFlightId, totalPrice, passengers);
}

export async function updateStatusByAdmin(bookingId, newStatus) {
    if (newStatus !== BOOKING_STATUS.CONFIRMED && newStatus !== BOOKING_STATUS.CANCELLED) {
        throw new Error(ERROR_CODES.INVALID_STATUS);
    }
    const success = await bookingsModel.updateBookingStatus(bookingId, newStatus);
    if (!success) {
        throw new Error(ERROR_CODES.NOT_FOUND);
    }
    return success;
}

// export async function updateBookingFull(bookingId, flightId, totalPrice, status, passengers) {
//     const success = await bookingsModel.updateBookingByAdmin(bookingId, flightId, totalPrice, status, passengers);
//     if (!success) {
//         throw new Error(ERROR_CODES.ADMIN_UPDATE_FAILED);
//     }
//     return success;
// }


// services/bookingsService.js

// services/bookingsService.js [צד השרת]

export async function updateBookingFull(bookingId, flightId, returnFlightId, totalPrice, status, passengers) {
    const success = await bookingsModel.updateBookingByAdmin(
        bookingId, flightId, returnFlightId, totalPrice, status, passengers
    );
    if (!success) {
        throw new Error(ERROR_CODES.ADMIN_UPDATE_FAILED);
    }
    return success;
}

// 🌟 פונקציה חדשה: ביטול הזמנה ע"י אדמין בלי בדיקת זמנים
export async function cancelBookingByAdmin(bookingId) {
    const booking = await bookingsModel.getBookingById(bookingId);
    
    if (!booking) {
        throw new Error(ERROR_CODES.NOT_FOUND);
    }
    if (booking.status === 'cancelled') {
        throw new Error("ההזמנה כבר מבוטלת");
    }

    // קריאה למודל לביצוע הטרנזקציה (שינוי סטטוס והחזרת מושבים)
    return await bookingsModel.cancelBookingAdminTransaction(bookingId);
}

export async function processBookingPayment(bookingId) {
    const paymentSuccess = true; // מדמה תשלום שעבר בהצלחה
    // משתמשים בפונקציה הקיימת במודל כדי לעדכן סטטוס
    const success = await bookingsModel.updateBookingStatus(bookingId, BOOKING_STATUS.CONFIRMED);
    if (!success) {
        throw new Error(ERROR_CODES.NOT_FOUND);
    }
    return true;
}
export async function cancelBookingByUser(bookingId, userId) {
    // 1. שליפת פרטי ההזמנה כדי לבדוק שיוך וזמנים
    const booking = await bookingsModel.getBookingDetailsForValidation(bookingId);
    
    if (!booking) {
        const error = new Error("ההזמנה לא נמצאה במערכת");
        error.status = 404;
        throw error;
    }

    if (booking.user_id !== userId) {
        const error = new Error("אין לך הרשאה לבטל הזמנה זו");
        error.status = 403;
        throw error;
    }

    if (booking.status === 'cancelled') {
        const error = new Error("ההזמנה כבר מבוטלת");
        error.status = 400;
        throw error;
    }

    // 2. 🌟 בדיקת ה-24 שעות (ההבדל בין זמן ההמראה לזמן הנוכחי)
    const departureTime = new Date(booking.departure_time);
    const now = new Date();
    const millisecondsIn24Hours = 24 * 60 * 60 * 1000;

    if (departureTime - now < millisecondsIn24Hours) {
        const error = new Error("לא ניתן לבטל טיסה פחות מ-24 שעות לפני מועד ההמראה");
        error.status = 400;
        throw error;
    }

    // 3. אם הכל תקין - מעדכנים את הסטטוס ל-cancelled
    return await bookingsModel.updateBookingStatus(bookingId, 'cancelled');
}