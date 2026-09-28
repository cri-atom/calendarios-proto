import { useMemo, useState } from "react";
import SettingsShell from "../components/SettingsShell";
import AtomTag from "../ui/AtomTag";
import { citasAgendadasIniciales, type CitaAgendada } from "../data/citasAgendadas";
import { Search, SlidersHorizontal } from "lucide-react";

const tagVariant: Record<CitaAgendada["estado"], "neutral" | "success"> = {
  Confirmada: "success",
  Completada: "success",
  Pendiente: "neutral",
  Cancelada: "neutral",
};

export default function CitasAgendadasPage() {
  const [citas] = useState<CitaAgendada[]>(citasAgendadasIniciales);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtrosActivo, setFiltrosActivo] = useState(false);

  const filtradas = useMemo(
    () => citas.filter((c) => `${c.contacto} ${c.tipoCita} ${c.calendario}`.toLowerCase().includes(query.toLowerCase())),
    [citas, query]
  );

  return (
    <SettingsShell>
      <div className="flex h-full flex-1 flex-col overflow-hidden bg-page">
        <div className="flex flex-col items-start px-4 pb-2 pt-4">
          <h1 className="text-base font-bold text-ink">Citas agendadas</h1>
          <p className="text-xs text-muted-soft">
            Historial de citas agendadas por tus contactos vía WhatsApp.
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
                placeholder="Buscar cita..."
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
        </div>

        <div className="flex flex-1 flex-col overflow-hidden px-4 pb-4">
          <div className="flex flex-1 flex-col overflow-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 bg-white">
                <tr className="text-xs font-bold text-ink-secondary">
                  <th className="border-b border-border px-4 py-3 font-bold">Contacto</th>
                  <th className="w-[150px] border-b border-border px-4 py-3 font-bold">Teléfono</th>
                  <th className="border-b border-border px-4 py-3 font-bold">Tipo de cita</th>
                  <th className="w-[150px] border-b border-border px-4 py-3 font-bold">Fecha y hora</th>
                  <th className="w-[140px] border-b border-border px-4 py-3 font-bold">Calendario</th>
                  <th className="w-[130px] border-b border-border px-4 py-3 font-bold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((c) => (
                  <tr key={c.id} className="text-xs text-ink-secondary hover:bg-surface-subtle">
                    <td className="border-b border-border px-4 py-3 font-medium text-ink">{c.contacto}</td>
                    <td className="border-b border-border px-4 py-3">{c.telefono}</td>
                    <td className="border-b border-border px-4 py-3">{c.tipoCita}</td>
                    <td className="border-b border-border px-4 py-3">{c.fechaHora}</td>
                    <td className="border-b border-border px-4 py-3">{c.calendario}</td>
                    <td className="border-b border-border px-4 py-3">
                      <AtomTag label={c.estado} variant={tagVariant[c.estado]} />
                    </td>
                  </tr>
                ))}
                {filtradas.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-xs text-muted-soft">
                      No se encontraron citas para "{query}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SettingsShell>
  );
}
