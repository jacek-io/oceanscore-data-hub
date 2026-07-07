"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "DHprototype2026") {
      document.cookie = "dh_auth=1; path=/; max-age=86400";
      window.location.href = "/";
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
      <div className="bg-white rounded-[16px] p-8 w-[400px] flex flex-col items-center gap-6 shadow-sm">
        <Image
          src="/oceanscore-logo.svg"
          alt="OceanScore"
          width={140}
          height={32}
        />
        <div className="text-center flex flex-col gap-1">
          <h1 className="text-xl font-medium text-foreground tracking-[-0.6px]">
            Data Hub Prototype
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the password to continue
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              className="w-full h-10 px-4 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            {error && (
              <span className="text-[12px] text-[#dc2626]">
                Incorrect password
              </span>
            )}
          </div>
          <button
            type="submit"
            className="w-full h-10 rounded-lg bg-[#061e3a] text-white text-sm font-normal hover:bg-[#0a2e57] transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
