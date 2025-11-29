CREATE EXTENSION IF NOT EXISTS pgcrypto;

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

-