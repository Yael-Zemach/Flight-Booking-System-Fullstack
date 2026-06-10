import pool from '../config/database.js';

// 1. הוספת שדה תעופה
export async function insertAirport(airportCode, airportName, city, country, imageUrl, description) {
    const [result] = await pool.query(
        'INSERT INTO Airports (airport_code, airport_name, city, country, image_url, description) VALUES (?, ?, ?, ?, ?, ?)',
        [airportCode, airportName, city, country, imageUrl, description]
    );
    return result.insertId;
}

// 2. עדכון תמונת שדה תעופה בלבד
export async function updateAirportImageUrl(airportId, imageUrl) {
    const [result] = await pool.query(
        'UPDATE Airports SET image_url = ? WHERE airport_id = ?',
        [imageUrl, airportId]
    );
    return result.affectedRows > 0;
}

// 3. מחיקת שדה תעופה
export async function deleteAirportById(airportId) {
    const [result] = await pool.query('DELETE FROM Airports WHERE airport_id = ?', [airportId]);
    return result.affectedRows > 0;
}

// פונקציית הגנה: ספירת טיסות שממריאות או נוחתות בשדה התעופה הזה
export async function countFlightsForAirport(airportId) {
    const query = `
        SELECT COUNT(*) as count 
        FROM Flights 
        WHERE departure_airport_id = ? OR arrival_airport_id = ?
    `;
    const [rows] = await pool.query(query, [airportId, airportId]);
    return rows[0].count;
}

// פונקציה לבדיקה אם קוד שדה תעופה כבר תפוס (כדי למנוע קריסת חוק ה-UNIQUE של ה-DB)
export async function getAirportByCode(airportCode) {
    const [rows] = await pool.query('SELECT airport_id FROM Airports WHERE airport_code = ?', [airportCode]);
    return rows[0];
}
// להוסיף לקובץ הקיים:

export async function getAllAirports() {
    // שליפת כל הנתונים, ממוינים לפי שם המדינה והעיר לנוחות המשתמש
    const query = 'SELECT * FROM Airports ORDER BY country ASC, city ASC';
    const [rows] = await pool.query(query);
    return rows;
}