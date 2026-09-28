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
  (Borrador/Publicado/Activa/Inactiva). Botón "Crear tipo de cita" abre un diálogo
  placeholder — ese flujo de creación todavía no está diseñado en Figma.
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
- Dentro de Tipos de cita: el flujo de creación/edición de un tipo de cita (wizard).
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
