import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

const baseField =
  "w-full rounded-sm ghost-border bg-surface-container-low px-3 text-on-surface font-montserrat placeholder:text-on-surface-muted/50 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-10", baseField, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-[96px] py-2", baseField, className)} {...props} />;
}
