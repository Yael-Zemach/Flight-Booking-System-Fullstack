import * as authService from '../services/authService.js';

export async function register(req, res) {
    const { name, email, password, userType } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'שם, אימייל וסיסמה הם שדות חובה' });
    }

    try {
       
        const { user, token } = await authService.registerUser(name, email, password, userType);
        return res.status(201).json({ 
            message: 'הרישום בוצע בהצלחה והתחברת למערכת!', 
            user, 
            token 
        });
    } catch (error) {
        if (error.message === 'EMAIL_EXISTS') {
            return res.status(400).json({ message: 'כתובת האימייל הזו כבר רשומה במערכת' });
        }
        console.error(error);
        return res.status(500).json({ message: 'שגיאת שרת פנימית בעת הרישום' });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'אימייל וסיסמה הם שדות חובה' });
    }

    try {
        const { user, token } = await authService.loginUser(email, password);
    
        return res.json({ 
            message: 'התחברת בהצלחה!', 
            user, 
            token 
        });
    } catch (error) {
    
        if (error.message === 'EMAIL_NOT_FOUND') {
            return res.status(401).json({ message: 'אימייל לא נמצא' });
        }
        if (error.message === 'PASSWORD_INCORRECT') {
            return res.status(401).json({ message: 'סיסמה שגויה' });
        }
        
        console.error(error);
        return res.status(500).json({ message: 'שגיאת שרת פנימית בעת ההתחברות' });
    }
}