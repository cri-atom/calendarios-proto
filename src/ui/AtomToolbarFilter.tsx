import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  icon: ReactNode;
  label: string;
}

export default function AtomToolbarFilter({ icon, label }: Props) {
  return (
    <button className="inline-flex h-8 items-center gap-2 rounded border border-border px-2 text-xs text-ink-secondary hover:bg-surface-subtle">
      {icon}
      <span>{label}</span>
      <ChevronDown size={14} className="text-muted" />
    </button>
  );
}
