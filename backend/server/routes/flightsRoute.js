import express from 'express';
import { 
    searchFlights,
    handleAdminCreateFlight, 
    handleAdminUpdateFlight, 
    handleAdminCancelFlight,
     handleGetAdminFlights
} from '../controllers/flightsController.js';
import { API_ROUTES } from '../constants/apiRoutes.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get(API_ROUTES.FLIGHTS.SEARCH, searchFlights);
router.post(API_ROUTES.FLIGHTS.ADMIN_FLIGHTS, authenticateToken, isAdmin, handleAdminCreateFlight);
router.put(API_ROUTES.FLIGHTS.ADMIN_FLIGHT_BY_ID, authenticateToken, isAdmin, handleAdminUpdateFlight);
router.patch(API_ROUTES.FLIGHTS.ADMIN_CANCEL_FLIGHT, authenticateToken, isAdmin, handleAdminCancelFlight);
router.get(API_ROUTES.FLIGHTS.ADMIN_FLIGHTS, authenticateToken, isAdmin, handleGetAdminFlights);

export default router;