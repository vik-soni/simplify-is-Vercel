import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getWaitlistEmailConfig } from "@/lib/config/server";
import { sendContactSubmissionEmail } from "@/lib/email/contact";

const CONTACT_SUBJECT_ENUM = z.enum([
  "pricing",
  "security",
  "frameworks",
  "maturity_model",
  "product_capability",
  "privacy",
  "partnership",
  "support",
  "other",
]);

const ContactSubmissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(320),
  country: z.string().trim().min(1, "Country is required").max(120),
  subject: CONTACT_SUBJECT_ENUM,
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
});

const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitStore.get(ip) ?? []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitStore.set(ip, timestamps);
    return true;
  }
  rateLimitStore.set(ip, [...timestamps, now]);
  return false;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid submission. Please check your details and try again." },
      { status: 400 },
    );
  }

  const validation = ContactSubmissionSchema.safeParse(body);
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    const msg =
      (fieldErrors.subject?.[0] as string | undefined) ??
      (fieldErrors.message?.[0] as string | undefined) ??
      (fieldErrors.email?.[0] as string | undefined) ??
      "Invalid submission. Please check your details and try again.";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }

  const ip = getClientIp(request);
  if (ip !== "unknown" && isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many submissions. Please try again later." },
      { status: 429 },
    );
  }

  const emailConfig = getWaitlistEmailConfig();
  if (!emailConfig) {
    return NextResponse.json(
      {
        success: false,
        error: "Contact form is temporarily unavailable. Please email vik@simplify.is directly.",
      },
      { status: 503 },
    );
  }

  const parsed = validation.data;

  try {
    await sendContactSubmissionEmail(emailConfig, {
      name: parsed.name,
      email: parsed.email,
      country: parsed.country,
      subject: parsed.subject,
      message: parsed.message,
      submitterIp: ip === "unknown" ? null : ip,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown error";
    if (process.env.NODE_ENV !== "production") {
      console.error("[contact] Resend send failed:", message);
    }
    return NextResponse.json(
      {
        success: false,
        error:
          process.env.NODE_ENV === "production"
            ? "Something went wrong. Please try again shortly."
            : `Email send failed: ${message}`,
      },
      { status: 500 },
    );
  }
}
