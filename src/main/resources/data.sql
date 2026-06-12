INSERT INTO users (username, email, password, role, created_at, updated_at)
SELECT 'admin', 'admin@sena.edu.co',
       '$2b$10$uNjp2NXJ6kkTAdcPhV0LD.8Ek4LweekLrtby90i1Ohs2xFkIP3Amm',
       'ROLE_ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

