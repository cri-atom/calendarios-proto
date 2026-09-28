import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  PanelLeftClose,
  Home,
  MessageSquare,
  Table2,
  Headphones,
  Calendar,
  UserX,
  Megaphone,
  Workflow,
  MessageCircle,
  MessagesSquare,
  Search,
  Bell,
  HelpCircle,
  LifeBuoy,
  Mail,
  BookOpen,
  Sparkles,
  Users,
  BarChart3,
  Building2,
  Database,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from "lucide-react";

const railIcons: LucideIcon[] = [
  Home,
  MessageSquare,
  Table2,
  Headphones,
  Calendar,
  UserX,
  Megaphone,
  Workflow,
  MessageCircle,
  MessagesSquare,
];

interface NavGroup {
  label: string;
  icon: LucideIcon;
}

const navGroups: NavGroup[] = [
  { label: "Plataforma", icon: LifeBuoy },
  { label: "Mensajería", icon: Mail },
  { label: "Conversaciones", icon: BookOpen },
  { label: "Magia de Atom", icon: Sparkles },
  { label: "Gestión usuarios", icon: Users },
  { label: "Reportes", icon: BarChart3 },
  { label: "Mi Empresa", icon: Building2 },
  { label: "Gestor de recursos", icon: Database },
];

const citasLinks = [
  { to: "/tipos-de-cita", label: "Tipos de cita" },
  { to: "/calendarios", label: "Calendarios" },
  { to: "/citas-agendadas", label: "Citas agendadas" },
];

export default function SettingsShell({ children }: { children: ReactNode }) {
  const [citasOpen, setCitasOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-page text-ink">
      <div className="flex h-full shrink-0 flex-col border-r border-border-soft bg-rail-bg">
        <div className="flex size-16 shrink-0 items-center justify-center border-b border-border-soft">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">
            A
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between overflow-y-auto">
          <div className="flex flex-col">
            <button
              aria-label="Colapsar panel"
              className="flex h-10 items-center justify-end border-b border-border-soft px-5 text-ink hover:text-brand"
            >
              <PanelLeftClose size={20} strokeWidth={1.75} />
            </button>
            {railIcons.map((Icon, i) => (
              <button
                key={i}
                className="flex h-12 w-16 items-center justify-center text-ink-secondary hover:bg-surface-subtle hover:text-brand"
              >
                <Icon size={20} strokeWidth={1.75} />
              </button>
            ))}
          </div>
          <div className="flex flex-col border-t border-border-soft">
            <button className="flex h-12 w-16 items-center justify-center text-ink-secondary hover:bg-surface-subtle hover:text-brand">
              <Search size={20} strokeWidth={1.75} />
            </button>
            <button className="flex h-12 w-16 items-center justify-center text-ink-secondary hover:bg-surface-subtle hover:text-brand">
              <Bell size={20} strokeWidth={1.75} />
            </button>
            <button className="flex h-12 w-16 items-center justify-center">
              <span className="flex size-6 items-center justify-center rounded-full bg-surface-subtle text-[9px] font-medium text-ink-secondary">
                MA
              </span>
            </button>
            <button className="flex h-12 w-16 items-center justify-center text-ink-secondary hover:bg-surface-subtle hover:text-brand">
              <HelpCircle size={20} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-full w-[216px] shrink-0 flex-col gap-5 overflow-y-auto border-r border-border-soft bg-surface-subtle px-6 py-6">
        {navGroups.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="flex items-center gap-2 text-xs font-medium text-ink-secondary hover:text-ink"
          >
            <Icon size={20} strokeWidth={1.75} className="shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            <ChevronDown size={20} strokeWidth={1.75} className="shrink-0" />
          </button>
        ))}

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setCitasOpen((o) => !o)}
            className="flex items-center gap-2 text-xs font-medium text-ink-secondary hover:text-ink"
          >
            <CalendarDays size={20} strokeWidth={1.75} className="shrink-0" />
            <span className="flex-1 text-left">Citas</span>
            {citasOpen ? (
              <ChevronUp size={20} strokeWidth={1.75} className="shrink-0" />
            ) : (
              <ChevronDown size={20} strokeWidth={1.75} className="shrink-0" />
            )}
          </button>
          {citasOpen && (
            <div className="flex flex-col">
              {citasLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-lg px-2 py-2 text-xs ${
                      isActive ? "bg-white font-normal text-brand" : "font-normal text-ink-secondary hover:bg-white/60"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}
