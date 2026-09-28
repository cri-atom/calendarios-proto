import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
}

export default function AtomBrandButton({ icon, className = "", children, ...props }: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1 rounded pl-2 pr-3 py-2 text-xs font-semibold text-[#fff7f2] bg-brand hover:bg-[#e65c00] transition-colors ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
