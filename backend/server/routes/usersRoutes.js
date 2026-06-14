import { Router } from 'express';
import { authenticateToken, isAdmin, verifyAdminTarget } from '../middleware/authMiddleware.js';
import { 
    handleUpdateUser, 
    handleGetUserIdByEmail

} from '../controllers/usersController.js';
import { API_ROUTES } from '../constants/apiRoutes.js';

const router = Router();
router.put(API_ROUTES.USERS.PROFILE, authenticateToken, handleUpdateUser);
router.put(API_ROUTES.USERS.ADMIN_USER, authenticateToken, isAdmin, verifyAdminTarget, handleUpdateUser);
router.get(API_ROUTES.USERS.BY_EMAIL, authenticateToken, isAdmin, handleGetUserIdByEmail);
export default router;