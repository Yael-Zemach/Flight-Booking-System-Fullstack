import pool from '../config/database.js';
import { BOOKING_STATUS } from '../constants/bookingStatus.js';
import { updateFlightSeats } from './flightsModel.js'; 
import { insertPassenger, updatePassengerDetails } from './passengersModel.js'; 

// 🌟 שליפת הזמנה בודדת - כולל נתוני טיסת חזור אופציונלית
export async function getBookingById(bookingId) {
    const query = `
        SELECT 
            b.booking_id, b.user_id, b.booking_time, b.total_price, b.status,
            -- טיסת הלוך
            f.flight_number, f.departure_time, f.arrival_time,
            dep.city AS departure_city, arr.city AS arrival_city,
            -- טיסת חזור (יכולה להיות NULL ולכן משתמשים ב-LEFT JOIN)
            rf.flight_number AS return_flight_number, 
            rf.departure_time AS return_departure_time, 
            rf.arrival_time AS return_arrival_time,
            rdep.city AS return_departure_city, 
            rarr.city AS return_arrival_city
        FROM Bookings b
        JOIN Flights f ON b.flight_id = f.flight_id
        JOIN Airports dep ON f.departure_airport_id = dep.airport_id
        JOIN Airports arr ON f.arrival_airport_id = arr.airport_id
        LEFT JOIN Flights rf ON b.return_flight_id = rf.flight_id
        LEFT JOIN Airports rdep ON rf.departure_airport_id = rdep.airport_id
        LEFT JOIN Airports rarr ON rf.arrival_airport_id = rarr.airport_id
        WHERE b.booking_id = ?
    `;
    const [bookings] = await pool.query(query, [bookingId]);
    
    if (bookings.length === 0) return null;

    const booking = bookings[0];

    // שליפת הנוסעים עבור ההזמנה
    const [passengers] = await pool.query(
        'SELECT passenger_id, first_name, last_name, gender, email, phone FROM Passengers WHERE booking_id = ?',
        [bookingId]
    );
    booking.passengers = passengers;

    return booking;
}

export async function getBookingsByUserId(userId, page, limit) {
    // 1. חישוב ה-Offset (כמה שורות לדלג)
    const offset = (page - 1) * limit;

    // 2. שאילתה א': ספירת סך כל ההזמנות הקיימות ליוזר (כדי לדעת כמה עמודים יש בסך הכל)
    const countQuery = `SELECT COUNT(*) AS total FROM Bookings WHERE user_id = ?`;
    const [countResult] = await pool.query(countQuery, [userId]);
    const totalCount = countResult[0].total;

    // 3. שאילתה ב': שליפת ההזמנות עצמן עבור העמוד הנוכחי בלבד
    const query = `
        SELECT 
            b.booking_id, b.booking_time, b.total_price, b.status,
            f.flight_number, f.departure_time, f.arrival_time,
            dep.city AS departure_city, arr.city AS arrival_city,
            rf.flight_number AS return_flight_number, 
            rf.departure_time AS return_departure_time, 
            rf.arrival_time AS return_arrival_time,
            rdep.city AS return_departure_city, 
            rarr.city AS return_arrival_city
        FROM Bookings b
        JOIN Flights f ON b.flight_id = f.flight_id
        JOIN Airports dep ON f.departure_airport_id = dep.airport_id
        JOIN Airports arr ON f.arrival_airport_id = arr.airport_id
        LEFT JOIN Flights rf ON b.return_flight_id = rf.flight_id
        LEFT JOIN Airports rdep ON rf.departure_airport_id = rdep.airport_id
        LEFT JOIN Airports rarr ON rf.arrival_airport_id = rarr.airport_id
        WHERE b.user_id = ? 
        ORDER BY b.booking_time DESC
        LIMIT ? OFFSET ?;
    `;
    
    // מריצים את השאילתה עם הערכים כמספרים
    const [bookings] = await pool.query(query, [userId, limit, offset]);

    // שליפת הנוסעים עבור כל הזמנה שחזרה בעמוד הנוכחי
    for (let booking of bookings) {
        const [passengers] = await pool.query(
            'SELECT passenger_id, first_name, last_name, gender, email, phone FROM Passengers WHERE booking_id = ?',
            [booking.booking_id]
        );
        booking.passengers = passengers;
    }

    // מחזירים את התוצאה המשולבת
    return { bookings, totalCount };
}

export async function createBookingWithPassengers(userId, flightId, returnFlightId, totalPrice, passengersArray) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const [bookingResult] = await connection.query(
            'INSERT INTO Bookings (user_id, flight_id, return_flight_id, booking_time, total_price, status) VALUES (?, ?, ?, NOW(), ?, ?)',
            [userId, flightId, returnFlightId, totalPrice, BOOKING_STATUS.PENDING]
        );
        const newBookingId = bookingResult.insertId;

        for (const pax of passengersArray) {
            await insertPassenger(connection, newBookingId, pax);
        }

        await updateFlightSeats(connection, flightId, -passengersArray.length);

        if (returnFlightId) {
            await updateFlightSeats(connection, returnFlightId, -passengersArray.length);
        }

        await connection.commit();
        return newBookingId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export async function updateBookingStatus(bookingId, newStatus) {
    const [result] = await pool.query(
        'UPDATE Bookings SET status = ? WHERE booking_id = ?',
        [newStatus, bookingId]
    );
    return result.affectedRows > 0;
}

export async function updateBookingByAdmin(bookingId, flightId, returnFlightId, totalPrice, status, passengersArray) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(
            'UPDATE Bookings SET flight_id = ?, return_flight_id = ?, total_price = ?, status = ? WHERE booking_id = ?',
            [flightId, returnFlightId,  totalPrice, status, bookingId]
        );

        if (passengersArray && passengersArray.length > 0) {
            for (const pax of passengersArray) {
                if (pax.passenger_id) {
                    await updatePassengerDetails(connection, bookingId, pax);
                }
            }
        }
        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}