import * as bookingsService from '../services/bookingsService.js';
import { MESSAGES } from '../constants/messages.js';

// שליפת הזמנות
export async function handleGetBookings(req, res) {
    const targetUserId = req.params.id ? parseInt(req.params.id) : req.user.userId;
    
    try {
        const bookings = await bookingsService.getUserBookings(targetUserId);
        return res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

// יצירת הזמנה
export async function handleCreateBooking(req, res) {
    const targetUserId = req.params.id ? parseInt(req.params.id) : req.user.userId;
    const { flightId, totalPrice, passengers } = req.body;

    try {
        const bookingId = await bookingsService.createNewBooking(targetUserId, flightId, totalPrice, passengers);
        return res.status(201).json({ 
            message: MESSAGES.BOOKINGS.CREATE_SUCCESS, 
            bookingId: bookingId 
        });
    } catch (error) {
        if (error.message === 'MISSING_DATA') {
            return res.status(400).json({ message: MESSAGES.BOOKINGS.MISSING_DATA });
        }
        console.error("Error creating booking:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

// עדכון סטטוס (נקודתי) ע"י אדמין בלבד
export async function handleAdminUpdateStatus(req, res) {
    const bookingId = parseInt(req.params.bookingId); 
    const { status } = req.body; 

    try {
        await bookingsService.updateStatusByAdmin(bookingId, status);
        return res.status(200).json({ message: MESSAGES.BOOKINGS.ADMIN_UPDATE_SUCCESS }); 
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ message: MESSAGES.BOOKINGS.NOT_FOUND_OR_CANCELLED }); 
        }
        if (error.message === 'INVALID_STATUS') {
            return res.status(400).json({ message: MESSAGES.BOOKINGS.INVALID_STATUS }); 
        }
        console.error("Error updating booking status:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

// עדכון מלא (הזמנה + נוסעים) ע"י אדמין בלבד
export async function handleAdminUpdateBooking(req, res) {
    const bookingId = parseInt(req.params.bookingId);
    const { flightId, totalPrice, status, passengers } = req.body;

    try {
        await bookingsService.updateBookingFull(bookingId, flightId, totalPrice, status, passengers);
        return res.status(200).json({ message: MESSAGES.BOOKINGS.ADMIN_UPDATE_SUCCESS }); 
    } catch (error) {
        if (error.message === 'ADMIN_UPDATE_FAILED') {
            return res.status(400).json({ message: MESSAGES.BOOKINGS.ADMIN_UPDATE_FAILED });
        }
        console.error("Error updating booking full details:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}