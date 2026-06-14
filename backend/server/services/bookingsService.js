import * as bookingsModel from '../models/bookingsModel.js';
import { BOOKING_STATUS } from '../constants/bookingStatus.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { MESSAGES } from '../constants/messages.js';

export async function getBookingDetails(bookingId, userId, userRole) {
    const booking = await bookingsModel.getBookingById(bookingId);
    
    if (!booking) {
        throw new Error(ERROR_CODES.NOT_FOUND);
    }
    if (userRole !== 'admin' && booking.user_id !== userId) {
        throw new Error(ERROR_CODES.FORBIDDEN); 
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

export async function updateBookingFull(bookingId, flightId, returnFlightId, totalPrice, passengers) {
    const success = await bookingsModel.updateBookingByAdmin(
        bookingId, flightId, returnFlightId, totalPrice, passengers
    );
    if (!success) {
        throw new Error(ERROR_CODES.ADMIN_UPDATE_FAILED);
    }
    return success;
}

export async function cancelBookingByAdmin(bookingId) {
    const booking = await bookingsModel.getBookingById(bookingId);
    
    if (!booking) {
        throw new Error(ERROR_CODES.NOT_FOUND);
    }
    if (booking.status === BOOKING_STATUS.CANCELLED) {
        throw new Error(ERROR_CODES.ALREADY_CANCELLED);
    }
    return await bookingsModel.cancelBookingAdminTransaction(bookingId);
}

export async function processBookingPayment(bookingId) {
    const paymentSuccess = true; // מדמה תשלום שעבר בהצלחה
    const success = await bookingsModel.updateBookingStatus(bookingId, BOOKING_STATUS.CONFIRMED);
    if (!success) {
        throw new Error(ERROR_CODES.NOT_FOUND);
    }
    return true;
}
export async function cancelBookingByUser(bookingId, userId) {
    const booking = await bookingsModel.getBookingDetailsForValidation(bookingId);
    if (!booking) {
        const error = new Error(MESSAGES.BOOKINGS.NOT_FOUND);
        error.status = 404;
        throw error;
    }
    if (booking.user_id !== userId) {
        const error = new Error(MESSAGES.BOOKINGS.NOT_YOUR_BOOKING);
        error.status = 403;
        throw error;
    }
    if (booking.status === BOOKING_STATUS.CANCELLED) {
        const error = new Error(MESSAGES.BOOKINGS.ALREADY_CANCELLED);
        error.status = 400;
        throw error;
    }
    const departureTime = new Date(booking.departure_time);
    const now = new Date();
    const millisecondsIn24Hours = 24 * 60 * 60 * 1000;
    if (departureTime - now < millisecondsIn24Hours) {
        const error = new Error(MESSAGES.BOOKINGS.CANNOT_CANCEL_24_HOURS);
        error.status = 400;
        throw error;
    }
    return await bookingsModel.cancelBookingAdminTransaction(bookingId);
}
export async function checkAndCleanExpiredBookings() {
    try {
        const deletedCount = await bookingsModel.clearExpiredPendingBookings(15);
        if (deletedCount > 0) {
            console.log(`[Background Task] Successfully cleaned up ${deletedCount} expired pending bookings and restored seats.`);
        }
    } catch (error) {
        console.error("Error running background cleaning for expired bookings:", error);
    }
}