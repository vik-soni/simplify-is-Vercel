// INTERIM: replace with custom SVG in Claude Code polish pass.
// This component renders a Lucide icon as a fallback per Agent 11 §5.5.
// When the 18 hand-crafted SVGs land in `public/icons/frameworks/`, swap
// the body of this component to load the asset for the active theme. The
// public surface (`framework`, `size`, `className` props) should remain
// stable so consumers (FrameworkTile, marketing pages) keep working.

import {
  AlertOctagon,
  Banknote,
  ClipboardList,
  Cpu,
  CreditCard,
  HeartPulse,
  Network,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/components/ui/utils";

interface FrameworkIconProps {
  framework: string;
  size?: number;
  className?: string;
  /** Render in muted accent rather than primary stroke. */
  muted?: boolean;
}

const FRAMEWORK_ICON_MAP: Record<string, LucideIcon> = {
  nist_csf_2_0: Shield,
  iso_27001_2022: ShieldCheck,
  pci_dss_4_0: CreditCard,
  apra_cps_234: Banknote,
  apra_cps_230: AlertOctagon,
  asd_essential_eight: ShieldAlert,
  iso_42001: Cpu,
  auva_iss: Sparkles,
  nist_ai_rmf: Network,
  soc_2_placeholder: ClipboardList,
  aus_ism_placeholder: ShieldAlert,
  hipaa_placeholder: HeartPulse,
};

export function FrameworkIcon({
  framework,
  size = 40,
  className,
  muted = false,
}: FrameworkIconProps): JSX.Element {
  const Icon = FRAMEWORK_ICON_MAP[framework] ?? Shield;
  return (
    <Icon
      width={size}
      height={size}
      strokeWidth={1.75}
      aria-hidden
      className={cn(
        muted ? "text-on-surface-muted" : "text-primary",
        "shrink-0",
        className,
      )}
    />
  );
}
