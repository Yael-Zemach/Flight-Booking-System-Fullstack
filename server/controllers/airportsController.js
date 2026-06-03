import * as airportsService from '../services/airportsService.js';
import { MESSAGES } from '../constants/messages.js';

// 1. טיפול בהוספת שדה תעופה
export async function handleAdminCreateAirport(req, res) {
    try {
        const airportId = await airportsService.createNewAirport(req.body);
        return res.status(201).json({ 
            message: MESSAGES.AIRPORTS.CREATE_SUCCESS, 
            airportId: airportId 
        });
    } catch (error) {
        if (error.message === 'MISSING_DATA') return res.status(400).json({ message: MESSAGES.AIRPORTS.MISSING_DATA });
        if (error.message === 'CODE_ALREADY_EXISTS') return res.status(400).json({ message: MESSAGES.AIRPORTS.CODE_ALREADY_EXISTS });
        
        console.error("Error creating airport:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

// 2. טיפול בעדכון תמונה (PATCH)
export async function handleAdminUpdateAirportImage(req, res) {
    const airportId = parseInt(req.params.id);
    const { image_url } = req.body;

    try {
        await airportsService.updateAirportImage(airportId, image_url);
        return res.status(200).json({ message: MESSAGES.AIRPORTS.UPDATE_IMAGE_SUCCESS });
    } catch (error) {
        if (error.message === 'NOT_FOUND') return res.status(404).json({ message: MESSAGES.AIRPORTS.NOT_FOUND });
        if (error.message === 'MISSING_DATA') return res.status(400).json({ message: MESSAGES.AIRPORTS.MISSING_DATA });
        
        console.error("Error updating airport image:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

// 3. טיפול במחיקת שדה תעופה
export async function handleAdminDeleteAirport(req, res) {
    const airportId = parseInt(req.params.id);

    try {
        await airportsService.deleteAirportSafely(airportId);
        return res.status(200).json({ message: MESSAGES.AIRPORTS.DELETE_SUCCESS });
    } catch (error) {
        if (error.message === 'NOT_FOUND') return res.status(404).json({ message: MESSAGES.AIRPORTS.NOT_FOUND });
        if (error.message === 'CANNOT_DELETE_HAS_FLIGHTS') return res.status(400).json({ message: MESSAGES.AIRPORTS.CANNOT_DELETE_HAS_FLIGHTS });
        
        console.error("Error deleting airport:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}
// להוסיף לקובץ הקיים:

export async function handleGetAllAirports(req, res) {
    try {
        const airports = await airportsService.fetchAllAirports();
        // מחזירים את המערך כמו שהוא לריאקט
        return res.status(200).json(airports);
    } catch (error) {
        console.error("Error fetching all airports:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}