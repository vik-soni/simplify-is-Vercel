import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getWaitlistEmailConfig } from "@/lib/config/server";
import { sendWaitlistNotificationEmail } from "@/lib/email/waitlist";

const WaitlistSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(80),
  last_name: z.string().trim().min(1, "Last name is required").max(80),
  organisation_name: z.string().trim().min(1, "Organisation name is required").max(160),
  email: z.string().trim().email("Enter a valid email address").max(320),
  source: z.string().trim().max(120).optional(),
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

  const validation = WaitlistSchema.safeParse(body);
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    const message =
      fieldErrors.first_name?.[0] ??
      fieldErrors.last_name?.[0] ??
      fieldErrors.organisation_name?.[0] ??
      fieldErrors.email?.[0] ??
      "Invalid submission. Please check your details and try again.";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
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
        error: "Waitlist is temporarily unavailable. Please email vik@simplify.is directly.",
      },
      { status: 503 },
    );
  }

  const parsed = validation.data;

  try {
    await sendWaitlistNotificationEmail(emailConfig, {
      firstName: parsed.first_name,
      lastName: parsed.last_name,
      organisationName: parsed.organisation_name,
      email: parsed.email,
      source: parsed.source ?? null,
      submitterIp: ip === "unknown" ? null : ip,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown error";
    if (process.env.NODE_ENV !== "production") {
      console.error("[waitlist] Resend send failed:", message);
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
