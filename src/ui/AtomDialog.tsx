import type { ReactNode } from "react";
import { X } from "lucide-react";

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
  width?: number;
}

export default function AtomDialog({ title, open, onClose, children, actions, width = 600 }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#6a6973]/60">
      <div
        className="flex max-h-[85vh] flex-col overflow-hidden rounded-xl border border-border bg-white shadow-xl"
        style={{ width }}
      >
        <div className="flex shrink-0 items-center gap-2 px-4 pb-4 pt-4">
          <p className="flex-1 truncate text-lg font-bold text-ink">{title}</p>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg p-2 text-ink hover:bg-surface-muted"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4">{children}</div>
        {actions && <div className="flex shrink-0 items-center justify-end gap-2 p-4">{actions}</div>}
      </div>
    </div>
  );
}
