import pool from '../config/database.js';
import { BOOKING_STATUS } from '../constants/bookingStatus.js';
// ייבוא הפונקציות שהוספת למודלים האחרים
import { updateFlightSeats } from './flightsModel.js'; 
import { insertPassenger, updatePassengerDetails } from './passengersModel.js'; 

export async function getBookingsByUserId(userId) {
    const query = `
        SELECT 
            b.booking_id, b.booking_time, b.total_price, b.status,
            f.flight_number, f.departure_time, f.arrival_time,
            dep.city AS departure_city, arr.city AS arrival_city
        FROM Bookings b
        JOIN Flights f ON b.flight_id = f.flight_id
        JOIN Airports dep ON f.departure_airport_id = dep.airport_id
        JOIN Airports arr ON f.arrival_airport_id = arr.airport_id
        WHERE b.user_id = ?
        ORDER BY b.booking_time DESC
    `;
    const [bookings] = await pool.query(query, [userId]);

    for (let booking of bookings) {
        const [passengers] = await pool.query(
            'SELECT passenger_id, first_name, last_name, date_of_birth, gender, email, phone FROM Passengers WHERE booking_id = ?',
            [booking.booking_id]
        );
        booking.passengers = passengers;
    }

    return bookings;
}

export async function createBookingWithPassengers(userId, flightId, totalPrice, passengersArray) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const [bookingResult] = await connection.query(
            'INSERT INTO Bookings (user_id, flight_id, booking_time, total_price, status) VALUES (?, ?, NOW(), ?, ?)',
            [userId, flightId, totalPrice, BOOKING_STATUS.PENDING]
        );
        const newBookingId = bookingResult.insertId;

        for (const pax of passengersArray) {
            await insertPassenger(connection, newBookingId, pax);
        }

        // עדכון מושבים פנויים (הורדה)
        await updateFlightSeats(connection, flightId, -passengersArray.length);

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

export async function updateBookingByAdmin(bookingId, flightId, totalPrice, status, passengersArray) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        await connection.query(
            'UPDATE Bookings SET flight_id = ?, total_price = ?, status = ? WHERE booking_id = ?',
            [flightId, totalPrice, status, bookingId]
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