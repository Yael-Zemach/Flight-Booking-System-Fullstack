import jwt from 'jsonwebtoken';
import { getUserById } from '../models/usersModel.js';

// ========================================================
// 1. שלב האימות (Authentication) - משותף לכולם!
// ========================================================
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'גישה נדחתה: נא להתחבר למערכת' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key', (err, decodedUser) => {
        if (err) {
            console.error("JWT Verification Error:", err.message); 
            return res.status(403).json({ message: 'הטוקן אינו תקין או שפג תוקפו' });
        }

        // שומרים את האובייקט המפוענח על ה-req כדי שהמידלוורס הבאים בתור יוכלו להשתמש בו
        req.user = decodedUser; 
        next(); 
    });
}

// ========================================================
// 2. שלב ההרשאה לאדמין בלבד (Admin Authorization) - חדש!
// ========================================================
export function isAdmin(req, res, next) {
    // req.user קיים רק אם המידלוור הקודם (authenticateToken) רץ בהצלחה
    if (req.user && req.user.userType === 'admin') {
        return next(); // המשתמש הוא אדמין, מאשרים לו להמשיך לקונטרולר
    }
    
    // אם הוא לא אדמין (הוא customer)
    return res.status(403).json({ message: 'גישה נדחתה: פעולה זו מותרת למנהלי מערכת בלבד' });
}

// ========================================================
// 3. שלב ההרשאה המעורבת (Generic User Action Authorization)
// ========================================================
export async function authorizeUserAction(req, res, next) {
    try {
        const loggedInUser = req.user; 

        // שליפת ה-ID מהפרמס או מה-body
        const targetUserId = parseInt(req.params.id || req.body.userId || req.body.id || req.user.userId);
        if (!targetUserId || isNaN(targetUserId)) {
            return res.status(400).json({ message: 'מזהה משתמש יעד חסר או לא תקין' });
        }

        // חוק 1: משתמש תמיד יכול לבצע פעולות עבור עצמו
        if (loggedInUser.userId === targetUserId) {
            return next(); 
        }

        // חוק 2: אדמין יכול לבצע פעולות עבור קסטומר, אך לא עבור אדמין אחר
        if (loggedInUser.userType === 'admin') {
            const targetUser = await getUserById(targetUserId);

            if (!targetUser) {
                return res.status(404).json({ message: 'המשתמש שאתה מנסה לבצע עבורו פעולה לא קיים' });
            }

            if (targetUser.user_type === 'customer') {
                return next(); 
            } else {
                return res.status(403).json({ message: 'אין הרשאה לאדמין לבצע פעולה עבור אדמין אחר' });
            }
        }

        return res.status(403).json({ message: 'אין לך הרשאה לבצע פעולה זו' });

    } catch (error) {
        console.error('Error in authorization middleware:', error);
        return res.status(500).json({ message: 'שגיאת שרת פנימית בבדיקת הרשאות' });
    }
}