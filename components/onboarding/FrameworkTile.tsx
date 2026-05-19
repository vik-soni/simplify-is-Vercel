"use client";

import { CheckCircle2, Lock } from "lucide-react";
import { FrameworkIcon } from "@/components/ui/FrameworkIcon";
import type { FrameworkTileData } from "@/lib/frameworks/library";
import type { FrameworkTileState } from "@/lib/frameworks/selection";
import { cn } from "@/components/ui/utils";

interface FrameworkTileProps {
  framework: FrameworkTileData;
  state: FrameworkTileState;
  /** Click handler — only fires for "selected" or "unselected" states. */
  onClick?: () => void;
  /** Whether to render the orange "✓" checkmark in the corner. */
  showCheckmark?: boolean;
  /** Whether to render the "Upgrade to access" pill (disabled-essential). */
  showUpgradePill?: boolean;
  /** Whether to render the "Included" pill (locked / NIST). */
  showIncludedPill?: boolean;
  /** When true, the tile renders as a non-interactive informational card. */
  informational?: boolean;
}

export function FrameworkTile({
  framework,
  state,
  onClick,
  showCheckmark = true,
  showUpgradePill = true,
  showIncludedPill = true,
  informational = false,
}: FrameworkTileProps): JSX.Element {
  const isInteractive = !informational && (state === "selected" || state === "unselected");
  const isLocked = state === "locked";
  const isDisabled = state === "disabled" || state === "disabled-essential";
  const isSelected = state === "selected" || isLocked;

  const baseClasses =
    "group relative flex h-full min-h-[220px] flex-col rounded-lg border p-5 text-left transition-all duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";

  const stateClasses = (() => {
    if (informational) {
      return "border-outline/15 bg-surface-container hover:border-outline/40 hover:bg-surface-container-high cursor-default";
    }
    if (isSelected) {
      return "border-primary bg-surface-container-high shadow-glow-brand cursor-default";
    }
    if (state === "disabled-essential") {
      return "cursor-not-allowed border-outline/10 bg-surface-container-low opacity-60";
    }
    if (state === "disabled") {
      return "cursor-not-allowed border-outline/10 bg-surface-container-low opacity-50";
    }
    return "border-outline/15 bg-surface-container hover:border-outline/40 hover:bg-surface-container-high cursor-pointer";
  })();

  const handleClick = (): void => {
    if (!isInteractive) return;
    onClick?.();
  };

  const ariaLabel = (() => {
    if (isLocked) return `${framework.name}, included with all plans`;
    if (state === "selected") return `${framework.name}, selected`;
    if (state === "disabled-essential")
      return `${framework.name}, upgrade to Professional to access`;
    if (state === "disabled")
      return `${framework.name}, additional framework limit reached`;
    return framework.name;
  })();

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isInteractive && !informational}
      aria-pressed={!informational ? isSelected : undefined}
      aria-disabled={isDisabled || isLocked}
      aria-label={ariaLabel}
      className={cn(baseClasses, stateClasses)}
    >
      <div className="mb-4 flex items-start justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-sm",
            isSelected
              ? "bg-primary/15"
              : isDisabled
                ? "bg-surface-container-high/50"
                : "bg-surface-container-high",
          )}
        >
          <FrameworkIcon framework={framework.id} size={28} muted={isDisabled && !isSelected} />
        </div>
        <div className="flex flex-col items-end gap-1">
          {showCheckmark && state === "selected" ? (
            <span
              aria-hidden
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-on-primary"
            >
              <CheckCircle2 className="h-4 w-4" />
            </span>
          ) : null}
          {showIncludedPill && isLocked ? (
            <span className="inline-flex items-center gap-1 rounded-sm bg-primary/15 px-2 py-1 font-geist text-[9px] font-bold uppercase tracking-[0.18em] text-primary">
              <Lock className="h-2.5 w-2.5" aria-hidden /> Included
            </span>
          ) : null}
          {showUpgradePill && state === "disabled-essential" ? (
            <span className="rounded-sm bg-surface-container-high px-2 py-1 font-geist text-[9px] font-bold uppercase tracking-[0.18em] text-on-surface-muted">
              Upgrade to access
            </span>
          ) : null}
        </div>
      </div>
      <h3 className="font-raleway text-base font-bold leading-tight text-on-surface">
        {framework.name}
      </h3>
      <span className="mt-2 inline-flex w-fit rounded-sm bg-surface-container-highest px-2 py-1 font-geist text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-muted">
        {framework.badge}
      </span>
      <p className="mt-3 font-montserrat text-xs leading-relaxed text-secondary">
        {framework.description}
      </p>
    </button>
  );
}
