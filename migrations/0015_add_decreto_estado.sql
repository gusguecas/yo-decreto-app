-- Migración 0015: Agregar campo 'estado' a decretos
-- Fecha: 2025-01-10
-- Propósito: Permitir marcar decretos como 'activo' o 'standby'

-- Agregar columna estado (por defecto 'activo')
ALTER TABLE decretos ADD COLUMN estado TEXT DEFAULT 'activo';

-- Crear índice para búsquedas rápidas por estado
CREATE INDEX IF NOT EXISTS idx_decretos_estado ON decretos(estado);

-- Actualizar todos los decretos existentes a 'activo'
UPDATE decretos SET estado = 'activo' WHERE estado IS NULL;

-- Comentario de la columna
-- estado puede ser: 'activo' o 'standby'
-- 'activo': El decreto está en trabajo activo, se pueden crear acciones
-- 'standby': El decreto está pausado, solo lectura, no se crean acciones
