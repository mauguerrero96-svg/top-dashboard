-- Add clinic column to bookings table
alter table public.bookings 
add column if not exists clinic text;

-- Optional: Add check constraint if we want to restrict values, 
-- but consistent with other tables we'll leave it as text for flexibility or validation at app level.
