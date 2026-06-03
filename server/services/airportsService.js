import * as airportsModel from '../models/airportsModel.js';

// 1. לוגיקת יצירת שדה תעופה
export async function createNewAirport(airportData) {
    const { airport_code, airport_name, city, country, image_url } = airportData;

    if (!airport_code || !airport_name || !city || !country || !image_url) {
        throw new Error('MISSING_DATA');
    }

    // בדיקה שקוד שדה התעופה ייחודי (למשל, שלא ינסו ליצור שוב את TLV)
    const existingAirport = await airportsModel.getAirportByCode(airport_code);
    if (existingAirport) {
        throw new Error('CODE_ALREADY_EXISTS');
    }

    return await airportsModel.insertAirport(airport_code, airport_name, city, country, image_url);
}

// 2. לוגיקת עדכון תמונה
export async function updateAirportImage(airportId, imageUrl) {
    if (!imageUrl) {
        throw new Error('MISSING_DATA');
    }

    const success = await airportsModel.updateAirportImageUrl(airportId, imageUrl);
    if (!success) {
        throw new Error('NOT_FOUND');
    }
    return success;
}

// 3. לוגיקת מחיקה בטוחה (מניעת אפקט הדומינו של ה-CASCADE)
export async function deleteAirportSafely(airportId) {
    // בדיקה האם קיימות טיסות שמשתמשות בשדה התעופה הזה (כהמראה או נחיתה)
    const activeFlightsCount = await airportsModel.countFlightsForAirport(airportId);
    if (activeFlightsCount > 0) {
        throw new Error('CANNOT_DELETE_HAS_FLIGHTS');
    }

    const success = await airportsModel.deleteAirportById(airportId);
    if (!success) {
        throw new Error('NOT_FOUND');
    }
    return success;
}

export async function fetchAllAirports() {
    return await airportsModel.getAllAirports();
}