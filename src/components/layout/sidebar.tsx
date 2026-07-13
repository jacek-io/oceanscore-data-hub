"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Ship,
  MapPin,
  Settings,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

/* ── Navigation config ── */

type SectionId = "dataHub" | "esi" | "epi";

const dataHubChildren = [
  { label: "Fleet", href: "/fleet" },
  { label: "Ship Transfers", href: "/fleet/transfers" },
  { label: "Upload Center", href: "/upload-center" },
];

const esiChildren = [
  { label: "Fleet", href: "/esi" },
  { label: "Knowledge", href: "/esi/knowledge" },
];

const epiChildren = [
  { label: "Port Calls", href: "/epi" },
  { label: "Ships", href: "/epi/ships" },
  { label: "Knowledge", href: "/epi/knowledge" },
];

/* ── Route matching helpers ── */

function isChildActive(href: string, pathname: string) {
  if (href === "/fleet") {
    return pathname === "/fleet" || (pathname.startsWith("/fleet/") && !pathname.startsWith("/fleet/transfers"));
  }
  if (href === "/esi") {
    return pathname === "/esi" || (pathname.startsWith("/esi/") && !pathname.startsWith("/esi/knowledge"));
  }
  if (href === "/epi") {
    return pathname === "/epi" && !pathname.startsWith("/epi/ships") && !pathname.startsWith("/epi/knowledge");
  }
  return pathname.startsWith(href);
}

function isSectionActive(prefixes: string[], pathname: string) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p));
}

/* ── Sidebar ── */

