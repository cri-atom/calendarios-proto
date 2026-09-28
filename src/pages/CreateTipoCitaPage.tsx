import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SettingsShell from "../components/SettingsShell";
import AtomButton from "../ui/AtomButton";
import AtomTextField from "../ui/AtomTextField";
import AtomSelect from "../ui/AtomSelect";

const steps = ["Tipo de cita", "Horarios", "Límites", "Flujo de WhatsApp"] as const;
type Step = (typeof steps)[number];

type MetodoAsignacion = "manual" | "automatica";

interface FormState {
  nombre: string;
  descripcion: string;
  duracionValor: string;
  duracionUnidad: string;
  canal: string;
  grupo: string;
  metodoAsignacion: MetodoAsignacion;
}

const initialForm: FormState = {
  nombre: "",
  descripcion: "",
  duracionValor: "0",
  duracionUnidad: "minutos",
  canal: "",
  grupo: "",
  metodoAsignacion: "manual",
};

function AtomCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-full max-w-[700px] rounded-lg border border-border bg-white p-6">
      <p className="pb-4 text-base font-medium text-ink">{title}</p>
      {children}
    </div>
  );
}

function AtomRadioOption({
  name,
  checked,
  onChange,
  label,
  hint,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  hint: string;
}) {
  return (
    <label className="flex flex-1 cursor-pointer items-start gap-2">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 size-4 shrink-0 accent-ink"
      />
      <div className="flex flex-col text-xs">
        <span className="font-medium text-ink-secondary">{label}</span>
        <span className="text-muted">{hint}</span>
      </div>
    </label>
  );
}

export default function CreateTipoCitaPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("Tipo de cita");
  const [form, setForm] = useState<FormState>(initialForm);

  const stepIndex = steps.indexOf(step);

  const canContinue = useMemo(() => {
    if (step === "Tipo de cita") return form.nombre.trim().length > 0;
    return true;
  }, [step, form.nombre]);

  const goToList = () => navigate("/tipos-de-cita");

  const handleBack = () => {
    if (stepIndex === 0) {
      goToList();
      return;
    }
    setStep(steps[stepIndex - 1]);
  };

  const handleContinue = () => {
    if (stepIndex === steps.length - 1) {
      goToList();
      return;
    }
    setStep(steps[stepIndex + 1]);
  };

  return (
    <SettingsShell>
      <div className="flex h-full flex-1 flex-col overflow-hidden bg-page">
        <div className="flex items-center gap-2 px-4 pb-2 pt-4">
          <button
            onClick={goToList}
            aria-label="Volver"
            className="flex size-6 items-center justify-center rounded-lg text-ink hover:bg-surface-muted"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-base font-bold text-ink">Crear tipo de cita</h1>
        </div>

        <div className="flex h-[60px] shrink-0 items-center px-4 py-2">
          <div className="flex flex-1 items-center">
            {steps.map((s, i) => {
              const active = i === stepIndex;
              return (
                <div
                  key={s}
                  className={`flex h-11 items-center gap-1 border-b-4 px-2 pb-3 pt-2 ${
                    i === 0 ? "shrink-0" : "flex-1 justify-end"
                  } ${active ? "border-[#ff9d5b]" : "border-border"}`}
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      active ? "bg-brand text-white" : "border-2 border-border-soft bg-surface-subtle text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`whitespace-nowrap text-xs ${active ? "font-bold text-ink" : "text-muted"}`}>
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-4 overflow-y-auto py-4">
          {step === "Tipo de cita" && (
            <>
              <AtomCard title="Tipo de cita">
                <div className="flex flex-col gap-4">
                  <AtomTextField
                    label="Nombre"
                    placeholder="Ej. Visita Local A"
                    maxLength={100}
                    value={form.nombre}
                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                    hint={`${form.nombre.length}/100`}
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-ink-secondary">Descripción (opcional)</label>
                    <textarea
                      value={form.descripcion}
                      onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                      placeholder="Ej. Sesión de 30 minutos"
                      maxLength={500}
                      rows={3}
                      className="w-full resize-none rounded-lg border border-border bg-white px-3 py-3 text-xs text-muted placeholder:text-muted-soft outline-none focus:border-ink focus:ring-1 focus:ring-ink"
                    />
                    <span className="self-end text-[11px] text-muted-soft">{form.descripcion.length}/500</span>
                  </div>
                  <div className="flex items-end gap-4">
                    <AtomTextField
                      label="Duración"
                      type="number"
                      min={0}
                      value={form.duracionValor}
                      onChange={(e) => setForm((f) => ({ ...f, duracionValor: e.target.value }))}
                    />
                    <AtomSelect
                      value={form.duracionUnidad}
                      onChange={(e) => setForm((f) => ({ ...f, duracionUnidad: e.target.value }))}
                    >
                      <option value="minutos">minutos (m)</option>
                      <option value="horas">horas (h)</option>
                    </AtomSelect>
                  </div>
                </div>
              </AtomCard>

              <AtomCard title="Asignación">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <AtomSelect
                      label="Canal"
                      value={form.canal}
                      onChange={(e) => setForm((f) => ({ ...f, canal: e.target.value }))}
                    >
                      <option value="">Selecciona un número o canal</option>
                      <option value="whatsapp-1">WhatsApp Principal</option>
                      <option value="whatsapp-2">WhatsApp Ventas</option>
                    </AtomSelect>
                    <AtomSelect
                      label="Grupos"
                      value={form.grupo}
                      onChange={(e) => setForm((f) => ({ ...f, grupo: e.target.value }))}
                    >
                      <option value="">Selecciona un grupo</option>
                      <option value="ventas">Ventas</option>
                      <option value="soporte">Soporte</option>
                    </AtomSelect>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-ink-secondary">Método de asignación de citas</span>
                    <div className="flex gap-4">
                      <AtomRadioOption
                        name="metodoAsignacion"
                        checked={form.metodoAsignacion === "manual"}
                        onChange={() => setForm((f) => ({ ...f, metodoAsignacion: "manual" }))}
                        label="Selección manual"
                        hint="El contacto puede seleccionar al agente."
                      />
                      <AtomRadioOption
                        name="metodoAsignacion"
                        checked={form.metodoAsignacion === "automatica"}
                        onChange={() => setForm((f) => ({ ...f, metodoAsignacion: "automatica" }))}
                        label="Selección automática"
                        hint="Las citas se agendan según la disponibilidad."
                      />
                    </div>
                  </div>
                </div>
              </AtomCard>
            </>
          )}

          {step !== "Tipo de cita" && (
            <AtomCard title={step}>
              <p className="text-xs text-muted-soft">
                Este paso todavía no fue diseñado en Figma — la navegación del asistente queda lista para
                conectarse en cuanto exista ese frame.
              </p>
            </AtomCard>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-page p-4">
          <AtomButton variant="secondary" onClick={handleBack}>
            {stepIndex === 0 ? "Cancelar" : "Atrás"}
          </AtomButton>
          <AtomButton variant="primary" disabled={!canContinue} onClick={handleContinue}>
            {stepIndex === steps.length - 1 ? "Crear tipo de cita" : "Continuar"}
          </AtomButton>
        </div>
      </div>
    </SettingsShell>
  );
}
