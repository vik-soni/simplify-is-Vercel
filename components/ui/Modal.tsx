"use client";

import { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  widthClassName?: string;
};

export function Modal({ open, title, onClose, children, widthClassName = "max-w-lg" }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`w-full ${widthClassName} rounded-lg ghost-border bg-surface-container-highest shadow-[0_30px_60px_rgba(0,0,0,0.5)]`}
      >
        <div className="flex items-center justify-between ghost-border border-x-0 border-t-0 px-5 py-4">
          <h3 className="font-raleway text-lg font-bold text-on-surface">{title}</h3>
          <button
            className="rounded-sm p-1 text-on-surface-muted transition-colors hover:bg-surface-container-high hover:text-on-surface"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
