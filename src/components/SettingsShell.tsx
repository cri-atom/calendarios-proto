import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  PanelLeftClose,
  Home,
  Bell,
  Search,
  MessageSquare,
  BookUser,
  Megaphone,
  Workflow,
  Activity,
  MessageCircle,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const railIcons = [PanelLeftClose, Home, Bell, Search, MessageSquare, BookUser, Megaphone, Workflow, Activity, MessageCircle];

const accordionSections = [
  "Plataforma",
  "Mensajería",
  "Conversaciones",
  "Magia de atom",
  "Gestión usuarios",
  "Reportes",
  "Mi empresa",
  "Gestor de recursos",
];

const citasLinks = [
  { to: "/tipos-de-cita", label: "Tipos de cita" },
  { to: "/calendarios", label: "Calendarios" },
  { to: "/citas-agendadas", label: "Citas agendadas" },
];

export default function SettingsShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-page text-ink">
      <div className="flex h-full shrink-0 items-start bg-[#f5f5f4] p-2">
        <div className="flex h-full flex-col items-center justify-between p-2">
          <div className="flex flex-col items-center gap-10">
            <div className="flex size-8 items-center justify-center rounded-lg p-1">
              <div className="flex size-6 items-center justify-center rounded-md bg-brand text-[11px] font-bold text-white">
                A
              </div>
            </div>
            <div className="flex flex-col items-start gap-1">
              {railIcons.map((Icon, i) => (
                <button
                  key={i}
                  className="flex size-8 items-center justify-center overflow-hidden rounded-lg text-ink hover:bg-white"
                >
                  <Icon size={16} strokeWidth={1.75} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <button className="flex size-8 items-center justify-center rounded-lg text-ink hover:bg-white">
              <HelpCircle size={16} strokeWidth={1.75} />
            </button>
            <button className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-[#a44200]">
              <Settings size={16} strokeWidth={1.75} />
            </button>
            <div className="relative flex size-8 items-center justify-center rounded-xl border-2 border-surface-quaternary bg-surface-muted text-[12px] text-ink">
              RM
              <span className="absolute bottom-[3px] right-[3px] size-2 rounded-full border border-surface-muted bg-[#00c951]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-full w-56 shrink-0 flex-col gap-4 border-l border-surface-quaternary bg-[#f5f5f4] px-2 py-6">
        <div className="px-2 text-base font-bold text-ink">Configuraciones</div>
        <div className="flex flex-col">
          {accordionSections.map((s) => (
            <button
              key={s}
              className="flex items-center justify-between rounded p-2 text-xs font-medium text-[#52525c] hover:bg-white/60"
            >
              {s}
              <ChevronDown size={14} />
            </button>
          ))}
          <div className="flex flex-col">
            <button className="flex items-center justify-between rounded p-2 text-xs font-medium text-ink">
              Citas
              <ChevronUp size={14} />
            </button>
            <div className="flex flex-col border-l border-border-soft pl-2">
              {citasLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded px-2 py-2 text-xs font-normal ${
                      isActive ? "bg-brand-soft text-[#a44200]" : "text-[#52525c] hover:bg-white/60"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}
