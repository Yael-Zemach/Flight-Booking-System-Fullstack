import express from 'express';
import { 
    handleGetAllAirports,
    handleAdminCreateAirport, 
    handleAdminUpdateAirportImage, 
    handleAdminDeleteAirport 
} from '../controllers/airportsController.js';
import { API_ROUTES } from '../constants/apiRoutes.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(API_ROUTES.AIRPORTS.GET_ALL, handleGetAllAirports);

// הוספת שדה תעופה חדש
router.post(API_ROUTES.AIRPORTS.ADMIN_AIRPORTS, authenticateToken, isAdmin, handleAdminCreateAirport);

// עדכון תמונה של שדה תעופה קיים (משתמשים ב-PATCH לעדכון חלקי וממוקד)
router.patch(API_ROUTES.AIRPORTS.ADMIN_UPDATE_IMAGE, authenticateToken, isAdmin, handleAdminUpdateAirportImage);

// מחיקת שדה תעופה
router.delete(API_ROUTES.AIRPORTS.ADMIN_AIRPORT_BY_ID, authenticateToken, isAdmin, handleAdminDeleteAirport);

export default router;