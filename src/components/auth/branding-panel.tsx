"use client";

import Image from "next/image";

export function BrandingPanel() {
  return (
    <div
      className="hidden lg:flex w-1/2 flex-col items-start rounded-2xl relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
      }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-[#061e3a]/30" />
      {/* Logo */}
      <div className="relative z-10 flex flex-col justify-center h-[70px] px-6 w-full mt-4">
        <Image
          src="/esi-os-logo.svg"
          alt="ESI by OceanScore"
          width={280}
          height={40}
        />
      </div>

      {/* Tagline — vertically centered */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-4 w-full">
        <div className="flex flex-col gap-4 px-16">
          <h2 className="text-[32px] font-medium text-white leading-[1.2] tracking-[-0.96px]">
            Centralized maritime
            <br />
            environmental data
          </h2>
          <p className="text-base text-white/80 leading-[1.4] tracking-[-0.48px] max-w-[392px]">
            Manage your fleet&apos;s ESI &amp; EPI scores, BDNs, EDNs, and Tier III hours — all in one place.
          </p>
        </div>
      </div>

      {/* Partner logos */}
      <div className="relative z-10 px-6 pb-3 w-full">
        <Image
          src="/partners-logo.svg"
          alt="IAPH & WPSP"
          width={180}
          height={50}
        />
      </div>

      {/* Copyright */}
      <div className="relative z-10 px-6 py-4 w-full">
        <p className="text-xs text-white/50 leading-[1.2] tracking-[-0.36px]">
          &copy; 2026 OceanScore GmbH. All rights reserved.
        </p>
      </div>
    </div>
  );
}
