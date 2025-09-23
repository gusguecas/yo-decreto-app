-- Agregar campo nombre_usuario a tabla usuarios
ALTER TABLE usuarios ADD COLUMN nombre_usuario TEXT DEFAULT 'Gustavo Adolfo Guerrero Castaños';

-- Actualizar usuario existente con el nombre por defecto
UPDATE usuarios SET nombre_usuario = 'Gustavo Adolfo Guerrero Castaños' WHERE nombre_usuario IS NULL;
