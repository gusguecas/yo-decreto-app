-- Migration 011: Google Calendar Integration
-- Creado: 2025-01-15
-- Descripción: Tablas para sincronización bidireccional con Google Calendar

-- Tabla para almacenar eventos importados de Google Calendar
CREATE TABLE IF NOT EXISTS google_events (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  google_event_id TEXT UNIQUE NOT NULL, -- ID del evento en Google Calendar
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha_inicio TEXT NOT NULL, -- ISO 8601 format
  fecha_fin TEXT NOT NULL,
  all_day BOOLEAN DEFAULT 0,
  location TEXT,
  attendees TEXT, -- JSON array de asistentes
  color_id TEXT,
  recurring BOOLEAN DEFAULT 0,
  recurring_event_id TEXT, -- Para eventos recurrentes
  synced_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted BOOLEAN DEFAULT 0, -- Soft delete para eventos eliminados en Google
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_google_events_user ON google_events(user_id);
CREATE INDEX IF NOT EXISTS idx_google_events_google_id ON google_events(google_event_id);
CREATE INDEX IF NOT EXISTS idx_google_events_fecha ON google_events(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_google_events_deleted ON google_events(deleted);

-- Tabla para mapear eventos locales con eventos de Google Calendar
CREATE TABLE IF NOT EXISTS event_sync_mapping (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  local_event_type TEXT NOT NULL, -- 'agenda_evento', 'daily_rotation', 'routine', 'accion'
  local_event_id TEXT NOT NULL,
  google_event_id TEXT NOT NULL,
  sync_status TEXT DEFAULT 'synced' CHECK(sync_status IN ('synced', 'pending', 'error', 'conflict')),
  sync_direction TEXT DEFAULT 'export' CHECK(sync_direction IN ('import', 'export', 'bidirectional')),
  last_synced TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  UNIQUE(local_event_type, local_event_id)
);

CREATE INDEX IF NOT EXISTS idx_event_sync_user ON event_sync_mapping(user_id);
CREATE INDEX IF NOT EXISTS idx_event_sync_google_id ON event_sync_mapping(google_event_id);
CREATE INDEX IF NOT EXISTS idx_event_sync_status ON event_sync_mapping(sync_status);

-- Tabla para configuración de integración con Google Calendar
CREATE TABLE IF NOT EXISTS user_integrations (
  user_id TEXT PRIMARY KEY DEFAULT 'demo-user',
  google_access_token TEXT,
  google_refresh_token TEXT,
  google_token_expiry TEXT,
  google_calendar_id TEXT DEFAULT 'primary',
  sync_enabled BOOLEAN DEFAULT 1,

  -- Configuraciones de importación
  auto_import BOOLEAN DEFAULT 1, -- Importar eventos de Google automáticamente
  import_interval INTEGER DEFAULT 15, -- Minutos entre sincronizaciones
  last_import TEXT,

  -- Configuraciones de exportación
  auto_export BOOLEAN DEFAULT 1, -- Exportar eventos Yo Decreto a Google
  export_rutinas BOOLEAN DEFAULT 1, -- Sincronizar rutinas matutina/vespertina
  export_decretos_primarios BOOLEAN DEFAULT 1, -- Sincronizar bloques de trabajo
  export_agenda_eventos BOOLEAN DEFAULT 1, -- Sincronizar eventos de agenda
  export_acciones BOOLEAN DEFAULT 0, -- Sincronizar acciones con fecha

  -- Configuraciones avanzadas
  conflict_resolution TEXT DEFAULT 'ask' CHECK(conflict_resolution IN ('ask', 'google_wins', 'local_wins', 'newest_wins')),
  timezone TEXT DEFAULT 'America/Mexico_City',

  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Insertar configuración por defecto para usuario demo
INSERT OR IGNORE INTO user_integrations (user_id, timezone)
VALUES ('demo-user', 'America/Mexico_City');

-- Tabla para log de sincronización (debugging y auditoría)
CREATE TABLE IF NOT EXISTS sync_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  sync_type TEXT NOT NULL, -- 'import', 'export', 'full_sync'
  sync_direction TEXT NOT NULL, -- 'google_to_local', 'local_to_google', 'bidirectional'
  events_processed INTEGER DEFAULT 0,
  events_created INTEGER DEFAULT 0,
  events_updated INTEGER DEFAULT 0,
  events_deleted INTEGER DEFAULT 0,
  errors INTEGER DEFAULT 0,
  error_details TEXT, -- JSON con detalles de errores
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT,
  status TEXT DEFAULT 'running' CHECK(status IN ('running', 'completed', 'failed', 'cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_sync_log_user ON sync_log(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_log_status ON sync_log(status);
CREATE INDEX IF NOT EXISTS idx_sync_log_started ON sync_log(started_at);
