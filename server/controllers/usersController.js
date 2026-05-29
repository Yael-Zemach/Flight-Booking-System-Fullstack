import { updateUser } from '../models/usersModel.js';

export async function handleUpdateUser(req, res) {
    const targetUserId = req.params.id;
    const { name, email } = req.body;

    try {
        const success = await updateUser(targetUserId, name, email);
        if (success) {
            return res.status(200).json({ message: 'הפרטים עודכנו בהצלחה' });
        } else {
            return res.status(400).json({ message: 'עדכון הפרטים נכשל' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'שגיאה בעדכון הנתונים' });
    }
}