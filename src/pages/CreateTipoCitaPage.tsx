import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import SettingsShell from "../components/SettingsShell";
import AtomButton from "../ui/AtomButton";
import AtomTextField from "../ui/AtomTextField";
import AtomSelect from "../ui/AtomSelect";
import AtomToggle from "../ui/AtomToggle";
import { zonasHorarias } from "../data/calendarios";

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

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;
type DiaSemana = (typeof diasSemana)[number];

interface RangoHorario {
  id: string;
  inicio: string;
  fin: string;
}

interface DiaHorario {
  activo: boolean;
  rangos: RangoHorario[];
}

type HorarioSemanal = Record<DiaSemana, DiaHorario>;

const horarioInicial: HorarioSemanal = {
  Lunes: {
    activo: true,
    rangos: [
      { id: "lun-1", inicio: "09:00", fin: "13:00" },
      { id: "lun-2", inicio: "14:00", fin: "18:00" },
    ],
  },
  Martes: {
    activo: true,
    rangos: [
      { id: "mar-1", inicio: "09:00", fin: "13:00" },
      { id: "mar-2", inicio: "14:00", fin: "18:00" },
    ],
  },
  Miércoles: {
    activo: true,
    rangos: [
      { id: "mie-1", inicio: "09:00", fin: "13:00" },
      { id: "mie-2", inicio: "14:00", fin: "18:00" },
    ],
  },
  Jueves: {
    activo: true,
    rangos: [
      { id: "jue-1", inicio: "10:00", fin: "13:00" },
      { id: "jue-2", inicio: "15:00", fin: "19:00" },
    ],
  },
  Viernes: {
    activo: true,
    rangos: [{ id: "vie-1", inicio: "09:00", fin: "17:00" }],
  },
  Sábado: { activo: false, rangos: [] },
  Domingo: { activo: false, rangos: [] },
};

interface Excepcion {
  id: string;
  fecha: string;
  detalle: string;
}

const excepcionesIniciales: Excepcion[] = [
  { id: "exc-1", fecha: "18 sep", detalle: "Cerrado por inventario" },
  { id: "exc-2", fecha: "20 sep", detalle: "10:00–14:00" },
];

function minutosDesde(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

function horasSemanales(horario: HorarioSemanal) {
  const minutos = diasSemana.reduce((total, dia) => {
    const { activo, rangos } = horario[dia];
    if (!activo) return total;
    const minutosDia = rangos.reduce((acc, r) => acc + Math.max(0, minutosDesde(r.fin) - minutosDesde(r.inicio)), 0);
    return total + minutosDia;
  }, 0);
  return Math.round((minutos / 60) * 10) / 10;
}

function diasActivos(horario: HorarioSemanal) {
  return diasSemana.filter((d) => horario[d].activo).length;
}

function AtomCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-full max-w-[700px] rounded-lg border border-border bg-white p-6">
      <p className="pb-4 text-base font-medium text-ink">{title}</p>
      {children}
    </div>
  );
}

function ScheduleCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full max-w-[700px] flex-col gap-5 rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-bold tracking-tight text-ink">{title}</p>
          {action}
        </div>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

interface LimitesState {
  tiempoEntreCitas: { activo: boolean; antes: string; despues: string };
  anticipacionMinima: { activo: boolean; valor: string };
  cuposPorHorario: { activo: boolean; maximo: string };
  maxCitasPorPersona: { activo: boolean; maximo: string };
  ventanaFutura: { activo: boolean; valor: string };
}

const limitesIniciales: LimitesState = {
  tiempoEntreCitas: { activo: true, antes: "15", despues: "15" },
  anticipacionMinima: { activo: true, valor: "2h" },
  cuposPorHorario: { activo: true, maximo: "4" },
  maxCitasPorPersona: { activo: false, maximo: "1" },
  ventanaFutura: { activo: true, valor: "60" },
};

const opcionesMinutos = [
  { value: "0", label: "Sin preparación" },
  { value: "5", label: "5 minutos" },
  { value: "10", label: "10 minutos" },
  { value: "15", label: "15 minutos" },
  { value: "30", label: "30 minutos" },
  { value: "45", label: "45 minutos" },
  { value: "60", label: "60 minutos" },
];

const opcionesAnticipacion = [
  { value: "30m", label: "30 minutos de anticipación" },
  { value: "1h", label: "1 hora de anticipación" },
  { value: "2h", label: "2 horas de anticipación" },
  { value: "4h", label: "4 horas de anticipación" },
  { value: "24h", label: "24 horas de anticipación" },
];

const opcionesVentanaFutura = [
  { value: "30", label: "30 días" },
  { value: "60", label: "60 días" },
  { value: "90", label: "90 días" },
  { value: "180", label: "180 días" },
];

