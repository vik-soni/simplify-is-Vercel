import { z } from "zod";

const waitlistEmailSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),
  VIK_ALERT_EMAIL: z.string().email(),
});

export type WaitlistEmailConfig = z.infer<typeof waitlistEmailSchema>;

export function getWaitlistEmailConfig(): WaitlistEmailConfig | null {
  const result = waitlistEmailSchema.safeParse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    VIK_ALERT_EMAIL: process.env.VIK_ALERT_EMAIL ?? "vik@simplify.is",
  });
  return result.success ? result.data : null;
}
