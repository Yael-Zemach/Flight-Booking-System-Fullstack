import * as bookingsService from '../services/bookingsService.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { io } from '../app.js';

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
    const limit = parseInt(req.query.limit) || 9;

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
    const { flightId, returnFlightId, totalPrice, passengers } = req.body; 
    
    try {
        const bookingId = await bookingsService.createNewBooking(targetUserId, flightId, returnFlightId, totalPrice, passengers);
        
        // ✂️ שורת ה-io.emit נמחקה מכאן בהצלחה! (כדי שלא תתריע כשההזמנה עדיין פנדינג)
        
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

// 🌟 הפונקציה המעודכנת שמטפלת בתשלום - מעוררת עכשיו את הסוקט!
export async function handleProcessPayment(req, res) {
    const bookingId = parseInt(req.params.bookingId);

    if (!bookingId || isNaN(bookingId)) {
        return res.status(400).json({ message: "Invalid or missing booking ID." });
    }

    try {
        // 🌟 קוראים לשירות ומקבלים בחזרה את פרטי ההזמנה ששולמו עכשיו
        const bookingData = await bookingsService.processBookingPayment(bookingId);

        // 🌟 שורת הקסם החדשה: מעוררים את האדמין בזמן אמת רק אחרי תשלום מוצלח!
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


export async function handleCancelOwnBooking(req, res) {
    const { bookingId } = req.params;
    const userId = req.user.userId; 

    try {
        await bookingsService.cancelBookingByUser(bookingId, userId);
        
        // 🌟 שורת הקסם: משדרים בזמן אמת שהזמנה בוטלה במערכת
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
    // חילוץ כל הפרמטרים שהמודאל בריאקט שולח ב-payload
    const { flightId, returnFlightId, totalPrice, status, passengers } = req.body;
    
    try {
        await bookingsService.updateBookingFull(bookingId, flightId, returnFlightId, totalPrice, status, passengers);
        return res.status(200).json({ message: MESSAGES.BOOKINGS.ADMIN_UPDATE_SUCCESS }); 
    } catch (error) {
        // תפיסת השגיאה של המושבים והחזרת תשובה ברורה לפרונטאנד
        if (error.message === 'NOT_ENOUGH_SEATS') {
            return res.status(400).json({ message: "שגיאת שמירה: אין מספיק מושבים פנויים בטיסה זו להוספת הנוסעים." });
        }
        if (error.message === ERROR_CODES.ADMIN_UPDATE_FAILED) {
            return res.status(400).json({ message: MESSAGES.BOOKINGS.ADMIN_UPDATE_FAILED });
        }
        console.error("Error updating booking full details:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}


// 🌟 הוספת הנדלר חדש לביטול של אדמין
export async function handleAdminCancelBooking(req, res) {
    const bookingId = parseInt(req.params.bookingId);
    try {
        await bookingsService.cancelBookingByAdmin(bookingId);
        return res.status(200).json({ message: "ההזמנה בוטלה בהצלחה (מושבים הוחזרו)" });
    } catch (error) {
        if (error.message === ERROR_CODES.NOT_FOUND) {
            return res.status(404).json({ message: MESSAGES.BOOKINGS.NOT_FOUND_OR_CANCELLED }); 
        }
        console.error("Error cancelling booking by admin:", error);
        return res.status(500).json({ message: error.message || MESSAGES.SERVER.INTERNAL_ERROR });
    }
}