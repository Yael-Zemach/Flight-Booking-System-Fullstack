import { updateUser } from '../models/usersModel.js';
import { MESSAGES } from '../constants/messages.js';

export async function handleUpdateUser(req, res) {
    // השורה המעודכנת: בודקת אם יש ID ב-URL (עבור אדמין), אחרת שולפת מהטוקן (עבור לקוח)
    const targetUserId = req.params.id ? parseInt(req.params.id) : req.user.userId;
    
    const { name, email } = req.body;

    try {
        const success = await updateUser(targetUserId, name, email);
        if (success) {
            return res.status(200).json({ message: MESSAGES.USERS.UPDATE_SUCCESS });
        } else {
            return res.status(400).json({ message: MESSAGES.USERS.UPDATE_FAILED });
        }
    } catch (error) {
        console.error("Error updating user:", error); // תמיד מומלץ להדפיס שגיאות לטרמינל כדי שיהיה קל לדאבג
        return res.status(500).json({ message: MESSAGES.USERS.UPDATE_ERROR });
    }
}