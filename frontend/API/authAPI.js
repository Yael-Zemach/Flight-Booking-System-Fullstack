import { api } from "./api";

// 1. התחברות למערכת (Login)
export const login = (userData) => {
    return api.post("/api/auth/login", {
        email: userData.email,
        password: userData.password,
    });
};

// 2. הרשמה למערכת (Register) - לקוחות בלבד!
export const register = (userData) => {
    return api.post("/api/auth/register", {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        // מחקנו את התנאי! אין אפשרות לשלוח סוג משתמש מהדפדפן.
    });
};

