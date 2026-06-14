import * as bookingsService from '../services/bookingsService.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { io } from '../app.js';

export async function handleGetBookingById(req, res) {
    const bookingId = parseInt(req.params.bookingId);
    const userId = req.user.userId;
    const userRole = req.user.userType;
    try {
        const booking = await bookingsService.getBookingDetails(bookingId, userId, userRole);
        return res.status(200).json(booking);
    } catch (error) {
        if (error.message === ERROR_CODES.NOT_FOUND) {
            return res.status(404).json({ message: MESSAGES.BOOKINGS.NOT_FOUND_OR_CANCELLED });
        }
        if (error.message === 'FORBIDDEN') {
            return res.status(403).json({ message: "אין לך הרשאה לצפות בהזמנה זו" });
        }
        console.error("Error fetching single booking:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

export async function handleGetBookings(req, res) {
    const targetUserId = req.params.id ? parseInt(req.params.id) : req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;

    try {
        const { bookings, totalCount } = await bookingsService.getUserBookings(targetUserId, page, limit);
        return res.status(200).json({ bookings, totalCount });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

export async function handleCreateBooking(req, res) {
    const targetUserId = req.params.id ? parseInt(req.params.id) : req.user.userId;
    const { flightId, returnFlightId, totalPrice, passengers } = req.body;

    try {
        const bookingId = await bookingsService.createNewBooking(targetUserId, flightId, returnFlightId, totalPrice, passengers);
        return res.status(201).json({
            message: MESSAGES.BOOKINGS.CREATE_SUCCESS,
            bookingId: bookingId
        });
    } catch (error) {
        if (error.message === ERROR_CODES.MISSING_DATA) {
            return res.status(400).json({ message: MESSAGES.BOOKINGS.MISSING_DATA });
        }
        console.error("Error creating booking:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

export async function handleProcessPayment(req, res) {
    const bookingId = parseInt(req.params.bookingId);

    if (!bookingId || isNaN(bookingId)) {
        return res.status(400).json({ message: "Invalid or missing booking ID." });
    }

    try {
        const bookingData = await bookingsService.processBookingPayment(bookingId);
        io.emit('new_booking_created', {
            bookingId: bookingId,

        });

        return res.status(200).json({ message: "Payment successful. Booking confirmed!" });
    } catch (error) {
        console.error("Payment error:", error);
        if (error.message === "PAYMENT_FAILED") {
            return res.status(402).json({ message: "Payment declined by issuing bank." });
        }
        if (error.message === ERROR_CODES.NOT_FOUND) {
            return res.status(404).json({ message: "Booking not found." });
        }
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}



export async function handleCancelOwnBooking(req, res) {
    const { bookingId } = req.params;
    const userId = req.user.userId;

    try {
        await bookingsService.cancelBookingByUser(bookingId, userId);
        io.emit('booking_cancelled', {
            bookingId: bookingId
        });

        return res.status(200).json({ message: "ההזמנה בוטלה בהצלחה" });
    } catch (error) {
        console.error("Error cancelling booking:", error);

        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }

        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}
export async function handleAdminUpdateBooking(req, res) {
    const bookingId = parseInt(req.params.bookingId);
    const { flightId, returnFlightId, totalPrice, passengers } = req.body;

    try {
        await bookingsService.updateBookingFull(bookingId, flightId, returnFlightId, totalPrice, passengers);
        return res.status(200).json({ message: MESSAGES.BOOKINGS.ADMIN_UPDATE_SUCCESS });
    } catch (error) {
        if (error.message === 'NOT_ENOUGH_SEATS') {
            return res.status(400).json({ message: "שגיאת שמירה: אין מספיק מושבים פנויים בטיסה זו להוספת הנוסעים." });
        }
        if (error.message === ERROR_CODES.ADMIN_UPDATE_FAILED) {
            return res.status(400).json({ message: MESSAGES.BOOKINGS.ADMIN_UPDATE_FAILED });
        }
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}


export async function handleAdminCancelBooking(req, res) {
    const bookingId = parseInt(req.params.bookingId);
    try {
        await bookingsService.cancelBookingByAdmin(bookingId);
        return res.status(200).json({ message: "ההזמנה בוטלה בהצלחה (מושבים הוחזרו)" });
    } catch (error) {
        if (error.message === ERROR_CODES.NOT_FOUND) {
            return res.status(404).json({ message: MESSAGES.BOOKINGS.NOT_FOUND_OR_CANCELLED });
        }
        
        return res.status(500).json({ message: error.message || MESSAGES.SERVER.INTERNAL_ERROR });
    }
}