# Calendarios — Prototipo (Agendamiento por WhatsApp)

Prototipo funcional en React + Tailwind del flujo **Calendarios** dentro del FRD
["Agendamiento por WhatsApp"](https://www.figma.com/design/Z6crdy6qNgAKhF8jxWMbGT/Calendarios?node-id=1-3)
en Figma, usando los tokens y patrones del **Web Library** (Design System de Atom).

## Qué incluye

- **Shell de la app**: sidebar de navegación + header, replicando la estructura de Atom.
- **Pantalla "Calendarios"**: tabla de usuarios con calendario habilitado (buscador, filtros,
  paginación, estado Activo/Inactivo), fiel al frame `configuraciones-citas_calendarios`.
- **Wizard "Crear usuario externo"**: diálogo de 4 pasos (Identificación → Disponibilidad →
  Zona horaria → Excepciones), funcional — al completarlo agrega el calendario a la tabla.
- **Diálogo "Ver disponibilidad"**: vista semanal de horarios disponibles por día, al hacer
  click en el nombre de un usuario o desde el menú de acciones de la fila.

Los datos son mock (`src/data/calendarios.ts`) — no hay backend ni persistencia real; es
un prototipo de interacción/UI para validar el flujo antes de pasar a desarrollo.

## Pendiente (backlog, no implementado en este prototipo)

El archivo de Figma tiene 3 secciones FRD; este prototipo cubre solo **Calendarios**.
Quedan pendientes, con rutas ya creadas como placeholder en el nav lateral:

- **Tipos de evento** (`/tipos-de-evento`): identificación, disponibilidad one-click,
  límites y flujo de confirmación por WhatsApp.
- **Citas agendadas** (`/citas-agendadas`): listado y detalle de citas ya agendadas.
- Dentro de Calendarios: integración con Genesys (mapeo de agentes) y el diálogo de
  "cambios sin guardar".

Para sumar cualquiera de estas, se puede volver a usar el MCP de Figma
(`get_design_context` sobre el nodeId del frame correspondiente) y seguir el mismo
patrón de componentes en `src/ui/` y `src/components/`.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (tokens del Design System declarados en `src/index.css` vía `@theme`)
- react-router-dom (navegación entre las 3 secciones del FRD)
- lucide-react (iconografía — sustituye los glifos de Font Awesome Pro del archivo de Figma,
  que requieren licencia)

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Estructura

```
src/
  ui/            Componentes base del Design System (AtomButton, AtomDialog, AtomTextField, ...)
  components/    AppShell, Sidebar, Header, y los diálogos del flujo (wizard, disponibilidad)
  pages/         Una página por sección del FRD
  data/          Datos mock
```
