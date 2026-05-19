import { Resend } from "resend";
import { getWaitlistEmailConfig } from "@/lib/config/server";

export function getResendClient(): { resend: Resend; from: string; alertTo: string } | null {
  const config = getWaitlistEmailConfig();
  if (!config) return null;
  return {
    resend: new Resend(config.RESEND_API_KEY),
    from: config.RESEND_FROM_EMAIL,
    alertTo: config.VIK_ALERT_EMAIL,
  };
}
