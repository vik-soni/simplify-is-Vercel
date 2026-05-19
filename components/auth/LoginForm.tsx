"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { AuthBanner } from "./AuthBanner";

const SHOWCASE_NOTICE =
  "This is a preview build. Sign-in is disabled while we prepare the full platform launch.";

export function LoginForm({
  successBanner,
  initialEmail,
}: {
  successBanner?: string;
  initialEmail?: string;
}) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <AuthBanner message={SHOWCASE_NOTICE} kind="success" />
      {successBanner ? <AuthBanner message={successBanner} kind="success" /> : null}
      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block font-josefin text-sm font-semibold tracking-wider text-secondary uppercase"
        >
          Login Email
        </label>
        <div className="relative group">
          <input
            id="email"
            required
            name="email"
            type="email"
            placeholder="name@organisation.com"
            defaultValue={initialEmail}
            className="w-full bg-surface-container border-0 border-b border-outline/20 px-0 py-3 text-on-surface placeholder:text-outline/40 outline-none focus:ring-0 focus:border-[#EB5E28] transition-all duration-300 font-montserrat text-sm"
          />
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#EB5E28] group-focus-within:w-full transition-all duration-500 shadow-[0_0_8px_rgba(235,94,40,0.5)]" />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="password"
            className="font-josefin text-sm font-semibold tracking-wider text-secondary uppercase"
          >
            Password
          </label>
          <span className="font-josefin text-xs text-outline/40 uppercase tracking-wider">
            Forgot password? (coming soon)
          </span>
        </div>
        <div className="relative group">
          <input
            id="password"
            required
            name="password"
            type="password"
            placeholder="••••••••••••"
            className="w-full bg-surface-container border-0 border-b border-outline/20 px-0 py-3 text-on-surface placeholder:text-outline/40 outline-none focus:ring-0 focus:border-[#EB5E28] transition-all duration-300 font-montserrat text-sm"
          />
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#EB5E28] group-focus-within:w-full transition-all duration-500 shadow-[0_0_8px_rgba(235,94,40,0.5)]" />
        </div>
      </div>

      {/* Remember me */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          name="remember_me"
          value="true"
          className="w-3.5 h-3.5 bg-transparent border border-outline/30 text-primary focus:ring-0 focus:ring-offset-0 rounded-none accent-[#EB5E28]"
        />
        <span className="font-josefin text-xs tracking-wider uppercase text-secondary group-hover:text-on-surface transition-colors">
          Remember me for 7 days
        </span>
      </label>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          className="group w-full bg-gradient-to-r from-[#EB5E28] to-[#C44A1A] text-[#1A1917] font-raleway font-bold py-4 rounded-sm shadow-lg hover:shadow-[#EB5E28]/20 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <span>Sign in</span>
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

      {/* OR divider */}
      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-outline/10" />
        <span className="flex-shrink mx-4 font-geist text-[10px] text-outline/40 uppercase tracking-widest">or</span>
        <div className="flex-grow border-t border-outline/10" />
      </div>

      {/* SSO — disabled */}
      <button
        type="button"
        disabled
        className="w-full bg-transparent border border-outline/20 text-secondary hover:bg-surface-bright hover:text-on-surface py-3 rounded-lg transition-all duration-300 font-josefin font-medium text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed pointer-events-none"
      >
        SSO Enterprise Login (Coming Soon)
      </button>

      {/* Create account */}
      <p className="text-center font-josefin text-xs uppercase tracking-wider text-secondary">
        No account?{" "}
        <Link href="/signup" className="text-[#EB5E28] font-bold hover:underline decoration-primary/30 underline-offset-4 ml-1">
          Register
        </Link>
      </p>

    </form>
  );
}
