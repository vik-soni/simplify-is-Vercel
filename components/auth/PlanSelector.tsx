"use client";

import { Check } from "lucide-react";

export type SignupPlan = "essential" | "professional";

interface PlanSelectorProps {
  value: SignupPlan;
  onChange: (next: SignupPlan) => void;
}

interface PlanOption {
  id: SignupPlan;
  label: string;
  pitch: string;
  badge: string;
}

const OPTIONS: ReadonlyArray<PlanOption> = [
  {
    id: "essential",
    label: "Essential",
    pitch: "NIST CSF 2.0",
    badge: "14-day free trial",
  },
  {
    id: "professional",
    label: "Professional",
    pitch: "NIST + choose 3",
    badge: "Paid plan",
  },
];

/**
 * Two-card plan selector rendered inside the signup form.
 * Default is `"essential"` so anyone can sign up for a free trial.
 */
export function PlanSelector({ value, onChange }: PlanSelectorProps): JSX.Element {
  return (
    <fieldset className="space-y-3">
      <legend className="font-josefin text-[10px] font-bold uppercase tracking-[0.15em] text-secondary">
        Select Your Plan
      </legend>
      <div role="radiogroup" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const isSelected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option.id)}
              className={`flex h-full flex-col items-start gap-2 rounded-sm border p-4 text-left transition-all duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-glow-brand"
                  : "border-outline/30 bg-surface-container hover:border-outline/50"
              }`}
            >
              <div className="flex w-full items-start justify-between">
                <span className="font-raleway text-base font-bold text-on-surface">
                  {option.label}
                </span>
                {isSelected ? (
                  <span
                    aria-hidden
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-on-primary"
                  >
                    <Check className="h-3 w-3" />
                  </span>
                ) : null}
              </div>
              <p className="font-montserrat text-sm text-on-surface-muted">
                {option.pitch}
              </p>
              <p
                className={`font-geist text-[10px] uppercase tracking-[0.18em] ${
                  isSelected ? "text-primary" : "text-on-surface-muted"
                }`}
              >
                {option.badge}
              </p>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
