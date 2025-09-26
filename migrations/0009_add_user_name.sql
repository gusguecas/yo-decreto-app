-- Crear tabla usuarios si no existe
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY DEFAULT 'user-001',
  nombre_usuario TEXT DEFAULT 'Gustavo Adolfo Guerrero Castaños',
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario por defecto si no existe
INSERT OR IGNORE INTO usuarios (id, nombre_usuario) 
VALUES ('user-001', 'Gustavo Adolfo Guerrero Castaños');
