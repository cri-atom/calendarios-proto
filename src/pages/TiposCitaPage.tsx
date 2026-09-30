import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsShell from "../components/SettingsShell";
import AtomButton from "../ui/AtomButton";
import AtomTag from "../ui/AtomTag";
import { tiposCitaIniciales, type TipoCita } from "../data/tiposCita";
import { Search, SlidersHorizontal, ChevronDown, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import AtomIconButton from "../ui/AtomIconButton";
import AtomSelect from "../ui/AtomSelect";

const tagVariant: Record<TipoCita["estado"], "neutral" | "success"> = {
  Borrador: "neutral",
  Publicado: "success",
  Activa: "success",
  Inactiva: "neutral",
};

export default function TiposCitaPage() {
  const navigate = useNavigate();
  const [tipos] = useState<TipoCita[]>(tiposCitaIniciales);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtrosActivo, setFiltrosActivo] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);

  const filtrados = useMemo(
    () => tipos.filter((t) => t.nombre.toLowerCase().includes(query.toLowerCase())),
    [tipos, query]
  );

  return (
    <SettingsShell>
      <div className="flex h-full flex-1 flex-col overflow-hidden bg-page">
        {/* ❖ atom- section-heading */}
        <div className="flex flex-col items-start px-4 pb-2 pt-4">
          <h1 className="text-base font-bold text-ink">Tipos de cita</h1>
          <p className="text-xs text-muted-soft">
            Configura los distintos tipos de cita que tus asesores pueden ofrecer.
          </p>
        </div>

        {/* ❖ atom-toolbar */}
        <div className="flex items-start justify-between gap-2 p-4">
          <div className="flex items-start gap-2">
            {searchOpen ? (
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => !query && setSearchOpen(false)}
                placeholder="Buscar tipo de cita..."
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
          <AtomButton variant="primary" onClick={() => navigate("/tipos-de-cita/crear")}>
            Crear tipo de cita
          </AtomButton>
        </div>

        {/* ❖ atom-data-table: tabla + paginación */}
        <div className="flex flex-1 flex-col overflow-hidden px-4 pb-4">
          <div className="flex-1 overflow-auto rounded-lg border border-border bg-white">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 bg-white">
                <tr className="text-xs font-bold text-ink-secondary">
                  <th className="h-12 border-b-[0.5px] border-border px-4 py-2 font-bold">Nombre</th>
                  <th className="w-[108px] h-12 border-b-[0.5px] border-border px-4 py-2 font-bold">Duración</th>
                  <th className="w-[180px] h-12 border-b-[0.5px] border-border px-4 py-2 font-bold">Grupos</th>
                  <th className="w-[105px] h-12 border-b-[0.5px] border-border px-4 py-2 font-bold">Estado</th>
                  <th className="w-[87px] h-12 border-b-[0.5px] border-border px-4 py-2 font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((t) => (
                  <tr key={t.id} className="text-xs text-ink-secondary hover:bg-surface-subtle">
                    <td className="h-12 border-b-[0.5px] border-border px-4 py-2">{t.nombre}</td>
                    <td className="h-12 border-b-[0.5px] border-border px-4 py-2">{t.duracion}</td>
                    <td className="h-12 border-b-[0.5px] border-border px-4 py-2">
                      <button className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-ink hover:bg-surface-muted">
                        {t.grupos} {t.grupos === 1 ? "Grupo" : "Grupos"}
                        <ChevronDown size={14} />
                      </button>
                    </td>
                    <td className="h-12 border-b-[0.5px] border-border px-4 py-2">
                      <AtomTag label={t.estado} variant={tagVariant[t.estado]} filled={false} />
                    </td>
                    <td className="relative h-12 border-b-[0.5px] border-border px-4 py-2">
                      <button
                        onClick={() => setMenuAbierto(menuAbierto === t.id ? null : t.id)}
                        className="rounded p-1.5 text-ink hover:bg-surface-muted"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {menuAbierto === t.id && (
                        <div className="absolute right-4 top-10 z-10 w-40 overflow-hidden rounded-lg border border-border bg-white py-1 shadow-lg">
                          <button className="block w-full px-3 py-2 text-left text-xs text-ink-secondary hover:bg-surface-subtle">
                            Editar
                          </button>
                          <button className="block w-full px-3 py-2 text-left text-xs text-ink-secondary hover:bg-surface-subtle">
                            Duplicar
                          </button>
                          <button className="block w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50">
                            Archivar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ❖ atom-pagination */}
          <div className="flex shrink-0 items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink">Registros por página</span>
              <AtomSelect value="10" onChange={() => {}} className="!w-16">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </AtomSelect>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink">
              <span>
                {filtrados.length === 0 ? 0 : 1}–{Math.min(10, filtrados.length)} de {filtrados.length} registros
              </span>
              <span className="h-4 w-px bg-border" aria-hidden="true" />
              <span>Página 1 de {Math.max(1, Math.ceil(filtrados.length / 10))}</span>
            </div>
            <div className="flex items-center gap-1">
              <AtomIconButton icon={<ChevronLeft size={16} />} label="Página anterior" disabled />
              <AtomIconButton
                icon={<ChevronRight size={16} />}
                label="Página siguiente"
                disabled={filtrados.length <= 10}
              />
            </div>
          </div>
        </div>
      </div>
    </SettingsShell>
  );
}
