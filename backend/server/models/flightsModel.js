import pool from '../config/database.js';
import { FLIGHT_STATUS } from '../constants/flightStatus.js';
import { BOOKING_STATUS } from '../constants/bookingStatus.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

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
          AND DATE(f.departure_time) BETWEEN ? AND ? 
          AND f.seats_available >= ? 
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


// 1. יצירת טיסה חדשה
export async function insertFlight(flightNumber, departureAirportId, arrivalAirportId, departureTime, arrivalTime, price, seatsAvailable) {
    const [result] = await pool.query(
        'INSERT INTO Flights (flight_number, departure_airport_id, arrival_airport_id, departure_time, arrival_time, price, seats_available, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [flightNumber, departureAirportId, arrivalAirportId, departureTime, arrivalTime, price, seatsAvailable, FLIGHT_STATUS.SCHEDULED]
    );
    return result.insertId;
}

// 2. עדכון פרטי טיסה
export async function updateFlightDetails(flightId, flightNumber, departureAirportId, arrivalAirportId, departureTime, arrivalTime, price, seatsAvailable) {
    const [result] = await pool.query(
        'UPDATE Flights SET flight_number = ?, departure_airport_id = ?, arrival_airport_id = ?, departure_time = ?, arrival_time = ?, price = ?, seats_available = ? WHERE flight_id = ?',
        [flightNumber, departureAirportId, arrivalAirportId, departureTime, arrivalTime, price, seatsAvailable, flightId]
    );
    return result.affectedRows > 0;
}

// 3. ביטול טיסה וביטול ההזמנות שלה (טרנזקציה!)
export async function cancelFlightAndBookings(flightId) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        // עדכון סטטוס הטיסה ל"מבוטל"
        const [flightResult] = await connection.query(
            'UPDATE Flights SET status = ? WHERE flight_id = ? AND status != ?',
            [FLIGHT_STATUS.CANCELLED, flightId, FLIGHT_STATUS.CANCELLED]
        );

        if (flightResult.affectedRows === 0) {
            throw new Error(ERROR_CODES.NOT_FOUND_OR_ALREADY_CANCELLED);
        }

        // אפקט הדומינו: עדכון כל ההזמנות של הטיסה הזו ל"מבוטל"
        await connection.query(
            'UPDATE Bookings SET status = ? WHERE flight_id = ?',
            [BOOKING_STATUS.CANCELLED, flightId]
        );

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export async function getFlightsByDateForAdmin(date) {
    const sqlQuery = `
        SELECT 
            f.flight_id,
            f.flight_number,
            f.departure_airport_id,  
            f.arrival_airport_id,   
            f.departure_time,
            f.arrival_time,
            f.price,
            f.seats_available,
            f.status,
            dep.airport_code AS departure_code,
            dep.city AS departure_city,
            arr.airport_code AS arrival_code,
            arr.city AS arrival_city
        FROM flights f
        JOIN airports dep ON f.departure_airport_id = dep.airport_id
        JOIN airports arr ON f.arrival_airport_id = arr.airport_id
        WHERE DATE(f.departure_time) = ?
        ORDER BY f.departure_time ASC
    `;
    
    const [rows] = await pool.query(sqlQuery, [date]);
    return rows;
}