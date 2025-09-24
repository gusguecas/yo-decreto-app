-- Seed data para Mi Práctica
-- Insertar rutinas matutinas por defecto

INSERT OR REPLACE INTO rutinas_matutinas (id, nombre, descripcion, tiempo_estimado, orden_display, activa, icono) VALUES
('rutina_001', 'Meditación Matutina', 'Meditación de 10 minutos para centrar la mente y establecer intenciones para el día', 10, 1, 1, 'fas fa-om'),
('rutina_002', 'Gratitud Diaria', 'Escribir 3 cosas por las que me siento agradecido/a cada mañana', 5, 2, 1, 'fas fa-heart'),
('rutina_003', 'Afirmaciones Poderosas', 'Repetir mis afirmaciones personales de abundancia y éxito', 5, 3, 1, 'fas fa-star'),
('rutina_004', 'Visualización de Metas', 'Visualizar mis objetivos ya cumplidos, sintiendo las emociones del éxito', 8, 4, 1, 'fas fa-eye'),
('rutina_005', 'Ejercicio Físico', 'Actividad física para energizar el cuerpo y la mente', 20, 5, 1, 'fas fa-dumbbell'),
('rutina_006', 'Lectura Inspiracional', 'Leer contenido que alimente mi crecimiento personal y espiritual', 15, 6, 1, 'fas fa-book-open');

-- Insertar afirmaciones por defecto
INSERT OR REPLACE INTO afirmaciones (id, texto, categoria, es_favorita, veces_usada) VALUES
-- Abundancia y Prosperidad
('afirm_001', 'Soy un imán para la abundancia y la prosperidad en todas las áreas de mi vida', 'material', 1, 0),
('afirm_002', 'El dinero fluye hacia mí de múltiples fuentes de manera constante y creciente', 'material', 1, 0),
('afirm_003', 'Merezco vivir una vida próspera y abundante en todos los aspectos', 'material', 0, 0),

-- Salud y Bienestar  
('afirm_004', 'Mi cuerpo es fuerte, saludable y lleno de energía vital', 'humano', 1, 0),
('afirm_005', 'Cada día me siento mejor, más fuerte y más vibrante', 'humano', 0, 0),
('afirm_006', 'Irradio salud, vitalidad y bienestar desde mi interior', 'humano', 0, 0),

-- Éxito y Logros
('afirm_007', 'Soy exitoso/a en todo lo que me propongo con determinación y fe', 'empresarial', 1, 0),
('afirm_008', 'Mis metas se manifiestan con facilidad y en el momento perfecto', 'empresarial', 0, 0),
('afirm_009', 'Tengo el poder de crear la vida extraordinaria que deseo', 'empresarial', 1, 0),

-- Amor y Relaciones
('afirm_010', 'Estoy rodeado/a de amor, comprensión y relaciones armoniosas', 'humano', 0, 0),
('afirm_011', 'Amo y soy amado/a incondicionalmente', 'humano', 1, 0),
('afirm_012', 'Atraigo personas positivas que enriquecen mi vida', 'humano', 0, 0),

-- Crecimiento Personal
('afirm_013', 'Cada día crezco en sabiduría, amor y comprensión', 'general', 0, 0),
('afirm_014', 'Confío en mi intuición y tomo decisiones desde mi sabiduría interior', 'general', 1, 0),
('afirm_015', 'Soy la versión más elevada y poderosa de mí mismo/a', 'general', 1, 0);