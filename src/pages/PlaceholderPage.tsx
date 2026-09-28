import AppShell from "../components/AppShell";
import { Construction } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  pendientes: string[];
}

export default function PlaceholderPage({ title, subtitle, pendientes }: Props) {
  return (
    <AppShell>
      <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-[0_6px_14px_0_rgba(46,33,74,0.08)]">
        <div className="flex flex-col gap-1 px-4 pb-2 pt-4">
          <h1 className="text-base font-bold text-ink">{title}</h1>
          <p className="text-xs text-muted-soft">{subtitle}</p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
          <div className="rounded-lg bg-surface-quaternary p-3 text-ink-secondary">
            <Construction size={24} />
          </div>
          <div className="max-w-md text-center">
            <p className="text-base font-medium text-ink">Próximamente en este prototipo</p>
            <p className="mt-1 text-sm text-muted-soft">
              Esta sección del FRD todavía no está implementada aquí. Pantallas pendientes de esta sección:
            </p>
          </div>
          <ul className="flex flex-col gap-1 text-xs text-muted-soft">
            {pendientes.map((p) => (
              <li key={p}>• {p}</li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
