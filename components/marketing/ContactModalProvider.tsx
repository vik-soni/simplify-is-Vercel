"use client";

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import { ContactUsModal } from "@/components/modals/ContactUsModal";

interface ContactModalOpenOptions {
  prefillName?: string;
  prefillEmail?: string;
  lockPrefilled?: boolean;
}

interface ContactModalContextValue {
  open: (options?: ContactModalOpenOptions) => void;
  close: () => void;
  isOpen: boolean;
}

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ContactModalOpenOptions>({});

  const open = useCallback((next?: ContactModalOpenOptions) => {
    setOptions(next ?? {});
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<ContactModalContextValue>(
    () => ({ open, close, isOpen }),
    [open, close, isOpen],
  );

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      <ContactUsModal
        open={isOpen}
        onClose={close}
        prefillName={options.prefillName}
        prefillEmail={options.prefillEmail}
        lockPrefilled={options.lockPrefilled}
      />
    </ContactModalContext.Provider>
  );
}

export function useContactModal(): ContactModalContextValue {
  const ctx = useContext(ContactModalContext);
  if (!ctx) {
    throw new Error("useContactModal must be used within a ContactModalProvider");
  }
  return ctx;
}
