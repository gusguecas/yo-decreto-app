-- Insertar configuración inicial del usuario
INSERT OR IGNORE INTO configuracion (id, nombre_usuario, frase_vida) VALUES 
  ('main', 'Gustavo Adolfo Guerrero Castaños', 'Creo mi realidad a través del poder de mis decretos');

-- Insertar rutinas matutinas por defecto (8 rutinas completas)
INSERT OR IGNORE INTO rutinas_matutinas (id, nombre, descripcion, tiempo_estimado, icono, orden_display, activa) VALUES 
  ('rutina_1', 'Meditación', 'Práctica de mindfulness y conexión interior', 10, '🧘', 1, 1),
  ('rutina_2', 'Ejercicio', 'Actividad física para energizar el cuerpo', 30, '💪', 2, 1),
  ('rutina_3', 'Lectura Inspiracional', 'Lectura de contenido motivacional o educativo', 15, '📚', 3, 1),
  ('rutina_4', 'Planificación del Día', 'Organizar prioridades y objetivos diarios', 10, '📅', 4, 1),
  ('rutina_5', 'Afirmaciones', 'Recitación de decretos y afirmaciones positivas', 5, '💎', 5, 1),
  ('rutina_6', 'Hidratación y Nutrición', 'Beber agua y tomar un desayuno saludable', 15, '💧', 6, 1),
  ('rutina_7', 'Revisión de Objetivos', 'Revisar metas semanales y mensuales', 10, '🎯', 7, 1),
  ('rutina_8', 'Gratitud y Visualización', 'Práctica de gratitud y visualización de objetivos', 10, '🙏', 8, 1);

-- Insertar afirmaciones por defecto
INSERT OR IGNORE INTO afirmaciones (texto, categoria, es_favorita) VALUES 
  ('Yo soy el arquitecto de mi destino empresarial', 'empresarial', true),
  ('Cada día mi empresa crece y prospera exponencialmente', 'empresarial', false),
  ('Tengo la visión y el liderazgo para transformar mi industria', 'empresarial', false),
  ('Soy un imán para las oportunidades de negocio perfectas', 'empresarial', false),
  ('Mi abundancia material fluye hacia mí de múltiples fuentes', 'material', true),
  ('Merezco y recibo prosperidad económica constante', 'material', false),
  ('Mis inversiones siempre generan retornos excepcionales', 'material', false),
  ('El dinero es mi aliado para crear impacto positivo', 'material', false),
  ('Irradio amor y compasión en todas mis relaciones', 'humano', true),
  ('Soy una fuente de inspiración y fortaleza para otros', 'humano', false),
  ('Mi salud física, mental y espiritual es perfecta', 'humano', false),
  ('Cultivo vínculos profundos y auténticos', 'humano', false),
  ('Soy poderoso, capaz y merezco todo lo que deseo', 'general', true),
  ('Cada día me acerco más a mi versión más elevada', 'general', false),
  ('El universo conspira a mi favor en todo momento', 'general', false);

-- Insertar decretos de ejemplo
INSERT OR IGNORE INTO decretos (id, area, titulo, sueno_meta, descripcion) VALUES 
  ('decreto_1', 'empresarial', 'Liderazgo Tecnológico Global', 'Convertir mi empresa en la referencia mundial de innovación tecnológica', 'Desarrollar soluciones tecnológicas que transformen industrias y mejoren la vida de millones de personas'),
  ('decreto_2', 'material', 'Abundancia Financiera Sostenible', 'Alcanzar la libertad financiera completa y crear un patrimonio sólido', 'Generar múltiples fuentes de ingresos pasivos que me permitan vivir con abundancia y contribuir generosamente'),
  ('decreto_3', 'humano', 'Salud Integral y Vitalidad', 'Mantener un estado de salud física, mental y espiritual óptimo', 'Cultivar hábitos que nutran mi cuerpo, mente y espíritu para vivir una vida plena y energética');

-- Insertar algunas acciones de ejemplo
INSERT OR IGNORE INTO acciones (decreto_id, titulo, que_hacer, como_hacerlo, tipo, proxima_revision) VALUES 
  ('decreto_1', 'Definir Visión Empresarial 2025', 'Crear un plan estratégico detallado para los próximos 2 años', 'Realizar sesiones de brainstorming, análisis de mercado y consulta con expertos', 'primaria', datetime('now', '+7 days')),
  ('decreto_2', 'Optimizar Portafolio de Inversiones', 'Revisar y rebalancear cartera de inversiones', 'Analizar rendimientos actuales, estudiar nuevas oportunidades y consultar con asesor financiero', 'primaria', datetime('now', '+3 days')),
  ('decreto_3', 'Rutina de Ejercicio Diario', 'Mantener actividad física constante', 'Ejercitarse 30 minutos diarios combinando cardio y fuerza', 'secundaria', datetime('now', '+1 day'));