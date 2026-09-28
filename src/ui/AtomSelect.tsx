import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export default function AtomSelect({ label, id, className = "", children, ...props }: Props) {
  const selectId = id ?? label?.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="flex flex-1 flex-col gap-2">
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium text-ink-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none rounded-lg border border-border bg-white px-3 py-2 pr-8 text-xs text-muted outline-none focus:border-ink focus:ring-1 focus:ring-ink ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted" />
      </div>
    </div>
  );
}
