import { Router } from 'express';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';
import { 
    handleGetMyProfile, 
    handleUpdateUser 
} from '../controllers/usersController.js';
import { API_ROUTES } from '../constants/apiRoutes.js';

const router = Router();

// ============================================================================
// אזור הלקוח (Customer Flow)
// השרת יודע מי הלקוח לפי הטוקן בלבד. אין ID ב-URL.
// ============================================================================

// שליפת הפרופיל של המשתמש המחובר
router.get(API_ROUTES.USERS.PROFILE, authenticateToken, handleGetMyProfile);

// עדכון הפרופיל של המשתמש המחובר
router.put(API_ROUTES.USERS.PROFILE, authenticateToken, handleUpdateUser);


// ============================================================================
// אזור האדמין (Admin Flow)
// חובה להשתמש ב-ID ב-URL כדי להגיד על מי פועלים. מוגן ע"י isAdmin.
// ============================================================================

// עדכון משתמש ספציפי ע"י מנהל
router.put(API_ROUTES.USERS.ADMIN_USER, authenticateToken, isAdmin, handleUpdateUser);

export default router;