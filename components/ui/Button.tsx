"use client";

import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/components/ui/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-primary to-primary-deep text-white shadow-glow-brand hover:shadow-glow-brand-lg active:scale-95",
  secondary:
    "ghost-border bg-transparent text-on-surface hover:bg-surface-container-high",
  ghost:
    "bg-transparent text-on-surface-muted hover:text-on-surface hover:bg-surface-container-high",
  danger:
    "bg-[#93000a] text-white hover:bg-[#93000a]/90",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs tracking-[0.2em]",
  md: "h-10 px-4 text-xs tracking-[0.2em]",
  lg: "h-12 px-6 text-xs tracking-[0.2em]",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm font-josefin font-bold uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
