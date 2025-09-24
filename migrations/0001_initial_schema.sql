-- Tabla de decretos principales
CREATE TABLE IF NOT EXISTS decretos (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  area TEXT NOT NULL CHECK (area IN ('empresarial', 'material', 'humano')),
  titulo TEXT NOT NULL,
  sueno_meta TEXT NOT NULL,
  descripcion TEXT,
  fecha_creacion DATE NOT NULL DEFAULT (date('now')),
  progreso INTEGER DEFAULT 0 CHECK (progreso >= 0 AND progreso <= 100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de acciones/tareas de decretos
CREATE TABLE IF NOT EXISTS acciones (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  decreto_id TEXT NOT NULL,
  titulo TEXT NOT NULL,
  que_hacer TEXT NOT NULL,
  como_hacerlo TEXT,
  resultados TEXT,
  tareas_pendientes TEXT, -- JSON array de subtareas
  tipo TEXT NOT NULL DEFAULT 'secundaria' CHECK (tipo IN ('primaria', 'secundaria')),
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completada', 'en_progreso')),
  fecha_creacion DATE NOT NULL DEFAULT (date('now')),
  proxima_revision DATETIME,
  fecha_cierre DATE,
  calificacion INTEGER CHECK (calificacion >= 1 AND calificacion <= 10),
  origen TEXT, -- manual, seguimiento:<accionId>
  agenda_event_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (decreto_id) REFERENCES decretos(id) ON DELETE CASCADE
);

-- Tabla de seguimientos de acciones
CREATE TABLE IF NOT EXISTS seguimientos (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  accion_id TEXT NOT NULL,
  que_se_hizo TEXT NOT NULL,
  como_se_hizo TEXT NOT NULL,
  resultados_obtenidos TEXT NOT NULL,
  tareas_pendientes TEXT, -- JSON array
  proxima_revision DATETIME,
  calificacion INTEGER CHECK (calificacion >= 1 AND calificacion <= 10),
  fecha_seguimiento DATE NOT NULL DEFAULT (date('now')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (accion_id) REFERENCES acciones(id) ON DELETE CASCADE
);

-- Tabla para la agenda
CREATE TABLE IF NOT EXISTS agenda_eventos (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  accion_id TEXT,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha_evento DATE NOT NULL,
  hora_evento TIME,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completada', 'cancelada')),
  es_enfoque_dia BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (accion_id) REFERENCES acciones(id) ON DELETE CASCADE
);

-- Tabla de configuración del usuario
CREATE TABLE IF NOT EXISTS configuracion (
  id TEXT PRIMARY KEY DEFAULT 'main',
  nombre_usuario TEXT DEFAULT 'Gustavo Adolfo Guerrero Castaños',
  frase_vida TEXT DEFAULT '(Agregar frase de vida)',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para rutinas matutinas (Mi Práctica)
CREATE TABLE IF NOT EXISTS rutinas_matutinas (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  tiempo_estimado INTEGER NOT NULL, -- minutos
  icono TEXT NOT NULL,
  orden_display INTEGER NOT NULL,
  activa BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para tracking de rutinas completadas
CREATE TABLE IF NOT EXISTS rutinas_completadas (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  rutina_id TEXT NOT NULL,
  fecha_completada DATE NOT NULL DEFAULT (date('now')),
  tiempo_invertido INTEGER, -- minutos reales
  notas TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rutina_id) REFERENCES rutinas_matutinas(id) ON DELETE CASCADE,
  UNIQUE(rutina_id, fecha_completada)
);

-- Tabla de afirmaciones
CREATE TABLE IF NOT EXISTS afirmaciones (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  texto TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('empresarial', 'material', 'humano', 'general')),
  es_favorita BOOLEAN DEFAULT FALSE,
  veces_usada INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_decretos_area ON decretos(area);
CREATE INDEX IF NOT EXISTS idx_acciones_decreto_id ON acciones(decreto_id);
CREATE INDEX IF NOT EXISTS idx_acciones_estado ON acciones(estado);
CREATE INDEX IF NOT EXISTS idx_acciones_proxima_revision ON acciones(proxima_revision);
CREATE INDEX IF NOT EXISTS idx_agenda_eventos_fecha ON agenda_eventos(fecha_evento);
CREATE INDEX IF NOT EXISTS idx_agenda_eventos_accion ON agenda_eventos(accion_id);
CREATE INDEX IF NOT EXISTS idx_seguimientos_accion ON seguimientos(accion_id);
CREATE INDEX IF NOT EXISTS idx_rutinas_completadas_fecha ON rutinas_completadas(fecha_completada);
CREATE INDEX IF NOT EXISTS idx_afirmaciones_categoria ON afirmaciones(categoria);