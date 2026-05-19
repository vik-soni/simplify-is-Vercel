"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics/gtm";

type SubmitState = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full bg-surface-container border-0 border-b border-outline/20 px-0 py-3 text-on-surface placeholder:text-outline/40 outline-none focus:ring-0 focus:border-[#EB5E28] transition-all duration-300 font-montserrat text-sm";

interface ComingSoonContentProps {
  variant?: "modal" | "page";
  source?: string;
  onSuccess?: () => void;
}

export function ComingSoonContent({
  variant = "modal",
  source = "website",
  onSuccess,
}: ComingSoonContentProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const headlineSize = variant === "page" ? "clamp(6rem, 20vw, 14rem)" : "clamp(4rem, 14vw, 8rem)";
  const titleSize = variant === "page" ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "submitting") return;

    setState("submitting");
    setErrorMessage(null);
    trackEvent("form_submit", { form: "waitlist", source });

    try {
      const response = await fetch("/api/v1/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          organisation_name: organisationName.trim(),
          email: email.trim(),
          source,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string }
        | null;

      if (!response.ok || !payload?.success) {
        setErrorMessage(payload?.error ?? "Something went wrong. Please try again shortly.");
        setState("error");
        trackEvent("form_error", { form: "waitlist", status: response.status });
        return;
      }

      setState("success");
      trackEvent("signup_completed", { form: "waitlist", source });
      onSuccess?.();
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setState("error");
      trackEvent("form_error", { form: "waitlist", status: "network" });
    }
  }

  return (
    <div className="relative w-full text-center">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
        <div
          className="h-[min(520px,70vw)] w-[min(520px,70vw)] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, #EB5E28, transparent)" }}
        />
      </div>

      <div className="relative z-10">
        <div className="mb-6 inline-flex items-center gap-2 border border-outline/15 bg-surface-container-high px-4 py-1.5">
          <span className="font-geist text-[10px] uppercase tracking-[0.2em] text-primary">
            Coming soon · Something big is brewing
          </span>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden />
        </div>

        <div className="mb-4">
          <p
            className="select-none font-raleway font-black leading-none tracking-tighter text-surface-container-highest"
            style={{ fontSize: headlineSize }}
            aria-hidden
          >
            SOON
          </p>
          <div style={{ marginTop: variant === "page" ? "clamp(-2.5rem, -5vw, -4rem)" : "-1.5rem" }}>
            <h1 className={`font-raleway font-black uppercase tracking-tight text-on-surface ${titleSize}`}>
              We&apos;re almost ready
            </h1>
          </div>
        </div>

        <div className="mx-auto mb-8 max-w-xl space-y-3">
          <p className="font-montserrat text-lg font-light leading-relaxed text-on-surface-muted md:text-xl">
            Simplify IS is coming soon — and we&apos;re genuinely excited to show you what
            we&apos;ve been building with Cypher.
          </p>
          <p className="font-montserrat text-sm font-light leading-relaxed text-on-surface-muted/90">
            We&apos;ll tell you shortly when it&apos;s ready for demo, signup, and early launch
            credits for your first months on the platform.
          </p>
        </div>

        {state === "success" ? (
          <SuccessMessage />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-lg space-y-5 rounded-sm border border-outline/10 bg-surface-container-low/80 p-6 text-left backdrop-blur-sm md:p-8"
          >
            <div>
              <h2 className="font-josefin text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Get on the list
              </h2>
              <p className="mt-2 font-montserrat text-sm font-light text-on-surface-muted">
                Excited? Leave your details and we&apos;ll reach out when you can demo, sign up, or
                claim launch credits.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First name" id="waitlist-first-name" required>
                <input
                  id="waitlist-first-name"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={state === "submitting"}
                  placeholder="Jane"
                  className={inputClass}
                />
              </Field>
              <Field label="Last name" id="waitlist-last-name" required>
                <input
                  id="waitlist-last-name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={state === "submitting"}
                  placeholder="Smith"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Organisation name" id="waitlist-organisation" required>
              <input
                id="waitlist-organisation"
                name="organisation_name"
                required
                autoComplete="organization"
                value={organisationName}
                onChange={(e) => setOrganisationName(e.target.value)}
                disabled={state === "submitting"}
                placeholder="Acme Corp"
                className={inputClass}
              />
            </Field>

            <Field label="Work email" id="waitlist-email" required>
              <input
                id="waitlist-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={state === "submitting"}
                placeholder="jane@organisation.com"
                className={inputClass}
              />
            </Field>

            {errorMessage ? (
              <p className="font-montserrat text-sm text-red-400/90" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={state === "submitting"}
              className="group flex w-full items-center justify-center gap-3 rounded-sm bg-gradient-to-r from-[#EB5E28] to-[#C44A1A] py-4 font-raleway font-bold text-[#1A1917] shadow-lg transition-all duration-300 hover:shadow-[#EB5E28]/20 active:scale-[0.98] disabled:opacity-60"
            >
              <span>{state === "submitting" ? "Sending…" : "Notify me when it's ready"}</span>
              {state !== "submitting" ? (
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              ) : null}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  required,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block font-josefin text-[10px] font-bold uppercase tracking-[0.15em] text-secondary"
      >
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </label>
      <div className="relative group">{children}</div>
    </div>
  );
}

function SuccessMessage() {
  return (
    <div className="mx-auto max-w-lg space-y-3 rounded-sm border border-primary/30 bg-surface-container-low p-8">
      <p className="font-raleway text-xl font-bold text-on-surface">You&apos;re on the list!</p>
      <p className="font-montserrat text-sm font-light leading-relaxed text-on-surface-muted">
        Thanks for your excitement — we&apos;ll reach out when Simplify IS is ready for demo, signup,
        and launch credits.
      </p>
    </div>
  );
}
