import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsShell from "../components/SettingsShell";
import AtomButton from "../ui/AtomButton";
import AtomTag from "../ui/AtomTag";
import { tiposCitaIniciales, type TipoCita } from "../data/tiposCita";
import { Search, SlidersHorizontal, ChevronDown, MoreVertical } from "lucide-react";

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
        <div className="flex flex-col items-start px-4 pb-2 pt-4">
          <h1 className="text-base font-bold text-ink">Tipos de cita</h1>
          <p className="text-xs text-muted-soft">
            Configura los distintos tipos de cita que tus asesores pueden ofrecer.
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

        <div className="flex flex-1 flex-col overflow-hidden px-4 pb-4">
          <div className="flex flex-1 flex-col overflow-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 bg-white">
                <tr className="text-xs font-bold text-ink-secondary">
                  <th className="border-b border-border px-4 py-3 font-bold">Nombre</th>
                  <th className="w-[110px] border-b border-border px-4 py-3 font-bold">Duración</th>
                  <th className="w-[140px] border-b border-border px-4 py-3 font-bold">Grupos</th>
                  <th className="w-[120px] border-b border-border px-4 py-3 font-bold">Estado</th>
                  <th className="w-[60px] border-b border-border px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtrados.map((t) => (
                  <tr key={t.id} className="text-xs text-ink-secondary hover:bg-surface-subtle">
                    <td className="border-b border-border px-4 py-3">{t.nombre}</td>
                    <td className="border-b border-border px-4 py-3">{t.duracion}</td>
                    <td className="border-b border-border px-4 py-3">
                      <button className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-ink hover:bg-surface-muted">
                        {t.grupos} {t.grupos === 1 ? "Grupo" : "Grupos"}
                        <ChevronDown size={14} />
                      </button>
                    </td>
                    <td className="border-b border-border px-4 py-3">
                      <AtomTag label={t.estado} variant={tagVariant[t.estado]} />
                    </td>
                    <td className="relative border-b border-border px-4 py-3">
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
        </div>
      </div>
    </SettingsShell>
  );
}