function OptionalRule({
  title,
  subtitle,
  activo,
  onToggle,
  children,
}: {
  title: string;
  subtitle: string;
  activo: boolean;
  onToggle: (activo: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-3.5 rounded-lg border border-border-soft p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="text-base font-medium text-ink">{title}</p>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
        <AtomToggle checked={activo} onChange={onToggle} label={title} />
      </div>
      {activo && children}
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
  const [zonaHoraria, setZonaHoraria] = useState(zonasHorarias[0]);
  const [horario, setHorario] = useState<HorarioSemanal>(horarioInicial);
  const [excepciones, setExcepciones] = useState<Excepcion[]>(excepcionesIniciales);
  const [limites, setLimites] = useState<LimitesState>(limitesIniciales);

  const stepIndex = steps.indexOf(step);

  const canContinue = useMemo(() => {
    if (step === "Tipo de cita") return form.nombre.trim().length > 0;
    return true;
  }, [step, form.nombre]);

  const resumenSemana = useMemo(
    () => `${diasActivos(horario)} días activos · ${horasSemanales(horario)} h semanales`,
    [horario]
  );

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

  const toggleDia = (dia: DiaSemana) => {
    setHorario((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        activo: !prev[dia].activo,
        rangos: !prev[dia].activo && prev[dia].rangos.length === 0 ? [{ id: `${dia}-${Date.now()}`, inicio: "09:00", fin: "18:00" }] : prev[dia].rangos,
      },
    }));
  };

  const agregarRango = (dia: DiaSemana) => {
    setHorario((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        rangos: [...prev[dia].rangos, { id: `${dia}-${Date.now()}`, inicio: "09:00", fin: "18:00" }],
      },
    }));
  };

  const quitarRango = (dia: DiaSemana, id: string) => {
    setHorario((prev) => ({
      ...prev,
      [dia]: { ...prev[dia], rangos: prev[dia].rangos.filter((r) => r.id !== id) },
    }));
  };

  const copiarDeLunes = () => {
    const base = horario.Lunes.rangos;
    setHorario((prev) => {
      const next = { ...prev };
      diasSemana.forEach((dia) => {
        if (dia !== "Lunes" && next[dia].activo) {
          next[dia] = { ...next[dia], rangos: base.map((r, i) => ({ ...r, id: `${dia}-copia-${i}-${Date.now()}` })) };
        }
      });
      return next;
    });
  };

  const agregarExcepcion = () => {
    setExcepciones((prev) => [
      ...prev,
      { id: crypto.randomUUID(), fecha: new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "short" }), detalle: "Nueva excepción" },
    ]);
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

          {step === "Horarios" && (
            <>
              <ScheduleCard title="Zona horaria" subtitle="Se aplica a horarios, recordatorios y excepciones.">
                <AtomSelect label="Zona horaria" value={zonaHoraria} onChange={(e) => setZonaHoraria(e.target.value)}>
                  {zonasHorarias.map((z) => (
                    <option key={z}>{z}</option>
                  ))}
                </AtomSelect>
              </ScheduleCard>

              <ScheduleCard
                title="Horario semanal"
                subtitle="Puedes agregar más de un rango por día."
                action={
                  <AtomButton variant="secondary" onClick={copiarDeLunes}>
                    Copiar de Lunes
                  </AtomButton>
                }
              >
                <p className="-mt-2 text-sm text-muted">{resumenSemana}</p>
                <div className="flex flex-col gap-3">
                  {diasSemana.map((dia) => {
                    const { activo, rangos } = horario[dia];
                    return (
                      <div key={dia} className="flex min-h-[46px] items-center gap-3">
                        <label className="flex w-[110px] shrink-0 items-center gap-2">
                          <input
                            type="checkbox"
                            checked={activo}
                            onChange={() => toggleDia(dia)}
                            className="size-4 accent-ink"
                          />
                          <span className={`text-sm font-medium ${activo ? "text-ink" : "text-muted-soft"}`}>
                            {dia}
                          </span>
                        </label>
                        {activo ? (
                          <div className="flex flex-1 flex-wrap items-center gap-2">
                            {rangos.map((r) => (
                              <div
                                key={r.id}
                                className="group flex items-center gap-1.5 rounded-lg border border-border-soft bg-surface-subtle px-2.5 py-1.5 text-sm text-ink-secondary"
                              >
                                <span>
                                  {r.inicio}–{r.fin}
                                </span>
                                <button
                                  onClick={() => quitarRango(dia, r.id)}
                                  aria-label="Quitar rango"
                                  className="text-muted-soft opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-600"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => agregarRango(dia)}
                              aria-label={`Agregar rango a ${dia}`}
                              className="flex size-6 items-center justify-center rounded-lg text-brand hover:bg-brand-soft"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="flex-1 text-sm text-muted-soft">No disponible</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScheduleCard>

              <ScheduleCard
                title="Excepciones"
                subtitle={`${excepciones.length} próximas · las fechas pasadas están ocultas.`}
              >
                <div className="flex flex-col gap-2">
                  {excepciones.map((exc) => (
                    <div
                      key={exc.id}
                      className="flex items-center gap-2 rounded-lg border border-border-soft px-3 py-2"
                    >
                      <span className="text-sm font-medium text-ink-secondary">{exc.fecha}</span>
                      <span className="flex-1 text-sm text-muted">{exc.detalle}</span>
                      <button
                        onClick={() => setExcepciones((prev) => prev.filter((e) => e.id !== exc.id))}
                        aria-label="Quitar excepción"
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
                  onClick={agregarExcepcion}
                  className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-brand hover:underline"
                >
                  <Plus size={14} /> Agregar excepción
                </button>
              </ScheduleCard>
            </>
          )}

          {step === "Límites" && (
            <ScheduleCard title="Límites de reserva" subtitle="Las reglas desactivadas no afectan la disponibilidad.">
              <OptionalRule
                title="Tiempo entre citas"
                subtitle="Deja preparación antes y después de cada atención."
                activo={limites.tiempoEntreCitas.activo}
                onToggle={(activo) =>
                  setLimites((l) => ({ ...l, tiempoEntreCitas: { ...l.tiempoEntreCitas, activo } }))
                }
              >
                <div className="flex gap-3">
                  <AtomSelect
                    label="Antes"
                    value={limites.tiempoEntreCitas.antes}
                    onChange={(e) =>
                      setLimites((l) => ({
                        ...l,
                        tiempoEntreCitas: { ...l.tiempoEntreCitas, antes: e.target.value },
                      }))
                    }
                  >
                    {opcionesMinutos.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </AtomSelect>
                  <AtomSelect
                    label="Después"
                    value={limites.tiempoEntreCitas.despues}
                    onChange={(e) =>
                      setLimites((l) => ({
                        ...l,
                        tiempoEntreCitas: { ...l.tiempoEntreCitas, despues: e.target.value },
                      }))
                    }
                  >
                    {opcionesMinutos.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </AtomSelect>
                </div>
              </OptionalRule>

              <OptionalRule
                title="Anticipación mínima"
                subtitle="Evita reservas de último minuto."
                activo={limites.anticipacionMinima.activo}
                onToggle={(activo) =>
                  setLimites((l) => ({ ...l, anticipacionMinima: { ...l.anticipacionMinima, activo } }))
                }
              >
                <AtomSelect
                  label="Reservar con al menos"
                  value={limites.anticipacionMinima.valor}
                  onChange={(e) =>
                    setLimites((l) => ({
                      ...l,
                      anticipacionMinima: { ...l.anticipacionMinima, valor: e.target.value },
                    }))
                  }
                >
                  {opcionesAnticipacion.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </AtomSelect>
              </OptionalRule>

              <OptionalRule
                title="Cupos por horario"
                subtitle="Atenciones simultáneas para este tipo de cita."
                activo={limites.cuposPorHorario.activo}
                onToggle={(activo) =>
                  setLimites((l) => ({ ...l, cuposPorHorario: { ...l.cuposPorHorario, activo } }))
                }
              >
                <AtomTextField
                  label="Cupos máximos"
                  type="number"
                  min={1}
                  value={limites.cuposPorHorario.maximo}
                  onChange={(e) =>
                    setLimites((l) => ({
                      ...l,
                      cuposPorHorario: { ...l.cuposPorHorario, maximo: e.target.value },
                    }))
                  }
                />
              </OptionalRule>

              <OptionalRule
                title="Máximo de citas activas por persona"
                subtitle="Limita reservas futuras del mismo contacto."
                activo={limites.maxCitasPorPersona.activo}
                onToggle={(activo) =>
                  setLimites((l) => ({ ...l, maxCitasPorPersona: { ...l.maxCitasPorPersona, activo } }))
                }
              >
                <AtomTextField
                  label="Máximo permitido"
                  type="number"
                  min={1}
                  value={limites.maxCitasPorPersona.maximo}
                  onChange={(e) =>
                    setLimites((l) => ({
                      ...l,
                      maxCitasPorPersona: { ...l.maxCitasPorPersona, maximo: e.target.value },
                    }))
                  }
                />
              </OptionalRule>

              <OptionalRule
                title="Ventana futura"
                subtitle="Hasta qué fecha puede reservar el cliente."
                activo={limites.ventanaFutura.activo}
                onToggle={(activo) => setLimites((l) => ({ ...l, ventanaFutura: { ...l.ventanaFutura, activo } }))}
              >
                <AtomSelect
                  label="Permitir reservas hasta"
                  value={limites.ventanaFutura.valor}
                  onChange={(e) =>
                    setLimites((l) => ({ ...l, ventanaFutura: { ...l.ventanaFutura, valor: e.target.value } }))
                  }
                >
                  {opcionesVentanaFutura.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </AtomSelect>
              </OptionalRule>
            </ScheduleCard>
          )}

          {step !== "Tipo de cita" && step !== "Horarios" && step !== "Límites" && (
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
