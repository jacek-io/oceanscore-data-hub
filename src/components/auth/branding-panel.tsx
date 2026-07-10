"use client";

import Image from "next/image";

export function BrandingPanel() {
  return (
    <div
      className="hidden lg:flex w-1/2 flex-col items-start rounded-2xl p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #061e3a 50%, #0c3c7a 100%)",
      }}
    >
      {/* Logo */}
      <div className="flex flex-col justify-center h-[70px] px-6 w-full">
        <Image
          src="/oceanscore-logo.svg"
          alt="OceanScore"
          width={165}
          height={25}
          className="brightness-0 invert"
        />
      </div>

      {/* Tagline — vertically centered */}
      <div className="flex-1 flex flex-col justify-center px-6 py-4 w-full">
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

      {/* Copyright */}
      <div className="px-6 py-4 w-full">
        <p className="text-xs text-white/50 leading-[1.2] tracking-[-0.36px]">
          &copy; 2026 OceanScore GmbH. All rights reserved.
        </p>
      </div>
    </div>
  );
}
