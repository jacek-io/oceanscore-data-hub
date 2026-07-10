"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { BrandingPanel } from "@/components/auth/branding-panel";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen flex bg-[#f3f4f6] p-4">
      <BrandingPanel />

      {/* Right — Reset form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center">
        <div className="w-[420px]">
          <div className="lg:hidden flex justify-center mb-8">
            <Image src="/oceanscore-logo.svg" alt="OceanScore" width={160} height={24} />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-[0_1px_1px_rgba(10,13,18,0.05)]">
            {sent ? (
              /* Success state */
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="w-14 h-14 rounded-full bg-[#e3f0db] flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-[#3d7c0f]" />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-medium text-[#1e2938] leading-[1.2] tracking-[-0.72px]">
                    Check your email
                  </h1>
                  <p className="text-sm text-[#697282] leading-[1.4] tracking-[-0.42px]">
                    We&apos;ve sent a password reset link to{" "}
                    <span className="font-medium text-[#1e2938]">{email}</span>.
                    Please check your inbox and follow the instructions.
                  </p>
                </div>
                <p className="text-xs text-[#98a1ae] mt-2">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setSent(false)}
                    className="text-[#0c3c7a] hover:text-[#061e3a] transition-colors"
                  >
                    try again
                  </button>
                </p>
                <Link
                  href="/login"
                  className="w-full h-10 rounded-lg bg-[#061e3a] text-white text-sm hover:bg-[#0a2e57] transition-colors flex items-center justify-center mt-2"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              /* Form state */
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-[#697282] hover:text-[#1e2938] transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>

                <div className="flex flex-col gap-2 mb-8">
                  <h1 className="text-2xl font-medium text-[#1e2938] leading-[1.2] tracking-[-0.72px]">
                    Reset your password
                  </h1>
                  <p className="text-sm text-[#697282] leading-[1.4] tracking-[-0.42px]">
                    Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-[#4a5565] leading-[1.45]">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#98a1ae]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        placeholder="you@company.com"
                        className="w-full h-10 pl-11 pr-4 rounded-lg border border-[#d1d5dc] bg-white text-sm text-[#1e2938] placeholder:text-[#98a1ae] focus:outline-none focus:ring-2 focus:ring-[#5c96e5] focus:border-transparent transition-shadow"
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-[#ffe2e1] border border-[#ffcaca] text-[#82181a] text-sm px-3 py-2 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full h-10 rounded-lg bg-[#061e3a] text-white text-sm hover:bg-[#0a2e57] transition-colors mt-4"
                  >
                    Send Reset Link
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
