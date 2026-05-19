"use client";

import { ReactNode } from "react";
import { useContactModal } from "./ContactModalProvider";
import { trackEvent } from "@/lib/analytics/gtm";

interface ContactCtaButtonProps {
  children: ReactNode;
  className?: string;
  placement?: string;
}

export function ContactCtaButton({ children, className, placement }: ContactCtaButtonProps) {
  const { open } = useContactModal();
  return (
    <button
      type="button"
      onClick={() => {
        if (placement) trackEvent("cta_click", { target: "contact_us_modal", placement });
        open();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
