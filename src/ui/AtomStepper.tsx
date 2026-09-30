import { Check } from "lucide-react";

interface AtomStepperProps {
  steps: readonly string[];
  currentIndex: number;
}

export default function AtomStepper({ steps, currentIndex }: AtomStepperProps) {
  return (
    <div className="flex w-full items-center">
      {steps.map((label, i) => {
        const isCompleted = i < currentIndex;
        const isActive = i === currentIndex;
        const isFirst = i === 0;

        return (
          <div
            key={label}
            className={`flex flex-col justify-center gap-2 border-b-4 px-2 pb-3 pt-2 ${
              isFirst ? "shrink-0 items-start" : "min-w-0 flex-1 items-end"
            } ${isCompleted || isActive ? "border-[#ff9d5b]" : "border-surface-quaternary"}`}
          >
            <div className="flex items-center gap-1">
              {isCompleted ? (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
              ) : (
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-xl text-xs ${
                    isActive
                      ? "bg-brand font-bold text-white"
                      : "border-2 border-surface-quaternary bg-surface-muted font-normal text-muted-soft"
                  }`}
                >
                  {i + 1}
                </span>
              )}
              <span
                className={`whitespace-nowrap text-xs ${
                  isCompleted
                    ? "font-medium text-ink-secondary"
                    : isActive
                      ? "font-bold text-ink"
                      : "font-normal text-muted-soft"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
