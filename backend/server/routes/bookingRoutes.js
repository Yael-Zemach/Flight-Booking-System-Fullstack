import { Router } from 'express';
import { authenticateToken, isAdmin, verifyAdminTarget } from '../middleware/authMiddleware.js';
import { 
    handleGetBookings, 
    handleCreateBooking, 
    handleAdminUpdateStatus,
    handleAdminUpdateBooking,
    handleGetBookingById,
    handleProcessPayment // 🌟 ייבוא ההנדלר החדש
} from '../controllers/bookingsController.js';
import { API_ROUTES } from '../constants/apiRoutes.js';

const router = Router();

// 🌟 הראוט החדש לשליפת הזמנה בודדת ומאובטחת עבור משתמש מחובר
router.get('/my-bookings/:bookingId', authenticateToken, handleGetBookingById);

// --- שאר הראוטים הקיימים שלך נשארים ללא שינוי ---
router.get(API_ROUTES.BOOKINGS.MY_BOOKINGS, authenticateToken, handleGetBookings);
router.post(API_ROUTES.BOOKINGS.MY_BOOKINGS, authenticateToken, handleCreateBooking);

router.get(API_ROUTES.BOOKINGS.ADMIN_USER_BOOKINGS, authenticateToken, isAdmin, verifyAdminTarget, handleGetBookings);
router.post(API_ROUTES.BOOKINGS.ADMIN_USER_BOOKINGS, authenticateToken, isAdmin, verifyAdminTarget, handleCreateBooking);

router.patch(API_ROUTES.BOOKINGS.ADMIN_UPDATE_STATUS, authenticateToken, isAdmin, verifyAdminTarget, handleAdminUpdateStatus);
router.post(API_ROUTES.BOOKINGS.MY_BOOKINGS_PAY, authenticateToken, handleProcessPayment);
router.put(API_ROUTES.BOOKINGS.ADMIN_UPDATE_BOOKING, authenticateToken, isAdmin, verifyAdminTarget, handleAdminUpdateBooking);

export default router;