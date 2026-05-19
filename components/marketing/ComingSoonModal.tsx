"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { ComingSoonContent } from "./ComingSoonContent";

interface ComingSoonModalProps {
  open: boolean;
  onClose: () => void;
  source?: string;
}

export function ComingSoonModal({ open, onClose, source }: ComingSoonModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] overflow-y-auto bg-surface font-montserrat text-on-surface"
      role="dialog"
      aria-modal="true"
      aria-label="Coming soon"
    >
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 md:px-8"
        style={{ background: "rgba(20,19,17,0.9)", backdropFilter: "blur(12px)" }}
      >
        <Link href="/" className="font-raleway text-xl font-black tracking-tighter text-on-surface">
          Simplify IS
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-outline/20 text-on-surface-muted transition-colors hover:border-primary/40 hover:text-on-surface"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </header>

      <main
        className="relative flex min-h-[calc(100vh-4.5rem)] flex-col items-center justify-center px-4 py-12 md:px-8"
        style={{ background: "linear-gradient(135deg, #141311 0%, #1c1b19 100%)" }}
      >
        <ComingSoonContent variant="modal" source={source} />
      </main>
    </div>
  );
}
