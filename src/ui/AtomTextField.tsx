import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  hideLabel?: boolean;
}

export default function AtomTextField({ label, hint, hideLabel = false, id, className = "", ...props }: Props) {
  const inputId = id ?? label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="flex flex-1 flex-col gap-2">
      <label htmlFor={inputId} className={`text-xs font-medium text-ink-secondary ${hideLabel ? "sr-only" : ""}`}>
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-muted placeholder:text-muted-soft outline-none focus:border-ink focus:ring-1 focus:ring-ink ${className}`}
        {...props}
      />
      {hint && <span className="text-[11px] text-muted-soft">{hint}</span>}
    </div>
  );
}
