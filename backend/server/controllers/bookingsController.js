import * as bookingsService from '../services/bookingsService.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { MESSAGES } from '../constants/messages.js';

// 🌟 ההנדלר החדש בקונטרולר - מטפל בשליפה ותרגום השגיאות לקליינט
export async function handleGetBookingById(req, res) {
    const bookingId = parseInt(req.params.bookingId);
    const userId = req.user.userId;
    const userRole = req.user.role; // ודאי שכך שמור ה-role בטוקן שלך (למשל 'admin'/'customer')

    try {
        const booking = await bookingsService.getBookingDetails(bookingId, userId, userRole);
        return res.status(200).json(booking);
    } catch (error) {
        if (error.message === ERROR_CODES.NOT_FOUND) {
            // החזרת הודעת ה-404 המקורית שלך מהקבועים
            return res.status(404).json({ message: MESSAGES.BOOKINGS.NOT_FOUND_OR_CANCELLED || "ההזמנה לא נמצאה" });
        }
        if (error.message === 'FORBIDDEN') {
            // חסימת גישה מיוזר שמנסה להציץ להזמנות של אחרים בשורת ה-URL
            return res.status(403).json({ message: "אין לך הרשאה לצפות בהזמנה זו" });
        }
        console.error("Error fetching single booking:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

export async function handleGetBookings(req, res) {
    // אם יש id בפרמטרים (אדמין) ניקח אותו, אם לא - ניקח את ה-id של המשתמש המחובר
    const targetUserId = req.params.id ? parseInt(req.params.id) : req.user.userId;
    
    // חילוץ פרמטרי הדפדוד עם ערכי ברירת מחדל (עמוד 1, 10 פריטים)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const { bookings, totalCount } = await bookingsService.getUserBookings(targetUserId, page, limit);
        
        // החזרת הנתונים בצורה אחידה
        return res.status(200).json({ bookings, totalCount });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

export async function handleCreateBooking(req, res) {
    const targetUserId = req.params.id ? parseInt(req.params.id) : req.user.userId;
    
    // 🌟 שליפת returnFlightId מה-body שקיבלנו מהפרונטנט
    const { flightId, returnFlightId, totalPrice, passengers } = req.body; 
    
    try {
        // 🌟 העברת הפרמטר החדש לשירות
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

export async function handleAdminUpdateStatus(req, res) {
    const bookingId = parseInt(req.params.bookingId); 
    const { status } = req.body; 
    try {
        await bookingsService.updateStatusByAdmin(bookingId, status);
        return res.status(200).json({ message: MESSAGES.BOOKINGS.ADMIN_UPDATE_SUCCESS }); 
    } catch (error) {
        if (error.message === ERROR_CODES.NOT_FOUND) {
            return res.status(404).json({ message: MESSAGES.BOOKINGS.NOT_FOUND_OR_CANCELLED }); 
        }
        if (error.message === ERROR_CODES.INVALID_STATUS) {
            return res.status(400).json({ message: MESSAGES.BOOKINGS.INVALID_STATUS }); 
        }
        console.error("Error updating booking status:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

export async function handleAdminUpdateBooking(req, res) {
    const bookingId = parseInt(req.params.bookingId);
    const { flightId, totalPrice, status, passengers } = req.body;
    try {
        await bookingsService.updateBookingFull(bookingId, flightId, totalPrice, status, passengers);
        return res.status(200).json({ message: MESSAGES.BOOKINGS.ADMIN_UPDATE_SUCCESS }); 
    } catch (error) {
        if (error.message === ERROR_CODES.ADMIN_UPDATE_FAILED) {
            return res.status(400).json({ message: MESSAGES.BOOKINGS.ADMIN_UPDATE_FAILED });
        }
        console.error("Error updating booking full details:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}
export async function handleProcessPayment(req, res) {
    const bookingId = parseInt(req.params.bookingId);

    if (!bookingId || isNaN(bookingId)) {
        return res.status(400).json({ message: "Invalid or missing booking ID." });
    }

    try {
        await bookingsService.processBookingPayment(bookingId);
        return res.status(200).json({ message: "Payment successful. Booking confirmed!" });
    } catch (error) {
        console.error("Payment error:", error);
        if (error.message === "PAYMENT_FAILED") {
            return res.status(402).json({ message: "Payment declined by issuing bank." });
        }
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}
export async function handleCancelOwnBooking(req, res) {
    const { bookingId } = req.params;
    const userId = req.user.userId; // מגיע מהטוקן המאומת

    try {
        await bookingsService.cancelBookingByUser(bookingId, userId);
        return res.status(200).json({ message: "ההזמנה בוטלה בהצלחה" });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        
        // אם מדובר בשגיאה לוגית (כמו פחות מ-24 שעות או הזמנה לא שלך)
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}