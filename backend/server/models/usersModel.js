import pool from '../config/database.js';

export async function createUser(name, email, passwordHash, userType) {
    const [userResult] = await pool.query(
        'INSERT INTO Users (name, email, user_type) VALUES (?, ?, ?)',
        [name, email, userType]
    );
        const userId = userResult.insertId;
    await pool.query(
        'INSERT INTO hash_passwords (user_id, password_hash) VALUES (?, ?)',
        [userId, passwordHash]
    );
    return userId;
}

export async function getUserByEmail(email) {
    const [rows] = await pool.query(
        `SELECT u.*, hp.password_hash 
         FROM Users u 
         JOIN hash_passwords hp ON u.user_id = hp.user_id 
         WHERE u.email = ?`,
        [email]
    );
    
    return rows[0]; 
}
export async function updateUser(userId, name) {
    const [result] = await pool.query(
        'UPDATE Users SET name = ? WHERE user_id = ?',
        [name, userId]
    );
    return result.affectedRows > 0;
}
export async function getUserById(userId) {
    const [rows] = await pool.query('SELECT user_id, email, name, user_type FROM Users WHERE user_id = ?', [userId]);
    return rows[0]; 
}