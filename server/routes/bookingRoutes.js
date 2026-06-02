import { Router } from 'express';
import { authenticateToken, isAdmin, verifyAdminTarget } from '../middleware/authMiddleware.js';
import { 
    handleGetBookings, 
    handleCreateBooking, 
    handleAdminUpdateStatus,
    handleAdminUpdateBooking 
} from '../controllers/bookingsController.js';
import { API_ROUTES } from '../constants/apiRoutes.js';

const router = Router();

// ============================================================================
// אזור הלקוח (הלקוח יכול רק לראות וליצור)
// ============================================================================
router.get(API_ROUTES.BOOKINGS.MY_BOOKINGS, authenticateToken, handleGetBookings);
router.post(API_ROUTES.BOOKINGS.MY_BOOKINGS, authenticateToken, handleCreateBooking);

// ============================================================================
// אזור האדמין (לאדמין יש שליטה גם על ביטול/עדכון סטטוס וגם על עריכה מלאה)
// ============================================================================
router.get(API_ROUTES.BOOKINGS.ADMIN_USER_BOOKINGS, authenticateToken, isAdmin, verifyAdminTarget, handleGetBookings);
router.post(API_ROUTES.BOOKINGS.ADMIN_USER_BOOKINGS, authenticateToken, isAdmin, verifyAdminTarget, handleCreateBooking);

// ראוט לאדמין לעדכון הסטטוס בלבד (PATCH)
router.patch(API_ROUTES.BOOKINGS.ADMIN_UPDATE_STATUS, authenticateToken, isAdmin, verifyAdminTarget, handleAdminUpdateStatus);

// ראוט לאדמין לעדכון מלא של ההזמנה ורשימת הנוסעים (PUT)
router.put(API_ROUTES.BOOKINGS.ADMIN_UPDATE_BOOKING, authenticateToken, isAdmin, verifyAdminTarget, handleAdminUpdateBooking);

export default router;