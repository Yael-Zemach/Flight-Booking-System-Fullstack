import express from 'express';
// ייבוא כל פונקציות הקונטרולר (החיפוש שלך + פונקציות האדמין החדשות)
import { 
    searchFlights,
    handleAdminCreateFlight, 
    handleAdminUpdateFlight, 
    handleAdminCancelFlight,
     handleGetAdminFlights
} from '../controllers/flightsController.js';
import { API_ROUTES } from '../constants/apiRoutes.js';
// ייבוא שומרי הסף להגנה על נתיבי האדמין
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();
// נתיב החיפוש
router.get(API_ROUTES.FLIGHTS.SEARCH, searchFlights);
// הוספת טיסה חדשה
router.post(API_ROUTES.FLIGHTS.ADMIN_FLIGHTS, authenticateToken, isAdmin, handleAdminCreateFlight);

// עריכת פרטי טיסה מלאים
router.put(API_ROUTES.FLIGHTS.ADMIN_FLIGHT_BY_ID, authenticateToken, isAdmin, handleAdminUpdateFlight);

// ביטול טיסה (Soft Delete) - משתמשים ב-PATCH כי זה רק עדכון סטטוס נקודתי
router.patch(API_ROUTES.FLIGHTS.ADMIN_CANCEL_FLIGHT, authenticateToken, isAdmin, handleAdminCancelFlight);
router.get(API_ROUTES.FLIGHTS.ADMIN_FLIGHTS, authenticateToken, isAdmin, handleGetAdminFlights);

export default router;