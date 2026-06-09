CREATE DATABASE IF NOT EXISTS flight_app;
USE flight_app;


CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    user_type ENUM('admin', 'customer') NOT NULL
);

create table if not exists hash_passwords (
    user_id INTEGER PRIMARY KEY NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    foreign key (user_id) references users(user_id) on delete cascade
);
CREATE TABLE IF NOT EXISTS Airports (
    airport_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    airport_code VARCHAR(3) NOT NULL UNIQUE,
    airport_name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    image_url VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS Flights (
    flight_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    flight_number VARCHAR(10) NOT NULL,
    departure_airport_id INTEGER NOT NULL,
    arrival_airport_id INTEGER NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    seats_available INTEGER NOT NULL,
    status ENUM('scheduled', 'cancelled') NOT NULL DEFAULT 'scheduled', -- העמודה החדשה!
    FOREIGN KEY (departure_airport_id) REFERENCES Airports(airport_id) ON DELETE CASCADE,
    FOREIGN KEY (arrival_airport_id) REFERENCES Airports(airport_id) ON DELETE CASCADE
);
-- 1. טבלת הזמנות (מייצגת את העסקה/ההזמנה הכללית)
CREATE TABLE IF NOT EXISTS Bookings (
    booking_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL, -- מי המשתמש המחובר שביצע ושילם על ההזמנה
    flight_id INTEGER NOT NULL,
    booking_time DATETIME NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL, -- המחיר הכולל של כל הנוסעים ביחד
    status ENUM('pending', 'confirmed', 'cancelled') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES Flights(flight_id) ON DELETE CASCADE
);

-- 2. טבלת נוסעים (חדשה - מייצגת את הכרטיסים והנוסעים בפועל)
CREATE TABLE IF NOT EXISTS Passengers (
    passenger_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    booking_id INTEGER NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    email VARCHAR(50),
    phone VARCHAR(20),
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE
);



-- CREATE OR REPLACE VIEW premium_users_status AS
-- SELECT 
--     u.user_id,
--     u.email,
--     u.name,
--     u.user_type,
--     COUNT(b.booking_id) AS bookings_count,
--     CASE 
--         WHEN u.user_type = 'admin' THEN 'admin'
--         WHEN COUNT(b.booking_id) >= 3 THEN 'premium'
--         ELSE 'customer'
--     END AS calculated_role
-- FROM Users u
-- LEFT JOIN Bookings b ON u.user_id = b.user_id 
--     AND b.booking_time >= NOW() - INTERVAL 1 YEAR
-- GROUP BY u.user_id;