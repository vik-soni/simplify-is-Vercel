import { HTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

type CardVariant = "default" | "elevated" | "interactive";

const cardVariantClass: Record<CardVariant, string> = {
  default: "bg-surface-container-high ghost-border",
  elevated:
    "bg-surface-container-highest ghost-border shadow-[0_20px_40px_rgba(0,0,0,0.4)]",
  interactive:
    "bg-surface-container-high ghost-border transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow-brand",
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export function Card({ className, children, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-lg p-6 transition-colors", cardVariantClass[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
