"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { BrandingPanel } from "@/components/auth/branding-panel";

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
    <div className="min-h-screen flex bg-[#f3f4f6] p-4">
      <BrandingPanel />

      {/* Right — Login form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center">
        <div className="w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image src="/oceanscore-logo.svg" alt="OceanScore" width={160} height={24} />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-[0_1px_1px_rgba(10,13,18,0.05)]">
            <div className="flex flex-col gap-2 mb-8">
              <h1 className="text-2xl font-medium text-[#1e2938] leading-[1.2] tracking-[-0.72px]">
                Welcome back
              </h1>
              <p className="text-sm text-[#697282] leading-[1.4] tracking-[-0.42px]">
                Sign in to your Data Hub account
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Email */}
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

              {/* Password */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-[#4a5565] leading-[1.45]">Password</label>
                  <Link
                    href="/reset-password"
                    className="text-sm text-[#0c3c7a] hover:text-[#061e3a] transition-colors leading-[1.45]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#98a1ae]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Enter your password"
                    className="w-full h-10 pl-11 pr-11 rounded-lg border border-[#d1d5dc] bg-white text-sm text-[#1e2938] placeholder:text-[#98a1ae] focus:outline-none focus:ring-2 focus:ring-[#5c96e5] focus:border-transparent transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98a1ae] hover:text-[#697282] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-[#ffe2e1] border border-[#ffcaca] text-[#82181a] text-sm px-3 py-2 rounded-lg mt-4">
                {error}
              </div>
            )}

            {/* Submit + Sign up link */}
            <div className="flex flex-col gap-8 mt-8">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full h-10 rounded-lg bg-[#061e3a] text-white text-sm hover:bg-[#0a2e57] transition-colors"
              >
                Sign In
              </button>

              <p className="text-sm text-[#697282] text-center leading-[1.2] tracking-[-0.42px]">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-[#0c3c7a] hover:text-[#061e3a] transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
