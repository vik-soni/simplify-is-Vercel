"use client";

import { ReactNode, useEffect } from "react";
import { Footer } from "./Footer";
import { TopNav } from "./TopNav";

export function MarketingShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add("marketing");
    return () => {
      document.body.classList.remove("marketing");
    };
  }, []);

  return (
    <>
      <TopNav />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
}
