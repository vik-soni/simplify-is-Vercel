"use client";

import { type CSSProperties, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics/gtm";
import { useComingSoonModal } from "./ComingSoonModalProvider";

interface ComingSoonTriggerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  source?: string;
  placement?: string;
}

export function ComingSoonTrigger({
  children,
  className,
  style,
  source,
  placement,
}: ComingSoonTriggerProps) {
  const { open } = useComingSoonModal();

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => {
        trackEvent("cta_click", {
          target: "coming_soon",
          placement: placement ?? source ?? "unknown",
        });
        open({ source: source ?? placement });
      }}
    >
      {children}
    </button>
  );
}
