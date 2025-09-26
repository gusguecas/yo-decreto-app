-- Hacer campos opcionales en tabla seguimientos
-- Solo que_se_hizo es realmente requerido

-- Recrear tabla seguimientos con campos opcionales
DROP TABLE IF EXISTS seguimientos_backup;
CREATE TABLE seguimientos_backup AS SELECT * FROM seguimientos;

DROP TABLE seguimientos;

CREATE TABLE IF NOT EXISTS seguimientos (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  accion_id TEXT NOT NULL,
  que_se_hizo TEXT NOT NULL,
  como_se_hizo TEXT, -- Ahora opcional
  resultados_obtenidos TEXT, -- Ahora opcional
  tareas_pendientes TEXT, -- JSON array
  proxima_revision DATETIME,
  calificacion INTEGER CHECK (calificacion >= 1 AND calificacion <= 10) DEFAULT 5,
  fecha_seguimiento DATE NOT NULL DEFAULT (date('now')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (accion_id) REFERENCES acciones (id) ON DELETE CASCADE
);

-- Restaurar datos existentes si los hay
INSERT INTO seguimientos SELECT * FROM seguimientos_backup;

-- Limpiar tabla temporal
DROP TABLE seguimientos_backup;

-- Crear índice
CREATE INDEX IF NOT EXISTS idx_seguimientos_accion_id ON seguimientos(accion_id);