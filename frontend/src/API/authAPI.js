import { api } from "./api";
import API_ROUTES from "../constants/apiRoutes.js";

// 1. התחברות למערכת (Login)
export const login = (userData) => {
    return api.post(`${API_ROUTES.AUTH.BASE}${API_ROUTES.AUTH.LOGIN}`, {
        email: userData.email,
        password: userData.password,
    });
};

// 2. הרשמה למערכת (Register) - לקוחות בלבד!
export const register = (userData) => {
    return api.post(`${API_ROUTES.AUTH.BASE}${API_ROUTES.AUTH.REGISTER}`, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        // מחקנו את התנאי! אין אפשרות לשלוח סוג משתמש מהדפדפן.
    });
};

