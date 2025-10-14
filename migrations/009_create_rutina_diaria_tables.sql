-- Migration 009: Sistema de Rutina Diaria Tripartito
-- Creado: 2025-01-15
-- Descripción: Tablas para el sistema de rotación diaria tripartito (Material, Humano, Empresarial)

-- Tabla para rotación diaria de decretos primarios
CREATE TABLE IF NOT EXISTS daily_rotation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL, -- Formato YYYY-MM-DD
  decreto_material_id INTEGER NOT NULL,
  decreto_humano_id INTEGER NOT NULL,
  decreto_empresarial_id INTEGER NOT NULL,
  generated_at TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (decreto_material_id) REFERENCES decretos(id) ON DELETE CASCADE,
  FOREIGN KEY (decreto_humano_id) REFERENCES decretos(id) ON DELETE CASCADE,
  FOREIGN KEY (decreto_empresarial_id) REFERENCES decretos(id) ON DELETE CASCADE,

  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_rotation_user_date ON daily_rotation(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_rotation_date ON daily_rotation(date);

-- Tabla para completar tareas diarias (primarias y secundarias)
CREATE TABLE IF NOT EXISTS task_completion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  decreto_id INTEGER NOT NULL,
  date TEXT NOT NULL, -- Formato YYYY-MM-DD
  task_type TEXT NOT NULL, -- 'primary' o 'secondary'
  completed BOOLEAN NOT NULL DEFAULT 0,
  minutes_spent INTEGER DEFAULT 0,
  notes TEXT,
  completed_at TEXT,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (decreto_id) REFERENCES decretos(id) ON DELETE CASCADE,

  UNIQUE(user_id, decreto_id, date, task_type)
);

CREATE INDEX IF NOT EXISTS idx_task_completion_user_date ON task_completion(user_id, date);
CREATE INDEX IF NOT EXISTS idx_task_completion_decreto ON task_completion(decreto_id);

-- Tabla para rutinas matutinas y vespertinas
CREATE TABLE IF NOT EXISTS daily_routines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL, -- Formato YYYY-MM-DD
  routine_type TEXT NOT NULL, -- 'morning' o 'evening'
  completed BOOLEAN NOT NULL DEFAULT 0,
  completed_at TEXT,
  notes TEXT,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  UNIQUE(user_id, date, routine_type)
);

CREATE INDEX IF NOT EXISTS idx_daily_routines_user_date ON daily_routines(user_id, date);

-- Tabla para tracking de fe (3 check-ins diarios: 10am, 3pm, 8pm)
CREATE TABLE IF NOT EXISTS faith_tracking (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  decreto_id INTEGER NOT NULL,
  date TEXT NOT NULL, -- Formato YYYY-MM-DD
  check_in_time TEXT NOT NULL, -- '10am', '3pm', '8pm'
  faith_level INTEGER NOT NULL CHECK(faith_level >= 1 AND faith_level <= 10),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (decreto_id) REFERENCES decretos(id) ON DELETE CASCADE,

  UNIQUE(user_id, decreto_id, date, check_in_time)
);

CREATE INDEX IF NOT EXISTS idx_faith_tracking_user_date ON faith_tracking(user_id, date);
CREATE INDEX IF NOT EXISTS idx_faith_tracking_decreto ON faith_tracking(decreto_id);

-- Tabla para señales y sincronicidades
CREATE TABLE IF NOT EXISTS signals_synchronicities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  decreto_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  signal_type TEXT, -- 'señal', 'sincronicidad', 'oportunidad'
  emotional_impact INTEGER CHECK(emotional_impact >= 1 AND emotional_impact <= 10),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (decreto_id) REFERENCES decretos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_signals_user ON signals_synchronicities(user_id);
CREATE INDEX IF NOT EXISTS idx_signals_decreto ON signals_synchronicities(decreto_id);
CREATE INDEX IF NOT EXISTS idx_signals_date ON signals_synchronicities(date);

-- Tabla para manifestaciones (cuando un decreto se cumple)
CREATE TABLE IF NOT EXISTS manifestations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  decreto_id INTEGER NOT NULL,
  manifestation_date TEXT NOT NULL,
  days_to_manifest INTEGER, -- Días desde la creación del decreto
  completion_percentage INTEGER DEFAULT 100 CHECK(completion_percentage >= 0 AND completion_percentage <= 100),
  story TEXT, -- Historia de cómo se manifestó
  gratitude_note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (decreto_id) REFERENCES decretos(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_manifestations_user ON manifestations(user_id);
CREATE INDEX IF NOT EXISTS idx_manifestations_date ON manifestations(manifestation_date);

-- Tabla para compromisos de merecimiento diario
CREATE TABLE IF NOT EXISTS merit_commitments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL, -- Formato YYYY-MM-DD
  commitment TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT 0,
  completed_at TEXT,
  reflection TEXT,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_merit_commitments_user_date ON merit_commitments(user_id, date);

-- Tabla para configuraciones de usuario
CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY,
  morning_routine_time TEXT DEFAULT '06:00', -- Hora preferida para rutina matutina
  evening_routine_time TEXT DEFAULT '21:00', -- Hora preferida para rutina vespertina
  notifications_enabled BOOLEAN DEFAULT 1,
  notification_times TEXT DEFAULT '["10:00", "15:00", "20:00"]', -- JSON array de horarios de check-in
  timezone TEXT DEFAULT 'America/Mexico_City',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Agregar campos faltantes a la tabla de decretos (si no existen)
-- Nota: SQLite no soporta ALTER TABLE ADD COLUMN IF NOT EXISTS,
-- así que esto debe verificarse manualmente o manejarse en el código

-- categoria: 'material', 'humano', 'empresarial'
-- last_primary_date: última vez que fue decreto primario
-- faith_level: nivel de fe actual (promedio de últimos 3 check-ins)

-- Insertar configuración por defecto para usuario demo
INSERT OR IGNORE INTO user_settings (user_id, morning_routine_time, evening_routine_time)
VALUES ('demo-user', '06:00', '21:00');
