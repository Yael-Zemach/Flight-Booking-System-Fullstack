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
        'SELECT passenger_id, first_name, last_name, date_of_birth, gender, email, phone FROM Passengers WHERE booking_id = ?', [bookingId]
    );
    booking.passengers = passengers;

    return booking;
}

export async function getBookingsByUserId(userId, page, limit) {
    // 1. חישוב ה-Offset (כמה שורות לדלג)
    const offset = (page - 1) * limit;

    // 2. שאילתה א': ספירת סך כל ההזמנות הקיימות ליוזר (כדי לדעת כמה עמודים יש בסך הכל)
    const countQuery = 'SELECT COUNT(*) AS total FROM Bookings WHERE user_id = ?';
    const [countResult] = await pool.query(countQuery, [userId]);
    const totalCount = countResult[0].total;

    // 3. שאילתה ב': שליפת ההזמנות עצמן עבור העמוד הנוכחי בלבד
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
        WHERE b.user_id = ? 
        ORDER BY b.booking_time DESC
        LIMIT ? OFFSET ?;
    `;

    // מריצים את השאילתה עם הערכים כמספרים
    const [bookings] = await pool.query(query, [userId, limit, offset]);

    // שליפת הנוסעים עבור כל הזמנה שחזרה בעמוד הנוכחי
    for (let booking of bookings) {
        const [passengers] = await pool.query(
            'SELECT passenger_id, first_name, last_name, date_of_birth, gender, email, phone FROM Passengers WHERE booking_id = ?',
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
// export async function updateBookingByAdmin(bookingId, flightId, returnFlightId, totalPrice, status, passengersArray) {
//     const connection = await pool.getConnection();
//     try {
//         await connection.beginTransaction();
//         await connection.query(
//             'UPDATE Bookings SET flight_id = ?, return_flight_id = ?, total_price = ?, status = ? WHERE booking_id = ?',
//             [flightId, returnFlightId,  totalPrice, status, bookingId]
//         );

//         if (passengersArray && passengersArray.length > 0) {
//             for (const pax of passengersArray) {
//                 if (pax.passenger_id) {
//                     await updatePassengerDetails(connection, bookingId, pax);
//                 }
//             }
//         }
//         await connection.commit();
//         return true;
//     } catch (error) {
//         await connection.rollback();
//         throw error;
//     } finally {
//         connection.release();
//     }
// }
// models/bookingsModel.js

// export async function updateBookingByAdmin(bookingId, flightId, returnFlightId, totalPrice, status, newPassengers, currentPassengers) {
//     const connection = await pool.getConnection();
//     try {
//         await connection.beginTransaction();

//         // 1. עדכון פרטי ההזמנה הכלליים
//         await connection.query(
//             'UPDATE Bookings SET flight_id = ?, return_flight_id = ?, total_price = ?, status = ? WHERE booking_id = ?',
//             [flightId, returnFlightId, totalPrice, status, bookingId]
//         );

//         // 2. זיהוי נוסעים: מי חדש? מי נשאר (לעדכון)? מי הוסר?
//         const newPaxIds = newPassengers.filter(p => p.passenger_id).map(p => p.passenger_id);
//         const toAdd = newPassengers.filter(p => !p.passenger_id); // בלי ID = חדש
//         const toUpdate = newPassengers.filter(p => p.passenger_id); // עם ID = קיים
//         const toDeleteIds = currentPassengers
//             .map(p => p.passenger_id)
//             .filter(id => !newPaxIds.includes(id)); // היה קיים ולא נשלח שוב

//         // 3. ביצוע השינויים בטבלת הנוסעים
//         for (const pax of toUpdate) {
//             await updatePassengerDetails(connection, bookingId, pax);
//         }
//         for (const pax of toAdd) {
//             await insertPassenger(connection, bookingId, pax);
//         }
//         if (toDeleteIds.length > 0) {
//             const placeholders = toDeleteIds.map(() => '?').join(',');
//             await connection.query(
//                 DELETE FROM Passengers WHERE passenger_id IN (${placeholders}) AND booking_id = ?,
//                 [...toDeleteIds, bookingId]
//             );
//         }

//         // 4. חישוב ההפרש בכמות הנוסעים ועדכון מלאי המושבים בטיסות
//         const paxDelta = toAdd.length - toDeleteIds.length;

//         if (paxDelta !== 0) {
//             // updateFlightSeats מצפה למינוס כשמזמינים, ולכן:
//             // אם נוספו נוסעים (paxDelta חיובי), נשלח -paxDelta (יורדו מושבים).
//             await updateFlightSeats(connection, flightId, -paxDelta);

//             if (returnFlightId) {
//                 await updateFlightSeats(connection, returnFlightId, -paxDelta);
//             }
//         }

//         await connection.commit();
//         return true;
//     } catch (error) {
//         await connection.rollback();
//         throw error;
//     } finally {
//         connection.release();
//     }
// }

export async function updateBookingByAdmin(bookingId, flightId, returnFlightId, totalPrice, passengersArray) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. שליפת הנוסעים הקיימים כרגע בבסיס הנתונים עבור הזמנה זו (לפני השינוי)
        const [currentPassengers] = await connection.query(
            'SELECT passenger_id FROM Passengers WHERE booking_id = ?',
            [bookingId]
        );
        const currentIds = currentPassengers.map(p => p.passenger_id);

        // 2. חלוקת הנוסעים שהגיעו מהפרונטאנד לקטגוריות
        const incomingIds = passengersArray.filter(p => p.passenger_id).map(p => p.passenger_id);
        const passengersToInsert = passengersArray.filter(p => !p.passenger_id); // נוסעים חדשים (בלי ID)
        const passengersToUpdate = passengersArray.filter(p => p.passenger_id);  // נוסעים קיימים לעדכון פרטים

        // זיהוי נוסעים שנמחקו: היו קודם ב-DB ולא קיימים במערך החדש שהאדמין שלח
        const idsToDelete = currentIds.filter(id => !incomingIds.includes(id));

        // 3. חישוב ההפרש במלאי המושבים (כמות שנוספה פחות כמות שגרענו)
        const seatDelta = passengersToInsert.length - idsToDelete.length;

        // 4. ולידציית הגנה: אם מתווספים מושבים, נוודא שיש מספיק מקום פנוי בטיסה במטוס!
        if (seatDelta > 0) {
            const [flightRows] = await connection.query('SELECT seats_available FROM Flights WHERE flight_id = ?', [flightId]);
            if (!flightRows.length || flightRows[0].seats_available < seatDelta) {
                throw new Error('NOT_ENOUGH_SEATS');
            }

            if (returnFlightId) {
                const [returnFlightRows] = await connection.query('SELECT seats_available FROM Flights WHERE flight_id = ?', [returnFlightId]);
                if (!returnFlightRows.length || returnFlightRows[0].seats_available < seatDelta) {
                    throw new Error('NOT_ENOUGH_SEATS');
                }
            }
        }

        // 5. עדכון פרטי ההזמנה הכלליים ב-DB (כולל המחיר הסופי המעודכן והסטטוס)
        await connection.query(
            'UPDATE Bookings SET flight_id = ?, return_flight_id = ?, total_price = ? WHERE booking_id = ?',
            [flightId, returnFlightId, totalPrice, bookingId]
        );

        // 6. ביצוע השינויים הדינמיים בטבלת הנוסעים (Passengers)
        // א. עדכון נוסעים קיימים (למשל, שינוי שם/תאריך לידה)
        for (const pax of passengersToUpdate) {
            await updatePassengerDetails(connection, bookingId, pax);
        }

        // ב. הוספת נוסעים חדשים ל-DB (כאן תוקן הבאג - שימוש ב-bookingId)
        for (const pax of passengersToInsert) {
            await insertPassenger(connection, bookingId, pax);
        }

        // ג. מחיקת הנוסעים שהאדמין הסיר מהרשימה
        if (idsToDelete.length > 0) {
            const placeholders = idsToDelete.map(() => '?').join(',');
            await connection.query(
                `DELETE FROM Passengers WHERE passenger_id IN (${placeholders}) AND booking_id = ?`,
                [...idsToDelete, bookingId]
            );
        }

        // 7. עדכון מלאי המושבים בפועל בטבלת Flights ב-DB
        // updateFlightSeats מחסירה מושבים כששולחים ערך שלילי, ומחזירה מושבים כששולחים ערך חיובי
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
// 🌟 פונקציה חדשה: ביטול הזמנה ע"י אדמין והחזרת מושבים
export async function cancelBookingAdminTransaction(bookingId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // שליפת פרטי ההזמנה והנוסעים כדי לדעת כמה מושבים להחזיר
        const [bookings] = await connection.query('SELECT flight_id, return_flight_id FROM Bookings WHERE booking_id = ?', [bookingId]);
        const [passengers] = await connection.query('SELECT passenger_id FROM Passengers WHERE booking_id = ?', [bookingId]);

        if (!bookings.length) throw new Error("NOT_FOUND");

        const { flight_id, return_flight_id } = bookings[0];
        const paxCount = passengers.length;

        // עדכון הסטטוס
        await connection.query('UPDATE Bookings SET status = ? WHERE booking_id = ?', ['cancelled', bookingId]);

        // החזרת המקומות לטיסה (+paxCount מגדיל את מספר המושבים הפנויים)
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