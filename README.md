# Calendarios — Prototipo (Agendamiento por WhatsApp)

Prototipo funcional en React + Tailwind del FRD
["Agendamiento por WhatsApp"](https://www.figma.com/design/Z6crdy6qNgAKhF8jxWMbGT/Calendarios?node-id=1-3)
en Figma, usando los tokens y patrones del **Web Library** (Design System de Atom).

## Qué incluye

Las 3 secciones del FRD comparten un mismo shell (`src/components/SettingsShell.tsx`):
riel de iconos + panel "Configuraciones" con acordeón, tal como viene definido en el
componente `❖ atom-sidebar-complete` del Design System (frame de referencia:
[Tipos de cita](https://www.figma.com/design/Z6crdy6qNgAKhF8jxWMbGT/Calendarios?node-id=9102-71311)).
Cada página sigue el mismo patrón de encabezado + toolbar (buscador que se expande,
chip "Filtros", botón primario) + tabla con `AtomTag` para los estados.

- **Tipos de cita** (`/tipos-de-cita`): tabla con Nombre, Duración, Grupos y Estado
  (Borrador/Publicado/Activa/Inactiva). Botón "Crear tipo de cita" abre el asistente de
  creación en pantalla completa (`/tipos-de-cita/crear`,
  [frame de Figma](https://www.figma.com/design/Z6crdy6qNgAKhF8jxWMbGT/Calendarios?node-id=9102-70224)):
  stepper de 4 pasos (Tipo de cita → Horarios → Límites → Flujo de WhatsApp). El paso 1
  ("Tipo de cita") está implementado fiel al diseño: tarjetas "Tipo de cita" (nombre,
  descripción, duración) y "Asignación" (canal, grupo, método de asignación manual/
  automática). El paso 2 ("Horarios",
  [frame de Figma](https://www.figma.com/design/Z6crdy6qNgAKhF8jxWMbGT/Calendarios?node-id=9070-8381))
  también está implementado: tarjetas "Zona horaria" (selector), "Horario semanal"
  (por día: activar/desactivar, agregar o quitar rangos horarios, resumen de días
  activos y horas semanales, botón "Copiar de Lunes") y "Excepciones" (lista de fechas
  puntuales con opción de agregar/quitar). Ese frame vive en un canvas distinto
  ("FRD - Mejoras UX › Propuesta 1") que usa un header de stepper diferente (barra de
  progreso + selector de HU); se mantuvo el header/stepper de círculos numerados ya
  construido en el paso 1 por consistencia dentro del wizard, y solo se tomó el
  contenido de las tarjetas de ese frame. Los pasos 3 y 4 todavía no tienen frame
  conectado — quedan como tarjetas placeholder dentro del mismo stepper.
- **Calendarios** (`/calendarios`): tabla de usuarios con calendario habilitado
  (buscador, filtros, estado Activo/Inactivo). Incluye:
  - Wizard funcional **"Crear usuario externo"** de 4 pasos (Identificación →
    Disponibilidad → Zona horaria → Excepciones) — al completarlo agrega el
    calendario a la tabla.
  - Diálogo **"Ver disponibilidad"** con la vista semanal de horarios, al hacer
    click en el nombre de un usuario o desde el menú de acciones de la fila.
- **Citas agendadas** (`/citas-agendadas`): historial de citas (Contacto, Teléfono,
  Tipo de cita, Fecha y hora, Calendario, Estado). No hay un frame de Figma propio
  para esta pantalla todavía — se construyó siguiendo el mismo patrón visual que las
  otras dos, con datos mock.

Todos los datos son mock (`src/data/`) — no hay backend ni persistencia real; es un
prototipo de interacción/UI para validar los flujos antes de pasar a desarrollo.

## Pendiente (backlog, no implementado en este prototipo)

- Dentro de Calendarios: integración con Genesys (mapeo de agentes) y el diálogo de
  "cambios sin guardar".
- Dentro de Tipos de cita: los pasos 3 y 4 del wizard de creación (Límites, Flujo de
  WhatsApp) y el flujo de edición de un tipo de cita existente.
- Citas agendadas: no tiene frame propio en Figma aún — cuando exista, reemplazar los
  datos mock por el diseño real con el mismo flujo de `get_design_context`.

Para sumar cualquiera de estas, se puede volver a usar el MCP de Figma
(`get_design_context` sobre el nodeId del frame correspondiente) y seguir el mismo
patrón de componentes en `src/ui/` y `src/components/`.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (tokens del Design System declarados en `src/index.css` vía `@theme`)
- react-router-dom (navegación entre las 3 secciones del FRD)
- lucide-react (iconografía — sustituye los glifos de Font Awesome Pro del archivo de
  Figma, que requieren licencia)

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Estructura

```
src/
  ui/            Componentes base del Design System (AtomButton, AtomDialog, AtomTag, AtomTextField, ...)
  components/    SettingsShell (shell compartido) y los diálogos del flujo de Calendarios
  pages/         Una página por sección del FRD
  data/          Datos mock
```
