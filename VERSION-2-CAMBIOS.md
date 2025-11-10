# 📋 VERSION 2 - CAMBIOS Y MEJORAS

## 🎯 Objetivo
Hacer la app más práctica y clara, manteniendo todas las funcionalidades pero definiendo flujos más directos.

---

## 🌲 ESTRUCTURA DE BRANCHES

```
main (original con cambio de botón)
  └─ version-2 (todos los nuevos cambios aquí)
```

### **Cómo regresar a la original:**
```bash
git checkout main
npm run build
# Volver a producción
```

---

## ✅ CAMBIOS APLICADOS EN VERSION-2

### **✅ Cambio #1: Modal simplificado para crear acciones**
- **Archivo:** `public/static/decretos.js`
- **Líneas:** 548-630 (aprox)
- **Cambios:**
  - Reducido de 13 campos a 4 campos básicos:
    1. Título
    2. ¿Qué hacer? (descripción)
    3. ¿Cuándo hacerla? (fecha)
    4. Hora
  - Eliminados campos complejos: duración, prioridad, repetir, enfoque día, cómo hacerlo, resultados, calificación
  - Campo "tipo" ahora es hidden (se define por el botón)
  - **Resultado:** Modal rápido y simple (< 30 segundos para crear acción)

### **✅ Cambio #2: Dos botones separados (Primaria vs Secundaria)**
- **Archivo:** `public/static/decretos.js`
- **Líneas:** 1514-1536 (renderMisAcciones)
- **Cambios:**
  - Eliminado botón único "+ Nueva Acción"
  - Agregados 2 botones claramente diferenciados:
    - "🎯 Acción Primaria" (verde, semanal)
    - "📅 Acción Secundaria" (azul, diaria)
  - Modal muestra título dinámico según botón clickeado
  - **Resultado:** Usuario sabe exactamente qué está creando

### **✅ Cambio #3: Eliminación completa del sistema de sub-tareas**
- **Archivo:** `public/static/decretos.js`
- **Líneas:** Múltiples secciones
- **Cambios:**
  - Eliminada sección de sub-tareas del modal (70+ líneas)
  - Función `toggleUniversalSubtareas()` desactivada
  - Eliminados 3 inputs de sub-tareas con fechas
  - **Filosofía:** Si una tarea genera más trabajo → crear NUEVA tarea
  - **Resultado:** Sin complejidad de jerarquías, lista plana simple

---

## 📝 CAMBIOS YA GUARDADOS EN MAIN (original)

### **✅ Eliminación de botón "+ Nueva Acción" en tarjetas**
- **Archivo:** `public/static/decretos.js`
- **Líneas removidas:** 304-311
- **Razón:** Simplificar flujo - las acciones solo se crean desde el detalle del decreto
- **Commit:** cb8c3fd

---

## 🚀 PRÓXIMOS CAMBIOS A IMPLEMENTAR

Lista de mejoras a implementar en version-2:
- [ ] Definir dónde se agregan tareas (solo decretos vs decretos + agenda)
- [ ] Simplificar UI de agenda si es necesario
- [ ] Otros cambios según feedback del usuario

---

**Branch actual:** version-2
**Fecha creación:** 8 de Noviembre de 2025
**Status:** ✅ Lista para nuevos cambios
