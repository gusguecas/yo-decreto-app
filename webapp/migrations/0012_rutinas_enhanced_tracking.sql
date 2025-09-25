-- Mejorar tabla de rutinas completadas con más campos para análisis
ALTER TABLE rutinas_completadas 
ADD COLUMN tiempo_inicio DATETIME;

ALTER TABLE rutinas_completadas 
ADD COLUMN tiempo_fin DATETIME;

ALTER TABLE rutinas_completadas 
ADD COLUMN calidad_percibida INTEGER DEFAULT NULL; -- Escala 1-5

ALTER TABLE rutinas_completadas 
ADD COLUMN respuestas_json TEXT DEFAULT NULL; -- JSON con respuestas específicas

ALTER TABLE rutinas_completadas 
ADD COLUMN ubicacion TEXT DEFAULT NULL; -- Donde se hizo la rutina

ALTER TABLE rutinas_completadas 
ADD COLUMN estado_animo_antes INTEGER DEFAULT NULL; -- Escala 1-5

ALTER TABLE rutinas_completadas 
ADD COLUMN estado_animo_despues INTEGER DEFAULT NULL; -- Escala 1-5

-- Añadir tabla para preguntas específicas por rutina
CREATE TABLE IF NOT EXISTS rutinas_preguntas (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  rutina_id TEXT NOT NULL,
  pregunta TEXT NOT NULL,
  tipo_respuesta TEXT DEFAULT 'texto', -- 'texto', 'numero', 'escala', 'booleano', 'tiempo'
  opciones_json TEXT DEFAULT NULL, -- Para preguntas de opción múltiple
  orden INTEGER DEFAULT 1,
  activa INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rutina_id) REFERENCES rutinas_matutinas(id)
);

-- Tabla para seguimiento de rachas y hábitos
CREATE TABLE IF NOT EXISTS rutinas_estadisticas_diarias (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  fecha DATE NOT NULL,
  rutinas_completadas INTEGER DEFAULT 0,
  rutinas_totales INTEGER DEFAULT 0,
  porcentaje_completado DECIMAL(5,2) DEFAULT 0,
  tiempo_total_minutos INTEGER DEFAULT 0,
  racha_actual INTEGER DEFAULT 0,
  mejor_racha INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(fecha)
);

-- Añadir índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_rutinas_completadas_fecha ON rutinas_completadas(fecha_completada);
CREATE INDEX IF NOT EXISTS idx_rutinas_completadas_rutina ON rutinas_completadas(rutina_id);
CREATE INDEX IF NOT EXISTS idx_rutinas_preguntas_rutina ON rutinas_preguntas(rutina_id);
CREATE INDEX IF NOT EXISTS idx_estadisticas_fecha ON rutinas_estadisticas_diarias(fecha);