import { useState } from "react";
import AtomDialog from "../ui/AtomDialog";
import AtomButton from "../ui/AtomButton";
import AtomIconButton from "../ui/AtomIconButton";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Moon } from "lucide-react";
import type { Calendario } from "../data/calendarios";

interface Props {
  calendario: Calendario | null;
  onClose: () => void;
}

const semana = [
  { dia: "Lun 1", slots: ["9:00 - 12:00", "2:00 - 4:00", "4:30 - 6:00"] },
  { dia: "Mar 2", slots: ["9:00 AM - 1:00 PM", "2:00 PM - 5:00 PM"] },
  { dia: "Mié 3", slots: ["9:00 AM - 11:00 AM", "2:00 PM - 5:00 PM"] },
  { dia: "Jue 4", slots: ["9:00 AM - 1:00 PM", "2:00 PM - 3:00 PM", "3:30 PM - 5:00 PM"] },
  { dia: "Vie 5", slots: ["9:00 AM - 1:00 PM", "2:00 AM - 4:00 PM"] },
  { dia: "Sáb 6", slots: [] },
  { dia: "Dom 7", slots: [] },
];

export default function AvailabilityDialog({ calendario, onClose }: Props) {
  const [vista, setVista] = useState<"Semana" | "Mes">("Semana");
  if (!calendario) return null;

  return (
    <AtomDialog
      title={`Calendario de ${calendario.nombre} ${calendario.apellido}`}
      open={!!calendario}
      onClose={onClose}
      width={960}
      actions={
        <AtomButton variant="secondary" onClick={onClose}>
          Cerrar
        </AtomButton>
      }
    >
      <div className="flex flex-col gap-2 pb-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <span className="rounded-lg px-2 py-1 text-xs font-medium text-ink">Semana del 1 al 7</span>
            <div className="flex items-center gap-0.5">
              <AtomIconButton icon={<ChevronsLeft size={14} />} label="Primera semana" />
              <AtomIconButton icon={<ChevronLeft size={14} />} label="Semana anterior" />
              <AtomIconButton icon={<ChevronRight size={14} />} label="Semana siguiente" />
              <AtomIconButton icon={<ChevronsRight size={14} />} label="Última semana" />
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-[#71717b] bg-[#fafafa] p-1">
            {(["Semana", "Mes"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVista(v)}
                className={`rounded-lg px-2 py-1 text-xs ${
                  v === vista ? "bg-white font-medium text-ink shadow-sm" : "text-muted"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-7 divide-x divide-border rounded-lg border border-border">
          {semana.map((col) => (
            <div key={col.dia} className="flex flex-col p-2">
              <span className="mb-1 text-center text-xs font-medium text-muted-soft">{col.dia}</span>
              {col.slots.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {col.slots.map((s) => (
                    <div key={s} className="rounded-md bg-white py-1.5 text-center text-[11px] font-medium text-muted">
                      {s}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 rounded-md bg-surface-muted py-2 text-[11px] font-medium text-muted-soft">
                  <Moon size={12} /> No disponible
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AtomDialog>
  );
}
