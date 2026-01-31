-- Insert Coaches (Corrected Schema)
-- Table only has: id, name, specialty, image_url
INSERT INTO public.coaches (name, specialty)
VALUES 
    ('Daniel Guerrero', 'General'),
    ('Armando Lopez', 'General'),
    ('Miguel Gamborino', 'General'),
    ('Eduardo Martinez', 'General')
ON CONFLICT DO NOTHING;
-- Note: ON CONFLICT might fail if there is no unique constraint on 'name'. 
-- Checking for existence first is safer given the schema doesn't explicitly modify constraints here.

-- Alternative safe insertion:
INSERT INTO public.coaches (name, specialty)
SELECT 'Daniel Guerrero', 'General'
WHERE NOT EXISTS (SELECT 1 FROM public.coaches WHERE name = 'Daniel Guerrero');

INSERT INTO public.coaches (name, specialty)
SELECT 'Armando Lopez', 'General'
WHERE NOT EXISTS (SELECT 1 FROM public.coaches WHERE name = 'Armando Lopez');

INSERT INTO public.coaches (name, specialty)
SELECT 'Miguel Gamborino', 'General'
WHERE NOT EXISTS (SELECT 1 FROM public.coaches WHERE name = 'Miguel Gamborino');

INSERT INTO public.coaches (name, specialty)
SELECT 'Eduardo Martinez', 'General'
WHERE NOT EXISTS (SELECT 1 FROM public.coaches WHERE name = 'Eduardo Martinez');
