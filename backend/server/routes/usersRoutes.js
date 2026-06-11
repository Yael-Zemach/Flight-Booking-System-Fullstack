import { Router } from 'express';
// ייבוא המידלוור החדש verifyAdminTarget
import { authenticateToken, isAdmin, verifyAdminTarget } from '../middleware/authMiddleware.js';
import { 
    // handleGetMyProfile, 
    handleUpdateUser, 
    handleGetUserIdByEmail

} from '../controllers/usersController.js';
import { API_ROUTES } from '../constants/apiRoutes.js';

const router = Router();

// router.get(API_ROUTES.USERS.PROFILE, authenticateToken, handleGetMyProfile);

// עדכון הפרופיל של המשתמש המחובר
router.put(API_ROUTES.USERS.PROFILE, authenticateToken, handleUpdateUser);

// עדכון משתמש ספציפי ע"י מנהל
router.put(API_ROUTES.USERS.ADMIN_USER, authenticateToken, isAdmin, verifyAdminTarget, handleUpdateUser);
 router.get(API_ROUTES.USERS.BY_EMAIL, authenticateToken, isAdmin, handleGetUserIdByEmail);
export default router;