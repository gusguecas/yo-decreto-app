-- Preguntas específicas para cada rutina matutina
-- Esto hará que el tracking sea más detallado y útil para análisis

-- 1. Despertar Consciente
INSERT INTO rutinas_preguntas (rutina_id, pregunta, tipo_respuesta, orden) VALUES 
('1b2fbe56f23d16d19660269bd00d9c9c', '¿Cómo te sentiste al despertar hoy?', 'escala', 1),
('1b2fbe56f23d16d19660269bd00d9c9c', '¿Cuántos minutos necesitaste para levantarte después de la alarma?', 'numero', 2),
('1b2fbe56f23d16d19660269bd00d9c9c', '¿Recordaste algún sueño significativo?', 'booleano', 3);

-- 2. Gratitud Matutina  
INSERT INTO rutinas_preguntas (rutina_id, pregunta, tipo_respuesta, orden) VALUES
('802c6f202cd20cdc3f83ae6ae684800b', '¿Por qué cosa principal sientes gratitud hoy?', 'texto', 1),
('802c6f202cd20cdc3f83ae6ae684800b', '¿Cuántas cosas anotaste en tu lista de gratitud?', 'numero', 2),
('802c6f202cd20cdc3f83ae6ae684800b', 'Nivel de sinceridad en tu gratitud (1-5)', 'escala', 3);

-- 3. Revisión de Decretos
INSERT INTO rutinas_preguntas (rutina_id, pregunta, tipo_respuesta, orden) VALUES
('f47b374066d56886d9aa5af140bcad51', '¿Cuántos decretos revisaste completamente?', 'numero', 1),
('f47b374066d56886d9aa5af140bcad51', '¿Sentiste conexión emocional con tus decretos?', 'escala', 2),
('f47b374066d56886d9aa5af140bcad51', '¿Modificaste o añadiste algo nuevo?', 'booleano', 3);

-- 4. Afirmaciones Poderosas
INSERT INTO rutinas_preguntas (rutina_id, pregunta, tipo_respuesta, orden) VALUES
('71337c15e29bc49d01a94cd38cd07eb5', '¿Cuántas afirmaciones recitaste?', 'numero', 1),
('71337c15e29bc49d01a94cd38cd07eb5', 'Intensidad emocional al recitar (1-5)', 'escala', 2),
('71337c15e29bc49d01a94cd38cd07eb5', '¿Las dijiste en voz alta o mentalmente?', 'texto', 3);

-- 5. Visualización del Día
INSERT INTO rutinas_preguntas (rutina_id, pregunta, tipo_respuesta, orden) VALUES
('1a70d2effe47e9a2ee09d9dad9316b29', '¿Qué resultado específico visualizaste?', 'texto', 1),
('1a70d2effe47e9a2ee09d9dad9316b29', 'Claridad de tu visualización (1-5)', 'escala', 2),
('1a70d2effe47e9a2ee09d9dad9316b29', '¿Sentiste las emociones de lograr tu visión?', 'booleano', 3);

-- 6. Hidratación Consciente
INSERT INTO rutinas_preguntas (rutina_id, pregunta, tipo_respuesta, orden) VALUES
('3c2a7a59580e1849ea170a47214925a7', '¿Cuántos vasos de agua tomaste?', 'numero', 1),
('3c2a7a59580e1849ea170a47214925a7', '¿Agregaste limón, sal o algún complemento?', 'texto', 2),
('3c2a7a59580e1849ea170a47214925a7', 'Nivel de consciencia al beber (1-5)', 'escala', 3);

-- 7. Movimiento Energético
INSERT INTO rutinas_preguntas (rutina_id, pregunta, tipo_respuesta, orden) VALUES
('9396dd6abf3981e2b6a347180cea1365', '¿Qué tipo de movimiento hiciste?', 'texto', 1),
('9396dd6abf3981e2b6a347180cea1365', 'Nivel de energía después del movimiento (1-5)', 'escala', 2),
('9396dd6abf3981e2b6a347180cea1365', '¿Sudaste o sentiste calor corporal?', 'booleano', 3);

-- 8. Planificación Intencional
INSERT INTO rutinas_preguntas (rutina_id, pregunta, tipo_respuesta, orden) VALUES
('94fa2fbaea3a0c04f111ea1c8dd04823', '¿Cuántas tareas prioritarias identificaste?', 'numero', 1),
('94fa2fbaea3a0c04f111ea1c8dd04823', 'Claridad de tus objetivos del día (1-5)', 'escala', 2),
('94fa2fbaea3a0c04f111ea1c8dd04823', '¿Asignaste horarios específicos a tus tareas?', 'booleano', 3);