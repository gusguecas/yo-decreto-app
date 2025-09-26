# 🎯 DIAGRAMA DE FLUJO - SISTEMA DE ACCIONES "YO DECRETO"

## 📋 FLUJO ACTUAL (Lo que está implementado)

```
🏠 INICIO
    ↓
📜 CREAR DECRETO
    ↓
🎯 CREAR ACCIÓN (Primaria/Secundaria)
    ↓
┌─────────────────────────────────────────┐
│  ACCIÓN CREADA - 4 BOTONES DISPONIBLES  │
│                                         │
│  📅 [1] Ir a Agenda                    │
│  🔒 [2] Seguimiento                     │
│  ✅ [3] Completar/Descompletar          │
│  🗑️ [4] Borrar                         │
└─────────────────────────────────────────┘
    ↓
🤔 **PROBLEMA IDENTIFICADO**
    ↓
❌ EL FLUJO ES DEMASIADO SIMPLE Y FALTA LÓGICA DE ESTADOS
```

---

## 🔄 FLUJO PROPUESTO (Lógica Completa)

```
🏠 INICIO
    ↓
📜 CREAR DECRETO
    ↓
🎯 CREAR ACCIÓN
    ↓
┌─────────────────────────────────────────┐
│           ESTADO: PENDIENTE             │
│                                         │
│  📅 [1] Programar en Agenda            │
│  🔒 [2] Agregar Seguimiento            │
│  ✅ [3] Marcar como Completada         │
│  🗑️ [4] Eliminar Acción                │
└─────────────────────────────────────────┘
    ↓ (Si presiona [3])
┌─────────────────────────────────────────┐
│          ESTADO: COMPLETADA             │
│                                         │
│  📅 [1] Ver en Agenda                  │
│  🔒 [2] Ver Seguimientos               │
│  🔄 [3] Marcar como Pendiente          │
│  🗑️ [4] Eliminar Acción                │
└─────────────────────────────────────────┘
    ↓ (Si presiona [2] desde cualquier estado)
┌─────────────────────────────────────────┐
│        MODAL DE SEGUIMIENTO             │
│                                         │
│  📝 ¿Qué se hizo?                      │
│  🔧 ¿Cómo se hizo?                     │
│  📊 ¿Resultados obtenidos?             │
│  📋 Tareas pendientes nuevas           │
│  📅 Próxima revisión                   │
│  ⭐ Calificación (1-10)                │
└─────────────────────────────────────────┘
    ↓
🔄 CREAR TAREAS AUTOMÁTICAS SECUNDARIAS
    ↓
📈 SINCRONIZAR CON AGENDA
    ↓
✅ ACTUALIZAR MÉTRICAS Y PROGRESO
```

---

## 🚨 PROBLEMAS IDENTIFICADOS EN LA LÓGICA ACTUAL

### 1. **FALTA GESTIÓN DE ESTADOS**
- Las acciones no cambian comportamiento según su estado
- Los 4 botones siempre iguales (no dinámicos)

### 2. **SEGUIMIENTO CONFUSO** 
- ¿Para qué sirve realmente?
- ¿Crea nuevas tareas o solo registra progreso?

### 3. **AGENDA DESCONECTADA**
- Botón "Ir a Agenda" no tiene propósito claro
- ¿Qué debe mostrar exactamente?

### 4. **FLUJO INCOMPLETO**
- No hay ciclo de mejora continua
- Faltan conexiones entre secciones

---

## ✅ PROPUESTA DE LÓGICA MEJORADA

### **ESTADO 1: ACCIÓN PENDIENTE**
```
📅 [Azul]  → Programar fecha/hora en agenda
🔒 [Verde] → Planificar: ¿Cómo la voy a hacer?
✅ [Verde] → Ejecutar: Marcar como hecha
🗑️ [Rojo]  → Cancelar: Eliminar acción
```

### **ESTADO 2: ACCIÓN EN PROGRESO** 
```
📅 [Azul]  → Ver cronograma en agenda
🔒 [Verde] → Seguimiento: ¿Cómo va?
✅ [Verde] → Terminar: Marcar completada
🗑️ [Rojo]  → Abandonar: Eliminar acción
```

### **ESTADO 3: ACCIÓN COMPLETADA**
```
📅 [Azul]  → Ver historial en agenda
🔒 [Verde] → Revisar: ¿Qué tal salió?
🔄 [Naranja] → Reactivar: Volver a pendiente
🗑️ [Rojo]  → Archivar: Eliminar registro
```

---

## 🎯 PREGUNTAS PARA DEFINIR LA LÓGICA CORRECTA

1. **¿Las acciones tienen estados claros?** (Pendiente → En Progreso → Completada)
2. **¿El seguimiento debe crear nuevas tareas automáticamente?**
3. **¿Qué debe pasar cuando presiono "Ir a Agenda"?**
4. **¿Los 4 botones deben cambiar según el estado?**
5. **¿Falta algún estado o acción intermedia?**

---

## 💡 SIGUIENTE PASO

**GUS, por favor revisa este diagrama y dime:**
- ¿Qué parte de la lógica actual no te cuadra?
- ¿Cuál debería ser el flujo correcto según tu visión?
- ¿Los estados propuestos tienen sentido?
- ¿Qué está faltando o sobrando?

**¡Vamos a diseñar la lógica perfecta antes de implementar! 🚀**