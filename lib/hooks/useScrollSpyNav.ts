"use client";

import { useCallback, useEffect, useState } from "react";

interface UseScrollSpyNavOptions {
  sectionIds: ReadonlyArray<string>;
  rootMargin?: string;
  defaultId?: string;
}

interface ScrollSpyState {
  activeId: string;
  onNavClick: (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const DEFAULT_ROOT_MARGIN = "-30% 0px -55% 0px";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useScrollSpyNav({
  sectionIds,
  rootMargin = DEFAULT_ROOT_MARGIN,
  defaultId,
}: UseScrollSpyNavOptions): ScrollSpyState {
  const [activeId, setActiveId] = useState<string>(defaultId ?? sectionIds[0] ?? "");

  useEffect(() => {
    if (sectionIds.length === 0) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const initialHash = window.location.hash.replace(/^#/, "");
    if (initialHash && sectionIds.includes(initialHash)) {
      setActiveId(initialHash);
    }

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visibility = new Map<string, number>();
    sectionIds.forEach((id) => visibility.set(id, 0));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target.id, entry.intersectionRatio);
        });
        let bestId = activeId;
        let bestRatio = -1;
        sectionIds.forEach((id) => {
          const ratio = visibility.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestRatio > 0 && bestId !== activeId) {
          setActiveId(bestId);
        }
      },
      { rootMargin, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // sectionIds is stable per page render; activeId omitted to avoid re-creating observer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds, rootMargin]);

  const onNavClick = useCallback(
    (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      setActiveId(id);
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
      if (typeof window !== "undefined" && window.history) {
        window.history.replaceState(null, "", `#${id}`);
      }
    },
    [],
  );

  return { activeId, onNavClick };
}
