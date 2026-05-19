"use client";

import { type ReactNode } from "react";
import { ComingSoonModalProvider } from "@/components/marketing/ComingSoonModalProvider";
import { ContactModalProvider } from "@/components/marketing/ContactModalProvider";

/** Global modals available on every page (marketing, errors, login/signup). */
export function SiteModalProviders({ children }: { children: ReactNode }) {
  return (
    <ComingSoonModalProvider>
      <ContactModalProvider>{children}</ContactModalProvider>
    </ComingSoonModalProvider>
  );
}
