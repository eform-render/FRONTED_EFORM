-- Agregar columnas de filtrado a la tabla products
ALTER TABLE products ADD COLUMN IF NOT EXISTS genero VARCHAR(20);
ALTER TABLE products ADD COLUMN IF NOT EXISTS tipo_prenda VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS carrera VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS tipo_uniforme VARCHAR(20) DEFAULT 'INDIVIDUAL';

-- Crear índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_products_genero ON products(genero);
CREATE INDEX IF NOT EXISTS idx_products_tipo_prenda ON products(tipo_prenda);
CREATE INDEX IF NOT EXISTS idx_products_carrera ON products(carrera);
CREATE INDEX IF NOT EXISTS idx_products_tipo_uniforme ON products(tipo_uniforme);
