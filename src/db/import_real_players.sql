-- DATA IMPORT SCRIPT - FROM EXCEL IMAGE
-- Replaces all players and generates invoices for the current month.

-- 1. CLEANUP
TRUNCATE TABLE public.financial_transactions CASCADE;
TRUNCATE TABLE public.invoices CASCADE;
TRUNCATE TABLE public.booking_participants CASCADE;
TRUNCATE TABLE public.player_schedules CASCADE;
-- varying constraints might prevent simple truncate on players if referenced elsewhere, 
-- but we wiped the children above.
DELETE FROM public.dashboard_players;

-- 2. INSERT PLAYERS
-- We act as if this is fresh data. 
-- Status map: 
--   Note='Beca' -> Status='Beca'
--   Note='NA' or Amount=0 -> Status='No Activo'/ 'Inactivo'
--   Else -> Status='Activo'

INSERT INTO public.dashboard_players (id, name, email, phone, clinic, status, monthly_fee, payment_status)
VALUES
    -- ALTO RENDIMIENTO
    (gen_random_uuid(), 'Juan Pablo Barriga', 'jp.barriga@example.com', '555-0001', 'Alto Rendimiento', 'Beca', 0, 'NA'),
    (gen_random_uuid(), 'Carlos Guzmán', 'carlos.guzman@example.com', '555-0002', 'Alto Rendimiento', 'No Activo', 0, 'NA'),
    (gen_random_uuid(), 'Marianna Olvera', 'marianna.olvera@example.com', '555-0003', 'Alto Rendimiento', 'No Activo', 0, 'NA'),
    (gen_random_uuid(), 'Juan Pablo Feregrino', 'jp.feregrino@example.com', '555-0004', 'Alto Rendimiento', 'No Activo', 0, 'NA'),
    (gen_random_uuid(), 'Julieta Alvarado', 'julieta.alvarado@example.com', '555-0005', 'Alto Rendimiento', 'No Activo', 0, 'NA'),
    (gen_random_uuid(), 'Natalia Urbina', 'natalia.urbina@example.com', '555-0006', 'Alto Rendimiento', 'Activo', 1350.00, 'Pagado'),
    (gen_random_uuid(), 'André Tavera Rueda', 'andre.tavera@example.com', '555-0007', 'Alto Rendimiento', 'Activo', 3000.00, 'Pagado'),
    (gen_random_uuid(), 'Ana Sofía Guzmán', 'ana.guzman@example.com', '555-0008', 'Alto Rendimiento', 'Activo', 3239.50, 'Pagado'),
    (gen_random_uuid(), 'Valeria Guzmán', 'valeria.guzman@example.com', '555-0009', 'Alto Rendimiento', 'Activo', 3239.50, 'Pagado'),
    (gen_random_uuid(), 'Valeria María Santiago Rodríguez', 'valeria.santiago@example.com', '555-0010', 'Alto Rendimiento', 'Activo', 3600.00, 'Pagado'),
    (gen_random_uuid(), 'Juan Pablo Rodríguez', 'jp.rodriguez@example.com', '555-0011', 'Alto Rendimiento', 'Activo', 4050.00, 'Pagado'),
    (gen_random_uuid(), 'Paula Domínguez', 'paula.dominguez@example.com', '555-0012', 'Alto Rendimiento', 'Activo', 4200.00, 'Pagado'),
    (gen_random_uuid(), 'Julieta Serrano', 'julieta.serrano@example.com', '555-0013', 'Alto Rendimiento', 'Activo', 4310.00, 'Pagado'),
    (gen_random_uuid(), 'Renata Serrano', 'renata.serrano@example.com', '555-0014', 'Alto Rendimiento', 'Activo', 4310.00, 'Pagado'),
    (gen_random_uuid(), 'Vasti Pérez', 'vasti.perez@example.com', '555-0015', 'Alto Rendimiento', 'Activo', 4319.00, 'Pagado'),
    (gen_random_uuid(), 'Elias Pérez', 'elias.perez@example.com', '555-0016', 'Alto Rendimiento', 'Activo', 4319.00, 'Pagado'),
    (gen_random_uuid(), 'Natalia Salinas', 'natalia.salinas@example.com', '555-0017', 'Alto Rendimiento', 'Activo', 4319.00, 'Pagado'),
    (gen_random_uuid(), 'Camila Salinas', 'camila.salinas@example.com', '555-0018', 'Alto Rendimiento', 'Activo', 4319.00, 'Pagado'),
    (gen_random_uuid(), 'Patricio Brena', 'patricio.brena@example.com', '555-0019', 'Alto Rendimiento', 'Activo', 5000.00, 'Pagado'),
    (gen_random_uuid(), 'Marco Damián', 'marco.damian@example.com', '555-0020', 'Alto Rendimiento', 'Activo', 5000.00, 'Pagado'),
    (gen_random_uuid(), 'Jorge Araiza', 'jorge.araiza@example.com', '555-0021', 'Alto Rendimiento', 'Activo', 5399.00, 'Pagado'),
    (gen_random_uuid(), 'Luis Victoria', 'luis.victoria@example.com', '555-0022', 'Alto Rendimiento', 'Activo', 5399.00, 'Pagado'),
    (gen_random_uuid(), 'Emiliano Flores', 'emiliano.flores@example.com', '555-0023', 'Alto Rendimiento', 'Activo', 5999.00, 'Pagado'),
    (gen_random_uuid(), 'Uziel Vázquez Vega', 'uziel.vazquez@example.com', '555-0024', 'Alto Rendimiento', 'Activo', 6999.00, 'Pagado'),
    (gen_random_uuid(), 'Sebastián Olmedo Mondragón', 'sebastian.olmedo@example.com', '555-0025', 'Alto Rendimiento', 'Activo', 6999.00, 'Pagado'),
    (gen_random_uuid(), 'Eugenio Miranda Moreno', 'eugenio.miranda@example.com', '555-0026', 'Alto Rendimiento', 'Activo', 6999.00, 'Pagado'),
    (gen_random_uuid(), 'Mila Escalona', 'mila.escalona@example.com', '555-0027', 'Alto Rendimiento', 'Activo', 5999.00, 'Pendiente'), -- Note: z 4000
    (gen_random_uuid(), 'Nicolás Fuentes', 'nicolas.fuentes@example.com', '555-0028', 'Alto Rendimiento', 'Activo', 2500.00, 'Pendiente'),
    (gen_random_uuid(), 'Emilio De La Torre', 'emilio.delatorre@example.com', '555-0029', 'Alto Rendimiento', 'Activo', 4999.00, 'Pendiente'),
    (gen_random_uuid(), 'Rafael López Valencia', 'rafael.lopez@example.com', '555-0030', 'Alto Rendimiento', 'Activo', 5000.00, 'Pendiente'),
    (gen_random_uuid(), 'Emilio Laporte', 'emilio.laporte@example.com', '555-0031', 'Alto Rendimiento', 'Activo', 4050.00, 'Pendiente'), -- Note: mike
    (gen_random_uuid(), 'Otto Cabrera', 'otto.cabrera@example.com', '555-0032', 'Alto Rendimiento', 'Activo', 4500.00, 'Pagado'),
    (gen_random_uuid(), 'Renata González', 'renata.gonzalez@example.com', '555-0033', 'Alto Rendimiento', 'Activo', 5399.00, 'Pagado'),
    (gen_random_uuid(), 'Sebastián Fuentes', 'sebastian.fuentes@example.com', '555-0034', 'Alto Rendimiento', 'Activo', 5400.00, 'Pendiente'),
    (gen_random_uuid(), 'Ian Kiezman Plaza', 'ian.kiezman@example.com', '555-0035', 'Alto Rendimiento', 'Activo', 6000.00, 'Pendiente'),
    (gen_random_uuid(), 'Emilio López Garduño', 'emilio.lopezg@example.com', '555-0036', 'Alto Rendimiento', 'Activo', 6000.00, 'Pendiente'),
    (gen_random_uuid(), 'Eugenio Gómez Reyes', 'eugenio.gomez@example.com', '555-0037', 'Alto Rendimiento', 'Activo', 6999.00, 'Pagado'),
    (gen_random_uuid(), 'Ricardo Benítez Fraga', 'ricardo.benitez@example.com', '555-0038', 'Alto Rendimiento', 'Activo', 8000.00, 'Pendiente'),

    -- CLINICA LALO (Assuming Clinica A)
    (gen_random_uuid(), 'Bianca Mercado', 'bianca.mercado@example.com', '555-1001', 'Clinica A', 'Activo', 1800.00, 'Pagado'),
    (gen_random_uuid(), 'Ailen Mendoza', 'ailen.mendoza@example.com', '555-1002', 'Clinica A', 'Activo', 1800.00, 'Pagado'),
    (gen_random_uuid(), 'Maritza Valencia', 'maritza.valencia@example.com', '555-1003', 'Clinica A', 'Activo', 1800.00, 'Pagado'),
    (gen_random_uuid(), 'Enrique Vargas Monzón', 'enrique.vargas@example.com', '555-1004', 'Clinica A', 'Activo', 1800.00, 'Pagado'),
    (gen_random_uuid(), 'Javier Garcia', 'javier.garcia@example.com', '555-1005', 'Clinica A', 'Activo', 2200.00, 'Pagado'),
    (gen_random_uuid(), 'Abraham Figueroa', 'abraham.figueroa@example.com', '555-1006', 'Clinica A', 'Activo', 2500.00, 'Pagado'),
    (gen_random_uuid(), 'Alejandro Ramos Verdeja', 'alejandro.ramos@example.com', '555-1007', 'Clinica A', 'Activo', 2600.00, 'Pagado'),
    (gen_random_uuid(), 'Javier Andrade', 'javier.andrade@example.com', '555-1008', 'Clinica A', 'Activo', 2600.00, 'Pagado'),
    (gen_random_uuid(), 'David Centeno', 'david.centeno@example.com', '555-1009', 'Clinica A', 'Activo', 2600.00, 'Pagado'),
    (gen_random_uuid(), 'Diego De La Campa', 'diego.delacampa@example.com', '555-1010', 'Clinica A', 'Activo', 2850.00, 'Pagado'),
    (gen_random_uuid(), 'Dario Rosales', 'dario.rosales@example.com', '555-1011', 'Clinica A', 'Inactivo', 0, 'NA'),
    (gen_random_uuid(), 'Johana', 'johana@example.com', '555-1012', 'Clinica A', 'Inactivo', 0, 'NA'),
    (gen_random_uuid(), 'Ana Araiza', 'ana.araiza@example.com', '555-1013', 'Clinica A', 'Inactivo', 0, 'NA'),
    (gen_random_uuid(), 'Danahe Lazcano', 'danahe.lazcano@example.com', '555-1014', 'Clinica A', 'Inactivo', 0, 'NA'),
    (gen_random_uuid(), 'Xavier Gómez', 'xavier.gomez@example.com', '555-1015', 'Clinica A', 'Inactivo', 0, 'NA'),
    (gen_random_uuid(), 'Audrey Navarrete', 'audrey.navarrete@example.com', '555-1016', 'Clinica A', 'Inactivo', 0, 'NA'),
    (gen_random_uuid(), 'Alejandro Navarro', 'alejandro.navarro@example.com', '555-1017', 'Clinica A', 'Inactivo', 0, 'NA'),
    (gen_random_uuid(), 'Aline Esposa Abraham', 'aline.esposa@example.com', '555-1018', 'Clinica A', 'Inactivo', 0, 'NA'),
    (gen_random_uuid(), 'Ximena Balderas', 'ximena.balderas@example.com', '555-1019', 'Clinica A', 'Activo', 1530.00, 'Pagado'),
    (gen_random_uuid(), 'Bruno Alvarado', 'bruno.alvarado@example.com', '555-1020', 'Clinica A', 'Activo', 2040.00, 'Pagado'),

    -- CLINICA DANI (Assuming Clinica B)
    (gen_random_uuid(), 'Cristina Madera', 'cristina.madera@example.com', '555-2001', 'Clinica B', 'Activo', 1200.00, 'Pagado'),
    (gen_random_uuid(), 'Mariana Ramírez', 'mariana.ramirez@example.com', '555-2002', 'Clinica B', 'Activo', 1200.00, 'Pagado'),
    (gen_random_uuid(), 'Rodrigo Pages', 'rodrigo.pages@example.com', '555-2003', 'Clinica B', 'Activo', 1200.00, 'Pagado'),
    (gen_random_uuid(), 'Frida Rendón', 'frida.rendon@example.com', '555-2004', 'Clinica B', 'Activo', 1200.00, 'Pagado'),
    (gen_random_uuid(), 'Eric Carrillo', 'eric.carrillo@example.com', '555-2005', 'Clinica B', 'Activo', 1200.00, 'Pagado'),
    (gen_random_uuid(), 'Luis Vilchis', 'luis.vilchis@example.com', '555-2006', 'Clinica B', 'Activo', 1200.00, 'Pagado'),
    (gen_random_uuid(), 'Paola Topete', 'paola.topete@example.com', '555-2007', 'Clinica B', 'Inactivo', 0, 'NA'),
    (gen_random_uuid(), 'Arturo Gómez', 'arturo.gomez@example.com', '555-2008', 'Clinica B', 'Inactivo', 0, 'NA'),
    (gen_random_uuid(), 'Carlos Lee', 'carlos.lee@example.com', '555-2009', 'Clinica B', 'Inactivo', 0, 'NA'),
    (gen_random_uuid(), 'Teresa Talavera', 'teresa.talavera@example.com', '555-2010', 'Clinica B', 'Inactivo', 0, 'NA'),
    (gen_random_uuid(), 'Gina Melo', 'gina.melo@example.com', '555-2011', 'Clinica B', 'Activo', 300.00, 'Pendiente'),
    (gen_random_uuid(), 'Juan Carlos Gómez', 'jc.gomez@example.com', '555-2012', 'Clinica B', 'Activo', 300.00, 'Pendiente'),
    (gen_random_uuid(), 'Claudia Yzita', 'claudia.yzita@example.com', '555-2013', 'Clinica B', 'Activo', 350.00, 'Pendiente'),
    (gen_random_uuid(), 'Elia Herrera', 'elia.herrera@example.com', '555-2014', 'Clinica B', 'Activo', 375.00, 'Pendiente'),
    (gen_random_uuid(), 'Carolina Noguez', 'carolina.noguez@example.com', '555-2015', 'Clinica B', 'Activo', 600.00, 'Pendiente'),
    (gen_random_uuid(), 'Estefanía Martínez', 'estefania.martinez@example.com', '555-2016', 'Clinica B', 'Activo', 1000.00, 'Pendiente'),
    (gen_random_uuid(), 'Anali Nuñez', 'anali.nunez@example.com', '555-2017', 'Clinica B', 'Activo', 1000.00, 'Pendiente'),
    (gen_random_uuid(), 'Karina Martínez', 'karina.martinez@example.com', '555-2018', 'Clinica B', 'Activo', 1200.00, 'Pendiente'),
    (gen_random_uuid(), 'Alejandro Jiménez', 'alejandro.jimenez@example.com', '555-2019', 'Clinica B', 'Activo', 1200.00, 'Pendiente'),
    (gen_random_uuid(), 'Juan Pablo Kuri', 'jp.kuri@example.com', '555-2020', 'Clinica B', 'Activo', 1200.00, 'Pendiente'),
    (gen_random_uuid(), 'Sofía Lepine', 'sofia.lepine@example.com', '555-2021', 'Clinica B', 'Activo', 1200.00, 'Pendiente'),
    (gen_random_uuid(), 'Carmen Hernández', 'carmen.hernandez@example.com', '555-2022', 'Clinica B', 'Activo', 1380.00, 'Pendiente'),
    (gen_random_uuid(), 'Luis Alfonso Castillo', 'luis.castillo@example.com', '555-2023', 'Clinica B', 'Activo', 1380.00, 'Pendiente'),
    (gen_random_uuid(), 'Marisol Martínez', 'marisol.martinez@example.com', '555-2024', 'Clinica B', 'Activo', 1800.00, 'Pendiente'),
    (gen_random_uuid(), 'Kario Alejandro López Mayen', 'kario.lopez@example.com', '555-2025', 'Clinica B', 'Activo', 2400.00, 'Pagado');


-- 3. GENERATE INVOICES
-- For every player with a monthly_fee > 0 and Status 'Activo', we generate an invoice.
-- If they are marked 'Pagado', we create a Paid invoice.
-- If they are 'Pendiente' (implicit in the sheet if not 'Pagado'), we create a Pending invoice.

INSERT INTO public.invoices (serial_id, player_id, description, date, amount, status)
SELECT 
    'INV-' || substring(id::text from 1 for 8),
    id,
    'Membresía Mensual',
    CURRENT_DATE,
    monthly_fee,
    CASE 
        WHEN payment_status = 'Pagado' THEN 'Paid' -- Mapping internal status to Invoice status
        ELSE 'Pending'
    END
FROM public.dashboard_players
WHERE status = 'Activo' AND monthly_fee > 0;
