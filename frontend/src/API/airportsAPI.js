import { api } from "./api";
import API_ROUTES from "../constants/apiRoutes.js";

// 1. שליפת כל שדות התעופה (נתיב ציבורי - מעולה לטפסי חיפוש)
export const getAllAirports = () => api.get(`${API_ROUTES.AIRPORTS.BASE}${API_ROUTES.AIRPORTS.GET_ALL}`);

// 2. הוספת שדה תעופה חדש (אדמין בלבד)
export const createAirport = (airportData) =>
    api.post(`${API_ROUTES.AIRPORTS.BASE}${API_ROUTES.AIRPORTS.ADMIN}`, {
        airport_code: airportData.airport_code,
        airport_name: airportData.airport_name,
        city: airportData.city,
        country: airportData.country,
        image_url: airportData.image_url,
    });

// 3. עדכון תמונה של שדה תעופה קיים (אדמין בלבד - משתמש ב-PATCH)
export const updateAirportImage = (airportData) =>
    api.patch(`${API_ROUTES.AIRPORTS.BASE}${API_ROUTES.AIRPORTS.ADMIN_BY_ID.replace(':id', airportData.airport_id)}/image`, {
        image_url: airportData.image_url,
    });

// 4. מחיקת שדה תעופה (אדמין בלבד)
export const deleteAirport = (airportData) =>
    api.delete(`${API_ROUTES.AIRPORTS.BASE}${API_ROUTES.AIRPORTS.ADMIN_BY_ID.replace(':id', airportData.airport_id)}`);