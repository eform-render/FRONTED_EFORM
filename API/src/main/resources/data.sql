INSERT INTO users (username, email, password, role, created_at, updated_at)
SELECT 'admin', 'admin@sena.edu.co',
       '$2b$10$uNjp2NXJ6kkTAdcPhV0LD.8Ek4LweekLrtby90i1Ohs2xFkIP3Amm',
       'ROLE_ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO products (nombre, descripcion, precio, stock, is_deleted, created_at, updated_at)
SELECT 'Teclado Mecánico', 'Teclado mecánico RGB con switches azules', 180000.00, 15, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM products WHERE nombre = 'Teclado Mecánico');

INSERT INTO products (nombre, descripcion, precio, stock, is_deleted, created_at, updated_at)
SELECT 'Mouse Inalámbrico', 'Mouse ergonómico con sensor óptico de alta precisión', 95000.00, 30, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM products WHERE nombre = 'Mouse Inalámbrico');

INSERT INTO products (nombre, descripcion, precio, stock, is_deleted, created_at, updated_at)
SELECT 'Monitor 24"', 'Monitor Full HD 24 pulgadas IPS 75Hz', 750000.00, 8, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM products WHERE nombre = 'Monitor 24"');
