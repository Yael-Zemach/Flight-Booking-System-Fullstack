import * as bookingsModel from '../models/bookingsModel.js';
import { BOOKING_STATUS } from '../constants/bookingStatus.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

export async function getUserBookings(userId) {
    return await bookingsModel.getBookingsByUserId(userId);
}

export async function createNewBooking(userId, flightId, totalPrice, passengers) {
    if (!flightId || !passengers || passengers.length === 0) {
        throw new Error(ERROR_CODES.MISSING_DATA);
    }

    const bookingId = await bookingsModel.createBookingWithPassengers(userId, flightId, totalPrice, passengers);
    return bookingId;
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