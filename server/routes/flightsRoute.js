import express from 'express';
import { searchFlights } from '../controllers/flightsController.js';
import { API_ROUTES } from '../constants/apiRoutes.js';

const router = express.Router();

// נתיב החיפוש: /api/flights/search
router.get(API_ROUTES.FLIGHTS.SEARCH, searchFlights);

export default router;