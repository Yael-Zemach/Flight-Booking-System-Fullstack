import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js'; // המידלוור של ה-JWT שלך
import { authorizeUserUpdate } from '../middleware/authMiddleware.js'; // המידלוור החדש של ההרשאות
import { handleUpdateUser } from '../controllers/usersController.js';

const router = express.Router();


router.put('/:id', authenticateToken, authorizeUserUpdate, handleUpdateUser);

export default router;