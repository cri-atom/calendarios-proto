import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
}

export default function AtomIconButton({ icon, label, className = "", ...props }: Props) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-lg p-1.5 text-ink hover:bg-surface-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
