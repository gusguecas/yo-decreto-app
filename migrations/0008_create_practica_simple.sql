-- Migración simplificada: Crear tablas de práctica
-- Fecha: 2025-09-23

-- Tabla de rutinas matutinas (estructura simple)
CREATE TABLE rutinas_matutinas (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  duracion_estimada INTEGER,
  orden_display INTEGER,
  activa INTEGER,
  color TEXT,
  icono TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de afirmaciones
CREATE TABLE afirmaciones_practica (
  id TEXT PRIMARY KEY,
  texto TEXT NOT NULL,
  categoria TEXT,
  activa INTEGER,
  orden_display INTEGER,
  veces_usada INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de rutinas completadas
CREATE TABLE rutinas_completadas (
  id TEXT PRIMARY KEY,
  rutina_id TEXT,
  fecha_completada DATE,
  tiempo_invertido INTEGER,
  notas TEXT,
  puntuacion INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de afirmaciones utilizadas
CREATE TABLE afirmaciones_utilizadas (
  id TEXT PRIMARY KEY,
  afirmacion_id TEXT,
  fecha_utilizada DATE,
  repeticiones INTEGER,
  notas TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);