-- Migration 008: Tabla para el chatbot con Helene Hadsell
-- Creado: 2025-01-15
-- Descripción: Almacena las conversaciones del chatbot con contexto de decretos

CREATE TABLE IF NOT EXISTS chatbot_conversaciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  mensaje_usuario TEXT NOT NULL,
  respuesta_helene TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- Indices para búsqueda rápida
  FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chatbot_user ON chatbot_conversaciones(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_created ON chatbot_conversaciones(created_at);

-- Insertar mensaje de ejemplo de bienvenida (comentado hasta tener usuarios)
-- INSERT INTO chatbot_conversaciones (user_id, mensaje_usuario, respuesta_helene, created_at)
-- VALUES (
--   1,
--   'Hola Helene',
--   '¡Hola dear! 👑 Soy Helene Hadsell, La Reina de los Concursos. Durante más de 30 años gané más de 5,000 concursos usando mi método SPEC. ¿Qué quieres manifestar en tu vida hoy?',
--   datetime('now')
-- );
