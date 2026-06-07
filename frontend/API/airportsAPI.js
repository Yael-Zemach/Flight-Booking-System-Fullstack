import { api } from "./api";

    // 1. שליפת כל שדות התעופה (נתיב ציבורי - מעולה לטפסי חיפוש)
export const getAllAirports = () => 
    api.get("/api/airports/all");

// 2. הוספת שדה תעופה חדש (אדמין בלבד)
export const createAirport = (airportData) =>
    api.post("/api/airports/admin/airports", {
        airport_code: airportData.airport_code,
        airport_name: airportData.airport_name,
        city: airportData.city,
        country: airportData.country,
        image_url: airportData.image_url,
    });

// 3. עדכון תמונה של שדה תעופה קיים (אדמין בלבד - משתמש ב-PATCH)
export const updateAirportImage = (airportData) =>
    api.patch(`/api/airports/admin/airports/${airportData.airport_id}/image`, {
        image_url: airportData.image_url,
    });

// 4. מחיקת שדה תעופה (אדמין בלבד)
export const deleteAirport = (airportData) =>
    api.delete(`/api/airports/admin/airports/${airportData.airport_id}`);