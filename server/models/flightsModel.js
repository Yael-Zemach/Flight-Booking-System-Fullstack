import pool from '../config/database.js';

export async function getFlightsByDateRange(originCode, destCode, startDate, endDate, requiredSeats) {
    const query = `
        SELECT 
            f.flight_id, f.flight_number, f.departure_time, f.arrival_time, 
            f.price, f.seats_available,
            dep.airport_code AS departure_code, dep.city AS departure_city,
            arr.airport_code AS arrival_code, arr.city AS arrival_city
        FROM Flights f
        JOIN Airports dep ON f.departure_airport_id = dep.airport_id
        JOIN Airports arr ON f.arrival_airport_id = arr.airport_id
        WHERE dep.airport_code = ? 
          AND arr.airport_code = ?
          -- חיפוש בטווח תאריכים
          AND DATE(f.departure_time) BETWEEN ? AND ? 
          AND f.seats_available >= ? 
          -- מוודא שהטיסה לא עברה כבר, ושיש לפחות 3 שעות מעכשיו
          AND f.departure_time >= NOW() + INTERVAL 3 HOUR
        ORDER BY f.departure_time ASC
    `;

    const [rows] = await pool.execute(query, [originCode, destCode, startDate, endDate, requiredSeats]);
    return rows;
}
export async function updateFlightSeats(connection, flightId, seatsToChange) {
    // seatsToChange יכול להיות שלילי (כאשר מזמינים) או חיובי (כאשר מבטלים)
    await connection.query(
        'UPDATE Flights SET seats_available = seats_available + ? WHERE flight_id = ?',
        [seatsToChange, flightId]
    );
}