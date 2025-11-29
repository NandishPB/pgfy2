-- seed_data.sql
-- Inserts sample users, hotels (2 per city), and bookings for testing
-- Runs as a single transaction in Postgres

BEGIN;

-- ensure pgcrypto available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    user1 UUID;
    user2 UUID;
    user3 UUID;
    user4 UUID;
    hotel_ids UUID[] := ARRAY[]::UUID[];
    h UUID;
    b UUID;
    nights INTEGER;
    room_price NUMERIC(12,2);
    total_amt NUMERIC(12,2);
BEGIN
    -- Create 4 users
    -- Clear-text passwords (for testing):
    -- Anita Sharma -> Anita@123
    -- Rohit Kumar  -> Rohit@123
    -- Maya Rao     -> Maya@123
    -- Arjun Patel  -> Arjun@123
    -- Passwords are stored using bcrypt via pgcrypto. crypt(password, gen_salt('bf'))
    INSERT INTO users (name, contact_number, email, dob, adhar_number, gender, password_hash)
    VALUES
      ('Anita Sharma', '9988776655', 'anita.sharma@example.com', '1990-05-12', 'ADHAR1001', 'FEMALE', crypt('Anita@123', gen_salt('bf')))
    RETURNING user_id INTO user1;

    INSERT INTO users (name, contact_number, email, dob, adhar_number, gender, password_hash)
    VALUES
      ('Rohit Kumar', '9876543210', 'rohit.kumar@example.com', '1988-11-23', 'ADHAR1002', 'MALE', crypt('Rohit@123', gen_salt('bf')))
    RETURNING user_id INTO user2;

    INSERT INTO users (name, contact_number, email, dob, adhar_number, gender, password_hash)
    VALUES
      ('Maya Rao', '9123456780', 'maya.rao@example.com', '1995-02-02', 'ADHAR1003', 'FEMALE', crypt('Maya@123', gen_salt('bf')))
    RETURNING user_id INTO user3;

    INSERT INTO users (name, contact_number, email, dob, adhar_number, gender, password_hash)
    VALUES
      ('Arjun Patel', '9012345678', 'arjun.patel@example.com', '1985-08-15', 'ADHAR1004', 'MALE', crypt('Arjun@123', gen_salt('bf')))
    RETURNING user_id INTO user4;

    RAISE NOTICE 'Inserted users: %, %, %, %', user1, user2, user3, user4;

    -- Cities and sample hotels (2 per city)
    PERFORM (
      SELECT 1
    );

    -- Bangalore
    INSERT INTO hotels (name, address, state, city, total_rooms, available_rooms, price_per_night, phone, email, owner_user_id)
    VALUES ('PGfy Residency Bangalore', '12 MG Road, Bangalore', 'Karnataka', 'Bangalore', 50, 50, 2499.00, '0801234567', 'residency.blr@example.com', user1)
    RETURNING hotel_id INTO h; hotel_ids := array_append(hotel_ids, h);

    INSERT INTO hotels (name, address, state, city, total_rooms, available_rooms, price_per_night, phone, email, owner_user_id)
    VALUES ('City Comforts Bangalore', '45 Indiranagar, Bangalore', 'Karnataka', 'Bangalore', 40, 40, 1999.00, '0802345678', 'comforts.blr@example.com', user2)
    RETURNING hotel_id INTO h; hotel_ids := array_append(hotel_ids, h);

    -- Udupi
    INSERT INTO hotels (name, address, state, city, total_rooms, available_rooms, price_per_night, phone, email, owner_user_id)
    VALUES ('Seaside Inn Udupi', 'Sea Road, Udupi', 'Karnataka', 'Udupi', 30, 30, 1799.00, '0820-123456', 'seaside.udpi@example.com', user3)
    RETURNING hotel_id INTO h; hotel_ids := array_append(hotel_ids, h);

    INSERT INTO hotels (name, address, state, city, total_rooms, available_rooms, price_per_night, phone, email, owner_user_id)
    VALUES ('Heritage Stay Udupi', 'Temple Street, Udupi', 'Karnataka', 'Udupi', 20, 20, 1499.00, '0820-234567', 'heritage.udpi@example.com', user1)
    RETURNING hotel_id INTO h; hotel_ids := array_append(hotel_ids, h);

    -- Davangere
    INSERT INTO hotels (name, address, state, city, total_rooms, available_rooms, price_per_night, phone, email, owner_user_id)
    VALUES ('MidTown Davangere', '10 Central Plaza, Davangere', 'Karnataka', 'Davangere', 25, 25, 1299.00, '08192-12345', 'midtown.dvg@example.com', user2)
    RETURNING hotel_id INTO h; hotel_ids := array_append(hotel_ids, h);

    INSERT INTO hotels (name, address, state, city, total_rooms, available_rooms, price_per_night, phone, email, owner_user_id)
    VALUES ('Lotus Comfort Davangere', 'MG Road, Davangere', 'Karnataka', 'Davangere', 15, 15, 999.00, '08192-23456', 'lotus.dvg@example.com', user3)
    RETURNING hotel_id INTO h; hotel_ids := array_append(hotel_ids, h);

    -- Chennai
    INSERT INTO hotels (name, address, state, city, total_rooms, available_rooms, price_per_night, phone, email, owner_user_id)
    VALUES ('Bayview Chennai', 'Marina Beach Road, Chennai', 'Tamil Nadu', 'Chennai', 60, 60, 2999.00, '044-12345678', 'bayview.chennai@example.com', user4)
    RETURNING hotel_id INTO h; hotel_ids := array_append(hotel_ids, h);

    INSERT INTO hotels (name, address, state, city, total_rooms, available_rooms, price_per_night, phone, email, owner_user_id)
    VALUES ('City Palace Chennai', 'Anna Salai, Chennai', 'Tamil Nadu', 'Chennai', 45, 45, 2199.00, '044-23456789', 'palace.chennai@example.com', user1)
    RETURNING hotel_id INTO h; hotel_ids := array_append(hotel_ids, h);

    -- Kolkata
    INSERT INTO hotels (name, address, state, city, total_rooms, available_rooms, price_per_night, phone, email, owner_user_id)
    VALUES ('Riverside Kolkata', 'Howrah Bridge Road, Kolkata', 'West Bengal', 'Kolkata', 55, 55, 2599.00, '033-12345678', 'riverside.kol@example.com', user2)
    RETURNING hotel_id INTO h; hotel_ids := array_append(hotel_ids, h);

    INSERT INTO hotels (name, address, state, city, total_rooms, available_rooms, price_per_night, phone, email, owner_user_id)
    VALUES ('Heritage Grand Kolkata', 'Park Street, Kolkata', 'West Bengal', 'Kolkata', 48, 48, 2299.00, '033-23456789', 'heritage.kol@example.com', user3)
    RETURNING hotel_id INTO h; hotel_ids := array_append(hotel_ids, h);

    RAISE NOTICE 'Inserted % hotels', array_length(hotel_ids,1);

    -- Create 3 bookings for various users/hotels
    -- Booking 1: user1 books first Bangalore hotel for 3 nights
    SELECT price_per_night INTO room_price FROM hotels WHERE hotel_id = hotel_ids[1];
    nights := 3;
    total_amt := (room_price * nights);
    INSERT INTO bookings (booking_reference, user_id, hotel_id, check_in_date, check_out_date, number_of_guests, number_of_rooms, room_price, nights, total_amount)
    VALUES ('PGFY-BLR-001', user1, hotel_ids[1], CURRENT_DATE + 10, CURRENT_DATE + 13, 2, 1, room_price, nights, total_amt)
    RETURNING booking_id INTO b;
    RAISE NOTICE 'Inserted booking % for user % at hotel %', b, user1, hotel_ids[1];

    -- Booking 2: user2 books a Udupi hotel for 2 nights
    SELECT price_per_night INTO room_price FROM hotels WHERE hotel_id = hotel_ids[3];
    nights := 2;
    total_amt := (room_price * nights);
    INSERT INTO bookings (booking_reference, user_id, hotel_id, check_in_date, check_out_date, number_of_guests, number_of_rooms, room_price, nights, total_amount)
    VALUES ('PGFY-UDP-001', user2, hotel_ids[3], CURRENT_DATE + 5, CURRENT_DATE + 7, 1, 1, room_price, nights, total_amt)
    RETURNING booking_id INTO b;
    RAISE NOTICE 'Inserted booking % for user % at hotel %', b, user2, hotel_ids[3];

    -- Booking 3: user3 books Kolkata Heritage Grand for 4 nights
    SELECT price_per_night INTO room_price FROM hotels WHERE hotel_id = hotel_ids[10];
    nights := 4;
    total_amt := (room_price * nights);
    INSERT INTO bookings (booking_reference, user_id, hotel_id, check_in_date, check_out_date, number_of_guests, number_of_rooms, room_price, nights, total_amount)
    VALUES ('PGFY-KOL-001', user3, hotel_ids[10], CURRENT_DATE + 20, CURRENT_DATE + 24, 3, 1, room_price, nights, total_amt)
    RETURNING booking_id INTO b;
    RAISE NOTICE 'Inserted booking % for user % at hotel %', b, user3, hotel_ids[10];

END$$;

COMMIT;

-- Show summary
SELECT count(*) AS users_count FROM users;
SELECT count(*) AS hotels_count FROM hotels;
SELECT count(*) AS bookings_count FROM bookings;
