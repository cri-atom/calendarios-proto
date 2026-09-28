interface Props {
  label: string;
  variant: "neutral" | "success";
}

export default function AtomTag({ label, variant }: Props) {
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
