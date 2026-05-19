"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ComingSoonModal } from "./ComingSoonModal";

interface ComingSoonOpenOptions {
  source?: string;
}

interface ComingSoonModalContextValue {
  open: (options?: ComingSoonOpenOptions) => void;
  close: () => void;
  isOpen: boolean;
}

const ComingSoonModalContext = createContext<ComingSoonModalContextValue | null>(null);

export function ComingSoonModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ComingSoonOpenOptions>({});

  const open = useCallback((next?: ComingSoonOpenOptions) => {
    setOptions(next ?? {});
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<ComingSoonModalContextValue>(
    () => ({ open, close, isOpen }),
    [open, close, isOpen],
  );

  return (
    <ComingSoonModalContext.Provider value={value}>
      {children}
      <ComingSoonModal open={isOpen} onClose={close} source={options.source} />
    </ComingSoonModalContext.Provider>
  );
}

export function useComingSoonModal(): ComingSoonModalContextValue {
  const ctx = useContext(ComingSoonModalContext);
  if (!ctx) {
    throw new Error("useComingSoonModal must be used within a ComingSoonModalProvider");
  }
  return ctx;
}
