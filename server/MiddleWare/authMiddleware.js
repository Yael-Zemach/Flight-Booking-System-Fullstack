import jwt from 'jsonwebtoken';
import { getUserById } from '../models/usersModel.js';
import { JWT_CONFIG } from '../constants/jwtConfig.js';
import { HTTP_HEADERS } from '../constants/httpHeaders.js';
import { USER_TYPES } from '../constants/userTypes.js';
import { MESSAGES } from '../constants/messages.js';

// ========================================================
// 1. שלב האימות (Authentication) - משותף לכולם!
// ========================================================
export function authenticateToken(req, res, next) {
    const authHeader = req.headers[HTTP_HEADERS.AUTHORIZATION];
    let token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: MESSAGES.AUTHORIZATION.PLEASE_LOGIN });
    }

    jwt.verify(token, JWT_CONFIG.SECRET, (err, decodedUser) => {
        if (err) {
            console.error("JWT Verification Error:", err.message); 
            return res.status(403).json({ message: MESSAGES.AUTHORIZATION.INVALID_OR_EXPIRED_TOKEN });
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
    if (req.user && req.user.userType === USER_TYPES.ADMIN) {
        return next(); // המשתמש הוא אדמין, מאשרים לו להמשיך לקונטרולר
    }
    
    // אם הוא לא אדמין (הוא customer)
    return res.status(403).json({ message: MESSAGES.AUTHORIZATION.ADMIN_ONLY });
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
            return res.status(400).json({ message: MESSAGES.AUTHORIZATION.MISSING_USER_ID });
        }

        // חוק 1: משתמש תמיד יכול לבצע פעולות עבור עצמו
        if (loggedInUser.userId === targetUserId) {
            return next(); 
        }

        // חוק 2: אדמין יכול לבצע פעולות עבור קסטומר, אך לא עבור אדמין אחר
        if (loggedInUser.userType === USER_TYPES.ADMIN) {
            const targetUser = await getUserById(targetUserId);

            if (!targetUser) {
                return res.status(404).json({ message: MESSAGES.AUTHORIZATION.TARGET_USER_NOT_FOUND });
            }

            if (targetUser.user_type === USER_TYPES.CUSTOMER) {
                return next(); 
            } else {
                return res.status(403).json({ message: MESSAGES.AUTHORIZATION.ADMIN_CANNOT_MANAGE_ADMIN });
            }
        }

        return res.status(403).json({ message: MESSAGES.AUTHORIZATION.PERMISSION_DENIED });

    } catch (error) {
        console.error('Error in authorization middleware:', error);
        return res.status(500).json({ message: MESSAGES.AUTHORIZATION.AUTH_ERROR });
    }
}