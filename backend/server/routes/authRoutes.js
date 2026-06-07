import express from 'express';
import { register, login } from '../controllers/authController.js';
import { API_ROUTES } from '../constants/apiRoutes.js';

const router = express.Router();
router.post(API_ROUTES.AUTH.REGISTER, register);
router.post(API_ROUTES.AUTH.LOGIN, login);

export default router;