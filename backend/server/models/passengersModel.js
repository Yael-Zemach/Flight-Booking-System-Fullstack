
import pool from '../config/database.js';
export async function insertPassenger(connection, bookingId, pax) {
    await connection.query(
        'INSERT INTO Passengers (booking_id, first_name, last_name, date_of_birth, gender, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [bookingId, pax.first_name, pax.last_name, pax.date_of_birth, pax.gender, pax.email || null, pax.phone || null]
    );
}

export async function updatePassengerDetails(connection, bookingId, pax) {
    await connection.query(
        'UPDATE Passengers SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, email = ?, phone = ? WHERE passenger_id = ? AND booking_id = ?',
        [pax.first_name, pax.last_name, pax.date_of_birth, pax.gender, pax.email || null, pax.phone || null, pax.passenger_id, bookingId]
    );
}