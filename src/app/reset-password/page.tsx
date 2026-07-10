"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-screen flex">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex w-[480px] bg-[#061e3a] flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full bg-[#0a2e57]/60" />
        <div className="absolute bottom-10 -right-16 w-[200px] h-[200px] rounded-full bg-[#1157b2]/20" />
        <div className="absolute top-1/2 left-1/3 w-[120px] h-[120px] rounded-full bg-[#5c96e5]/10" />

        <div className="relative z-10">
          <Image
            src="/oceanscore-logo.svg"
            alt="OceanScore"
            width={180}
            height={28}
            className="brightness-0 invert"
          />
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          <h2 className="text-3xl font-medium text-white leading-[1.3] tracking-[-0.96px]">
            Centralized maritime
            <br />
            environmental data
          </h2>
          <p className="text-[15px] text-white/60 leading-[1.6] max-w-[340px]">
            Manage your fleet&apos;s ESI &amp; EPI scores, BDNs, EDNs, and Tier III hours — all in one place.
          </p>
        </div>

        <p className="relative z-10 text-xs text-white/30">
          &copy; 2026 OceanScore GmbH. All rights reserved.
        </p>
      </div>

      {/* Right — Reset form */}
      <div className="flex-1 flex items-center justify-center bg-[#f3f4f6] px-6">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden flex justify-center mb-8">
            <Image src="/oceanscore-logo.svg" alt="OceanScore" width={160} height={24} />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            {sent ? (
              /* Success state */
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="w-14 h-14 rounded-full bg-[#e3f0db] flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-[#3d7c0f]" />
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-medium text-[#1e2938] tracking-[-0.6px]">
                    Check your email
                  </h1>
                  <p className="text-sm text-[#697282] leading-[1.6]">
                    We&apos;ve sent a password reset link to{" "}
                    <span className="font-medium text-[#1e2938]">{email}</span>.
                    Please check your inbox and follow the instructions.
                  </p>
                </div>
                <p className="text-xs text-[#98a1ae] mt-2">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setSent(false)}
                    className="text-[#1157b2] hover:text-[#0a2e57] transition-colors"
                  >
                    try again
                  </button>
                </p>
                <Link
                  href="/login"
                  className="w-full h-11 rounded-lg bg-[#061e3a] text-white text-sm font-medium hover:bg-[#0a2e57] transition-colors flex items-center justify-center mt-2"
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

                <div className="flex flex-col gap-1 mb-8">
                  <h1 className="text-2xl font-medium text-[#1e2938] tracking-[-0.6px]">
                    Reset your password
                  </h1>
                  <p className="text-sm text-[#697282] leading-[1.6]">
                    Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#4a5565]">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#98a1ae]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        placeholder="you@company.com"
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#d1d5dc] bg-white text-sm text-[#1e2938] placeholder:text-[#98a1ae] focus:outline-none focus:ring-2 focus:ring-[#5c96e5] focus:border-transparent transition-shadow"
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
                    className="w-full h-11 rounded-lg bg-[#061e3a] text-white text-sm font-medium hover:bg-[#0a2e57] transition-colors mt-2"
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
