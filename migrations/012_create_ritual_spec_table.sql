-- Tabla para sesiones del Ritual SPEC
CREATE TABLE IF NOT EXISTS ritual_spec_sesiones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  decreto_id TEXT,
  momento TEXT NOT NULL CHECK(momento IN ('manana', 'noche')),
  fecha TEXT NOT NULL,
  hora_inicio TEXT NOT NULL,
  hora_fin TEXT,
  completada INTEGER DEFAULT 0,
  duracion_segundos INTEGER DEFAULT 0,
  etapa_actual INTEGER DEFAULT 0,
  notas TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (decreto_id) REFERENCES decretos(id) ON DELETE SET NULL
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_ritual_sesiones_fecha ON ritual_spec_sesiones(fecha);
CREATE INDEX IF NOT EXISTS idx_ritual_sesiones_completada ON ritual_spec_sesiones(completada);
CREATE INDEX IF NOT EXISTS idx_ritual_sesiones_decreto ON ritual_spec_sesiones(decreto_id);
CREATE INDEX IF NOT EXISTS idx_ritual_sesiones_momento ON ritual_spec_sesiones(momento);
