USE flight_app;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. הכנסת 20 משתמשים (Users)
INSERT INTO Users (email, name, user_type) VALUES
('admin1@elal.co.il', 'אדמין ראשי', 'admin'),  -- ID = 1
('admin2@elal.co.il', 'אדמין משני', 'admin'),  -- ID = 2
('tamar@gmail.com', 'תמר כהן', 'customer'),    -- ID = 3
('yossi@gmail.com', 'יוסי לוי', 'customer'),    -- ID = 4
('dana@gmail.com', 'דנה אברהם', 'customer'),    -- ID = 5
('ron@gmail.com', 'רון שפירא', 'customer'),     -- ID = 6
('michal@gmail.com', 'מיכל רז', 'customer'),     -- ID = 7
('david@gmail.com', 'דוד מזרחי', 'customer'),   -- ID = 8
('sarah@gmail.com', 'שרה פרידמן', 'customer'),  -- ID = 9
('amit@gmail.com', 'עמית גל', 'customer'),      -- ID = 10
('noam@gmail.com', 'נועם כץ', 'customer'),      -- ID = 11
('yael@gmail.com', 'יעל צמח', 'customer'),      -- ID = 12
('adi@gmail.com', 'עדי ברק', 'customer'),       -- ID = 13
('omer@gmail.com', 'עומר דגן', 'customer'),     -- ID = 14
('shira@gmail.com', 'שירה לוין', 'customer'),    -- ID = 15
('itay@gmail.com', 'איתי שגב', 'customer'),     -- ID = 16
('maya@gmail.com', 'מאיה רוזן', 'customer'),     -- ID = 17
('elan@gmail.com', 'אילן גרין', 'customer'),    -- ID = 18
('rachel@gmail.com', 'רחל אזולאי', 'customer'),  -- ID = 19
('tom@gmail.com', 'תום שגיא', 'customer');      -- ID = 20

-- 2. הכנסת הסיסמאות התואמות לטבלת hash_passwords
INSERT INTO hash_passwords (user_id, password_hash) VALUES
(1, '$2b$10$E3EjKDF76KksjdhfKJGHe7'),
(2, '$2b$10$E3EjKDF76KksjdhfKJGHe8'),
(3, '$2b$10$JHe7E3EjKDF76KksjdhfKG'),
(4, '$2b$10$KksjdhfKJGHe7E3EjKDF76'),
(5, '$2b$10$76KksjdhfKGKksjdhfKJGH'),
(6, '$2b$10$dfKJGHe7E3EjKDF76Kksjd'),
(7, '$2b$10$E3EjKDF76KksjdhfKJGHe8'),
(8, '$2b$10$HJGHe7E3EjKDF76Kksjdhf'),
(9, '$2b$10$KksjdhfKJGHe7E3EjKDF77'),
(10, '$2b$10$E3EjKDF76KksjdhfKJGHe9'),
(11, '$2b$10$76KksjdhfKGKksjdhfKJGHa'),
(12, '$2b$10$dfKJGHe7E3EjKDF76Kksja'),
(13, '$2b$10$E3EjKDF76KksjdhfKJGHea'),
(14, '$2b$10$HJGHe7E3EjKDF76Kksjdhb'),
(15, '$2b$10$KksjdhfKJGHe7E3EjKDF78'),
(16, '$2b$10$E3EjKDF76KksjdhfKJGHeb'),
(17, '$2b$10$76KksjdhfKGKksjdhfKJGHc'),
(18, '$2b$10$dfKJGHe7E3EjKDF76Kksjc'),
(19, '$2b$10$E3EjKDF76KksjdhfKJGHed'),
(20, '$2b$10$HJGHe7E3EjKDF76Kksjdhe');

