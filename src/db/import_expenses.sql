-- Import expenses from user image
-- Categories mapped based on description:
-- Names -> Salaries
-- CRM -> Other (Software/Tools)
-- Reparación de Canchas -> Maintenance

INSERT INTO financial_transactions (date, amount, type, category, description, payment_method) VALUES
    (CURRENT_DATE, 20000.00, 'expense', 'Salaries', 'Aline', 'Transfer'),
    (CURRENT_DATE, 30000.00, 'expense', 'Salaries', 'Tlaca', 'Transfer'),
    (CURRENT_DATE, 25000.00, 'expense', 'Salaries', 'Dani', 'Transfer'),
    (CURRENT_DATE, 17000.00, 'expense', 'Salaries', 'Lalo', 'Transfer'),
    (CURRENT_DATE, 30000.00, 'expense', 'Salaries', 'Mike', 'Transfer'),
    (CURRENT_DATE, 6000.00, 'expense', 'Salaries', 'Jesús', 'Transfer'),
    (CURRENT_DATE, 10000.00, 'expense', 'Salaries', 'Vale', 'Transfer'),
    (CURRENT_DATE, 6000.00, 'expense', 'Other', 'CRM', 'Transfer'),
    (CURRENT_DATE, 10000.00, 'expense', 'Maintenance', 'Reparación de Canchas', 'Transfer');
