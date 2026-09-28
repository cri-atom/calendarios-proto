import { NavLink } from "react-router-dom";
import {
  HelpCircle,
  Home,
  MessagesSquare,
  Table2,
  Headphones,
  CalendarClock,
  CalendarRange,
  Megaphone,
  MessageCircle,
  Timer,
  Settings,
  Phone,
  Mail,
  Sparkles,
  Users,
  BarChart3,
  Building2,
  Database,
  ChevronDown,
} from "lucide-react";

const navIcons = [Home, MessagesSquare, Table2, Headphones, CalendarClock, CalendarRange, Megaphone, MessageCircle, Timer];

const sections = [
  { icon: Phone, label: "Llamadas", badge: "BETA" },
  { icon: Mail, label: "Mensajería" },
  { icon: MessageCircle, label: "Conversaciones" },
  { icon: Sparkles, label: "Magia de Atom" },
  { icon: Users, label: "Gestión Usuarios" },
  { icon: BarChart3, label: "Reportes" },
  { icon: Building2, label: "Mi Empresa" },
  { icon: Database, label: "Gestor de recursos" },
];

const citasLinks = [
  { to: "/tipos-de-cita", label: "Tipos de cita" },
  { to: "/calendarios", label: "Calendarios" },
  { to: "/citas-agendadas", label: "Citas agendadas" },
];

export default function Sidebar() {
  return (
    <div className="flex h-full shrink-0 border-r border-border-soft">
      <div className="flex h-full w-16 flex-col items-center border-r border-border-soft">
        <div className="flex size-16 items-center justify-center border-b border-border-soft bg-surface-subtle">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand text-white font-bold">A</div>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1 py-2">
          {navIcons.map((Icon, i) => (
            <button
              key={i}
              className={`flex size-10 items-center justify-center rounded-lg text-ink-secondary hover:bg-surface-subtle ${
                i === 4 ? "border-l-2 border-brand bg-surface-subtle text-brand" : ""
              }`}
            >
              <Icon size={18} strokeWidth={1.75} />
            </button>
          ))}
        </div>
        <button className="mb-2 flex size-10 items-center justify-center rounded-lg text-ink-secondary hover:bg-surface-subtle">
          <HelpCircle size={18} strokeWidth={1.75} />
        </button>
      </div>
      <div className="flex h-full w-52 flex-col gap-5 overflow-y-auto bg-surface-subtle px-4 pt-4">
        <button className="flex items-center justify-between gap-2 text-xs font-medium text-[#4d4642]">
          <span className="flex items-center gap-2">
            <Settings size={16} />
            Plataforma
          </span>
          <ChevronDown size={16} />
        </button>
        {sections.map(({ icon: Icon, label, badge }) => (
          <button key={label} className="flex items-center justify-between gap-2 text-xs font-medium text-[#4d4642]">
            <span className="flex items-center gap-2">
              <Icon size={16} />
              {label}
            </span>
            <span className="flex items-center gap-2">
              {badge && (
                <span className="rounded bg-brand-soft px-1.5 py-0.5 text-[10px] font-medium text-brand">{badge}</span>
              )}
              <ChevronDown size={16} />
            </span>
          </button>
        ))}
        <div className="flex flex-col gap-2 pb-4">
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#4d4642]">
            <span className="flex items-center gap-2">
              <CalendarRange size={16} />
              Citas
            </span>
            <ChevronDown size={16} />
          </div>
          <div className="flex flex-col">
            {citasLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-xs ${isActive ? "bg-white font-medium text-brand" : "text-[#645e5b] hover:bg-white/60"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
