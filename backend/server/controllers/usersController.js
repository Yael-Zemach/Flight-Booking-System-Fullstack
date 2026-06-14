import { updateUser, getUserByEmail } from '../models/usersModel.js';
import { MESSAGES } from '../constants/messages.js';


export async function handleUpdateUser(req, res) {
    const targetUserId = req.params.id ? parseInt(req.params.id) : req.user.userId;
    const { name } = req.body;

    try {
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
    const { email } = req.query;
    try {
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "משתמש לא נמצא" });
        }
        res.status(200).json({ userId: user.user_id });
    } catch (error) {
        console.error("Error fetching user ID:", error);
        res.status(500).json({ message: "שגיאה בחיפוש משתמש" });
    }
};
