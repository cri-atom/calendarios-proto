import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Copy, Info, Moon, Plus, Trash2 } from "lucide-react";
import SettingsShell from "../components/SettingsShell";
import AtomButton from "../ui/AtomButton";
import AtomTextField from "../ui/AtomTextField";
import AtomSelect from "../ui/AtomSelect";
import AtomToggle from "../ui/AtomToggle";
import AtomStepper from "../ui/AtomStepper";
import AtomIconButton from "../ui/AtomIconButton";
import { zonasHorarias } from "../data/calendarios";
import { tiposCitaIniciales } from "../data/tiposCita";

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
  rangos: RangoHorario[];
}

type HorarioSemanal = Record<DiaSemana, DiaHorario>;

const horarioInicial: HorarioSemanal = {
  Lunes: { rangos: [] },
  Martes: { rangos: [] },
  Miércoles: { rangos: [] },
  Jueves: { rangos: [] },
  Viernes: { rangos: [] },
  Sábado: { rangos: [] },
  Domingo: { rangos: [] },
};

interface Excepcion {
  id: string;
  fecha: string;
  rangos: RangoHorario[];
}

const excepcionesIniciales: Excepcion[] = [];

const excepcionesPasadasDemo: Excepcion[] = [
  { id: "exc-past-1", fecha: "2026-08-20", rangos: [] },
  { id: "exc-past-2", fecha: "2026-08-05", rangos: [{ id: "exc-past-2-1", inicio: "09:00", fin: "12:00" }] },
];

function AtomCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-full max-w-[700px] rounded-lg border border-border bg-white p-6">
      <p className="pb-4 text-base font-medium text-ink">{title}</p>
      {children}
    </div>
  );
}

function FieldHint({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-muted-soft">
      <Info size={11} />
      <span>{children}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-border-soft" />;
}

function DisabledBanner({ label = "No disponible" }: { label?: string }) {
  return (
    <div className="flex h-8 w-[330px] max-w-full shrink-0 items-center gap-1.5 text-xs font-medium text-muted-soft">
      <Moon size={14} />
      {label}
    </div>
  );
}

function HorarioCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex w-[700px] max-w-full flex-col gap-4 rounded-lg border border-border bg-white p-6 shadow-[0px_2px_4px_0px_rgba(9,9,11,0.08)]">
      <p className="text-base font-medium text-ink">{title}</p>
      {children}
    </div>
  );
}

