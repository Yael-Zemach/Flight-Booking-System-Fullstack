import pool from '../config/database.js';
import { BOOKING_STATUS } from '../constants/bookingStatus.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { updateFlightSeats } from './flightsModel.js';
import { insertPassenger, updatePassengerDetails } from './passengersModel.js';

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
    const [passengers] = await pool.query(
        'SELECT passenger_id, first_name, last_name, date_of_birth, gender, email, phone FROM Passengers WHERE booking_id = ?', [bookingId]
    );
    booking.passengers = passengers;

    return booking;
}

export async function getBookingsByUserId(userId, page, limit) {
    const offset = (page - 1) * limit;
    const countQuery = "SELECT COUNT(*) AS total FROM Bookings WHERE user_id = ? AND status != 'pending'"; const [countResult] = await pool.query(countQuery, [userId]);
    const totalCount = countResult[0].total;
    const query = `
        SELECT 
b.booking_id, b.flight_id, b.return_flight_id, b.booking_time, b.total_price, b.status,            f.flight_number, f.departure_time, f.arrival_time,
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
       WHERE b.user_id = ? AND b.status != 'pending' 
ORDER BY b.booking_time DESC
        LIMIT ? OFFSET ?;
    `;

    const [bookings] = await pool.query(query, [userId, limit, offset]);

    for (let booking of bookings) {
        const [passengers] = await pool.query(
            'SELECT passenger_id, first_name, last_name, date_of_birth, gender, email, phone FROM Passengers WHERE booking_id = ?',
            [booking.booking_id]
        );
        booking.passengers = passengers;
    }

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


export async function updateBookingByAdmin(bookingId, flightId, returnFlightId, totalPrice, passengersArray) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [currentPassengers] = await connection.query(
            'SELECT passenger_id FROM Passengers WHERE booking_id = ?',
            [bookingId]
        );
        const currentIds = currentPassengers.map(p => p.passenger_id);
        const incomingIds = passengersArray.filter(p => p.passenger_id).map(p => p.passenger_id);
        const passengersToInsert = passengersArray.filter(p => !p.passenger_id); 
        const passengersToUpdate = passengersArray.filter(p => p.passenger_id); 
        const idsToDelete = currentIds.filter(id => !incomingIds.includes(id));
        const seatDelta = passengersToInsert.length - idsToDelete.length;
        if (seatDelta > 0) {
            const [flightRows] = await connection.query('SELECT seats_available FROM Flights WHERE flight_id = ?', [flightId]);
            if (!flightRows.length || flightRows[0].seats_available < seatDelta) {
                throw new Error(ERROR_CODES.NOT_ENOUGH_SEATS);
            }

            if (returnFlightId) {
                const [returnFlightRows] = await connection.query('SELECT seats_available FROM Flights WHERE flight_id = ?', [returnFlightId]);
                if (!returnFlightRows.length || returnFlightRows[0].seats_available < seatDelta) {
                    throw new Error(ERROR_CODES.NOT_ENOUGH_SEATS);
                }
            }
        }
        await connection.query(
            'UPDATE Bookings SET flight_id = ?, return_flight_id = ?, total_price = ? WHERE booking_id = ?',
            [flightId, returnFlightId, totalPrice, bookingId]
        );

        for (const pax of passengersToUpdate) {
            await updatePassengerDetails(connection, bookingId, pax);
        }
        for (const pax of passengersToInsert) {
            await insertPassenger(connection, bookingId, pax);
        }
        if (idsToDelete.length > 0) {
            const placeholders = idsToDelete.map(() => '?').join(',');
            await connection.query(
                `DELETE FROM Passengers WHERE passenger_id IN (${placeholders}) AND booking_id = ?`,
                [...idsToDelete, bookingId]
            );
        }
        if (seatDelta !== 0) {
            await updateFlightSeats(connection, flightId, -seatDelta);
            if (returnFlightId) {
                await updateFlightSeats(connection, returnFlightId, -seatDelta);
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
export async function cancelBookingAdminTransaction(bookingId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [bookings] = await connection.query('SELECT flight_id, return_flight_id FROM Bookings WHERE booking_id = ?', [bookingId]);
        const [passengers] = await connection.query('SELECT passenger_id FROM Passengers WHERE booking_id = ?', [bookingId]);
        if (!bookings.length) throw new Error(ERROR_CODES.NOT_FOUND);
        const { flight_id, return_flight_id } = bookings[0];
        const paxCount = passengers.length;
        await connection.query('UPDATE Bookings SET status = ? WHERE booking_id = ?', [BOOKING_STATUS.CANCELLED, bookingId]);
        await updateFlightSeats(connection, flight_id, paxCount);
        if (return_flight_id) {
            await updateFlightSeats(connection, return_flight_id, paxCount);
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
export async function getBookingDetailsForValidation(bookingId) {
    const query = `
        SELECT b.user_id, b.status, f.departure_time 
        FROM Bookings b
        JOIN Flights f ON b.flight_id = f.flight_id
        WHERE b.booking_id = ?
    `;
    const [rows] = await pool.query(query, [bookingId]);
    return rows[0] || null;
}
export async function clearExpiredPendingBookings(minutesExpired) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [expiredBookings] = await connection.query(
            `SELECT booking_id, flight_id, return_flight_id 
             FROM Bookings 
             WHERE status = ? AND booking_time < NOW() - INTERVAL ? MINUTE`,
            [BOOKING_STATUS.PENDING, minutesExpired]
        );
        if (expiredBookings.length === 0) {
            await connection.commit();
            return 0;
        }
        for (const booking of expiredBookings) {
            const [passengers] = await connection.query(
                'SELECT COUNT(*) AS count FROM Passengers WHERE booking_id = ?',
                [booking.booking_id]
            );
            const paxCount = passengers[0].count;

            if (paxCount > 0) {
                await updateFlightSeats(connection, booking.flight_id, paxCount);
                if (booking.return_flight_id) {
                    await updateFlightSeats(connection, booking.return_flight_id, paxCount);
                }
            }
            // await connection.query('DELETE FROM Passengers WHERE booking_id = ?', [booking.booking_id]);
            await connection.query('DELETE FROM Bookings WHERE booking_id = ?', [booking.booking_id]);
        }
        await connection.commit();
        return expiredBookings.length;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}