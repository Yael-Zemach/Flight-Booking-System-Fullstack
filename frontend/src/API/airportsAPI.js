import { api } from "./api";
import API_ROUTES from "../constants/apiRoutes.js";

// 1. שליפת כל שדות התעופה
export const getAllAirports = () => api.get(`${API_ROUTES.AIRPORTS.BASE}${API_ROUTES.AIRPORTS.GET_ALL}`);

// 2. הוספת שדה תעופה חדש (מקבל FormData עם קובץ או טקסט)
export const createAirport = (formData) => api.post(`${API_ROUTES.AIRPORTS.BASE}${API_ROUTES.AIRPORTS.ADMIN}`, formData);

// 3. עדכון תמונה בלבד (מקבל FormData)
export const updateAirportImage = (airportId, formData) => {
    const url = `${API_ROUTES.AIRPORTS.BASE}${API_ROUTES.AIRPORTS.ADMIN_BY_ID.replace(':id', airportId)}/image`;
    return api.patch(url, formData);
};

// 4. מחיקת שדה תעופה קיים
export const deleteAirport = (airportId) => {
    const url = `${API_ROUTES.AIRPORTS.BASE}${API_ROUTES.AIRPORTS.ADMIN_BY_ID.replace(':id', airportId)}`;
    return api.delete(url);
};