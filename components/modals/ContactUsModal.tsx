"use client";

import { Modal, Button, Input, Textarea } from "@/components/ui";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics/gtm";

type SubmitState = "idle" | "submitting" | "success" | "error";

interface ContactUsModalProps {
  open: boolean;
  onClose: () => void;
  prefillName?: string;
  prefillEmail?: string;
  lockPrefilled?: boolean;
}

const MIN_MESSAGE_LENGTH = 10;
// RFC-5322-style pragmatic regex — matches the server-side zod `.email()`.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Stored as `contact_submissions.subject` — no free-text subject line; "Other" relies on message body. */
const CONTACT_SUBJECT_OPTIONS = [
  { value: "pricing", label: "Pricing" },
  { value: "security", label: "Security" },
  { value: "frameworks", label: "Frameworks" },
  { value: "maturity_model", label: "Maturity model" },
  { value: "product_capability", label: "Product / capability" },
  { value: "privacy", label: "Privacy" },
  { value: "partnership", label: "Partnership" },
  { value: "support", label: "Support" },
  { value: "other", label: "Other" },
] as const;

export function ContactUsModal({
  open,
  onClose,
  prefillName,
  prefillEmail,
  lockPrefilled = false,
}: ContactUsModalProps) {
  const [name, setName] = useState(prefillName ?? "");
  const [email, setEmail] = useState(prefillEmail ?? "");
  const [country, setCountry] = useState("");
  const [subject, setSubject] = useState<(typeof CONTACT_SUBJECT_OPTIONS)[number]["value"] | "">("");
  const [message, setMessage] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && state !== "submitting") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, state]);

  useEffect(() => {
    if (!open) {
      setName(prefillName ?? "");
      setEmail(prefillEmail ?? "");
      setCountry("");
      setSubject("");
      setMessage("");
      setEmailTouched(false);
      setState("idle");
      setErrorMessage(null);
    }
  }, [open, prefillName, prefillEmail]);

  useEffect(() => {
    if (state !== "success") return;
    const timer = window.setTimeout(() => {
      onClose();
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [state, onClose]);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedCountry = country.trim();
  const trimmedMessage = message.trim();
  const emailValid = EMAIL_PATTERN.test(trimmedEmail);
  const subjectOk = subject !== "";
  const isValid =
    trimmedName.length > 0 &&
    emailValid &&
    trimmedCountry.length > 0 &&
    subjectOk &&
    trimmedMessage.length >= MIN_MESSAGE_LENGTH;

  const nameReadOnly = lockPrefilled && !!prefillName;
  const emailReadOnly = lockPrefilled && !!prefillEmail;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid || state === "submitting") return;

    setState("submitting");
    setErrorMessage(null);
    trackEvent("form_submit", { form: "contact_us" });

    // Preview build: acknowledge locally without calling the API.
    void trimmedName;
    void trimmedEmail;
    void trimmedCountry;
    void subject;
    void trimmedMessage;
    setState("success");
  }

  return (
    <Modal open={open} onClose={state === "submitting" ? () => undefined : onClose} title="Contact Us">
      {state === "success" ? (
        <div className="space-y-3 py-6 text-center">
          <div className="font-raleway text-lg font-bold text-on-surface">Thanks — we&apos;ll be in touch shortly.</div>
          <p className="text-sm text-on-surface-muted font-montserrat font-light">
            Your message is on its way to the Simplify IS team.
          </p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <p className="text-sm text-on-surface-muted font-montserrat font-light">
            Tell us how to reach you and we&apos;ll respond within one business day.
          </p>

          <div>
            <label htmlFor="contact-name" className="mb-1 block text-xs text-secondary">
              Name <span className="text-primary">*</span>
            </label>
            <Input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              disabled={state === "submitting"}
              readOnly={nameReadOnly}
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="mb-1 block text-xs text-secondary">
              Email <span className="text-primary">*</span>
            </label>
            <Input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              required
              autoComplete="email"
              disabled={state === "submitting"}
              readOnly={emailReadOnly}
              aria-invalid={emailTouched && !emailValid}
              aria-describedby="contact-email-hint"
            />
            {emailTouched && !emailValid && trimmedEmail.length > 0 && (
              <div id="contact-email-hint" className="mt-1 text-[11px] text-danger">
                Enter a valid email address so we can reply.
              </div>
            )}
          </div>

          <div>
            <label htmlFor="contact-subject" className="mb-1 block text-xs text-secondary">
              Reason for your message <span className="text-primary">*</span>
            </label>
            <select
              id="contact-subject"
              value={subject}
              onChange={(e) => {
                const v = e.target.value;
                setSubject(
                  v === "" ? "" : (v as (typeof CONTACT_SUBJECT_OPTIONS)[number]["value"]),
                );
              }}
              disabled={state === "submitting"}
              required
              className="w-full rounded-sm border border-outline/20 bg-surface-container px-3 py-2.5 font-montserrat text-sm text-on-surface focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-60"
            >
              <option value="">Select a reason…</option>
              {CONTACT_SUBJECT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contact-country" className="mb-1 block text-xs text-secondary">
              Country <span className="text-primary">*</span>
            </label>
            <Input
              id="contact-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              autoComplete="country-name"
              disabled={state === "submitting"}
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="mb-1 block text-xs text-secondary">
              Message <span className="text-primary">*</span>
            </label>
            <Textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              minLength={MIN_MESSAGE_LENGTH}
              disabled={state === "submitting"}
              placeholder="Tell us more — if you chose Other, use this field to explain."
            />
            <div className="mt-1 text-[11px] text-on-surface-muted">
              Minimum {MIN_MESSAGE_LENGTH} characters.
            </div>
          </div>

          {state === "error" && errorMessage && (
            <div
              role="alert"
              className="rounded-sm border border-error/30 bg-error/10 px-3 py-2 text-xs text-error"
            >
              {errorMessage}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={state === "submitting"}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || state === "submitting"}>
              {state === "submitting" ? "Sending…" : "Send Message"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
