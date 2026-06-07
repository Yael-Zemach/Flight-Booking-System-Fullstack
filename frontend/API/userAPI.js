    users:
    import { api } from "./api";

    // 1. עדכון הפרופיל האישי של המשתמש המחובר (משתמש ב-PUT)
    // הטוקן נשלח אוטומטית וה-Server יודע לעדכן את המשתמש הנוכחי
    export const updateMyProfile = (userData) =>
        api.put("/api/users/profile", {
            name: userData.name,
            email: userData.email,
        });

    // 2. עדכון משתמש ספציפי על ידי מנהל (אדמין בלבד - משתמש ב-PUT)
    // כאן מעבירים גם את ה-id של המשתמש שרוצים לערוך בתוך ה-URL
    export const adminUpdateUser = (userId, userData) =>
        api.put(`/api/users/admin/users/${userId}`, {
            name: userData.name,
            email: userData.email,
        });