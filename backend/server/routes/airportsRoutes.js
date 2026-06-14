import express from 'express';
import { 
    handleGetAllAirports,
    handleAdminCreateAirport, 
    handleAdminUpdateAirportImage, 
    handleAdminDeleteAirport 
} from '../controllers/airportsController.js';
import { API_ROUTES } from '../constants/apiRoutes.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js'; 
const router = express.Router();
router.get(API_ROUTES.AIRPORTS.GET_ALL, handleGetAllAirports);
router.post(API_ROUTES.AIRPORTS.ADMIN_AIRPORTS, authenticateToken, isAdmin, upload.single('image'), handleAdminCreateAirport);
router.patch(API_ROUTES.AIRPORTS.ADMIN_UPDATE_IMAGE, authenticateToken, isAdmin, upload.single('image'), handleAdminUpdateAirportImage);
router.delete(API_ROUTES.AIRPORTS.ADMIN_AIRPORT_BY_ID, authenticateToken, isAdmin, handleAdminDeleteAirport);
export default router;