-- Migration 010: Agregar campos al sistema tripartito en decretos
-- Creado: 2025-01-15
-- Descripción: Agrega campos necesarios para el sistema de rotación diaria

-- Agregar columna de categoría
ALTER TABLE decretos ADD COLUMN categoria TEXT CHECK(categoria IN ('material', 'humano', 'empresarial'));

-- Agregar columna de última fecha como primario
ALTER TABLE decretos ADD COLUMN last_primary_date TEXT;

-- Agregar columna de nivel de fe actual
ALTER TABLE decretos ADD COLUMN faith_level REAL DEFAULT 5.0 CHECK(faith_level >= 1.0 AND faith_level <= 10.0);

-- Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_decretos_categoria ON decretos(categoria);
CREATE INDEX IF NOT EXISTS idx_decretos_last_primary ON decretos(last_primary_date);
CREATE INDEX IF NOT EXISTS idx_decretos_faith_level ON decretos(faith_level);

-- Actualizar decretos existentes con categoría por defecto (se debe hacer manualmente después)
-- UPDATE decretos SET categoria = 'material' WHERE categoria IS NULL AND id % 3 = 0;
-- UPDATE decretos SET categoria = 'humano' WHERE categoria IS NULL AND id % 3 = 1;
-- UPDATE decretos SET categoria = 'empresarial' WHERE categoria IS NULL AND id % 3 = 2;
