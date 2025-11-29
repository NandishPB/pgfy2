CREATE TABLE IF NOT EXISTS users (
	user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name VARCHAR(255) NOT NULL,
	contact_number VARCHAR(20),
	email VARCHAR(320) NOT NULL UNIQUE,
	dob DATE,
	adhar_number VARCHAR(20) UNIQUE,
	gender VARCHAR(16),
	password_hash VARCHAR(255) NOT NULL,
	is_active BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hotels (
    hotel_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    state VARCHAR(100),
    city VARCHAR(100),
    total_rooms INTEGER DEFAULT 0,
    available_rooms INTEGER DEFAULT 0,
    price_per_night NUMERIC(10,2) DEFAULT 0.00,
    phone VARCHAR(20),
    email VARCHAR(320),
    average_rating NUMERIC(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    owner_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE IF NOT EXISTS bookings (
    booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference VARCHAR(64) UNIQUE, -- optional human-friendly reference
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    hotel_id UUID NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
    room_type_id UUID NULL, -- optional FK to room_type table if implemented
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_guests INTEGER DEFAULT 1,
    number_of_rooms INTEGER DEFAULT 1,
    room_price NUMERIC(12,2) DEFAULT 0.00, -- per night or total depending on your calc
    nights INTEGER NOT NULL DEFAULT 1,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);