# Calendarios — Prototipo (Agendamiento por WhatsApp)

Prototipo funcional en React + Tailwind del FRD
["Agendamiento por WhatsApp"](https://www.figma.com/design/Z6crdy6qNgAKhF8jxWMbGT/Calendarios?node-id=1-3)
en Figma, usando los tokens y patrones del **Web Library** (Design System de Atom).

## Qué incluye

Las 3 secciones del FRD comparten un mismo shell (`src/components/SettingsShell.tsx`),
reconstruido a partir del sidebar completo real de AtomChat que aparece en la sección
"Migración a DS" del canvas
[FRD - Mejoras UX](https://www.figma.com/design/Z6crdy6qNgAKhF8jxWMbGT/Calendarios?node-id=9070-8382)
(frame `configuraciones-citas`, id 9072:16611): riel de íconos de 64px (logo, íconos de
navegación general sin ruteo real, cluster inferior con buscador/notificaciones/avatar/
ayuda) + panel de 216px con los 9 grupos de nivel superior del producto (Plataforma,
Mensajería, Conversaciones, Magia de Atom, Gestión usuarios, Reportes, Mi Empresa,
Gestor de recursos, Citas) cada uno con su ícono; solo "Citas" está expandido y enlaza
a las 3 páginas del prototipo (los demás grupos son decorativos, sin contenido en este
prototipo). El ítem activo se resalta con fondo blanco y texto naranja, igual que en el
frame. Cada página sigue el mismo patrón de encabezado + toolbar (buscador que se
expande, chip "Filtros", botón primario) + tabla con `AtomTag` para los estados.

- **Tipos de cita** (`/tipos-de-cita`): tabla con Nombre, Duración, Grupos y Estado
  (Borrador/Publicado/Activa/Inactiva) y barra de paginación ("Registros por página",
  contador de registros y controles anterior/siguiente), igual que el frame
  `configuraciones-citas` de "Migración a DS" mencionado arriba. Botón "Crear tipo de
  cita" abre el asistente de
  creación en pantalla completa (`/tipos-de-cita/crear`), con 4 pasos (Tipo de cita →
  Horarios → Límites → Flujo de WhatsApp). El encabezado del wizard sigue el diseño del
  canvas "FRD - Mejoras UX › Propuesta 1" (frame de referencia para Horarios y Límites,
  [Figma](https://www.figma.com/design/Z6crdy6qNgAKhF8jxWMbGT/Calendarios?node-id=9070-8381)):
  título + subtítulo, "Paso X de 4" con barra de progreso y fila con los 4 labels de
  pasos (el activo resaltado en naranja). No se replicó la fila superior con el
  selector "1 - Unificar el tratamiento al cliente" (+ botones para agregar/quitar
  HU): es un control de autoría del FRD para navegar entre propuestas dentro de
  Figma, no un elemento de la interfaz del producto. El footer también sigue ese
  diseño: "Atrás" a la izquierda y "Guardar borrador" + "Continuar" (con ícono de
  flecha) agrupados a la derecha.
  El paso 1 ("Tipo de cita",
  [frame de Figma](https://www.figma.com/design/Z6crdy6qNgAKhF8jxWMbGT/Calendarios?node-id=9102-70224))
  está implementado fiel al diseño de esa tarjeta: "Tipo de cita" (nombre, descripción,
  duración) y "Asignación" (canal, grupo, método de asignación manual/automática). El
  paso 2 ("Horarios",
  [frame de Figma](https://www.figma.com/design/Z6crdy6qNgAKhF8jxWMbGT/Calendarios?node-id=9070-8381))
  también está implementado: tarjetas "Zona horaria" (selector), "Horario semanal"
  (por día: activar/desactivar con `❖ atom-checkbox` vía `src/ui/AtomCheckbox.tsx`,
  agregar o quitar rangos horarios, resumen de días activos y horas semanales, botón
  "Copiar de otro tipo") y "Excepciones" (lista de fechas puntuales con opción de
  agregar/quitar). El paso 3 ("Límites", mismo frame de Figma) también está
  implementado: tarjeta "Límites de reserva" con 5 reglas activables/desactivables
  (`AtomToggle`) — "Tiempo entre citas" (preparación antes/después), "Anticipación
  mínima", "Cupos por horario", "Máximo de citas activas por persona" y "Ventana
  futura" — cada una revela su(s) selector(es) o campo numérico solo cuando está
  activa. El paso 4 todavía no tiene frame conectado — queda como tarjeta placeholder
  dentro del mismo wizard.
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
