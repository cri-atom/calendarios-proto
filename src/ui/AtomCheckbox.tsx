import { Check } from "lucide-react";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export default function AtomCheckbox({ checked, onChange, label, disabled }: Props) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex size-4 shrink-0 items-center justify-center rounded-[2px] border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "border-ink bg-ink" : "border-[#71717b] bg-white"
      }`}
    >
      {checked && <Check size={11} strokeWidth={3} className="text-white" />}
    </button>
  );
}
