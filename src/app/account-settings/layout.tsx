"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Building2,
  Users,
  Ship,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const settingsNav = [
  {
    label: "My Account",
    icon: User,
    items: [
      { label: "Profile", href: "/account-settings" },
      { label: "Change Password", href: "/account-settings/password" },
    ],
  },
  {
    label: "My Organization",
    icon: Building2,
    items: [
      { label: "General", href: "/account-settings/organization" },
      { label: "Sub-organizations", href: "/account-settings/organization/sub-orgs" },
      { label: "Billing Preferences", href: "/account-settings/organization/billing" },
    ],
  },
  {
    label: "Users",
    icon: Users,
    items: [
      { label: "Users", href: "/account-settings/users" },
      { label: "Roles & Permissions", href: "/account-settings/users/roles" },
    ],
  },
  {
    label: "Vessels",
    icon: Ship,
    items: [
      { label: "Vessel List", href: "/account-settings/vessels" },
    ],
  },
];

export default function AccountSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    settingsNav.forEach((section) => {
      const isActive = section.items.some((item) => {
        if (item.href === "/account-settings") {
          return pathname === "/account-settings";
        }
        return pathname.startsWith(item.href);
      });
      initial[section.label] = isActive;
    });
    // Default: open My Account if nothing matches
    if (!Object.values(initial).some(Boolean)) {
      initial["My Account"] = true;
    }
    return initial;
  });

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isItemActive = (href: string) => {
    if (href === "/account-settings") {
      return pathname === "/account-settings";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="px-6 py-5 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-medium text-foreground leading-tight tracking-[-0.96px]">
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1 tracking-[-0.14px]">
          Manage your account, organization, users, and vessels
        </p>
      </div>

      {/* Content with sidebar */}
      <div className="flex gap-5">
        {/* Settings sidebar */}
        <div className="w-[240px] shrink-0 space-y-1">
          {settingsNav.map((section) => (
            <div key={section.label}>
              <button
                onClick={() => toggleSection(section.label)}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors",
                  section.items.some((item) => isItemActive(item.href))
                    ? "bg-primary/5 text-foreground font-medium"
                    : "text-muted-foreground hover:bg-[#f3f4f6] hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </span>
                {openSections[section.label] ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
              {openSections[section.label] && (
                <div className="ml-[18px] border-l border-[#e5e7eb] space-y-0.5 py-1 mt-1 mb-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center pl-4 pr-3 py-1.5 rounded-r-lg text-sm transition-colors",
                        isItemActive(item.href)
                          ? "text-primary font-medium bg-primary/5 border-l-2 border-primary -ml-px"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
