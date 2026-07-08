"use client";

import { OrgProvider } from "@/lib/org-context";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OrgProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </OrgProvider>
  );
}
