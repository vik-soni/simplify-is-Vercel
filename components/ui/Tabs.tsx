"use client";

type Tab = { id: string; label: string };

type TabsProps = {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
};

export function Tabs({ tabs, activeId, onChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`rounded-full border px-3 py-1.5 text-xs font-josefin uppercase tracking-[0.08em] ${
            activeId === tab.id
              ? "border-primary bg-primary text-on-primary"
              : "border-outline/30 bg-surface-container-low text-secondary hover:bg-surface-container"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
