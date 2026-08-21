"use client";

import Image from "next/image";

export function BrandingPanel() {
  return (
    <div
      className="hidden lg:flex w-1/2 flex-col rounded-2xl relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
      }}
    >
      {/* ESI logo — top left */}
      <div className="relative z-10 px-8 pt-6">
        <Image
          src="/esi-logo-white.svg"
          alt="ESI — Environmental Ship Index"
          width={100}
          height={36}
        />
      </div>

      {/* Tagline — absolutely centered in the full box */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-8">
        <div className="flex flex-col gap-4 max-w-[520px]">
          <h2 className="text-[40px] font-medium text-white leading-[1.1] tracking-[-1px]">
            Turn environmental data
            <br />
            into commercial value
          </h2>
          <p className="text-[16px] text-white/70 leading-[1.5] tracking-[-0.3px] max-w-[440px]">
            Access ESI, EPI and URN from one account. Manage your vessels,
            submit the required data and keep your environmental scores
            up to date.
          </p>
        </div>
      </div>

      {/* Spacer to push footer down */}
      <div className="flex-1" />

      {/* Footer — partners left, powered-by right */}
      <div className="relative z-10 flex items-end justify-between px-8 pb-6">
        <Image
          src="/partners-logo.svg"
          alt="IAPH & WPSP"
          width={200}
          height={55}
        />
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-white/50 tracking-[-0.3px]">powered by</span>
          <Image
            src="/oceanscore-logo.svg"
            alt="OceanScore"
            width={130}
            height={20}
          />
        </div>
      </div>
    </div>
  );
}
