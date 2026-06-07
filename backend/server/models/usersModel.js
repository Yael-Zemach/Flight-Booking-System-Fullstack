import pool from '../config/database.js';

export async function createUser(name, email, passwordHash, userType) {
    // שלב א': הכנסת פרטי המשתמש הבסיסיים לטבלת Users
    const [userResult] = await pool.query(
        'INSERT INTO Users (name, email, user_type) VALUES (?, ?, ?)',
        [name, email, userType]
    );
    
    // שליפת ה-user_id שנוצר באופן אוטומטי (AUTO_INCREMENT)
    const userId = userResult.insertId;

    // שלב ב': הכנסת ה-Hash של הסיסמה לטבלת hash_passwords עם ה-user_id המתאים
    await pool.query(
        'INSERT INTO hash_passwords (user_id, password_hash) VALUES (?, ?)',
        [userId, passwordHash]
    );

    // נחזיר את ה-userId של המשתמש החדש
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
export async function updateUser(userId, name, email) {
    const [result] = await pool.query(
        'UPDATE Users SET name = ?, email = ? WHERE user_id = ?',
        [name, email, userId]
    );
    return result.affectedRows > 0; 
}
// הפונקציה החדשה שנצרכת עבור ה-Middleware
export async function getUserById(userId) {
    const [rows] = await pool.query('SELECT user_id, email, name, user_type FROM Users WHERE user_id = ?', [userId]);
    return rows[0]; // מחזיר את המשתמש הראשון שנמצא או undefined
}