import { findRelevantFlights } from '../services/flightsService.js';
import { AIRPORT_CODES } from '../constants/airportCodes.js';
import { MESSAGES } from '../constants/messages.js';

export async function searchFlights(req, res) {
    try {
        const { tripType, origin, dest, departDate, returnDate, passengers } = req.query;

        if (origin !== AIRPORT_CODES.TLV && dest !== AIRPORT_CODES.TLV) {
            return res.status(400).json({ message: MESSAGES.FLIGHTS.TLV_REQUIRED });
        }

        const numPassengers = parseInt(passengers) || 1;

        const searchResults = await findRelevantFlights(tripType, origin, dest, departDate, returnDate, numPassengers);

        return res.status(200).json(searchResults);

    } catch (error) {
        console.error("Search Error:", error);
        return res.status(500).json({ message: MESSAGES.FLIGHTS.SEARCH_ERROR });
    }
}