import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import AtomBrandButton from "../ui/AtomBrandButton";
import AtomToolbarFilter from "../ui/AtomToolbarFilter";
import AtomBadge from "../ui/AtomBadge";
import CreateCalendarWizard from "../components/CreateCalendarWizard";
import AvailabilityDialog from "../components/AvailabilityDialog";
import { calendariosIniciales, type Calendario } from "../data/calendarios";
import {
  Search,
  SlidersHorizontal,
  Shapes,
  Users2,
  Plus,
  MoreVertical,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Inbox,
} from "lucide-react";

export default function CalendariosPage() {
  const [calendarios, setCalendarios] = useState<Calendario[]>(calendariosIniciales);
  const [query, setQuery] = useState("");
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
    <AppShell>
      <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-[0_6px_14px_0_rgba(46,33,74,0.08)]">
        <div className="flex flex-col gap-1 px-4 pb-2 pt-4">
          <h1 className="text-base font-bold text-ink">Calendarios</h1>
          <p className="text-xs text-muted-soft">
            Usuarios con calendario habilitado que pueden recibir citas agendadas vía WhatsApp
          </p>
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex h-8 items-center gap-2">
            <div className="flex h-full w-[180px] items-center justify-between rounded border border-border px-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full bg-transparent text-xs text-ink-secondary outline-none placeholder:text-muted-soft"
              />
              <Search size={14} className="text-muted" />
            </div>
            <AtomToolbarFilter icon={<SlidersHorizontal size={14} />} label="Todos los estados" />
            <AtomToolbarFilter icon={<Shapes size={14} />} label="Todos los tipos" />
            <AtomToolbarFilter icon={<Users2 size={14} />} label="Todos los grupos" />
          </div>
          <AtomBrandButton icon={<Plus size={14} />} onClick={() => setWizardOpen(true)}>
            Crear usuario externo
          </AtomBrandButton>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden px-4">
          <div className="flex flex-1 flex-col overflow-auto rounded-lg border border-border-soft">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 bg-table-header">
                <tr className="border-b border-border-soft text-xs font-medium text-ink-secondary">
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="w-[150px] px-4 py-3 font-medium">Teléfono</th>
                  <th className="w-[200px] px-4 py-3 font-medium">Correo</th>
                  <th className="w-[100px] px-4 py-3 font-medium">Grupos</th>
                  <th className="w-[130px] px-4 py-3 font-medium">Tipos de evento</th>
                  <th className="w-[110px] px-4 py-3 font-medium">Estado</th>
                  <th className="w-[48px] px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtrados.map((c) => (
                  <tr key={c.id} className="border-b border-border-soft text-xs text-ink-secondary last:border-0 hover:bg-surface-subtle">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setViendoDisponibilidad(c)}
                        className="font-medium text-ink hover:text-brand hover:underline"
                      >
                        {c.nombre} {c.apellido}
                      </button>
                    </td>
                    <td className="px-4 py-3">{c.telefono}</td>
                    <td className="px-4 py-3">{c.correo}</td>
                    <td className="px-4 py-3">{c.grupos} grupo{c.grupos !== 1 ? "s" : ""}</td>
                    <td className="px-4 py-3">{c.tiposEvento} tipo{c.tiposEvento !== 1 ? "s" : ""}</td>
                    <td className="px-4 py-3">
                      <AtomBadge status={c.estado} />
                    </td>
                    <td className="relative px-4 py-3">
                      <button
                        onClick={() => setMenuAbierto(menuAbierto === c.id ? null : c.id)}
                        className="rounded p-1 text-muted hover:bg-surface-muted"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {menuAbierto === c.id && (
                        <div className="absolute right-4 top-9 z-10 w-44 overflow-hidden rounded-lg border border-border bg-white py-1 shadow-lg">
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
                    <td colSpan={7} className="py-16">
                      <div className="flex flex-col items-center gap-4">
                        <div className="rounded-lg bg-surface-quaternary p-3 text-ink-secondary">
                          <Inbox size={24} />
                        </div>
                        <div className="flex flex-col items-center gap-2 text-center">
                          <p className="text-base font-medium text-ink">Aún no hay registros</p>
                          <p className="text-sm text-muted-soft">Todavía no hay información disponible.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-8 border-t border-border-soft py-2">
            <div className="flex items-center gap-4 text-xs text-[#2b2b2b]">
              <span>Registros por página</span>
              <select className="rounded border border-border px-2 py-1.5 text-xs" defaultValue={10}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-8 text-xs text-[#2b2b2b]">
              <span>
                1-{filtrados.length} de {filtrados.length} items
              </span>
              <div className="flex items-center gap-4 text-muted">
                <ChevronsLeft size={18} />
                <ChevronLeft size={18} />
                <ChevronRight size={18} />
                <ChevronsRight size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateCalendarWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onCreate={(nuevo) => setCalendarios((prev) => [nuevo, ...prev])}
      />
      <AvailabilityDialog calendario={viendoDisponibilidad} onClose={() => setViendoDisponibilidad(null)} />
    </AppShell>
  );
}
