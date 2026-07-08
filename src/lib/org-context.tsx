"use client";

import { createContext, useContext, useState, ReactNode } from "react";

/**
 * Organization hierarchy rules:
 * - An org can be "corporate" (has sub-orgs) OR "sub-org" (has a parent) OR "standalone" (neither)
 * - Only one hierarchy layer: a sub-org cannot have its own sub-orgs
 * - A corporate (parent) cannot itself have a parent
 */
export type OrgType = "corporate" | "sub-org" | "standalone";

type OrgContextValue = {
  orgType: OrgType;
  setOrgType: (type: OrgType) => void;
  parentOrg: string | null;
};

const OrgContext = createContext<OrgContextValue>({
  orgType: "corporate",
  setOrgType: () => {},
  parentOrg: null,
});

export function OrgProvider({ children }: { children: ReactNode }) {
  // Mock: toggle this to test different org types
  // "corporate" = has sub-orgs, "sub-org" = has a parent, "standalone" = neither
  const [orgType, setOrgType] = useState<OrgType>("corporate");

  const parentOrg = orgType === "sub-org" ? "OceanScore GmbH" : null;

  return (
    <OrgContext.Provider value={{ orgType, setOrgType, parentOrg }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrgContext() {
  return useContext(OrgContext);
}
