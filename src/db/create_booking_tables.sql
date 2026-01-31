
-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Courts Table
CREATE TABLE IF NOT EXISTS courts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Coaches Table
CREATE TABLE IF NOT EXISTS coaches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    specialty TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    court_id UUID REFERENCES courts(id),
    player_id UUID, -- Keeping loose reference for now or reference dashboard_players if possible
    coach_id UUID REFERENCES coaches(id),
    title TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'Confirmed',
    price DECIMAL(10, 2) DEFAULT 0,
    clinic TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Booking Participants Table
CREATE TABLE IF NOT EXISTS booking_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    player_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Initial Data (Seed)
INSERT INTO courts (name, type) VALUES
('Court 1 (Central)', 'Clay'),
('Court 2', 'Clay'),
('Court 3', 'Hard'),
('Court 4', 'Hard');

INSERT INTO coaches (name, specialty) VALUES
('Toni Nadal', 'Clay Strategy'),
('Patrick M.', 'Serve & Volley'),
('Darren C.', 'Mental Game');
