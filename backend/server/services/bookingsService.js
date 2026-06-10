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

// --- שאר הפונקציות הקיימות שלך נשארות ללא שינוי ---
export async function getUserBookings(userId) {
    return await bookingsModel.getBookingsByUserId(userId);
}

export async function createNewBooking(userId, flightId, totalPrice, passengers) {
    if (!flightId || !passengers || passengers.length === 0) {
        throw new Error(ERROR_CODES.MISSING_DATA);
    }
    return await bookingsModel.createBookingWithPassengers(userId, flightId, totalPrice, passengers);
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

export async function updateBookingFull(bookingId, flightId, totalPrice, status, passengers) {
    const success = await bookingsModel.updateBookingByAdmin(bookingId, flightId, totalPrice, status, passengers);
    if (!success) {
        throw new Error(ERROR_CODES.ADMIN_UPDATE_FAILED);
    }
    return success;
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

