import { Router } from 'express';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';
import { handleGetBookings } from '../controllers/bookingsController.js';

const router = Router();

// 1. נתיב הלקוח - ה-URL נקי (הקונטרולר יקח את ה-ID מהטוקן)
router.get('/my-bookings', authenticateToken, handleGetBookings);

// 2. נתיב האדמין - ה-URL כולל ID (הקונטרולר יקח את ה-ID משם, המידלוור מאבטח)
router.get('/admin/user-bookings/:id', authenticateToken, isAdmin, handleGetBookings);

export default router;