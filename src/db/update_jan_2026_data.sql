-- Metadato: Update Data Jan 2026
-- Actualiza dashboard_players y sus horarios

DO $$
DECLARE
    p_id uuid;
BEGIN

    -- 1. Juan Pablo B (Beca) -> Assuming match by partial name "Juan Pablo B%"
    -- Skip emails that look truncated or 'Na'
    UPDATE public.dashboard_players
    SET status = 'Beca', monthly_fee = 0, payment_status = 'NA', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Juan Pablo B%';
    -- No schedule days in text

    -- 2. Carlos Guzmán (Phone: 525563580779, No Activo)
    UPDATE public.dashboard_players
    SET phone = '525563580779', status = 'No Activo', monthly_fee = 0, payment_status = 'NA', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Carlos Guzm%';

    -- 3. Marianna Olv (No Activo)
    UPDATE public.dashboard_players
    SET status = 'No Activo', monthly_fee = 0, payment_status = 'NA', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Marianna Olv%';

    -- 4. Juan Pablo F (No Activo, Phone: 525536472063)
    UPDATE public.dashboard_players
    SET phone = '525536472063', status = 'No Activo', monthly_fee = 0, payment_status = 'NA', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Juan Pablo F%';

    -- 5. Julieta Alvara (No Activo, Phone: 525529121890)
    UPDATE public.dashboard_players
    SET phone = '525529121890', status = 'No Activo', monthly_fee = 0, payment_status = 'NA', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Julieta Alvar%';

    -- 6. Natalia Urbina (Activo, 1350, Paid, Phone: 525525739976)
    UPDATE public.dashboard_players
    SET phone = '525525739976', status = 'Activo', monthly_fee = 1350.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Natalia Urbin%';
    -- No schedule days

    -- 7. André Tavera (Activo, 3000, Paid, Phone: 525567929017)
    -- Days: Lunes, Martes, Miercoles (Si, Si, Si)
    UPDATE public.dashboard_players
    SET phone = '525567929017', status = 'Activo', monthly_fee = 3000.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'André Tavera%'
    RETURNING id INTO p_id;
    
    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Mon', '16:00', '17:00'),
        (p_id, 'Tue', '16:00', '17:00'),
        (p_id, 'Wed', '16:00', '17:00');
    END IF;

    -- 8. Ana Sofia Gu (Activo, 3239.50, Paid, Phone: 525536777235)
    -- Days: Miercoles, Jueves
    UPDATE public.dashboard_players
    SET phone = '525536777235', status = 'Activo', monthly_fee = 3239.50, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Ana Sofia G%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Wed', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 9. Valeria Guzm (Activo, 3239.50, Paid, Phone: 525536777235 - Same phone as Ana Sofia?)
    -- Days: Miercoles, Jueves
    UPDATE public.dashboard_players
    SET phone = '525536777235', status = 'Activo', monthly_fee = 3239.50, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Valeria Guzm%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Wed', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 10. Valeria María (Activo, 3600, Paid, Phone: 525522450271)
    UPDATE public.dashboard_players
    SET phone = '525522450271', status = 'Activo', monthly_fee = 3600.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Valeria María%';

    -- 11. Juan Pablo R (Activo, 4050, Paid, Phone: 525515078583)
    UPDATE public.dashboard_players
    SET phone = '525515078583', status = 'Activo', monthly_fee = 4050.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Juan Pablo R%';

    -- 12. Paula Domín (Activo, 4200, Paid, Phone: 525515122089)
    UPDATE public.dashboard_players
    SET phone = '525515122089', status = 'Activo', monthly_fee = 4200.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Paula Domín%';

    -- 13. Julieta Serrar (Activo, 4310, Paid, Phone: 525541947157)
    -- Days: Miercoles, Jueves (Text says Si, Si under Miercoles, Jueves?)
    -- Looking at the grid: L M X J V S D. 
    -- Julieta Serrar: Si under Miercoles, Si under Jueves.
    UPDATE public.dashboard_players
    SET phone = '525541947157', status = 'Activo', monthly_fee = 4310.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Julieta Serra%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Wed', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 14. Renata Serra (Activo, 4310, Paid, Phone: 525541947157)
    -- Days: Miercoles, Jueves
    UPDATE public.dashboard_players
    SET phone = '525541947157', status = 'Activo', monthly_fee = 4310.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Renata Serra%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Wed', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 15. Vasti Pérez (Activo, 4319, Paid, Phone: 525514990890)
    UPDATE public.dashboard_players
    SET phone = '525514990890', status = 'Activo', monthly_fee = 4319.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Vasti Pérez%';

    -- 16. Elías Pérez (Activo, 4319, Paid, Phone: 525514990890)
    UPDATE public.dashboard_players
    SET phone = '525514990890', status = 'Activo', monthly_fee = 4319.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Elías Pérez%';

    -- 17. Natalia Salina (Activo, 4319, Paid, Phone: 525532228155, Email: almanza7@y...)
    UPDATE public.dashboard_players
    SET phone = '525532228155', status = 'Activo', monthly_fee = 4319.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Natalia Salina%';

    -- 18. Camila Salina (Activo, 4319, Paid, Phone: 525532228155, Email: almanza7@y...)
    UPDATE public.dashboard_players
    SET phone = '525532228155', status = 'Activo', monthly_fee = 4319.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Camila Salina%';

    -- 19. Patricio Brena (Activo, 5000, Paid, Phone: 525522717576)
    UPDATE public.dashboard_players
    SET phone = '525522717576', status = 'Activo', monthly_fee = 5000.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Patricio Brena%';

    -- 20. Marco Damián (Activo, 5000, Paid, Phone: 5255534889273 - extra digit?)
    UPDATE public.dashboard_players
    SET phone = '525534889273', status = 'Activo', monthly_fee = 5000.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Marco Damián%';

    -- 21. Jorge Araiza (Activo, 5399, Paid, Phone: 525538884872, Email: dante_araiza...)
    UPDATE public.dashboard_players
    SET phone = '525538884872', status = 'Activo', monthly_fee = 5399.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Jorge Araiza%';

    -- 22. Luis Victoria (Activo, 5399, Paid, Phone: 5255513854725)
    UPDATE public.dashboard_players
    SET phone = '525513854725', status = 'Activo', monthly_fee = 5399.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Luis Victoria%';

    -- 23. Emiliano Flore (Activo, 5999, Paid, Phone: 5255543546052)
    UPDATE public.dashboard_players
    SET phone = '5255543546052', status = 'Activo', monthly_fee = 5999.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Emiliano Flor%';

    -- 24. Uziel Vázquez (Activo, 6999, Paid, Phone: 525523114619)
    UPDATE public.dashboard_players
    SET phone = '525523114619', status = 'Activo', monthly_fee = 6999.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Uziel Vázq%';

    -- 25. Sebastián Ol (Activo, 6999, Paid, Phone: 525554195060)
    UPDATE public.dashboard_players
    SET phone = '525554195060', status = 'Activo', monthly_fee = 6999.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Sebastián Ol%';

    -- 26. Eugenio Mira (Activo, 6999, Paid, Phone: 525515948128, Email: nayelimoreno...)
    UPDATE public.dashboard_players
    SET phone = '525515948128', status = 'Activo', monthly_fee = 6999.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Eugenio Mira%';

    -- 27. Mila Escalona (Activo, 5999, Pendiente, Phone: 525530383900, Email: miguelangel...)
    UPDATE public.dashboard_players
    SET phone = '525530383900', status = 'Activo', monthly_fee = 5999.00, payment_status = 'Pendiente', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Mila Escalon%';

    -- 28. Nicolás Fuen (Activo, 2500, Pendiente, Phone: 525543509641)
    UPDATE public.dashboard_players
    SET phone = '525543509641', status = 'Activo', monthly_fee = 2500.00, payment_status = 'Pendiente', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Nicolás Fuen%';

    -- 29. Emilio De La (Activo, 4999, Pendiente, Phone: 525533692274)
    UPDATE public.dashboard_players
    SET phone = '525533692274', status = 'Activo', monthly_fee = 4999.00, payment_status = 'Pendiente', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Emilio De La%';

    -- 30. Rafael López (No Activo, 5000, Pendiente)
    UPDATE public.dashboard_players
    SET status = 'No Activo', monthly_fee = 5000.00, payment_status = 'Pendiente', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Rafael López%';

    -- 31. Emilio Laport (Activo, 4050, Pagado, Phone: 525534821828)
    UPDATE public.dashboard_players
    SET phone = '525534821828', status = 'Activo', monthly_fee = 4050.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Emilio Laport%';

    -- 32. Otto Cabrera (Activo, 4500, Pagado, Phone: 525545119806)
    UPDATE public.dashboard_players
    SET phone = '525545119806', status = 'Activo', monthly_fee = 4500.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Otto Cabrera%';

    -- 33. Renata Gonz (Activo, 5399, Pagado, Phone: 525611697790)
    UPDATE public.dashboard_players
    SET phone = '525611697790', status = 'Activo', monthly_fee = 5399.00, payment_status = 'Pagado', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Renata Gonz%';

    -- 34. Sebastián Fu (Activo, 5400, Pendiente, Phone: 525543509641 - same as Nicolas Fuentes?)
    UPDATE public.dashboard_players
    SET phone = '525543509641', status = 'Activo', monthly_fee = 5400.00, payment_status = 'Pendiente', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Sebastián Fu%';

    -- 35. Ian Kleiman (Activo, 6000, Pendiente, Phone: 525513047993, Email: danielkleiman...)
    UPDATE public.dashboard_players
    SET phone = '525513047993', status = 'Activo', monthly_fee = 6000.00, payment_status = 'Pendiente', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Ian Kleiman%';

    -- 36. Emilio López (Activo, 6000, Pendiente, Phone: 526691645172)
    UPDATE public.dashboard_players
    SET phone = '526691645172', status = 'Activo', monthly_fee = 6000.00, payment_status = 'Pendiente', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Emilio López%';

    -- 37. Eugenio Góm (Activo, 6999, Pendiente, Phone: 525514730632, Email: eduardogome...)
    UPDATE public.dashboard_players
    SET phone = '525514730632', status = 'Activo', monthly_fee = 6999.00, payment_status = 'Pendiente', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Eugenio Góm%';

    -- 38. Ricardo Benít (Activo, 8000, Pendiente, Phone: 525552174837)
    UPDATE public.dashboard_players
    SET phone = '525552174837', status = 'Activo', monthly_fee = 8000.00, payment_status = 'Pendiente', clinic = 'Alto Rendimiento'
    WHERE name ILIKE 'Ricardo Benít%';

    -- === CLINICA A ===
    -- 39. Bianca Merca (Activo, 1800, Pagado, Phone: 52585592608)
    -- Days: Martes, Jueves
    UPDATE public.dashboard_players
    SET phone = '52585592608', status = 'Activo', monthly_fee = 1800.00, payment_status = 'Pagado', clinic = 'Clinica A'
    WHERE name ILIKE 'Bianca Merca%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Tue', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 40. Allen Mendoz (Activo, 1800, Pagado)
    -- Days: Martes, Jueves
    UPDATE public.dashboard_players
    SET status = 'Activo', monthly_fee = 1800.00, payment_status = 'Pagado', clinic = 'Clinica A'
    WHERE name ILIKE 'Allen Mendoz%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Tue', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 41. Maritza Valen (Activo, 1800, Pagado, Phone: 525554320417)
    -- Days: Lunes, Martes
    UPDATE public.dashboard_players
    SET phone = '525554320417', status = 'Activo', monthly_fee = 1800.00, payment_status = 'Pagado', clinic = 'Clinica A'
    WHERE name ILIKE 'Maritza Valen%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Mon', '16:00', '17:00'),
        (p_id, 'Tue', '16:00', '17:00');
    END IF;

    -- 42. Enrique Varg (Activo, 1800, Pagado)
    -- Days: Martes, Jueves
    UPDATE public.dashboard_players
    SET status = 'Activo', monthly_fee = 1800.00, payment_status = 'Pagado', clinic = 'Clinica A'
    WHERE name ILIKE 'Enrique Varg%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Tue', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 43. Javier Garcia (Activo, 2200, Pagado, Phone: 525563595756)
    -- Days: Lunes, Martes, Jueves
    UPDATE public.dashboard_players
    SET phone = '525563595756', status = 'Activo', monthly_fee = 2200.00, payment_status = 'Pagado', clinic = 'Clinica A'
    WHERE name ILIKE 'Javier García%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Mon', '16:00', '17:00'),
        (p_id, 'Tue', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 44. Abraham Fig (Activo, 2500, Pagado, Phone: 525585283867)
    -- Days: Martes, Jueves, Viernes, Sabado
    UPDATE public.dashboard_players
    SET phone = '525585283867', status = 'Activo', monthly_fee = 2500.00, payment_status = 'Pagado', clinic = 'Clinica A'
    WHERE name ILIKE 'Abraham Fig%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Tue', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00'),
        (p_id, 'Fri', '16:00', '17:00'),
        (p_id, 'Sat', '10:00', '11:00');
    END IF;

    -- 45. Alejandro Rai (Activo, 2600, Pagado, Phone: 525540647568, Email: barcademexic...)
    -- Days: Lunes, Martes, Jueves
    UPDATE public.dashboard_players
    SET phone = '525540647568', status = 'Activo', monthly_fee = 2600.00, payment_status = 'Pagado', clinic = 'Clinica A'
    WHERE name ILIKE 'Alejandro Ramos%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Mon', '16:00', '17:00'),
        (p_id, 'Tue', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 46. Javier Andrac (Activo, 2600, Pagado, Phone: 525554331775, Email: cacharritogsp...)
    -- Days: Lunes, Martes, Jueves
    UPDATE public.dashboard_players
    SET phone = '525554331775', status = 'Activo', monthly_fee = 2600.00, payment_status = 'Pagado', clinic = 'Clinica A'
    WHERE name ILIKE 'Javier Andrad%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Mon', '16:00', '17:00'),
        (p_id, 'Tue', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 47. David Centen (Activo, 2600, Pagado, Phone: 525544494988, Email: dacentenof@)
    -- Days: Lunes, Martes, Jueves
    UPDATE public.dashboard_players
    SET phone = '525544494988', status = 'Activo', monthly_fee = 2600.00, payment_status = 'Pagado', clinic = 'Clinica A'
    WHERE name ILIKE 'David Centen%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Mon', '16:00', '17:00'),
        (p_id, 'Tue', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 48. Diego De La (Activo, 2850, Pagado, Phone: 525555066886)
    -- Days: Martes, Jueves, Domingo
    UPDATE public.dashboard_players
    SET phone = '525555066886', status = 'Activo', monthly_fee = 2850.00, payment_status = 'Pagado', clinic = 'Clinica A'
    WHERE name ILIKE 'Diego De La%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Tue', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00'),
        (p_id, 'Sun', '10:00', '11:00');
    END IF;

    -- 49. Ximena Balde (Activo, 1530, Pagado, Phone: 525544164297)
    -- Days: Viernes, Sabado
    UPDATE public.dashboard_players
    SET phone = '525544164297', status = 'Activo', monthly_fee = 1530.00, payment_status = 'Pagado', clinic = 'Clinica A'
    WHERE name ILIKE 'Ximena Balder%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Fri', '16:00', '17:00'),
        (p_id, 'Sat', '10:00', '11:00');
    END IF;

    -- 50. Bruno Alvar (Activo, 2040, Pagado, Phone: 525517446393, Email: brunobaf12@)
    -- Days: Viernes, Sabado
    UPDATE public.dashboard_players
    SET phone = '525517446393', status = 'Activo', monthly_fee = 2040.00, payment_status = 'Pagado', clinic = 'Clinica A'
    WHERE name ILIKE 'Bruno Alvarado%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Fri', '16:00', '17:00'),
        (p_id, 'Sat', '10:00', '11:00');
    END IF;

    -- === CLINICA B ===
    -- 51. Cristina Made (Activo, 1200, Pagado, Phone: 5255513623787, Email: cristinamadsa...)
    -- Days: Sabado
    UPDATE public.dashboard_players
    SET phone = '5255513623787', status = 'Activo', monthly_fee = 1200.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'Cristina Mader%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Sat', '10:00', '11:00');
    END IF;

    -- 52. Mariana Ram (Activo, 1200, Pagado, Phone: 525664426300, Email: marianapand...)
    -- Days: Martes, Jueves
    UPDATE public.dashboard_players
    SET phone = '525664426300', status = 'Activo', monthly_fee = 1200.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'Mariana Ramí%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Tue', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 53. Octavio Colu (Phone: 525518389272, Email: octaviocolung...) - No Status/Fee in snippet?
    -- Assuming updates
    UPDATE public.dashboard_players
    SET phone = '525518389272'
    WHERE name ILIKE 'Octavio Colu%';

    -- 54. Rodrigo Page (Activo, 1200, Pagado, Phone: 525537348033)
    -- Days: Domingo
    UPDATE public.dashboard_players
    SET phone = '525537348033', status = 'Activo', monthly_fee = 1200.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'Rodrigo Page%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Sun', '10:00', '11:00');
    END IF;

    -- 55. Frida Rendón (Activo, 1200, Pagado, Phone: 525585700805, Email: alejandrafrida...)
    -- Days: Martes, Jueves
    UPDATE public.dashboard_players
    SET phone = '525585700805', status = 'Activo', monthly_fee = 1200.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'Frida Rendón%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Tue', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 56. Eric Carrillo (Activo, 1200, Pagado, Phone: 525548515748, Email: ericcarrillo199...)
    -- Days: Martes, Jueves
    UPDATE public.dashboard_players
    SET phone = '525548515748', status = 'Activo', monthly_fee = 1200.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'Eric Carrillo%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Tue', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 57. Luis Vilchis (Activo, 1200, Pagado, Phone: 525566943641)
    -- Days: Domingo
    UPDATE public.dashboard_players
    SET phone = '525566943641', status = 'Activo', monthly_fee = 1200.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'Luis Vilchis%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Sun', '10:00', '11:00');
    END IF;

    -- 58. Gina Melo (Activo, 300, Pagado, Phone: 525516338370)
    -- Days: Miercoles (Si)
    UPDATE public.dashboard_players
    SET phone = '525516338370', status = 'Activo', monthly_fee = 300.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'Gina Melo%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Wed', '16:00', '17:00');
    END IF;

    -- 59. José Carlos (Activo, 300, Pagado, Phone: 525554124247, Email: carlos@talen...)
    -- Days: Miercoles
    UPDATE public.dashboard_players
    SET phone = '525554124247', status = 'Activo', monthly_fee = 300.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'José Carlos Gómez%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Wed', '16:00', '17:00');
    END IF;

    -- 60. Claudia Yzitia (Activo, 350, Pagado, Phone: 525511715336)
    -- Days: Miercoles
    UPDATE public.dashboard_players
    SET phone = '525511715336', status = 'Activo', monthly_fee = 350.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'Claudia Yzitia%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Wed', '16:00', '17:00');
    END IF;

    -- 61. Elia Herrera (Activo, 375, Pagado, Phone: 525535003745)
    -- Days: Miercoles
    UPDATE public.dashboard_players
    SET phone = '525535003745', status = 'Activo', monthly_fee = 375.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'Elia Herrera%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Wed', '16:00', '17:00');
    END IF;

    -- 62. Carolina Nogi (Inactivo, 600, Email: dranoguez@)
    UPDATE public.dashboard_players
    SET status = 'Inactivo', monthly_fee = 600.00, payment_status = 'NA', clinic = 'Clinica B', phone = '525516927245'
    WHERE name ILIKE 'Carolina Nog%';

    -- 63. Estefanía Ma (Activo, 1000, Pagado, Phone: 525588052803)
    -- Days: Domingo
    UPDATE public.dashboard_players
    SET phone = '525588052803', status = 'Activo', monthly_fee = 1000.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'Estefanía Mar%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Sun', '10:00', '11:00');
    END IF;

    -- 64. Anali NUñez (Inactivo, 1000)
    UPDATE public.dashboard_players
    SET status = 'Inactivo', monthly_fee = 1000.00, payment_status = 'NA', clinic = 'Clinica B', phone = '525525889602'
    WHERE name ILIKE 'Anali NUñez%';

    -- 65. Karina Martin (Activo, 1200, Pagado, Phone: 522291095030, Email: karinasanch...)
    -- Days: Lunes, Jueves
    UPDATE public.dashboard_players
    SET phone = '522291095030', status = 'Activo', monthly_fee = 1200.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'Karina Martin%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Mon', '16:00', '17:00'),
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 66. Alejandro Jim (Activo, 1200, Pagado, Phone: 525538097485)
    -- Days: Domingo
    UPDATE public.dashboard_players
    SET phone = '525538097485', status = 'Activo', monthly_fee = 1200.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'Alejandro Jim%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Sun', '10:00', '11:00');
    END IF;

    -- 67. Juan Pablo K (Inactivo, 1200, Phone: 525635625773)
    UPDATE public.dashboard_players
    SET status = 'Inactivo', monthly_fee = 1200.00, payment_status = 'NA', clinic = 'Clinica B', phone = '525635625773'
    WHERE name ILIKE 'Juan Pablo K%';

    -- 68. Sofia Lepine (Inactivo, 1200, Phone: 525543425332)
    UPDATE public.dashboard_players
    SET status = 'Inactivo', monthly_fee = 1200.00, payment_status = 'NA', clinic = 'Clinica B', phone = '525543425332'
    WHERE name ILIKE 'Sofia Lepine%';

    -- 69. Marisol Martín (Activo, 1800, Pagado, Phone: 525525618928)
    -- Days: Jueves
    UPDATE public.dashboard_players
    SET phone = '525525618928', status = 'Activo', monthly_fee = 1800.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'Marisol Martí%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Thu', '16:00', '17:00');
    END IF;

    -- 70. Karlo Alejand (Activo, 1200, Pagado, Phone: 525578142992)
    -- Days: Domingo
    UPDATE public.dashboard_players
    SET phone = '525578142992', status = 'Activo', monthly_fee = 1200.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'Karlo Alejand%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Sun', '10:00', '11:00');
    END IF;

    -- 71. Isabel Hernández (Activo, 1200, Pagado, Phone: 525559950441)
    -- Days: Domingo
    UPDATE public.dashboard_players
    SET phone = '525559950441', status = 'Activo', monthly_fee = 1200.00, payment_status = 'Pagado', clinic = 'Clinica B'
    WHERE name ILIKE 'Isabel Hernández%'
    RETURNING id INTO p_id;

    IF p_id IS NOT NULL THEN
        DELETE FROM public.player_schedules WHERE player_id = p_id;
        INSERT INTO public.player_schedules (player_id, day_of_week, start_time, end_time) VALUES
        (p_id, 'Sun', '10:00', '11:00');
    END IF;

    -- 72. Ana Araiza (Inactivo, Phone: 525531416098, Email: anaraiza1@h...)
    UPDATE public.dashboard_players
    SET status = 'Inactivo', monthly_fee = 0, payment_status = 'NA', clinic = 'Clinica B', phone = '525531416098'
    WHERE name ILIKE 'Ana Araiz%';

    -- 73. Danahe Lazc (Inactivo, Phone: 525576688904, Email: danahe.lz@g...)
    UPDATE public.dashboard_players
    SET status = 'Inactivo', monthly_fee = 0, payment_status = 'NA', clinic = 'Clinica B', phone = '525576688904'
    WHERE name ILIKE 'Danahe Lazc%';

    -- 74. Xavier Góme (Inactivo, Phone: 525510426494, Email: xaviergom72...)
    UPDATE public.dashboard_players
    SET status = 'Inactivo', monthly_fee = 0, payment_status = 'NA', clinic = 'Clinica B', phone = '525510426494'
    WHERE name ILIKE 'Xavier Góme%';

    -- 75. Audrey Navar (Inactivo, Phone: 525551656283)
    UPDATE public.dashboard_players
    SET status = 'Inactivo', monthly_fee = 0, payment_status = 'NA', clinic = 'Clinica B', phone = '525551656283'
    WHERE name ILIKE 'Audrey Navar%';

    -- 76. Alejandro Na (Inactivo, Phone: 525582269006)
    UPDATE public.dashboard_players
    SET status = 'Inactivo', monthly_fee = 0, payment_status = 'NA', clinic = 'Clinica B', phone = '525582269006'
    WHERE name ILIKE 'Alejandro Na%';

    -- 77. Aline Rivas (Inactivo, Phone: 525513961662)
    UPDATE public.dashboard_players
    SET status = 'Inactivo', monthly_fee = 0, payment_status = 'NA', clinic = 'Clinica B', phone = '525513961662'
    WHERE name ILIKE 'Aline Rivas%';

END $$;
