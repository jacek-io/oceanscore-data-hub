"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Ship,
  Upload,
  MapPin,
  Settings,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  User,
  Building2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const dataHubItems = [
  { label: "Fleet", href: "/fleet", icon: null },
  { label: "Upload Center", href: "/upload-center", icon: null },
];

const schemeItems = [
  {
    label: "Environmental Ship Index",
    shortLabel: "ESI",
    href: "/esi",
    badge: "ESI",
    badgeColor: "bg-esi-green",
  },
  {
    label: "Environmental Port Index",
    shortLabel: "EPI",
    href: "/epi",
    badge: "EPI",
    badgeColor: "bg-epi-blue",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [dataHubOpen, setDataHubOpen] = useState(true);
  const [esiOpen, setEsiOpen] = useState(false);
  const [epiOpen, setEpiOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className="flex flex-col w-[267px] h-screen sticky top-0 bg-sidebar-bg text-sidebar-foreground">
      {/* Logo */}
      <div className="px-6 py-5">
        <Link href="/">
          <Image
            src="/oceanscore-logo.svg"
            alt="OceanScore"
            width={165}
            height={25}
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {/* Data Hub Section */}
        <button
          onClick={() => setDataHubOpen(!dataHubOpen)}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-normal transition-colors",
            isActive("/fleet") || isActive("/upload-center")
              ? "bg-sidebar-accent text-white"
              : "text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
          )}
        >
          <span className="flex items-center gap-3">
            <Ship className="w-5 h-5" />
            Data Hub
          </span>
          {dataHubOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {dataHubOpen && (
          <div className="ml-[22px] border-l border-white/15 space-y-0.5 py-1 mt-2 mb-3">
            {dataHubItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 pl-5 pr-3 py-2 rounded-lg text-sm transition-colors",
                  isActive(item.href)
                    ? "text-white font-normal"
                    : "text-sidebar-muted hover:text-white"
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <div className="w-2 h-2 rounded-full bg-primary-icon ml-auto" />
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Ports */}
        <Link
          href="/ports"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-normal transition-colors",
            isActive("/ports")
              ? "bg-sidebar-accent text-white"
              : "text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
          )}
        >
          <MapPin className="w-5 h-5" />
          Ports
        </Link>

        {/* Schemes Section */}
        <div className="pt-4">
          <p className="px-3 text-[12px] font-normal uppercase tracking-wider text-sidebar-muted mb-2">
            Schemes
          </p>

          {/* ESI */}
          <button
            onClick={() => setEsiOpen(!esiOpen)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors",
              isActive("/esi")
                ? "bg-sidebar-accent text-white"
                : "text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
            )}
          >
            <span className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-md bg-esi-green flex items-center justify-center text-[10px] font-medium text-white">
                ESI
              </span>
              <span className="text-left leading-tight">
                Environmental
                <br />
                Ship Index
              </span>
            </span>
            {esiOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {esiOpen && (
            <div className="ml-[22px] border-l border-white/15 space-y-0.5 py-1 mt-2 mb-3">
              <Link
                href="/esi"
                className={cn(
                  "flex items-center gap-2 pl-5 pr-3 py-2 rounded-lg text-sm transition-colors",
                  pathname === "/esi" || (pathname.startsWith("/esi/") && !pathname.startsWith("/esi/knowledge"))
                    ? "text-white font-normal"
                    : "text-sidebar-muted hover:text-white"
                )}
              >
                Fleet
                {(pathname === "/esi" || (pathname.startsWith("/esi/") && !pathname.startsWith("/esi/knowledge"))) && (
                  <div className="w-2 h-2 rounded-full bg-primary-icon ml-auto" />
                )}
              </Link>
              <Link
                href="/esi/knowledge"
                className={cn(
                  "flex items-center gap-2 pl-5 pr-3 py-2 rounded-lg text-sm transition-colors",
                  isActive("/esi/knowledge")
                    ? "text-white font-normal"
                    : "text-sidebar-muted hover:text-white"
                )}
              >
                Knowledge
                {isActive("/esi/knowledge") && (
                  <div className="w-2 h-2 rounded-full bg-primary-icon ml-auto" />
                )}
              </Link>
            </div>
          )}

          {/* EPI */}
          <button
            onClick={() => setEpiOpen(!epiOpen)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors",
              isActive("/epi")
                ? "bg-sidebar-accent text-white"
                : "text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
            )}
          >
            <span className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-md bg-epi-blue flex items-center justify-center text-[10px] font-medium text-white">
                EPI
              </span>
              <span className="text-left leading-tight">
                Environmental
                <br />
                Port Index
              </span>
            </span>
            {epiOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {epiOpen && (
            <div className="ml-[22px] border-l border-white/15 space-y-0.5 py-1 mt-2 mb-3">
              <Link
                href="/epi"
                className={cn(
                  "flex items-center gap-2 pl-5 pr-3 py-2 rounded-lg text-sm transition-colors",
                  pathname === "/epi"
                    ? "text-white font-normal"
                    : "text-sidebar-muted hover:text-white"
                )}
              >
                Port Calls
                {pathname === "/epi" && (
                  <div className="w-2 h-2 rounded-full bg-primary-icon ml-auto" />
                )}
              </Link>
              <Link
                href="/epi/ships"
                className={cn(
                  "flex items-center gap-2 pl-5 pr-3 py-2 rounded-lg text-sm transition-colors",
                  isActive("/epi/ships")
                    ? "text-white font-normal"
                    : "text-sidebar-muted hover:text-white"
                )}
              >
                Ships
                {isActive("/epi/ships") && (
                  <div className="w-2 h-2 rounded-full bg-primary-icon ml-auto" />
                )}
              </Link>
              <Link
                href="/epi/knowledge"
                className={cn(
                  "flex items-center gap-2 pl-5 pr-3 py-2 rounded-lg text-sm transition-colors",
                  isActive("/epi/knowledge")
                    ? "text-white font-normal"
                    : "text-sidebar-muted hover:text-white"
                )}
              >
                Knowledge
                {isActive("/epi/knowledge") && (
                  <div className="w-2 h-2 rounded-full bg-primary-icon ml-auto" />
                )}
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Links */}
      <div className="px-3 pb-4 space-y-0.5">
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-normal transition-colors",
            isActive("/account-settings")
              ? "bg-sidebar-accent text-white"
              : "text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
          )}
        >
          <span className="flex items-center gap-3">
            <Settings className="w-5 h-5" />
            Settings
          </span>
          {settingsOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {settingsOpen && (
          <div className="ml-[22px] border-l border-white/15 space-y-0.5 py-1 mt-2 mb-3">
            <Link
              href="/account-settings"
              className={cn(
                "flex items-center gap-2 pl-5 pr-3 py-2 rounded-lg text-sm transition-colors",
                pathname === "/account-settings" || pathname === "/account-settings/password"
                  ? "text-white font-normal"
                  : "text-sidebar-muted hover:text-white"
              )}
            >
              My Account
              {(pathname === "/account-settings" || pathname === "/account-settings/password") && (
                <div className="w-2 h-2 rounded-full bg-primary-icon ml-auto" />
              )}
            </Link>
            <Link
              href="/account-settings/organization"
              className={cn(
                "flex items-center gap-2 pl-5 pr-3 py-2 rounded-lg text-sm transition-colors",
                pathname.startsWith("/account-settings/organization")
                  ? "text-white font-normal"
                  : "text-sidebar-muted hover:text-white"
              )}
            >
              Organization
              {pathname.startsWith("/account-settings/organization") && (
                <div className="w-2 h-2 rounded-full bg-primary-icon ml-auto" />
              )}
            </Link>
            <Link
              href="/account-settings/users"
              className={cn(
                "flex items-center gap-2 pl-5 pr-3 py-2 rounded-lg text-sm transition-colors",
                pathname.startsWith("/account-settings/users")
                  ? "text-white font-normal"
                  : "text-sidebar-muted hover:text-white"
              )}
            >
              Users
              {pathname.startsWith("/account-settings/users") && (
                <div className="w-2 h-2 rounded-full bg-primary-icon ml-auto" />
              )}
            </Link>
            <Link
              href="/account-settings/vessels"
              className={cn(
                "flex items-center gap-2 pl-5 pr-3 py-2 rounded-lg text-sm transition-colors",
                pathname.startsWith("/account-settings/vessels")
                  ? "text-white font-normal"
                  : "text-sidebar-muted hover:text-white"
              )}
            >
              Vessels
              {pathname.startsWith("/account-settings/vessels") && (
                <div className="w-2 h-2 rounded-full bg-primary-icon ml-auto" />
              )}
            </Link>
          </div>
        )}

        <Link
          href="/support"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
            isActive("/support")
              ? "bg-sidebar-accent text-white"
              : "text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
          )}
        >
          <MessageCircle className="w-5 h-5" />
          Support
        </Link>
      </div>
    </aside>
  );
}
