import * as userModel from '../models/usersModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function registerUser(name, email, password, userType = 'customer') {
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
        throw new Error('EMAIL_EXISTS');
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const userId = await userModel.createUser(name, email, passwordHash, userType);
    
    const token = jwt.sign(
        { userId: userId, userType: userType },
        process.env.JWT_SECRET || 'your_super_secret_key', 
        { expiresIn: '3h' }
    );

    const newUser = {
        user_id: userId,
        name,
        email,
        user_type: userType
    };

    return { user: newUser, token };
}


export async function loginUser(email, password) {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
        throw new Error('EMAIL_NOT_FOUND');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('PASSWORD_INCORRECT');
    }

    delete user.password_hash;


    const token = jwt.sign(
        { userId: user.user_id, userType: user.user_type },
        process.env.JWT_SECRET || 'your_super_secret_key', 
        { expiresIn: '3h' } 
    );

    return { user, token };
}