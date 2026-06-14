import * as airportsService from '../services/airportsService.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { MESSAGES } from '../constants/messages.js';

export async function handleAdminCreateAirport(req, res) {
    try {
        const file = req.file; 
        const bodyUrl = req.body.image_url;
        if (!file && !bodyUrl) {
            return res.status(400).json({ message: "חובה לספק קובץ תמונה או קישור (URL) לתמונה" });
        }
        const airportId = await airportsService.createNewAirport(req.body, file);
        
        return res.status(201).json({ 
            message: MESSAGES.AIRPORTS.CREATE_SUCCESS, 
            airportId: airportId 
        });
    } catch (error) {
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

export async function handleAdminUpdateAirportImage(req, res) {
    const airportId = parseInt(req.params.id);

    try {
        let imageUrl = '';

        if (req.file) {
            imageUrl = `http://localhost:3000/${req.file.path.replace(/\\/g, '/')}`;
        } 
        else if (req.body.image_url) {
            imageUrl = req.body.image_url.trim();
        } 
        else {
            return res.status(400).json({ message: "חובה לספק קובץ תמונה או קישור (URL) לעדכון" });
        }

        await airportsService.updateAirportImage(airportId, imageUrl);
        return res.status(200).json({ 
            message: MESSAGES.AIRPORTS.UPDATE_IMAGE_SUCCESS,
            image_url: imageUrl
        });
    } catch (error) {
        if (error.message === ERROR_CODES.NOT_FOUND) return res.status(404).json({ message: MESSAGES.AIRPORTS.NOT_FOUND });
        if (error.message === ERROR_CODES.MISSING_DATA) return res.status(400).json({ message: MESSAGES.AIRPORTS.MISSING_DATA });
        
        console.error("Error updating airport image:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

export async function handleAdminDeleteAirport(req, res) {
    const airportId = parseInt(req.params.id);
    try {
        await airportsService.deleteAirportSafely(airportId);
        return res.status(200).json({ message: MESSAGES.AIRPORTS.DELETE_SUCCESS });
    } catch (error) {
        if (error.message === ERROR_CODES.NOT_FOUND) return res.status(404).json({ message: MESSAGES.AIRPORTS.NOT_FOUND });
        if (error.message === ERROR_CODES.CANNOT_DELETE_HAS_FLIGHTS) return res.status(400).json({ message: MESSAGES.AIRPORTS.CANNOT_DELETE_HAS_FLIGHTS });
        
        console.error("Error deleting airport:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}

export async function handleGetAllAirports(req, res) {
    try {
        const airports = await airportsService.fetchAllAirports();
        return res.status(200).json(airports);
    } catch (error) {
        console.error("Error fetching all airports:", error);
        return res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
}