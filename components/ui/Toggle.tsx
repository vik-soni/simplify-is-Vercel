"use client";

type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
};

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`inline-flex h-7 w-12 items-center rounded-full p-1 transition ${checked ? "bg-primary" : "bg-surface-container-highest"}`}
    >
      <span className={`h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}
