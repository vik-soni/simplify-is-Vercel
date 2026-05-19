"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthBanner } from "./AuthBanner";
import { PlanSelector, type SignupPlan } from "./PlanSelector";

const SHOWCASE_NOTICE =
  "This is a preview build. Account creation is disabled while we prepare the full platform launch.";

function getStrength(password: string): "weak" | "medium" | "strong" {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  if (score <= 2) return "weak";
  if (score === 3) return "medium";
  return "strong";
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-outline/30" />
      <span className="font-josefin text-[9px] tracking-[0.25em] text-secondary/40 uppercase">
        {label}
      </span>
      <span className="h-px flex-1 bg-outline/30" />
    </div>
  );
}

function FieldGroup({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block font-josefin text-[10px] font-bold tracking-[0.15em] text-secondary uppercase"
      >
        {label}
      </label>
      <div className="relative group">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full bg-surface-container border-0 border-b-2 border-outline/30 px-0 py-3 text-on-surface placeholder:text-outline/40 outline-none focus:ring-0 focus:border-[#EB5E28] transition-all duration-300 font-montserrat text-sm";

const underlineClass =
  "absolute bottom-0 left-0 w-0 h-[2px] bg-[#EB5E28] group-focus-within:w-full transition-all duration-500 shadow-[0_0_8px_rgba(235,94,40,0.5)]";

const selectClass =
  "w-full bg-surface-container border-0 border-b-2 border-outline/30 px-0 py-3 text-on-surface placeholder:text-outline/40 outline-none focus:ring-0 focus:outline-none focus:border-[#EB5E28] transition-all duration-300 font-montserrat text-sm appearance-none";

export function SignupForm() {
  const searchParams = useSearchParams();
  const initialPlan: SignupPlan =
    searchParams?.get("plan") === "professional" ? "professional" : "essential";
  const [plan, setPlan] = useState<SignupPlan>(initialPlan);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const strength = useMemo(() => getStrength(password), [password]);
  const passwordsMatch = confirm.length > 0 && confirm === password;

  const strengthConfig = {
    weak: { segments: 1, color: "bg-red-500", label: "Weak" },
    medium: { segments: 2, color: "bg-amber-400", label: "Fair" },
    strong: { segments: 3, color: "bg-emerald-500", label: "Strong" },
  }[strength];

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <AuthBanner kind="success" message={SHOWCASE_NOTICE} />
      <PlanSelector value={plan} onChange={setPlan} />
      {plan === "professional" ? (
        <p className="-mt-2 font-montserrat text-[11px] leading-relaxed text-on-surface-muted">
          You&rsquo;ll be prompted for payment details after creating your account.
          Frameworks can be selected during onboarding.
        </p>
      ) : null}
      <SectionDivider label="Identity" />

      {/* Full name */}
      <FieldGroup id="full_name" label="Full Name">
        <input
          id="full_name"
          required
          name="full_name"
          type="text"
          placeholder="Jane Smith"
          className={inputClass}
        />
        <div className={underlineClass} />
      </FieldGroup>

      {/* Email */}
      <FieldGroup id="email" label="Work Email">
        <input
          id="email"
          required
          name="email"
          type="email"
          placeholder="jane@organisation.com"
          className={inputClass}
        />
        <div className={underlineClass} />
      </FieldGroup>

      <SectionDivider label="Security" />

      {/* Password */}
      <FieldGroup id="password" label="Password">
        <input
          id="password"
          required
          name="password"
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        <div className={underlineClass} />
      </FieldGroup>

      {/* Strength bar */}
      {password.length > 0 && (
        <div className="space-y-1 -mt-2">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                  i < strengthConfig.segments ? strengthConfig.color : "bg-outline/15"
                }`}
              />
            ))}
          </div>
          <p className="font-josefin text-[9px] tracking-widest text-secondary/60 uppercase">
            {strengthConfig.label}
          </p>
        </div>
      )}

      {/* Confirm password */}
      <FieldGroup id="confirm_password" label="Confirm Password">
        <input
          id="confirm_password"
          required
          name="confirm_password"
          type="password"
          placeholder="••••••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
        />
        <div className={underlineClass} />
      </FieldGroup>

      {confirm.length > 0 && (
        <p
          className={`font-josefin text-[9px] tracking-wider uppercase -mt-2 ${
            passwordsMatch ? "text-emerald-500" : "text-red-500/80"
          }`}
        >
          {passwordsMatch ? "Passwords match" : "Passwords do not match"}
        </p>
      )}

      <SectionDivider label="Organisation" />

      {/* Organisation name */}
      <FieldGroup id="organisation_name" label="Organisation Name">
        <input
          id="organisation_name"
          required
          name="organisation_name"
          type="text"
          placeholder="Acme Corp"
          className={inputClass}
        />
        <div className={underlineClass} />
      </FieldGroup>

      {/* Job title */}
      <FieldGroup id="job_title" label="Job Title">
        <input
          id="job_title"
          required
          name="job_title"
          type="text"
          placeholder="CISO / Security Manager"
          className={inputClass}
        />
        <div className={underlineClass} />
      </FieldGroup>

      {/* Team size */}
      <div className="space-y-2">
        <label
          htmlFor="team_size"
          className="block font-josefin text-[10px] font-bold tracking-[0.15em] text-secondary uppercase"
        >
          Team Size
        </label>
        <div className="relative group">
          <select id="team_size" required name="team_size" className={selectClass}>
            <option value="">Select range</option>
            <option value="1-10">1–10</option>
            <option value="11-50">11–50</option>
            <option value="51-200">51–200</option>
            <option value="201-500">201–500</option>
            <option value="500+">500+</option>
          </select>
          <div className={underlineClass} />
        </div>
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <label
          htmlFor="industry"
          className="block font-josefin text-[10px] font-bold tracking-[0.15em] text-secondary uppercase"
        >
          Industry
        </label>
        <div className="relative group">
          <select id="industry" required name="industry" className={selectClass}>
            <option value="">Select industry</option>
            <option>Financial Services</option>
            <option>Healthcare</option>
            <option>Government</option>
            <option>Technology</option>
            <option>Retail</option>
            <option>Education</option>
            <option>Legal</option>
            <option>Manufacturing</option>
            <option>Other</option>
          </select>
          <div className={underlineClass} />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          className="group w-full bg-gradient-to-r from-[#EB5E28] to-[#C44A1A] text-[#1A1917] font-raleway font-bold py-4 rounded-sm shadow-lg hover:shadow-[#EB5E28]/20 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <span>Create account</span>
          <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </button>
      </div>

      <p className="text-center font-montserrat text-[11px] text-secondary/60">
        Already provisioned?{" "}
        <Link href="/login" className="text-[#EB5E28] font-bold hover:underline decoration-primary/30 underline-offset-4 ml-1">
          Sign In
        </Link>
      </p>
    </form>
  );
}
