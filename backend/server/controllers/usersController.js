import { updateUser, getUserByEmail } from '../models/usersModel.js';
import { MESSAGES } from '../constants/messages.js';


export async function handleUpdateUser(req, res) {
    // השורה המעודכנת: בודקת אם יש ID ב-URL (עבור אדמין), אחרת שולפת מהטוקן (עבור לקוח)
    const targetUserId = req.params.id ? parseInt(req.params.id) : req.user.userId;
    
    // שינוי: מושכים רק את ה-name מהבקשה (האימייל כבר לא נשלח מהפרונטאנד)
    const { name } = req.body;

    try {
        // שינוי: שולחים רק 2 פרמטרים לפונקציה במודל - את ה-ID ואת השם
        const success = await updateUser(targetUserId, name);
        
        if (success) {
            return res.status(200).json({ message: MESSAGES.USERS.UPDATE_SUCCESS });
        } else {
            return res.status(400).json({ message: MESSAGES.USERS.UPDATE_FAILED });
        }
    } catch (error) {
        console.error("Error updating user:", error); 
        return res.status(500).json({ message: MESSAGES.USERS.UPDATE_ERROR });
    }
}
export const handleGetUserIdByEmail = async (req, res) => {
    const { email } = req.query; // אנחנו מחפשים אימייל ב-Query
    try {
        // שימוש במודל הקיים שלך שכבר יודע לשלוף לפי אימייל
        const user = await getUserByEmail(email);
        
        if (!user) {
            return res.status(404).json({ message: "משתמש לא נמצא" });
        }
        
        // החזרת ה-ID בלבד כדי לא לחשוף מידע רגיש
        res.status(200).json({ userId: user.user_id }); 
    } catch (error) {
        res.status(500).json({ message: "שגיאה בחיפוש משתמש" });
    }
};