-- 3. הכנסת 20 נמלי תעופה (Airports) - כולל תיקון לפרנקפורט
INSERT INTO Airports (airport_code, airport_name, city, country, image_url) VALUES
('TLV', 'נמל התעופה בן גוריון', 'תל אביב', 'ישראל', 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1'),
('JFK', 'John F. Kennedy International Airport', 'ניו יורק', 'ארצות הברית', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9'),
('LHR', 'London Heathrow Airport', 'לונדון', 'בריטניה', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad'),
('CDG', 'Charles de Gaulle Airport', 'פריז', 'צרפת', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'),
('DXB', 'Dubai International Airport', 'דובאי', 'איחוד האמירויות', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'),
('FCO', 'Leonardo da Vinci–Fiumicino Airport', 'רומא', 'איטליה', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5'),
('AMS', 'Amsterdam Airport Schiphol', 'אמסטרדם', 'הולנד', 'https://images.unsplash.com/photo-1513694203232-719a280e022f'),
('BCN', 'Josep Tarradellas Barcelona-El Prat Airport', 'ברצלונה', 'ספרד', 'https://images.unsplash.com/photo-1583422874117-67ad13a3c68a'),
('ATH', 'Athens International Airport', 'אתונה', 'יוון', 'https://images.unsplash.com/photo-1503156311465-1c3a42d0dd14'),
('NRT', 'Narita International Airport', 'טוקיו', 'יפן', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e'),
('BKK', 'Suvarnabhumi Airport', 'בנגקוק', 'תאילנד', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365'),
('LAX', 'Los Angeles International Airport', 'לוס אנגלס', 'ארצות הברית', 'https://images.unsplash.com/photo-1422464804701-7d00235af121'),
('FRA', 'Frankfurt Airport', 'פרנקפורט', 'גרמניה', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b'),
('VIE', 'Vienna International Airport', 'וינה', 'אוסטריה', 'https://images.unsplash.com/photo-1516550893923-42d28e5677af'),
('ZRH', 'Zurich Airport', 'ציריך', 'שוויץ', 'https://images.unsplash.com/photo-1515488042361-404e9250afb2'),
('MAD', 'Adolfo Suárez Madrid–Barajas Airport', 'מדריד', 'ספרד', 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750'),
('PRG', 'Václav Havel Airport Prague', 'פראג', 'צכיה', 'https://images.unsplash.com/photo-1541384982283-d269a291d550'),
('IST', 'Istanbul Airport', 'איסטנבול', 'טורקיה', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200'),
('BER', 'Berlin Brandenburg Airport', 'ברלין', 'גרמניה', 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc'),
('MUC', 'Munich Airport', 'מינכן', 'גרמניה', 'https://images.unsplash.com/photo-1595844730298-b9f0ff9800a4');

-- 4. הכנסת 20 הטיסות המקוריות (Flights)
INSERT INTO Flights (flight_number, departure_airport_id, arrival_airport_id, departure_time, arrival_time, price, seats_available) VALUES
('LY301', 1, 2, '2026-07-15 10:00:00', '2026-07-15 22:30:00', 850.00, 120),
('LY202', 1, 3, '2026-07-16 06:15:00', '2026-07-16 11:45:00', 420.00, 85),
('LY401', 1, 4, '2026-07-17 08:30:00', '2026-07-17 13:20:00', 390.50, 140),
('LY971', 1, 5, '2026-07-18 16:00:00', '2026-07-18 20:15:00', 299.00, 180),
('LY511', 1, 6, '2026-07-19 12:00:00', '2026-07-19 15:45:00', 250.00, 90),
('LY331', 1, 7, '2026-07-20 05:30:00', '2026-07-20 09:50:00', 310.00, 110),
('LY221', 1, 8, '2026-07-21 14:10:00', '2026-07-21 18:00:00', 280.00, 65),
('LY613', 1, 9, '2026-07-22 19:30:00', '2026-07-22 21:40:00', 180.00, 40),
('LY091', 1, 10, '2026-07-23 21:00:00', '2026-07-24 13:30:00', 1100.00, 150),
('LY081', 1, 11, '2026-07-24 23:45:00', '2026-07-25 12:00:00', 950.00, 200),
('AZ420', 6, 1, '2026-07-26 09:00:00', '2026-07-26 12:45:00', 230.00, 145),
('LH112', 13, 1, '2026-07-27 15:00:00', '2026-07-27 20:15:00', 340.00, 170),
('OS203', 14, 1, '2026-07-28 07:15:00', '2026-07-28 11:30:00', 290.00, 88),
('LX280', 15, 1, '2026-07-29 10:00:00', '2026-07-29 14:10:00', 370.00, 95),
('IB312', 16, 1, '2026-07-30 16:45:00', '2026-07-30 21:30:00', 320.00, 130),
('OK150', 17, 1, '2026-07-31 22:00:00', '2026-08-01 02:45:00', 260.00, 115),
('TK790', 18, 1, '2026-08-02 01:30:00', '2026-08-02 03:40:00', 190.00, 185),
('EJU45', 19, 1, '2026-08-03 13:00:00', '2026-08-03 18:20:00', 210.00, 50),
('LY302', 2, 1, '2026-08-04 23:55:00', '2026-08-05 16:20:00', 820.00, 210),
('BA165', 3, 1, '2026-08-05 08:00:00', '2026-08-05 15:00:00', 399.00, 160);

-- 5. הכנסת 20 הזמנות (Bookings)
INSERT INTO Bookings (user_id, flight_id, booking_time, total_price, status) VALUES
(3, 1, '2026-05-10 10:00:00', 850.00, 'confirmed'),
(3, 2, '2026-05-11 11:30:00', 840.00, 'confirmed'), -- שונה המחיר ל-840 (עבור 2 נוסעים בטיסה 2)
(3, 3, '2026-05-12 14:15:00', 390.50, 'confirmed'),
(4, 4, '2026-05-12 09:00:00', 299.00, 'confirmed'),
(4, 5, '2026-05-13 10:00:00', 250.00, 'confirmed'),
(4, 6, '2026-05-14 16:45:00', 310.00, 'confirmed'),
(5, 7, '2026-05-14 18:00:00', 280.00, 'confirmed'),
(5, 8, '2026-05-15 11:15:00', 180.00, 'confirmed'),
(5, 9, '2026-05-15 13:20:00', 1100.00, 'confirmed'),
(6, 10, '2026-05-15 22:00:00', 950.00, 'confirmed'),
(7, 11, '2026-05-16 08:30:00', 230.00, 'confirmed'),
(8, 12, '2026-05-16 14:12:00', 340.00, 'confirmed'),
(9, 13, '2026-05-16 19:00:00', 290.00, 'cancelled'),
(10, 14, '2026-05-17 09:45:00', 370.00, 'confirmed'),
(11, 15, '2026-05-17 12:10:00', 320.00, 'confirmed'),
(12, 16, '2026-05-17 15:30:00', 260.00, 'confirmed'),
(13, 17, '2026-05-18 11:00:00', 190.00, 'confirmed'),
(14, 18, '2026-05-18 16:22:00', 210.00, 'confirmed'),
(15, 19, '2026-05-19 10:05:00', 820.00, 'confirmed'),
(16, 20, '2026-05-19 14:40:00', 399.00, 'confirmed');

-- 6. הכנסת נוסעים (Passengers) המתאימים ל-20 ההזמנות הקיימות
INSERT INTO Passengers (booking_id, first_name, last_name, date_of_birth, gender, email, phone) VALUES
(1, 'תמר', 'כהן', '1995-04-12', 'female', 'tamar@gmail.com', '052-1112223'),
(2, 'תמר', 'כהן', '1995-04-12', 'female', 'tamar@gmail.com', '052-1112223'),
(2, 'רועי', 'כהן', '2018-09-05', 'male', NULL, NULL), -- הדגמה: 2 נוסעים על אותה הזמנה!
(3, 'תמר', 'כהן', '1995-04-12', 'female', 'tamar@gmail.com', '052-1112223'),
(4, 'יוסי', 'לוי', '1988-11-23', 'male', 'yossi@gmail.com', '054-4445556'),
(5, 'יוסי', 'לוי', '1988-11-23', 'male', 'yossi@gmail.com', '054-4445556'),
(6, 'יוסי', 'לוי', '1988-11-23', 'male', 'yossi@gmail.com', '054-4445556'),
(7, 'דנה', 'אברהם', '1992-07-30', 'female', 'dana@gmail.com', '050-7778889'),
(8, 'דנה', 'אברהם', '1992-07-30', 'female', 'dana@gmail.com', '050-7778889'),
(9, 'דנה', 'אברהם', '1992-07-30', 'female', 'dana@gmail.com', '050-7778889'),
(10, 'רון', 'שפירא', '1985-02-14', 'male', 'ron@gmail.com', '053-9991112'),
(11, 'מיכל', 'רז', '1990-10-05', 'female', 'michal@gmail.com', '052-5554443'),
(12, 'דוד', 'מזרחי', '1982-06-18', 'male', 'david@gmail.com', '054-3332221'),
(13, 'שרה', 'פרידמן', '1979-12-01', 'female', 'sarah@gmail.com', '050-1234567'),
(14, 'עמית', 'גל', '1994-03-25', 'male', 'amit@gmail.com', '052-9876543'),
(15, 'נועם', 'כץ', '1987-08-14', 'male', 'noam@gmail.com', '053-1113335'),
(16, 'יעל', 'צמח', '1976-05-15', 'female', 'yael@gmail.com', '050-5556667'),
(17, 'עדי', 'ברק', '1991-01-22', 'female', 'adi@gmail.com', '054-7776665'),
(18, 'עומר', 'דגן', '1989-11-09', 'male', 'omer@gmail.com', '050-8889991'),
(19, 'שירה', 'לוין', '1993-02-28', 'female', 'shira@gmail.com', '052-4447772'),
(20, 'איתי', 'שגב', '1986-07-07', 'male', 'itay@gmail.com', '053-6663332');

-- הפעלה מחדש של מנגנון המפתחות הזרים
SET FOREIGN_KEY_CHECKS = 1;