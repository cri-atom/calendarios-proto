interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  "aria-label"?: string;
}

export default function AtomToggle({ checked, onChange, label, ...rest }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label ?? rest["aria-label"]}
      onClick={() => onChange(!checked)}
      className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
        checked ? "justify-end bg-ink" : "justify-start bg-surface-quaternary"
      }`}
    >
      <span className="size-4 rounded-full bg-white shadow" />
    </button>
  );
}
