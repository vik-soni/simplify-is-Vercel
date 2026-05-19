import { Resend } from "resend";
import type { WaitlistEmailConfig } from "@/lib/config/server";

export interface WaitlistSubmission {
  firstName: string;
  lastName: string;
  organisationName: string;
  email: string;
  source?: string | null;
  submitterIp?: string | null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendWaitlistNotificationEmail(
  config: WaitlistEmailConfig,
  input: WaitlistSubmission,
): Promise<void> {
  const resend = new Resend(config.RESEND_API_KEY);
  const fullName = `${input.firstName} ${input.lastName}`.trim();
  const safe = {
    firstName: escapeHtml(input.firstName),
    lastName: escapeHtml(input.lastName),
    organisation: escapeHtml(input.organisationName),
    email: escapeHtml(input.email),
    source: escapeHtml(input.source ?? "website"),
    ip: escapeHtml(input.submitterIp ?? "—"),
  };

  const subject = `Simplify IS waitlist — ${fullName} @ ${input.organisationName}`;
  const html = [
    '<div style="font-family:system-ui,sans-serif;background:#1A1917;color:#FFFCF2;padding:24px">',
    '<h1 style="margin:0 0 16px;font-size:20px;color:#EB5E28">New launch waitlist signup</h1>',
    `<p style="margin:4px 0;color:#CCC5B9"><strong>First name:</strong> ${safe.firstName}</p>`,
    `<p style="margin:4px 0;color:#CCC5B9"><strong>Last name:</strong> ${safe.lastName}</p>`,
    `<p style="margin:4px 0;color:#CCC5B9"><strong>Organisation:</strong> ${safe.organisation}</p>`,
    `<p style="margin:4px 0;color:#CCC5B9"><strong>Email:</strong> ${safe.email}</p>`,
    `<p style="margin:4px 0;color:#CCC5B9"><strong>Source:</strong> ${safe.source}</p>`,
    `<p style="margin:4px 0;color:#CCC5B9"><strong>IP:</strong> ${safe.ip}</p>`,
    '<hr style="border:0;border-top:1px solid #403D39;margin:20px 0"/>',
    '<p style="margin:0;color:#FFFCF2;font-size:14px;line-height:1.6">',
    "They asked to be notified when Simplify IS is ready for demo, signup, or launch credits. ",
    "Reply directly to reach them.",
    "</p></div>",
  ].join("");

  const text = [
    "New launch waitlist signup",
    `First name: ${input.firstName}`,
    `Last name: ${input.lastName}`,
    `Organisation: ${input.organisationName}`,
    `Email: ${input.email}`,
    `Source: ${input.source ?? "website"}`,
    `IP: ${input.submitterIp ?? "—"}`,
    "",
    "They asked to be notified when Simplify IS is ready for demo, signup, or launch credits.",
  ].join("\n");

  const { error } = await resend.emails.send({
    from: config.RESEND_FROM_EMAIL,
    to: config.VIK_ALERT_EMAIL,
    subject,
    html,
    text,
    replyTo: input.email,
  });

  if (error) {
    throw new Error(error.message);
  }
}
