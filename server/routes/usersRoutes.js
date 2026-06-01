import { Router } from 'express';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';
import { 
    handleGetMyProfile, 
    handleUpdateUser 
} from '../controllers/usersController.js';

const router = Router();

// ============================================================================
// אזור הלקוח (Customer Flow)
// השרת יודע מי הלקוח לפי הטוקן בלבד. אין ID ב-URL.
// ============================================================================

// שליפת הפרופיל של המשתמש המחובר
router.get('/profile', authenticateToken, handleGetMyProfile);

// עדכון הפרופיל של המשתמש המחובר
router.put('/profile', authenticateToken, handleUpdateUser);


// ============================================================================
// אזור האדמין (Admin Flow)
// חובה להשתמש ב-ID ב-URL כדי להגיד על מי פועלים. מוגן ע"י isAdmin.
// ============================================================================

// עדכון משתמש ספציפי ע"י מנהל
router.put('/admin/users/:id', authenticateToken, isAdmin, handleUpdateUser);

export default router;