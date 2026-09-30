interface Props {
  label: string;
  variant: "neutral" | "success";
  /** atom-data-table (Tipos de cita) uses the plain-text style: no pill, no background. */
  filled?: boolean;
}

export default function AtomTag({ label, variant, filled = true }: Props) {
  const fg = variant === "success" ? "text-tag-success-fg" : "text-tag-neutral-fg";

  if (!filled) {
    return <span className={`max-w-[200px] truncate text-xs font-medium ${fg}`}>{label}</span>;
  }

  return (
    <span
      className={`inline-flex max-w-[200px] items-center rounded-full px-2 py-1 text-xs font-medium ${
        variant === "success" ? "bg-tag-success text-tag-success-fg" : "bg-tag-neutral text-tag-neutral-fg"
      }`}
    >
      {label}
    </span>
  );
}