function TimeRangeFields({
  rango,
  contexto,
  onChange,
  onRemove,
}: {
  rango: RangoHorario;
  contexto: string;
  onChange: (campo: "inicio" | "fin", valor: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex w-[330px] max-w-full shrink-0 items-center gap-3">
      <input
        type="time"
        value={rango.inicio}
        onChange={(e) => onChange("inicio", e.target.value)}
        aria-label={`Hora de inicio, ${contexto}`}
        className="w-[120px] shrink-0 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs text-muted outline-none focus:border-ink focus:ring-1 focus:ring-ink"
      />
      <span className="shrink-0 text-xs font-medium text-ink-secondary">Hasta</span>
      <input
        type="time"
        value={rango.fin}
        onChange={(e) => onChange("fin", e.target.value)}
        aria-label={`Hora de término, ${contexto}`}
        className="w-[120px] shrink-0 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs text-muted outline-none focus:border-ink focus:ring-1 focus:ring-ink"
      />
      <button onClick={onRemove} aria-label="Quitar rango" className="shrink-0 text-red-500 hover:text-red-600">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function TimeFrameList({
  rangos,
  contexto,
  onChangeRango,
  onRemove,
}: {
  rangos: RangoHorario[];
  contexto: string;
  onChangeRango: (id: string, campo: "inicio" | "fin", valor: string) => void;
  onRemove: (id: string) => void;
}) {
  if (rangos.length === 0) {
    return <DisabledBanner />;
  }
  return (
    <div className="flex w-[330px] max-w-full shrink-0 flex-col gap-2.5">
      {rangos.map((r) => (
        <TimeRangeFields
          key={r.id}
          rango={r}
          contexto={contexto}
          onChange={(campo, valor) => onChangeRango(r.id, campo, valor)}
          onRemove={() => onRemove(r.id)}
        />
      ))}
    </div>
  );
}

function DayRow({
  dia,
  rangos,
  onAdd,
  onRemove,
  onChangeRango,
  onCopy,
}: {
  dia: DiaSemana;
  rangos: RangoHorario[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChangeRango: (id: string, campo: "inicio" | "fin", valor: string) => void;
  onCopy: () => void;
}) {
  return (
    <div className="flex w-full items-start gap-4">
      <div className="flex min-h-8 flex-1 items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-medium text-ink-secondary">
            {dia.slice(0, 1)}
          </div>
          <span className="text-sm font-medium text-ink-secondary">{dia}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <AtomIconButton icon={<Plus size={14} />} label={`Agregar horario a ${dia}`} onClick={onAdd} />
          <AtomIconButton icon={<Copy size={14} />} label={`Copiar horario de ${dia}`} onClick={onCopy} />
        </div>
      </div>
      <TimeFrameList rangos={rangos} contexto={dia} onChangeRango={onChangeRango} onRemove={onRemove} />
    </div>
  );
}

function ExceptionRow({
  exc,
  onFecha,
  onAdd,
  onRemove,
  onChangeRango,
  onCopy,
  onRemoveExcepcion,
}: {
  exc: Excepcion;
  onFecha: (fecha: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChangeRango: (id: string, campo: "inicio" | "fin", valor: string) => void;
  onCopy: () => void;
  onRemoveExcepcion: () => void;
}) {
  return (
    <div className="flex w-full items-start gap-2">
      <div className="flex min-h-8 flex-1 items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <input
            type="date"
            value={exc.fecha}
            onChange={(e) => onFecha(e.target.value)}
            className="w-[150px] shrink-0 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs text-muted outline-none focus:border-ink focus:ring-1 focus:ring-ink"
          />
          <AtomIconButton
            icon={<Trash2 size={14} />}
            label="Quitar excepción"
            onClick={onRemoveExcepcion}
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
          />
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <AtomIconButton icon={<Plus size={14} />} label="Agregar horario a esta fecha" onClick={onAdd} />
          <AtomIconButton icon={<Copy size={14} />} label="Copiar horario de esta fecha" onClick={onCopy} />
        </div>
      </div>
      <TimeFrameList
        rangos={exc.rangos}
        contexto={exc.fecha || "esta excepción"}
        onChangeRango={onChangeRango}
        onRemove={onRemove}
      />
    </div>
  );
}

interface LimitesState {
  buffer: { antes: string; despues: string };
  anticipacionMinima: { activo: boolean; duracionValor: string; duracionUnidad: string };
  diasEnElFuturo: string;
  frecuencia: { activo: boolean; cupos: string };
  citasActivasPorPersona: { activo: boolean; maximo: string };
}

const limitesIniciales: LimitesState = {
  buffer: { antes: "0", despues: "0" },
  anticipacionMinima: { activo: false, duracionValor: "120", duracionUnidad: "minutos" },
  diasEnElFuturo: "30",
  frecuencia: { activo: false, cupos: "1" },
  citasActivasPorPersona: { activo: false, maximo: "1" },
};

const opcionesMinutos = [
  { value: "0", label: "Sin tiempo libre" },
  { value: "5", label: "5 minutos" },
  { value: "10", label: "10 minutos" },
  { value: "15", label: "15 minutos" },
  { value: "30", label: "30 minutos" },
  { value: "45", label: "45 minutos" },
  { value: "60", label: "60 minutos" },
];

const opcionesUnidadDuracion = [
  { value: "minutos", label: "minutos" },
  { value: "horas", label: "horas" },
];

function RuleRow({
  title,
  subtitle,
  activo,
  onToggle,
  children,
}: {
  title: string;
  subtitle?: string;
  activo?: boolean;
  onToggle?: (activo: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6 py-4">
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-xs font-medium text-ink-secondary">{title}</p>
          {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
        </div>
        {activo !== undefined && onToggle && <AtomToggle checked={activo} onChange={onToggle} label={title} />}
      </div>
      {(activo ?? true) && children}
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
  const [copiarHorarioTipo, setCopiarHorarioTipo] = useState("");
  const [excepciones, setExcepciones] = useState<Excepcion[]>(excepcionesIniciales);
  const [copiarExcepcionesTipo, setCopiarExcepcionesTipo] = useState("");
  const [mostrarExcepcionesPasadas, setMostrarExcepcionesPasadas] = useState(false);
  const [limites, setLimites] = useState<LimitesState>(limitesIniciales);

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

  const actualizarRango = (dia: DiaSemana, id: string, campo: "inicio" | "fin", valor: string) => {
    setHorario((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        rangos: prev[dia].rangos.map((r) => (r.id === id ? { ...r, [campo]: valor } : r)),
      },
    }));
  };

  const copiarDeDia = (diaOrigen: DiaSemana) => {
    const base = horario[diaOrigen].rangos;
    if (base.length === 0) return;
    setHorario((prev) => {
      const next = { ...prev };
      diasSemana.forEach((dia) => {
        if (dia !== diaOrigen && next[dia].rangos.length > 0) {
          next[dia] = { ...next[dia], rangos: base.map((r, i) => ({ ...r, id: `${dia}-copia-${i}-${Date.now()}` })) };
        }
      });
      return next;
    });
  };

  const aplicarCopiaHorario = (tipoId: string) => {
    setCopiarHorarioTipo(tipoId);
    if (!tipoId) return;
    const base =
      horario.Lunes.rangos.length > 0
        ? horario.Lunes.rangos
        : [{ id: `base-${Date.now()}`, inicio: "09:00", fin: "18:00" }];
    setHorario(() => {
      const next = {} as HorarioSemanal;
      diasSemana.forEach((dia) => {
        next[dia] = { rangos: base.map((r, i) => ({ ...r, id: `${dia}-copia-${i}-${Date.now()}` })) };
      });
      return next;
    });
  };

  const puedeQuitarTodosHorarios =
    copiarHorarioTipo !== "" || diasSemana.some((dia) => horario[dia].rangos.length > 0);

  const quitarTodosHorarios = () => {
    setHorario(horarioInicial);
    setCopiarHorarioTipo("");
  };

  const agregarExcepcion = () => {
    setExcepciones((prev) => [...prev, { id: crypto.randomUUID(), fecha: "", rangos: [] }]);
  };

  const actualizarExcepcion = (id: string, cambios: Partial<Excepcion>) => {
    setExcepciones((prev) => prev.map((exc) => (exc.id === id ? { ...exc, ...cambios } : exc)));
  };

  const agregarRangoExcepcion = (excId: string) => {
    setExcepciones((prev) =>
      prev.map((exc) =>
        exc.id === excId
          ? { ...exc, rangos: [...exc.rangos, { id: `${excId}-${Date.now()}`, inicio: "09:00", fin: "18:00" }] }
          : exc,
      ),
    );
  };

  const quitarRangoExcepcion = (excId: string, rangoId: string) => {
    setExcepciones((prev) =>
      prev.map((exc) => (exc.id === excId ? { ...exc, rangos: exc.rangos.filter((r) => r.id !== rangoId) } : exc)),
    );
  };

  const actualizarRangoExcepcion = (excId: string, rangoId: string, campo: "inicio" | "fin", valor: string) => {
    setExcepciones((prev) =>
      prev.map((exc) =>
        exc.id === excId
          ? { ...exc, rangos: exc.rangos.map((r) => (r.id === rangoId ? { ...r, [campo]: valor } : r)) }
          : exc,
      ),
    );
  };

  const copiarDeExcepcion = (excIdOrigen: string) => {
    const origen = excepciones.find((exc) => exc.id === excIdOrigen);
    if (!origen || origen.rangos.length === 0) return;
    setExcepciones((prev) =>
      prev.map((exc) =>
        exc.id !== excIdOrigen && exc.rangos.length > 0
          ? { ...exc, rangos: origen.rangos.map((r, i) => ({ ...r, id: `${exc.id}-copia-${i}-${Date.now()}` })) }
          : exc,
      ),
    );
  };

  return (
    <SettingsShell>
      <div className="flex h-full flex-1 flex-col overflow-hidden bg-page">
        <div className="flex flex-col gap-1 px-8 pb-4 pt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={goToList}
              aria-label="Volver"
              className="flex size-6 items-center justify-center rounded-lg text-ink hover:bg-surface-muted"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-xl font-bold text-ink">Crear tipo de cita</h1>
          </div>
          <p className="pl-8 text-sm text-muted">Configura cuándo puede reservarse esta experiencia.</p>
        </div>

        <div className="shrink-0 px-8 pb-4">
          <AtomStepper steps={steps} currentIndex={stepIndex} />
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
              <HorarioCard title="Horarios disponibles">
                <AtomSelect label="Zona horaria" value={zonaHoraria} onChange={(e) => setZonaHoraria(e.target.value)}>
                  {zonasHorarias.map((z) => (
                    <option key={z}>{z}</option>
                  ))}
                </AtomSelect>

                <Divider />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-ink-secondary">Copiar de otro tipo de cita</span>
                  <div className="w-[439px] max-w-full">
                    <AtomSelect value={copiarHorarioTipo} onChange={(e) => aplicarCopiaHorario(e.target.value)}>
                      <option value="">Seleccionar tipo de cita</option>
                      {tiposCitaIniciales.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nombre}
                        </option>
                      ))}
                    </AtomSelect>
                  </div>
                </div>

                <Divider />

                <div className="flex w-full flex-col gap-4">
                  {diasSemana.map((dia) => (
                    <DayRow
                      key={dia}
                      dia={dia}
                      rangos={horario[dia].rangos}
                      onAdd={() => agregarRango(dia)}
                      onRemove={(id) => quitarRango(dia, id)}
                      onChangeRango={(id, campo, valor) => actualizarRango(dia, id, campo, valor)}
                      onCopy={() => copiarDeDia(dia)}
                    />
                  ))}
                </div>

                {puedeQuitarTodosHorarios && (
                  <button
                    onClick={quitarTodosHorarios}
                    className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                    Quitar todos
                  </button>
                )}
              </HorarioCard>

              <HorarioCard title="No disponibles (opcional)">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-ink-secondary">Copiar de otro tipo de cita</span>
                  <div className="w-[439px] max-w-full">
                    <AtomSelect value={copiarExcepcionesTipo} onChange={(e) => setCopiarExcepcionesTipo(e.target.value)}>
                      <option value="">Seleccionar tipo de cita</option>
                      {tiposCitaIniciales.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nombre}
                        </option>
                      ))}
                    </AtomSelect>
                  </div>
                </div>

                <Divider />

                <div className="flex w-full flex-col gap-4">
                  {excepciones.map((exc) => (
                    <ExceptionRow
                      key={exc.id}
                      exc={exc}
                      onFecha={(fecha) => actualizarExcepcion(exc.id, { fecha })}
                      onAdd={() => agregarRangoExcepcion(exc.id)}
                      onRemove={(rangoId) => quitarRangoExcepcion(exc.id, rangoId)}
                      onChangeRango={(rangoId, campo, valor) => actualizarRangoExcepcion(exc.id, rangoId, campo, valor)}
                      onCopy={() => copiarDeExcepcion(exc.id)}
                      onRemoveExcepcion={() => setExcepciones((prev) => prev.filter((e) => e.id !== exc.id))}
                    />
                  ))}
                  {excepciones.length === 0 && (
                    <p className="rounded-lg border border-dashed border-border-soft px-3 py-4 text-center text-xs text-muted-soft">
                      Sin excepciones agregadas
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start gap-2">
                  <AtomButton variant="secondary" icon={<Plus size={14} />} onClick={agregarExcepcion}>
                    Agregar
                  </AtomButton>
                  <AtomButton variant="secondary" onClick={() => setMostrarExcepcionesPasadas((v) => !v)}>
                    {mostrarExcepcionesPasadas ? "Ocultar excepciones pasadas" : "Ver excepciones pasadas"}
                  </AtomButton>
                  {mostrarExcepcionesPasadas && (
                    <div className="flex w-full flex-col gap-2 pt-1">
                      {excepcionesPasadasDemo.map((exc) => (
                        <div
                          key={exc.id}
                          className="flex items-center gap-2 rounded-lg border border-dashed border-border-soft px-3 py-2 opacity-60"
                        >
                          <span className="text-xs font-medium text-ink-secondary">{exc.fecha}</span>
                          <span className="flex-1 text-xs text-muted">
                            {exc.rangos.length > 0
                              ? exc.rangos.map((r) => `${r.inicio}–${r.fin}`).join(", ")
                              : "No disponible"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </HorarioCard>
            </>
          )}

          {step === "Límites" && (
            <HorarioCard title="Límites">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-ink-secondary">Tiempo libre</p>
                <p className="text-xs text-muted">
                  Este tiempo se bloquea antes y/o después de la cita y no queda disponible para ser agendado.
                </p>
              </div>

              <div className="flex gap-4">
                <AtomSelect
                  label="Antes de la cita"
                  value={limites.buffer.antes}
                  onChange={(e) => setLimites((l) => ({ ...l, buffer: { ...l.buffer, antes: e.target.value } }))}
                >
                  {opcionesMinutos.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </AtomSelect>
                <AtomSelect
                  label="Después de la cita"
                  value={limites.buffer.despues}
                  onChange={(e) => setLimites((l) => ({ ...l, buffer: { ...l.buffer, despues: e.target.value } }))}
                >
                  {opcionesMinutos.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </AtomSelect>
              </div>

              <Divider />

              <RuleRow
                title="Tiempo de anticipación mínima"
                subtitle="Con cuánto tiempo previo se puede agendar este tipo de cita."
                activo={limites.anticipacionMinima.activo}
                onToggle={(activo) =>
                  setLimites((l) => ({ ...l, anticipacionMinima: { ...l.anticipacionMinima, activo } }))
                }
              >
                <div className="flex items-center gap-4">
                  <AtomTextField
                    label="Duración"
                    hideLabel
                    type="number"
                    min={0}
                    placeholder="Ej: 120"
                    value={limites.anticipacionMinima.duracionValor}
                    onChange={(e) =>
                      setLimites((l) => ({
                        ...l,
                        anticipacionMinima: { ...l.anticipacionMinima, duracionValor: e.target.value },
                      }))
                    }
                  />
                  <AtomSelect
                    label="Unidad de anticipación mínima"
                    hideLabel
                    value={limites.anticipacionMinima.duracionUnidad}
                    onChange={(e) =>
                      setLimites((l) => ({
                        ...l,
                        anticipacionMinima: { ...l.anticipacionMinima, duracionUnidad: e.target.value },
                      }))
                    }
                  >
                    {opcionesUnidadDuracion.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </AtomSelect>
                </div>
              </RuleRow>

              <Divider />

              <RuleRow
                title="Días de anticipación máxima"
                subtitle="Con cuántos días previos se puede agendar este tipo de cita."
              >
                <div className="flex w-[326px] max-w-full flex-col gap-2">
                  <AtomTextField
                    label="Días de anticipación máxima"
                    hideLabel
                    type="number"
                    min={1}
                    max={45}
                    placeholder="Ej: 30"
                    value={limites.diasEnElFuturo}
                    onChange={(e) => setLimites((l) => ({ ...l, diasEnElFuturo: e.target.value }))}
                  />
                  <FieldHint>Hasta 45 días como máximo</FieldHint>
                </div>
              </RuleRow>

              <Divider />

              <RuleRow
                title="Cupos"
                subtitle="Define cuántos cupos de este tipo de cita están disponibles en total."
                activo={limites.frecuencia.activo}
                onToggle={(activo) => setLimites((l) => ({ ...l, frecuencia: { ...l.frecuencia, activo } }))}
              >
                <div className="w-[326px] max-w-full">
                  <AtomTextField
                    label="Cupos"
                    hideLabel
                    type="number"
                    min={1}
                    placeholder="Ej: 1"
                    value={limites.frecuencia.cupos}
                    onChange={(e) =>
                      setLimites((l) => ({ ...l, frecuencia: { ...l.frecuencia, cupos: e.target.value } }))
                    }
                  />
                </div>
              </RuleRow>

              <Divider />

              <RuleRow
                title="Citas activas por contacto"
                subtitle="Cantidad máxima de citas activas que un mismo contacto puede tener agendadas."
                activo={limites.citasActivasPorPersona.activo}
                onToggle={(activo) =>
                  setLimites((l) => ({
                    ...l,
                    citasActivasPorPersona: { ...l.citasActivasPorPersona, activo },
                  }))
                }
              >
                <div className="w-[326px] max-w-full">
                  <AtomTextField
                    label="Citas activas por contacto"
                    hideLabel
                    type="number"
                    min={1}
                    placeholder="Ej: 1"
                    value={limites.citasActivasPorPersona.maximo}
                    onChange={(e) =>
                      setLimites((l) => ({
                        ...l,
                        citasActivasPorPersona: { ...l.citasActivasPorPersona, maximo: e.target.value },
                      }))
                    }
                  />
                </div>
              </RuleRow>
            </HorarioCard>
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

        <div className="flex shrink-0 items-center justify-between border-t border-border bg-page px-8 py-4">
          <AtomButton variant="secondary" onClick={handleBack}>
            {stepIndex === 0 ? "Cancelar" : "Atrás"}
          </AtomButton>
          <div className="flex items-center gap-2">
            <AtomButton variant="secondary">Guardar borrador</AtomButton>
            <AtomButton
              variant="primary"
              disabled={!canContinue}
              onClick={handleContinue}
              icon={<ArrowRight size={14} />}
            >
              {stepIndex === steps.length - 1 ? "Crear tipo de cita" : "Continuar"}
            </AtomButton>
          </div>
        </div>
      </div>
    </SettingsShell>
  );
}
