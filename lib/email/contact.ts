import type { WaitlistEmailConfig } from "@/lib/config/server";
import { getResendClient } from "./resendClient";

export interface ContactEmailInput {
  name: string;
  email: string;
  country: string;
  subject: string;
  message: string;
  submitterIp?: string | null;
}

const SUBJECT_LABELS: Record<string, string> = {
  pricing: "Pricing",
  security: "Security",
  frameworks: "Frameworks",
  maturity_model: "Maturity model",
  product_capability: "Product / capability",
  privacy: "Privacy",
  partnership: "Partnership",
  support: "Support",
  other: "Other",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactSubmissionEmail(
  config: WaitlistEmailConfig,
  input: ContactEmailInput,
): Promise<void> {
  const client = getResendClient();
  if (!client) {
    throw new Error("Resend is not configured");
  }

  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safeCountry = escapeHtml(input.country);
  const subjectLabel = escapeHtml(SUBJECT_LABELS[input.subject] ?? input.subject);
  const safeMessage = escapeHtml(input.message).replace(/\n/g, "<br/>");
  const safeIp = input.submitterIp ? escapeHtml(input.submitterIp) : "—";

  const subject = `Simplify IS contact — ${SUBJECT_LABELS[input.subject] ?? input.subject} — ${input.name}`;
  const html = [
    '<div style="font-family:system-ui,sans-serif;background:#1A1917;color:#FFFCF2;padding:24px">',
    "<h1 style=\"margin:0 0 12px;font-size:18px\">New contact submission</h1>",
    `<p style="margin:4px 0;color:#CCC5B9"><strong>Name:</strong> ${safeName}</p>`,
    `<p style="margin:4px 0;color:#CCC5B9"><strong>Email:</strong> ${safeEmail}</p>`,
    `<p style="margin:4px 0;color:#CCC5B9"><strong>Country:</strong> ${safeCountry}</p>`,
    `<p style="margin:4px 0;color:#CCC5B9"><strong>Reason:</strong> ${subjectLabel}</p>`,
    `<p style="margin:4px 0;color:#CCC5B9"><strong>IP:</strong> ${safeIp}</p>`,
    '<hr style="border:0;border-top:1px solid #403D39;margin:16px 0"/>',
    '<p style="margin:0 0 8px;color:#FFFCF2"><strong>Message</strong></p>',
    `<p style="margin:0;color:#FFFCF2;white-space:pre-wrap">${safeMessage}</p>`,
    "</div>",
  ].join("");

  const text = [
    "New contact submission",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Country: ${input.country}`,
    `Reason: ${SUBJECT_LABELS[input.subject] ?? input.subject}`,
    `IP: ${input.submitterIp ?? "—"}`,
    "",
    "Message:",
    input.message,
  ].join("\n");

  const { error } = await client.resend.emails.send({
    from: client.from,
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