export function Sidebar() {
  const pathname = usePathname();

  // Independent expand/collapse — multiple sections can be open
  const [expandedSections, setExpandedSections] = useState<Set<SectionId>>(new Set(["dataHub"]));
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // Derive which section owns the current route
  const dataHubActive = isSectionActive(["/fleet", "/upload-center"], pathname);
  const esiActive = isSectionActive(["/esi"], pathname);
  const epiActive = isSectionActive(["/epi"], pathname);

  // Auto-expand the section that owns the current route
  useEffect(() => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (dataHubActive) next.add("dataHub");
      if (esiActive) next.add("esi");
      if (epiActive) next.add("epi");
      return next.size !== prev.size ? next : prev;
    });
  }, [dataHubActive, esiActive, epiActive]);

  // Close account popover on outside click
  useEffect(() => {
    if (!accountOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountOpen]);

  // Toggle a single section open/closed
  const toggleSection = (section: SectionId) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  // Hide sidebar on auth pages (after all hooks)
  const authRoutes = ["/login", "/signup", "/reset-password"];
  if (authRoutes.some((r) => pathname.startsWith(r))) return null;

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
        {/* Data Hub */}
        <NavSection
          icon={<Ship className="w-5 h-5" />}
          label="Data Hub"
          href="/fleet"
          isOpen={expandedSections.has("dataHub")}
          isActive={dataHubActive}
          onToggle={() => toggleSection("dataHub")}
          children={dataHubChildren}
          pathname={pathname}
        />

        {/* Ports — standalone link, no dot */}
        <Link
          href="/ports"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-normal transition-colors",
            pathname.startsWith("/ports")
              ? "bg-white/5 text-white"
              : "text-sidebar-muted hover:bg-white/5 hover:text-white"
          )}
        >
          <MapPin className="w-5 h-5" />
          Ports
          {pathname.startsWith("/ports") && (
            <div className="w-2 h-2 rounded-full bg-primary-icon ml-auto" />
          )}
        </Link>

        {/* Schemes */}
        <div className="pt-4">
          <p className="px-3 text-[12px] font-normal uppercase tracking-wider text-sidebar-muted mb-2">
            Schemes
          </p>

          {/* ESI */}
          <NavSection
            badge={{ text: "ESI", color: "bg-esi-green" }}
            label={<>Environmental<br />Ship Index</>}
            href="/esi"
            isOpen={expandedSections.has("esi")}
            isActive={esiActive}
            onToggle={() => toggleSection("esi")}
            children={esiChildren}
            pathname={pathname}
          />

          {/* EPI */}
          <NavSection
            badge={{ text: "EPI", color: "bg-epi-blue" }}
            label={<>Environmental<br />Port Index</>}
            href="/epi"
            isOpen={expandedSections.has("epi")}
            isActive={epiActive}
            onToggle={() => toggleSection("epi")}
            children={epiChildren}
            pathname={pathname}
          />
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-0.5">
        {/* Support — standalone link, no dot */}
        <Link
          href="/support"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
            pathname.startsWith("/support")
              ? "bg-white/5 text-white"
              : "text-sidebar-muted hover:bg-white/5 hover:text-white"
          )}
        >
          <MessageCircle className="w-5 h-5" />
          Support
          {pathname.startsWith("/support") && (
            <div className="w-2 h-2 rounded-full bg-primary-icon ml-auto" />
          )}
        </Link>

        {/* User account */}
        <div ref={accountRef} className="relative mt-3">
          <button
            onClick={() => setAccountOpen(!accountOpen)}
            className="flex items-center gap-2 w-full px-3.5 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#5c96e5] flex items-center justify-center text-xs text-white shrink-0">
              JZ
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm leading-tight truncate">Jacek Zabicki</p>
              <p className="text-[11px] opacity-50 leading-tight truncate">jacek.z@oceanscore.com</p>
            </div>
          </button>

          {accountOpen && (
            <div className="absolute bottom-0 left-full ml-3 w-[260px] bg-white rounded-2xl shadow-xl border border-[#e5e7eb] overflow-hidden z-50">
              <div className="p-2">
                <div className="flex flex-col items-center bg-[#ebf3ff] rounded-xl px-5 pt-6 pb-5">
                  <div className="w-[72px] h-[72px] rounded-full bg-[#5c96e5] flex items-center justify-center text-2xl font-medium text-white mb-3">
                    JZ
                  </div>
                  <p className="text-lg font-medium text-[#1e2938]">Jacek Zabicki</p>
                  <p className="text-sm text-[#697282] mt-0.5">jacek.z@oceanscore.com</p>
                </div>
              </div>
              <Link
                href="/account-settings"
                onClick={() => setAccountOpen(false)}
                className="flex items-center gap-3 px-5 py-3.5 text-sm text-[#1e2938] hover:bg-[#f3f4f6] transition-colors border-b border-[#e5e7eb]"
              >
                <Settings className="w-5 h-5 text-[#697282]" />
                Settings
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-3 px-5 py-3.5 text-sm text-[#1e2938] hover:bg-[#f3f4f6] transition-colors"
              >
                <LogOut className="w-5 h-5 text-[#697282]" />
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ── NavSection: independent expand/collapse, no parent active background ── */

function NavSection({
  icon,
  badge,
  label,
  href,
  isOpen,
  isActive,
  onToggle,
  children,
  pathname,
}: {
  icon?: React.ReactNode;
  badge?: { text: string; color: string };
  label: React.ReactNode;
  href: string;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  children: { label: string; href: string }[];
  pathname: string;
}) {
  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between rounded-lg text-sm transition-colors",
          isActive
            ? "text-white"
            : "text-sidebar-muted hover:bg-white/5 hover:text-white"
        )}
      >
        {/* Label area — navigates to first child + expands */}
        <Link
          href={href}
          onClick={() => { if (!isOpen) onToggle(); }}
          className="flex items-center gap-3 flex-1 min-w-0 px-3 py-2.5"
        >
          {icon}
          {badge && (
            <span className={cn("w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-medium text-white shrink-0", badge.color)}>
              {badge.text}
            </span>
          )}
          <span className="text-left leading-tight">{label}</span>
        </Link>

        {/* Chevron — only toggles expand/collapse, always enabled */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="w-8 h-8 flex items-center justify-center rounded-md shrink-0 mr-1 hover:bg-white/10 transition-colors"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Children — active sub-item gets bg highlight + blue dot */}
      {isOpen && (
        <div className="ml-[22px] border-l border-white/15 pl-1.5 space-y-0.5 py-1 mt-2 mb-3">
          {children.map((child) => {
            const active = isChildActive(child.href, pathname);
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "flex items-center gap-2 pl-3.5 pr-3 py-2 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-white/5 text-white font-medium"
                    : "text-sidebar-muted hover:text-white"
                )}
              >
                {child.label}
                {active && (
                  <div className="w-2 h-2 rounded-full bg-primary-icon ml-auto" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
