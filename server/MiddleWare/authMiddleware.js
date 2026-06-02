import jwt from 'jsonwebtoken';
import { getUserById } from '../models/usersModel.js';
import { JWT_CONFIG } from '../constants/jwtConfig.js';
import { HTTP_HEADERS } from '../constants/httpHeaders.js';
import { USER_TYPES } from '../constants/userTypes.js';
import { MESSAGES } from '../constants/messages.js';

// ========================================================
// 1. אימות (Authentication) - לכולם
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

        req.user = decodedUser; 
        next(); 
    });
}

// ========================================================
// 2. הרשאה בסיסית לאדמין - האם מי שמבקש הוא אדמין?
// ========================================================
export function isAdmin(req, res, next) {
    if (req.user && req.user.userType === USER_TYPES.ADMIN) {
        return next(); 
    }
    
    return res.status(403).json({ message: MESSAGES.AUTHORIZATION.ADMIN_ONLY });
}

// ========================================================
// 3. הגנת יעד לאדמין - מונע מאדמין לערוך אדמין אחר
// (יושם רק על ראוטים מסוג /admin/:id)
// ========================================================
export async function verifyAdminTarget(req, res, next) {
    try {
        const loggedInUserId = req.user.userId; 
        
        // בראוט של אדמין, אנחנו יודעים בוודאות שהיעד נמצא ב-URL!
        const targetUserId = parseInt(req.params.id); 

        if (!targetUserId || isNaN(targetUserId)) {
            return res.status(400).json({ message: MESSAGES.AUTHORIZATION.MISSING_USER_ID });
        }

        // חוק 1: אדמין תמיד יכול לערוך את עצמו (גם דרך פאנל הניהול)
        if (loggedInUserId === targetUserId) {
            return next(); 
        }

        // שליפת משתמש היעד מה-DB
        const targetUser = await getUserById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({ message: MESSAGES.AUTHORIZATION.TARGET_USER_NOT_FOUND });
        }

        // חוק 2: מותר לערוך רק לקוחות, אסור לערוך אדמין אחר
        if (targetUser.user_type === USER_TYPES.CUSTOMER) {
            return next(); 
        } else {
            return res.status(403).json({ message: MESSAGES.AUTHORIZATION.ADMIN_CANNOT_MANAGE_ADMIN });
        }

    } catch (error) {
        console.error('Error in verifyAdminTarget middleware:', error);
        return res.status(500).json({ message: MESSAGES.AUTHORIZATION.AUTH_ERROR });
    }
}