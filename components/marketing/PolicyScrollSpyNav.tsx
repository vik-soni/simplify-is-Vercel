"use client";

import { useScrollSpyNav } from "@/lib/hooks/useScrollSpyNav";

interface PolicyScrollSpyNavProps {
  sections: ReadonlyArray<{ id: string; navLabel: string }>;
}

export function PolicyScrollSpyNav({ sections }: PolicyScrollSpyNavProps) {
  const ids = sections.map((s) => s.id);
  const { activeId, onNavClick } = useScrollSpyNav({ sectionIds: ids });

  return (
    <nav className="flex flex-col gap-1">
      {sections.map((s) => {
        const isActive = s.id === activeId;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={onNavClick(s.id)}
            aria-current={isActive ? "true" : undefined}
            className={`font-josefin text-xs uppercase tracking-widest py-3 px-4 transition-all duration-300 block ${
              isActive
                ? "text-primary border-r-4 border-primary bg-surface-container-high"
                : "text-on-surface-muted hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            {s.navLabel}
          </a>
        );
      })}
    </nav>
  );
}
