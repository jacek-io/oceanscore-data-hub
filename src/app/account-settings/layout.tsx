"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserRound,
  KeyRound,
  Building,
  Building2,
  DollarSign,
  UsersRound,
  Ship,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrgContext } from "@/lib/org-context";
import type { LucideIcon } from "lucide-react";

type NavItem = { label: string; href: string; icon: LucideIcon };
type NavSection = { label: string; items: NavItem[] };

export default function AccountSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { orgType } = useOrgContext();

  const sections: NavSection[] = [
    {
      label: "Account",
      items: [
        { label: "Profile", href: "/account-settings", icon: UserRound },
        { label: "Change Password", href: "/account-settings/password", icon: KeyRound },
      ],
    },
    {
      label: "Organization",
      items: [
        { label: "My Organization", href: "/account-settings/organization", icon: Building },
        ...(orgType === "corporate"
          ? [{ label: "Sub-organizations", href: "/account-settings/organization/sub-orgs", icon: Building2 }]
          : []),
        { label: "Billing preferences", href: "/account-settings/organization/billing", icon: DollarSign },
      ],
    },
    {
      label: "Users",
      items: [
        { label: "Users", href: "/account-settings/users", icon: UsersRound },
      ],
    },
    {
      label: "Ships",
      items: [
        { label: "Ships list", href: "/account-settings/vessels", icon: Ship },
      ],
    },
  ];

  const isItemActive = (href: string) => {
    if (href === "/account-settings") {
      return pathname === "/account-settings";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="px-6 py-5 flex flex-col h-full">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[32px] font-medium text-foreground leading-tight tracking-[-0.96px]">
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1 tracking-[-0.14px]">
          Manage your account, organization, users, and ships
        </p>
      </div>

      {/* Content with sidebar */}
      <div className="flex gap-5 flex-1 min-h-0">
        {/* Settings sidebar */}
        <div className="w-[260px] shrink-0 bg-white rounded-[16px] flex flex-col">
          {sections.map((section, sIdx) => (
            <div
              key={section.label}
              className={cn(
                "flex flex-col gap-2 px-4 py-2",
                sIdx === 0 && "pt-4",
                sIdx === sections.length - 1 && "pb-4"
              )}
            >
              <p className="text-[11px] font-medium text-[#697282] uppercase tracking-[1.1px]">
                {section.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const active = isItemActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between h-[44px] px-4 py-3 rounded-lg text-sm opacity-80 transition-colors",
                        active
                          ? "bg-[#ebf3ff] text-foreground"
                          : "text-[#1e2938] hover:bg-[#f3f4f6]"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="w-5 h-5 text-[#697282]" />
                        {item.label}
                      </span>
                      {active && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
