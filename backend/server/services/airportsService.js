import * as airportsModel from '../models/airportsModel.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
export async function createNewAirport(bodyData, fileData) {
    if (!bodyData.airport_code || !bodyData.airport_name || !bodyData.city || !bodyData.country) {
        throw new Error(ERROR_CODES.MISSING_DATA);
    }
    if (!fileData && !bodyData.image_url) {
        throw new Error(ERROR_CODES.MISSING_DATA); 
    }
    let finalImageUrl = '';
    if (fileData) {
        const cleanPath = fileData.path.replace(/\\/g, '/');
        finalImageUrl = `http://localhost:3000/${cleanPath}`; 
    } else if (bodyData.image_url) {
        finalImageUrl = bodyData.image_url.trim();
    }

    try {
        return await airportsModel.insertAirport(
            bodyData.airport_code,
            bodyData.airport_name,
            bodyData.city,
            bodyData.country,
            finalImageUrl,        
            bodyData.description 
        );
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            throw new Error('AIRPORT_CODE_EXISTS'); 
        }
        
        throw error;
    }
}
export async function updateAirportImage(airportId, bodyData, fileData) {
    let finalImageUrl = '';
    if (fileData) {
        const cleanPath = fileData.path.replace(/\\/g, '/');
        finalImageUrl = `http://localhost:3000/${cleanPath}`; 
    } else if (bodyData.image_url) {
        finalImageUrl = bodyData.image_url.trim();
    }
    if (!finalImageUrl) {
        throw new Error(ERROR_CODES.MISSING_DATA);
    }

    const success = await airportsModel.updateAirportImageUrl(airportId, finalImageUrl);
    if (!success) {
        throw new Error(ERROR_CODES.NOT_FOUND);
    }
    return success;
}
export async function deleteAirportSafely(airportId) {
    const activeFlightsCount = await airportsModel.countFlightsForAirport(airportId);
    if (activeFlightsCount > 0) {
        throw new Error(ERROR_CODES.CANNOT_DELETE_HAS_FLIGHTS);
    }

    const success = await airportsModel.deleteAirportById(airportId);
    if (!success) {
        throw new Error(ERROR_CODES.NOT_FOUND);
    }
    return success;
}

export async function fetchAllAirports() {
    return await airportsModel.getAllAirports();
}