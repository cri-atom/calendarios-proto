interface Props {
  status: "Activo" | "Inactivo";
}

export default function AtomBadge({ status }: Props) {
  const isActive = status === "Activo";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
        isActive ? "bg-success-soft text-success" : "bg-surface-quaternary text-muted-soft"
      }`}
    >
      {status}
    </span>
  );
}
