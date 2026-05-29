import jwt from 'jsonwebtoken';
import { getUserById } from '../models/usersModel.js';

// 1. אימות הטוקן (Authentication) - מתוקן עם ניקוי גרשיים!
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'גישה נדחתה: נא להתחבר למערכת' });
    }

    // שורת הזהב: מנקה גרשיים כפולים או בודדים אם הועתקו בטעות מ-Postman
    // token = token.replace(/^["']|["']$/g, '');

    jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key', (err, decodedUser) => {
        if (err) {
            console.error("JWT Verification Error:", err.message); // הדפסה לטרמינל כדי שתוכלי לראות מה השגיאה האמיתית
            return res.status(403).json({ message: 'הטוקן אינו תקין או שפג תוקפו' });
        }

        // שומרים את האובייקט המפוענח
        req.user = decodedUser; 
        next(); 
    });
}

// 2. בדיקת הרשאות עריכה (Authorization) - מותאם בדיוק למבנה הטוקן שלך!
export async function authorizeUserUpdate(req, res, next) {
    try {
        const loggedInUser = req.user; // מגיע מהטוקן המפוענח
        const targetUserId = parseInt(req.params.id); // ה-ID מה-URL

        // חוק 1: משתמש תמיד יכול לערוך את עצמו
        // שונה ל-userId כדי להתאים לטוקן שלך!
        if (loggedInUser.userId === targetUserId) {
            return next(); 
        }

        // חוק 2: אדמין יכול לערוך קסטומר, אך לא אדמין אחר
        // שונה ל-userType כדי להתאים לטוקן שלך!
        if (loggedInUser.userType === 'admin') {
            const targetUser = await getUserById(targetUserId);

            if (!targetUser) {
                return res.status(404).json({ message: 'המשתמש שאתה מנסה לערוך לא קיים' });
            }

            // כאן זה נשאר user_type (עם קו תחתון) כי זה מגיע ישירות מהשורות של מסד הנתונים
            if (targetUser.user_type === 'customer') {
                return next(); 
            } else {
                return res.status(403).json({ message: 'אין הרשאה לאדמין לערוך אדמין אחר' });
            }
        }

        // קסטומר מנסה לערוך מישהו אחר
        return res.status(403).json({ message: 'אין לך הרשאה לבצע פעולה זו' });

    } catch (error) {
        console.error('Error in authorization middleware:', error);
        return res.status(500).json({ message: 'שגיאת שרת פנימית בבדיקת הרשאות' });
    }
}