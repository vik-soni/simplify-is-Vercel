"use client";

import { type ElementType } from "react";
import { useContactModal } from "./ContactModalProvider";

interface ContactHelperCardProps {
  Icon: ElementType;
  title: string;
  body: string;
}

export function ContactHelperCard({ Icon, title, body }: ContactHelperCardProps) {
  const { open } = useContactModal();

  return (
    <button
      type="button"
      onClick={() => open()}
      className="flex h-full flex-col bg-surface-container-low p-8 border border-outline/5 text-left transition-all hover:border-primary/40 hover:bg-surface-container"
    >
      <Icon className="text-primary mb-4 h-7 w-7" strokeWidth={1.5} aria-hidden />
      <h3 className="mb-2 font-josefin text-xs font-bold uppercase tracking-widest text-on-surface">
        {title}
      </h3>
      <p className="font-montserrat text-xs font-light leading-relaxed text-on-surface-muted">{body}</p>
    </button>
  );
}
