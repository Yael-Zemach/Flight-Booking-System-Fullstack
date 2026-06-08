import * as userModel from '../models/usersModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { USER_TYPES } from '../constants/userTypes.js';
import { JWT_CONFIG } from '../constants/jwtConfig.js';

export async function registerUser(name, email, password, userType = USER_TYPES.CUSTOMER) {
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
        throw new Error(ERROR_CODES.EMAIL_EXISTS);
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const userId = await userModel.createUser(name, email, passwordHash, userType);
    
    const token = jwt.sign(
        { userId: userId, userType: userType },
        JWT_CONFIG.SECRET, 
        { expiresIn: JWT_CONFIG.EXPIRATION }
    );

    const newUser = {
        name: name,
        email: email
    };

    return { user: newUser, token };
}


export async function loginUser(email, password) {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
        throw new Error(ERROR_CODES.EMAIL_NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error(ERROR_CODES.PASSWORD_INCORRECT);
    }

    


    const token = jwt.sign(
        { userId: user.user_id, userType: user.user_type },
        JWT_CONFIG.SECRET, 
        { expiresIn: JWT_CONFIG.EXPIRATION } 
    );
     const newUser = {
        name: user.name,
        email: user.email,
        userType: user.user_type
    };


    return { user: newUser, token };
}