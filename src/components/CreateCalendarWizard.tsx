import { useState } from "react";
import AtomDialog from "../ui/AtomDialog";
import AtomButton from "../ui/AtomButton";
import AtomTextField from "../ui/AtomTextField";
import AtomSelect from "../ui/AtomSelect";
import { Plus, Trash2 } from "lucide-react";
import { gruposDisponibles, zonasHorarias, type Calendario } from "../data/calendarios";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (calendario: Calendario) => void;
}

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const steps = ["Identificación", "Disponibilidad", "Zona horaria", "Excepciones"] as const;
type Step = (typeof steps)[number];

interface Excepcion {
  id: string;
  fecha: string;
  motivo: string;
}

export default function CreateCalendarWizard({ open, onClose, onCreate }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [cargo, setCargo] = useState("");
  const [grupo, setGrupo] = useState(gruposDisponibles[0]);
  const [disponibilidad, setDisponibilidad] = useState<Record<string, boolean>>(
    Object.fromEntries(dias.map((d) => [d, d !== "Sábado" && d !== "Domingo"]))
  );
  const [zona, setZona] = useState(zonasHorarias[0]);
  const [excepciones, setExcepciones] = useState<Excepcion[]>([]);

  const step: Step = steps[stepIndex];

  function reset() {
    setStepIndex(0);
    setNombre("");
    setApellido("");
    setTelefono("");
    setCorreo("");
    setCargo("");
    setGrupo(gruposDisponibles[0]);
    setExcepciones([]);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleContinue() {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }
    onCreate({
      id: crypto.randomUUID(),
      nombre,
      apellido,
      telefono,
      correo,
      cargo,
      grupos: 1,
      tiposEvento: 1,
      estado: "Activo",
    });
    reset();
    onClose();
  }

  function handleBack() {
    if (stepIndex === 0) {
      handleClose();
      return;
    }
    setStepIndex(stepIndex - 1);
  }

  const canContinue =
    step !== "Identificación" || (nombre.trim() && apellido.trim() && telefono.trim() && correo.trim());

  const actions = (
    <>
      <AtomButton variant="secondary" onClick={handleBack}>
        {stepIndex === 0 ? "Cancelar" : "Atrás"}
      </AtomButton>
      <AtomButton variant="primary" disabled={!canContinue} onClick={handleContinue}>
        {stepIndex === steps.length - 1 ? "Crear calendario" : "Continuar"}
      </AtomButton>
    </>
  );

  return (
    <AtomDialog title="Crear calendario" open={open} onClose={handleClose} actions={actions}>
      <div className="flex flex-col gap-4 pb-4">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                  i <= stepIndex ? "bg-ink text-white" : "bg-surface-quaternary text-muted-soft"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-[11px] ${i === stepIndex ? "font-medium text-ink" : "text-muted-soft"}`}>{s}</span>
              {i < steps.length - 1 && <div className="h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>

        {step === "Identificación" && (
          <div className="flex flex-col gap-4">
            <p className="text-base font-medium text-ink">Identificación</p>
            <div className="flex gap-4">
              <AtomTextField label="Nombre" placeholder="Ej. Tom" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <AtomTextField label="Apellido" placeholder="Ej. Chatt" value={apellido} onChange={(e) => setApellido(e.target.value)} />
            </div>
            <div className="flex gap-4">
              <AtomTextField
                label="Teléfono WhatsApp"
                placeholder="Ej. +52211111111"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
              <AtomTextField
                label="Correo electrónico"
                placeholder="Ej. tom@chatt.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <AtomTextField
                label="Cargo en la empresa (opcional)"
                placeholder="Ej. Administrador"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
              />
              <AtomSelect label="Grupos de Atom" value={grupo} onChange={(e) => setGrupo(e.target.value)}>
                {gruposDisponibles.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </AtomSelect>
            </div>
          </div>
        )}

        {step === "Disponibilidad" && (
          <div className="flex flex-col gap-3">
            <p className="text-base font-medium text-ink">Disponibilidad semanal</p>
            <p className="text-xs text-muted-soft">Define los días y horarios en que este calendario puede recibir citas vía WhatsApp.</p>
            <div className="flex flex-col divide-y divide-border-soft rounded-lg border border-border-soft">
              {dias.map((dia) => (
                <div key={dia} className="flex items-center justify-between gap-4 px-3 py-2.5">
                  <label className="flex flex-1 items-center gap-2 text-xs font-medium text-ink-secondary">
                    <input
                      type="checkbox"
                      checked={disponibilidad[dia]}
                      onChange={(e) => setDisponibilidad({ ...disponibilidad, [dia]: e.target.checked })}
                      className="size-3.5 accent-ink"
                    />
                    {dia}
                  </label>
                  {disponibilidad[dia] ? (
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <input type="time" defaultValue="09:00" className="rounded border border-border px-2 py-1 text-xs" />
                      <span>—</span>
                      <input type="time" defaultValue="18:00" className="rounded border border-border px-2 py-1 text-xs" />
                    </div>
                  ) : (
                    <span className="text-[11px] text-muted-soft">No disponible</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === "Zona horaria" && (
          <div className="flex flex-col gap-3">
            <p className="text-base font-medium text-ink">Zona horaria</p>
            <p className="text-xs text-muted-soft">
              Las citas se ofrecerán al contacto según la zona horaria configurada para este calendario.
            </p>
            <AtomSelect label="Zona horaria" value={zona} onChange={(e) => setZona(e.target.value)}>
              {zonasHorarias.map((z) => (
                <option key={z}>{z}</option>
              ))}
            </AtomSelect>
          </div>
        )}

        {step === "Excepciones" && (
          <div className="flex flex-col gap-3">
            <p className="text-base font-medium text-ink">Excepciones</p>
            <p className="text-xs text-muted-soft">
              Agrega fechas puntuales (feriados, vacaciones) en las que este calendario no debe recibir citas.
            </p>
            <div className="flex flex-col gap-2">
              {excepciones.map((exc) => (
                <div key={exc.id} className="flex items-center gap-2 rounded-lg border border-border-soft px-3 py-2">
                  <span className="text-xs font-medium text-ink-secondary">{exc.fecha}</span>
                  <span className="flex-1 text-xs text-muted">{exc.motivo}</span>
                  <button
                    onClick={() => setExcepciones(excepciones.filter((e) => e.id !== exc.id))}
                    className="text-muted-soft hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {excepciones.length === 0 && (
                <p className="rounded-lg border border-dashed border-border-soft px-3 py-4 text-center text-xs text-muted-soft">
                  Sin excepciones agregadas
                </p>
              )}
            </div>
            <button
              onClick={() =>
                setExcepciones([
                  ...excepciones,
                  { id: crypto.randomUUID(), fecha: new Date().toLocaleDateString("es-CL"), motivo: "Feriado" },
                ])
              }
              className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-brand hover:underline"
            >
              <Plus size={14} /> Agregar excepción
            </button>
          </div>
        )}
      </div>
    </AtomDialog>
  );
}
