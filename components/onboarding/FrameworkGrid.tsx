import type { ReactNode } from "react";
import { cn } from "@/components/ui/utils";

/**
 * Layout wrapper for the canonical 3×3 framework grid.
 *  - Desktop (lg+): 3 columns
 *  - Tablet (md):   2 columns (last row centred via auto-fill)
 *  - Mobile:        1 column
 *
 * Pure layout — children control their own appearance.
 */
export function FrameworkGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <div
      role="group"
      aria-label="Framework selection"
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
