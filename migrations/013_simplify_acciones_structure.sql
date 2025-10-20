-- Migración 013: Simplificar estructura de acciones
-- Fusionar agenda_eventos en acciones para eliminar duplicación

-- 1. Agregar nuevos campos a acciones
ALTER TABLE acciones ADD COLUMN fecha_evento DATE;
ALTER TABLE acciones ADD COLUMN hora_evento TIME;
ALTER TABLE acciones ADD COLUMN prioridad TEXT DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta'));
ALTER TABLE acciones ADD COLUMN duracion_minutos INTEGER DEFAULT 15;
ALTER TABLE acciones ADD COLUMN repetir_dias TEXT DEFAULT 'todos'; -- 'todos', 'lun,mar,mie', etc.
ALTER TABLE acciones ADD COLUMN es_enfoque_dia BOOLEAN DEFAULT FALSE;

-- 2. Migrar datos de agenda_eventos a acciones
UPDATE acciones
SET
  fecha_evento = (SELECT fecha_evento FROM agenda_eventos WHERE agenda_eventos.accion_id = acciones.id LIMIT 1),
  hora_evento = (SELECT hora_evento FROM agenda_eventos WHERE agenda_eventos.accion_id = acciones.id LIMIT 1),
  prioridad = (SELECT prioridad FROM agenda_eventos WHERE agenda_eventos.accion_id = acciones.id LIMIT 1),
  es_enfoque_dia = (SELECT es_enfoque_dia FROM agenda_eventos WHERE agenda_eventos.accion_id = acciones.id LIMIT 1)
WHERE EXISTS (SELECT 1 FROM agenda_eventos WHERE agenda_eventos.accion_id = acciones.id);

-- 3. Eliminar campo obsoleto agenda_event_id
-- (No se puede hacer ALTER TABLE DROP COLUMN en SQLite, lo dejamos)

-- 4. Eliminar tabla agenda_eventos
DROP TABLE IF EXISTS agenda_eventos;

-- 5. Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_acciones_fecha_evento ON acciones(fecha_evento);
CREATE INDEX IF NOT EXISTS idx_acciones_tipo ON acciones(tipo);
CREATE INDEX IF NOT EXISTS idx_acciones_decreto_tipo ON acciones(decreto_id, tipo);
