import { useMemo, useState } from "react";
import SettingsShell from "../components/SettingsShell";
import AtomButton from "../ui/AtomButton";
import AtomTag from "../ui/AtomTag";
import CreateCalendarWizard from "../components/CreateCalendarWizard";
import AvailabilityDialog from "../components/AvailabilityDialog";
import { calendariosIniciales, type Calendario } from "../data/calendarios";
import { Search, SlidersHorizontal, ChevronDown, MoreVertical } from "lucide-react";

export default function CalendariosPage() {
  const [calendarios, setCalendarios] = useState<Calendario[]>(calendariosIniciales);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtrosActivo, setFiltrosActivo] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [viendoDisponibilidad, setViendoDisponibilidad] = useState<Calendario | null>(null);
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);

  const filtrados = useMemo(
    () =>
      calendarios.filter((c) =>
        `${c.nombre} ${c.apellido} ${c.correo}`.toLowerCase().includes(query.toLowerCase())
      ),
    [calendarios, query]
  );

  function toggleEstado(id: string) {
    setCalendarios((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado: c.estado === "Activo" ? "Inactivo" : "Activo" } : c))
    );
    setMenuAbierto(null);
  }

  return (
    <SettingsShell>
      <div className="flex h-full flex-1 flex-col overflow-hidden bg-page">
        <div className="flex flex-col items-start px-4 pb-2 pt-4">
          <h1 className="text-base font-bold text-ink">Calendarios</h1>
          <p className="text-xs text-muted-soft">
            Usuarios con calendario habilitado que pueden recibir citas agendadas vía WhatsApp.
          </p>
        </div>

        <div className="flex items-start justify-between gap-2 p-4">
          <div className="flex items-start gap-2">
            {searchOpen ? (
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => !query && setSearchOpen(false)}
                placeholder="Buscar calendario..."
                className="h-8 w-56 rounded-lg border border-border bg-white px-3 text-xs text-ink-secondary outline-none focus:border-ink"
              />
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-white text-ink hover:bg-surface-subtle"
                aria-label="Buscar"
              >
                <Search size={14} />
              </button>
            )}
            <button
              onClick={() => setFiltrosActivo(!filtrosActivo)}
              className={`inline-flex max-w-[240px] items-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium ${
                filtrosActivo ? "border-ink bg-surface-muted text-ink" : "border-border bg-white text-muted"
              }`}
            >
              <SlidersHorizontal size={14} />
              Filtros
            </button>
          </div>
          <AtomButton variant="primary" onClick={() => setWizardOpen(true)}>
            Crear usuario externo
          </AtomButton>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden px-4 pb-4">
          <div className="flex flex-1 flex-col overflow-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 bg-white">
                <tr className="text-xs font-bold text-ink-secondary">
                  <th className="border-b border-border px-4 py-3 font-bold">Nombre</th>
                  <th className="w-[150px] border-b border-border px-4 py-3 font-bold">Teléfono</th>
                  <th className="w-[200px] border-b border-border px-4 py-3 font-bold">Correo</th>
                  <th className="w-[130px] border-b border-border px-4 py-3 font-bold">Grupos</th>
                  <th className="w-[130px] border-b border-border px-4 py-3 font-bold">Tipos de cita</th>
                  <th className="w-[120px] border-b border-border px-4 py-3 font-bold">Estado</th>
                  <th className="w-[60px] border-b border-border px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtrados.map((c) => (
                  <tr key={c.id} className="text-xs text-ink-secondary hover:bg-surface-subtle">
                    <td className="border-b border-border px-4 py-3">
                      <button
                        onClick={() => setViendoDisponibilidad(c)}
                        className="font-medium text-ink hover:text-brand hover:underline"
                      >
                        {c.nombre} {c.apellido}
                      </button>
                    </td>
                    <td className="border-b border-border px-4 py-3">{c.telefono}</td>
                    <td className="border-b border-border px-4 py-3">{c.correo}</td>
                    <td className="border-b border-border px-4 py-3">
                      <button className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-ink hover:bg-surface-muted">
                        {c.grupos} {c.grupos === 1 ? "Grupo" : "Grupos"}
                        <ChevronDown size={14} />
                      </button>
                    </td>
                    <td className="border-b border-border px-4 py-3">
                      {c.tiposEvento} {c.tiposEvento === 1 ? "tipo" : "tipos"}
                    </td>
                    <td className="border-b border-border px-4 py-3">
                      <AtomTag label={c.estado} variant={c.estado === "Activo" ? "success" : "neutral"} />
                    </td>
                    <td className="relative border-b border-border px-4 py-3">
                      <button
                        onClick={() => setMenuAbierto(menuAbierto === c.id ? null : c.id)}
                        className="rounded p-1.5 text-ink hover:bg-surface-muted"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {menuAbierto === c.id && (
                        <div className="absolute right-4 top-10 z-10 w-44 overflow-hidden rounded-lg border border-border bg-white py-1 shadow-lg">
                          <button
                            onClick={() => {
                              setViendoDisponibilidad(c);
                              setMenuAbierto(null);
                            }}
                            className="block w-full px-3 py-2 text-left text-xs text-ink-secondary hover:bg-surface-subtle"
                          >
                            Ver disponibilidad
                          </button>
                          <button
                            onClick={() => toggleEstado(c.id)}
                            className="block w-full px-3 py-2 text-left text-xs text-ink-secondary hover:bg-surface-subtle"
                          >
                            {c.estado === "Activo" ? "Desactivar" : "Activar"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-xs text-muted-soft">
                      No se encontraron calendarios para "{query}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CreateCalendarWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onCreate={(nuevo) => setCalendarios((prev) => [nuevo, ...prev])}
      />
      <AvailabilityDialog calendario={viendoDisponibilidad} onClose={() => setViendoDisponibilidad(null)} />
    </SettingsShell>
  );
}
