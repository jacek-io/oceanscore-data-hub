"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    // Prototype auth
    if (password === "DHprototype2026") {
      document.cookie = "dh_auth=1; path=/; max-age=86400";
      window.location.href = "/";
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex w-[480px] bg-[#061e3a] flex-col justify-between p-10 relative overflow-hidden">
        {/* Decorative circles */}
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

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center bg-[#f3f4f6] px-6">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image src="/oceanscore-logo.svg" alt="OceanScore" width={160} height={24} />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col gap-1 mb-8">
              <h1 className="text-2xl font-medium text-[#1e2938] tracking-[-0.6px]">
                Welcome back
              </h1>
              <p className="text-sm text-[#697282]">
                Sign in to your Data Hub account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
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

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#4a5565]">Password</label>
                  <Link
                    href="/reset-password"
                    className="text-xs text-[#1157b2] hover:text-[#0a2e57] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#98a1ae]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Enter your password"
                    className="w-full h-11 pl-10 pr-11 rounded-lg border border-[#d1d5dc] bg-white text-sm text-[#1e2938] placeholder:text-[#98a1ae] focus:outline-none focus:ring-2 focus:ring-[#5c96e5] focus:border-transparent transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98a1ae] hover:text-[#697282] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-[#ffe2e1] border border-[#ffcaca] text-[#82181a] text-sm px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#061e3a] text-white text-sm font-medium hover:bg-[#0a2e57] transition-colors mt-2"
              >
                Sign In
              </button>
            </form>

            {/* Sign up link */}
            <p className="text-sm text-[#697282] text-center mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#1157b2] font-medium hover:text-[#0a2e57] transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
