import * as airportsModel from '../models/airportsModel.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

export async function createNewAirport(bodyData, fileData) {
    let finalImageUrl = '';

    // אופציה א': הגיע קובץ פיזי ממולטר - כאן הסרביס מרכיב את ה-URL!
    if (fileData) {
        const cleanPath = fileData.path.replace(/\\/g, '/');
        // בעתיד אפשר להחליף את localhost במשתנה סביבה: process.env.BASE_URL
        finalImageUrl = `http://localhost:3000/${cleanPath}`; 
    } 
    // אופציה ב': הגיע קישור URL ישיר מהטקסט
    else if (bodyData.image_url) {
        finalImageUrl = bodyData.image_url.trim();
    }

    // בונים את האובייקט הסופי שיישלח ל-Model/DB
    const finalAirportObject = {
        airport_code: bodyData.airport_code,
        airport_name: bodyData.airport_name,
        city: bodyData.city,
        country: bodyData.country,
        description: bodyData.description,
        image_url: finalImageUrl // ה-URL המורכב והמוכן
    };

    // קריאה ל-Model שיבצע את שאילתת ה-SQL INSERT
    return await airportsModel.insertAirport(finalAirportObject);
}
// 2. לוגיקת עדכון תמונה
export async function updateAirportImage(airportId, imageUrl) {
    if (!imageUrl) {
        throw new Error(ERROR_CODES.MISSING_DATA);
    }

    const success = await airportsModel.updateAirportImageUrl(airportId, imageUrl);
    if (!success) {
        throw new Error(ERROR_CODES.NOT_FOUND);
    }
    return success;
}

// 3. לוגיקת מחיקה בטוחה (מניעת אפקט הדומינו של ה-CASCADE)
export async function deleteAirportSafely(airportId) {
    // בדיקה האם קיימות טיסות שמשתמשות בשדה התעופה הזה (כהמראה או נחיתה)
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