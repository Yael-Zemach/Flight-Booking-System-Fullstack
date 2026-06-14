import * as authService from '../services/authService.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { MESSAGES } from '../constants/messages.js';

export async function register(req, res) {
    const { name, email, password, userType } = req.body;

   
    try {
       
        const { user, token } = await authService.registerUser(name, email, password, userType);
        return res.status(201).json({ 
            message: MESSAGES.AUTH.REGISTRATION_SUCCESS, 
            user, 
            token 
        });
    } catch (error) {
        if (error.message === ERROR_CODES.MISSING_DATA) {
            return res.status(400).json({ message: MESSAGES.AUTH.REGISTRATION_REQUIRED_FIELDS });
        }
        if (error.message === ERROR_CODES.EMAIL_EXISTS) {
            return res.status(400).json({ message: MESSAGES.AUTH.EMAIL_ALREADY_EXISTS });
        }
        console.error(error);
        return res.status(500).json({ message: MESSAGES.AUTH.REGISTRATION_ERROR });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

   

    try {
        const { user, token } = await authService.loginUser(email, password);
    
        return res.json({ 
            message: MESSAGES.AUTH.LOGIN_SUCCESS, 
            user, 
            token 
        });
    } catch (error) {
        if (error.message === ERROR_CODES.MISSING_DATA) {
            return res.status(400).json({ message: MESSAGES.AUTH.REGISTRATION_REQUIRED_FIELDS });
        }
    
        if (error.message === ERROR_CODES.EMAIL_NOT_FOUND) {
            return res.status(401).json({ message: MESSAGES.AUTH.EMAIL_NOT_FOUND });
        }
        if (error.message === ERROR_CODES.PASSWORD_INCORRECT) {
            return res.status(401).json({ message: MESSAGES.AUTH.PASSWORD_INCORRECT });
        }
        
        console.error(error);
        return res.status(500).json({ message: MESSAGES.AUTH.LOGIN_ERROR });
    }
}