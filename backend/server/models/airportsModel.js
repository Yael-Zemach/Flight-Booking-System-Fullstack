import pool from '../config/database.js';

export async function insertAirport(airportCode, airportName, city, country, imageUrl, description) {
    const [result] = await pool.query(
        'INSERT INTO Airports (airport_code, airport_name, city, country, image_url, description) VALUES (?, ?, ?, ?, ?, ?)',
        [airportCode, airportName, city, country, imageUrl, description]
    );
    return result.insertId;
}

export async function updateAirportImageUrl(airportId, imageUrl) {
    const [result] = await pool.query(
        'UPDATE Airports SET image_url = ? WHERE airport_id = ?',
        [imageUrl, airportId]
    );
    return result.affectedRows > 0;
}

export async function deleteAirportById(airportId) {
    const [result] = await pool.query('DELETE FROM Airports WHERE airport_id = ?', [airportId]);
    return result.affectedRows > 0;
}

export async function countFlightsForAirport(airportId) {
    const query = `
        SELECT COUNT(*) as count 
        FROM Flights 
        WHERE departure_airport_id = ? OR arrival_airport_id = ?
    `;
    const [rows] = await pool.query(query, [airportId, airportId]);
    return rows[0].count;
}


export async function getAllAirports() {
    const query = 'SELECT * FROM Airports ORDER BY country ASC, city ASC';
    const [rows] = await pool.query(query);
    return rows;
}