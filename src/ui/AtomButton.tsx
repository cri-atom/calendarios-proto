import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "tertiary" | "danger";

const variantClasses: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-black border border-ink",
  secondary: "bg-white text-ink border border-border hover:bg-surface-subtle",
  tertiary: "bg-transparent text-ink hover:bg-surface-muted border border-transparent",
  danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
};

interface AtomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
}

export default function AtomButton({
  variant = "secondary",
  icon,
  className = "",
  children,
  ...props
}: AtomButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium leading-4 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
