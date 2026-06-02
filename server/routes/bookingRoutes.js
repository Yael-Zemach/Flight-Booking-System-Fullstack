import { Router } from 'express';
import { authenticateToken, isAdmin, verifyAdminTarget } from '../middleware/authMiddleware.js';
import { handleGetBookings } from '../controllers/bookingsController.js';
import { API_ROUTES } from '../constants/apiRoutes.js';

const router = Router();

// 1. נתיב הלקוח - ה-URL נקי (הקונטרולר יקח את ה-ID מהטוקן)
router.get(API_ROUTES.BOOKINGS.MY_BOOKINGS, authenticateToken, handleGetBookings);

// 2. נתיב האדמין - ה-URL כולל ID (הקונטרולר יקח את ה-ID משם, המידלוור מאבטח)
router.get(API_ROUTES.BOOKINGS.ADMIN_USER_BOOKINGS, authenticateToken, isAdmin, verifyAdminTarget, handleGetBookings);

export default router;