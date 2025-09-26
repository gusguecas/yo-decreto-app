-- Agregar columna prioridad a la tabla agenda_eventos
-- Esta columna define la prioridad de las tareas de la agenda

-- Agregar columna prioridad con valor por defecto 'media'
ALTER TABLE agenda_eventos ADD COLUMN prioridad TEXT DEFAULT 'media';

-- Crear índice para mejorar rendimiento de consultas por prioridad
CREATE INDEX IF NOT EXISTS idx_agenda_eventos_prioridad ON agenda_eventos(prioridad);

-- Actualizar todas las filas existentes con prioridad 'media' (por si hay valores NULL)
UPDATE agenda_eventos SET prioridad = 'media' WHERE prioridad IS NULL;