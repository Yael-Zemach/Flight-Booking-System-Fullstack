import { AIRPORT_CODES } from '../constants/airportCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import * as flightsService from '../services/flightsService.js';
export async function searchFlights(req, res) {
    try {
        const { tripType, origin, dest, departDate, returnDate, passengers } = req.query;

        if (origin !== AIRPORT_CODES.TLV && dest !== AIRPORT_CODES.TLV) {
            return res.status(400).json({ message: MESSAGES.FLIGHTS.TLV_REQUIRED });
        }

        const numPassengers = parseInt(passengers) || 1;

        const searchResults = await flightsService.findRelevantFlights(tripType, origin, dest, departDate, returnDate, numPassengers);

        return res.status(200).json(searchResults);

    } catch (error) {
        console.error("Search Error:", error);
        return res.status(500).json({ message: MESSAGES.FLIGHTS.SEARCH_ERROR });
    }
}


export async function handleAdminCreateFlight(req, res) {
    try {
        const flightId = await flightsService.createNewFlight(req.body);
        return res.status(201).json({ 
            message: MESSAGES.FLIGHTS.CREATE_SUCCESS, 
            flightId: flightId 
        });
    } catch (error) {
        if (error.message === ERROR_CODES.MISSING_DATA) return res.status(400).json({ message: MESSAGES.FLIGHTS.MISSING_DATA });
        if (error.message === ERROR_CODES.INVALID_AIRPORTS) return res.status(400).json({ message: MESSAGES.FLIGHTS.INVALID_AIRPORTS });
        if (error.message === ERROR_CODES.INVALID_DATES) return res.status(400).json({ message: MESSAGES.FLIGHTS.INVALID_DATES });
        
        console.error("Error creating flight:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

export async function handleAdminUpdateFlight(req, res) {
    const flightId = parseInt(req.params.id);
    
    try {
        await flightsService.updateExistingFlight(flightId, req.body);
        return res.status(200).json({ message: MESSAGES.FLIGHTS.UPDATE_SUCCESS });
    } catch (error) {
        if (error.message === ERROR_CODES.NOT_FOUND) return res.status(404).json({ message: MESSAGES.FLIGHTS.NOT_FOUND });
        if (error.message === ERROR_CODES.MISSING_DATA) return res.status(400).json({ message: MESSAGES.FLIGHTS.MISSING_DATA });
        if (error.message === ERROR_CODES.INVALID_AIRPORTS) return res.status(400).json({ message: MESSAGES.FLIGHTS.INVALID_AIRPORTS });
        if (error.message === ERROR_CODES.INVALID_DATES) return res.status(400).json({ message: MESSAGES.FLIGHTS.INVALID_DATES });
        
        console.error("Error updating flight:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

export async function handleAdminCancelFlight(req, res) {
    const flightId = parseInt(req.params.id);
    
    try {
        await flightsService.cancelFlight(flightId);
        return res.status(200).json({ message: MESSAGES.FLIGHTS.CANCEL_SUCCESS });
    } catch (error) {
        if (error.message === ERROR_CODES.ALREADY_CANCELLED) return res.status(400).json({ message: MESSAGES.FLIGHTS.ALREADY_CANCELLED });
        
        console.error("Error cancelling flight:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}
export async function handleGetAdminFlights(req, res) {
    try {
        const { date } = req.query;
        const flights = await flightsService.getAdminFlightsByDate(date);
        return res.status(200).json(flights);
    } catch (error) {
        console.error("Error fetching admin flights:", error);
        return res.status(500).json({ message: "שגיאה בשרת בעת שליפת הטיסות" });
    }
}