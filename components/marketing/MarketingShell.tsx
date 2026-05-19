"use client";

import { ReactNode, useEffect } from "react";
import { Footer } from "./Footer";
import { TopNav } from "./TopNav";
import { ContactModalProvider } from "./ContactModalProvider";

export function MarketingShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add("marketing");
    return () => {
      document.body.classList.remove("marketing");
    };
  }, []);

  return (
    <ContactModalProvider>
      <TopNav />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </ContactModalProvider>
  );
}
