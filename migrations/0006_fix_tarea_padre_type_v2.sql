-- Arreglar tipo de dato de tarea_padre_id de INTEGER a TEXT
-- Incluye recreación de vista vista_arbol_tareas

-- 1. Eliminar vista que depende de la tabla acciones
DROP VIEW IF EXISTS vista_arbol_tareas;

-- 2. Crear nueva tabla temporal con estructura correcta
CREATE TABLE acciones_temp (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  decreto_id TEXT NOT NULL,
  titulo TEXT NOT NULL,
  que_hacer TEXT NOT NULL,
  como_hacerlo TEXT,
  resultados TEXT,
  tareas_pendientes TEXT,
  tipo TEXT NOT NULL DEFAULT 'secundaria',
  estado TEXT NOT NULL DEFAULT 'pendiente',
  fecha_creacion DATE NOT NULL DEFAULT (date('now')),
  proxima_revision DATETIME,
  fecha_cierre DATE,
  calificacion INTEGER,
  origen TEXT,
  agenda_event_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  tarea_padre_id TEXT DEFAULT NULL,  -- Cambiado de INTEGER a TEXT
  nivel_jerarquia INTEGER DEFAULT 0,
  tiene_derivadas BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (decreto_id) REFERENCES decretos(id) ON DELETE CASCADE,
  FOREIGN KEY (tarea_padre_id) REFERENCES acciones_temp(id) ON DELETE CASCADE
);

-- 3. Copiar datos de la tabla original (convertir tarea_padre_id)
INSERT INTO acciones_temp SELECT 
  id, decreto_id, titulo, que_hacer, como_hacerlo, resultados, 
  tareas_pendientes, tipo, estado, fecha_creacion, proxima_revision, 
  fecha_cierre, calificacion, origen, agenda_event_id, created_at, 
  updated_at, 
  CASE 
    WHEN tarea_padre_id IS NULL THEN NULL 
    ELSE CAST(tarea_padre_id AS TEXT) 
  END as tarea_padre_id,
  nivel_jerarquia, tiene_derivadas 
FROM acciones;

-- 4. Eliminar tabla original
DROP TABLE acciones;

-- 5. Renombrar tabla temporal
ALTER TABLE acciones_temp RENAME TO acciones;

-- 6. Recrear índices
CREATE INDEX IF NOT EXISTS idx_acciones_decreto ON acciones(decreto_id);
CREATE INDEX IF NOT EXISTS idx_acciones_padre ON acciones(tarea_padre_id);
CREATE INDEX IF NOT EXISTS idx_acciones_estado ON acciones(estado);
CREATE INDEX IF NOT EXISTS idx_acciones_tipo ON acciones(tipo);

-- 7. Crear tabla tareas_derivadas con tipos correctos
CREATE TABLE IF NOT EXISTS tareas_derivadas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tarea_padre_id TEXT NOT NULL,
  tarea_hija_id TEXT NOT NULL,
  nivel INTEGER NOT NULL DEFAULT 1,
  orden INTEGER NOT NULL DEFAULT 1,
  dias_offset INTEGER DEFAULT 0,
  tipo_relacion TEXT DEFAULT 'derivada',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tarea_padre_id) REFERENCES acciones(id) ON DELETE CASCADE,
  FOREIGN KEY (tarea_hija_id) REFERENCES acciones(id) ON DELETE CASCADE
);

-- 8. Crear índices para tareas_derivadas
CREATE INDEX IF NOT EXISTS idx_tareas_derivadas_padre ON tareas_derivadas(tarea_padre_id);
CREATE INDEX IF NOT EXISTS idx_tareas_derivadas_hija ON tareas_derivadas(tarea_hija_id);
CREATE INDEX IF NOT EXISTS idx_tareas_derivadas_nivel ON tareas_derivadas(nivel);

-- 9. Recrear vista vista_arbol_tareas
CREATE VIEW vista_arbol_tareas AS
WITH RECURSIVE arbol_tareas(id, titulo, nivel_jerarquia, tarea_padre_id, path, decreto_id) AS (
  
  SELECT 
    id, titulo, nivel_jerarquia, tarea_padre_id, 
    CAST(id AS TEXT) as path,
    decreto_id
  FROM acciones 
  WHERE nivel_jerarquia = 0
  
  UNION ALL
  
  
  SELECT 
    a.id, a.titulo, a.nivel_jerarquia, a.tarea_padre_id,
    at.path || ' > ' || CAST(a.id AS TEXT) as path,
    a.decreto_id
  FROM acciones a
  JOIN arbol_tareas at ON a.tarea_padre_id = at.id
  WHERE a.nivel_jerarquia <= 2
)
SELECT * FROM arbol_tareas;