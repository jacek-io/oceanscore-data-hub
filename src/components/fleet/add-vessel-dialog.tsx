"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Plus,
  CircleAlert,
  ArrowRightLeft,
  CircleCheck,
  Info,
} from "lucide-react";
import { ships } from "@/lib/mock-data";

/* -- IMO format validation -- */
function isValidImo(imo: string): boolean {
  const cleaned = imo.replace(/\s/g, "");
  return /^[1-9]\d{6,8}$/.test(cleaned);
}

/* -- Mock: ships registered by 3rd party organisations -- */
const thirdPartyShips: Record<string, { name: string; type: string; owner: string }> = {
  "940123456": { name: "Northern Spirit", type: "Bulk Carrier", owner: "Baltic Maritime Ltd" },
  "881427500": { name: "Pacific Horizon", type: "Tanker", owner: "Oceanic Holdings" },
};

/* -- Mock: ships registered by sister/parent organisation -- */
const sisterOrgShips: Record<string, { name: string; type: string; owner: string }> = {
  "950111222": { name: "Nordic Sentinel", type: "Container Ship", owner: "Nordic Shipping AS" },
  "960222333": { name: "Baltic Pioneer", type: "Bulk Carrier", owner: "Nordic Shipping AS" },
};

type Result = null | "invalid" | "found" | "registered-by-you" | "third-party" | "sister-org" | "new";

export function AddVesselDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [imo, setImo] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [foundShip, setFoundShip] = useState<{ name: string; type: string; imo: string; owner?: string } | null>(null);

  const reset = () => {
    setImo("");
    setResult(null);
    setFoundShip(null);
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) reset();
  };

  const handleContinue = () => {
    const cleaned = imo.replace(/\s/g, "");

    if (!isValidImo(cleaned)) {
      setResult("invalid");
      setFoundShip(null);
      return;
    }

    // Check if in user's fleet
    const inFleet = ships.find((s) => s.imo === cleaned);
    if (inFleet) {
      setFoundShip({ name: inFleet.name, type: inFleet.shipType, imo: inFleet.imo });
      setResult("registered-by-you");
      return;
    }

    // Check 3rd party
    const thirdParty = thirdPartyShips[cleaned];
    if (thirdParty) {
      setFoundShip({ name: thirdParty.name, type: thirdParty.type, imo: cleaned, owner: thirdParty.owner });
      setResult("third-party");
      return;
    }

    // Check sister/parent org
    const sisterOrg = sisterOrgShips[cleaned];
    if (sisterOrg) {
      setFoundShip({ name: sisterOrg.name, type: sisterOrg.type, imo: cleaned, owner: sisterOrg.owner });
      setResult("sister-org");
      return;
    }

    // Valid, not in system
    setFoundShip(null);
    setResult("new");
  };

  const handleCreateShip = () => {
    setOpen(false);
    router.push(`/fleet/new?imo=${imo.replace(/\s/g, "")}`);
    reset();
  };

  const handleImoChange = (v: string) => {
    setImo(v);
    if (result) {
      setResult(null);
      setFoundShip(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <button className="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#061e3a] text-white text-sm font-normal hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors">
            <Plus className="w-4 h-4 text-primary-icon" />
            Add Ship
          </button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Ship</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* IMO input */}
          <div>
            <label htmlFor="imo-number" className="text-sm font-medium text-foreground">
              IMO Number
            </label>
            <Input
              id="imo-number"
              placeholder="e.g. 912345678"
              value={imo}
              onChange={(e) => handleImoChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && imo.replace(/\s/g, "").length >= 7) handleContinue(); }}
              className="mt-1.5 rounded-lg"
            />
          </div>

          {/* Invalid IMO - red text under input */}
          {result === "invalid" && (
            <div className="flex items-start gap-2">
              <CircleAlert className="w-4 h-4 text-status-revoked shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-status-revoked">Invalid IMO number</p>
                <p className="text-xs text-status-revoked/80 mt-0.5">
                  The check digit does not match. Please verify the 7-digit IMO number and try again.
                </p>
              </div>
            </div>
          )}

          {/* New vessel - valid IMO */}
          {result === "new" && (
            <>
              <div className="bg-[#f3f4f6] rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">New Ship</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
                    <CircleCheck className="w-3 h-3" />
                    Valid IMO
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  IMO: {imo}
                </p>
              </div>
              <div className="flex items-start gap-2 bg-[#f3f4f6] rounded-lg px-4 py-3">
                <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  This ship is not yet in the system. You can create a new record.
                </p>
              </div>
            </>
          )}

          {/* Registered by you */}
          {result === "registered-by-you" && foundShip && (
            <>
              <div className="bg-[#f3f4f6] rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{foundShip.name}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-epi-blue-light text-epi-blue border border-epi-blue-border">
                    <CircleCheck className="w-3 h-3" />
                    In the system
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  IMO: {foundShip.imo}<span className="mx-1.5">|</span>{foundShip.type}
                </p>
              </div>
              <div className="flex items-start gap-2 bg-epi-blue-light rounded-lg px-4 py-3">
                <Info className="w-4 h-4 text-epi-blue shrink-0 mt-0.5" />
                <p className="text-sm text-epi-blue">
                  This ship is already registered to your organization in ESI. No further action is needed.
                </p>
              </div>
            </>
          )}

          {/* 3rd party */}
          {result === "third-party" && foundShip && (
            <>
              <div className="bg-[#f3f4f6] rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{foundShip.name}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-[#FFF8EB] text-[#A67C1A] border border-[#F5D680]">
                    <ArrowRightLeft className="w-3 h-3" />
                    Other organization
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  IMO: {foundShip.imo}<span className="mx-1.5">|</span>{foundShip.type}<span className="mx-1.5">|</span>{foundShip.owner}
                </p>
              </div>
              <div className="flex items-start gap-2 bg-[#FFF8EB] rounded-lg px-4 py-3">
                <Info className="w-4 h-4 text-[#A67C1A] shrink-0 mt-0.5" />
                <p className="text-sm text-[#A67C1A]">
                  This ship is already registered in ESI by another organization. Would you like to request a transfer?
                </p>
              </div>
            </>
          )}

          {/* Sister/parent organization */}
          {result === "sister-org" && foundShip && (
            <>
              <div className="bg-[#f3f4f6] rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{foundShip.name}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
                    <CircleCheck className="w-3 h-3" />
                    Found
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  IMO: {foundShip.imo}<span className="mx-1.5">|</span>{foundShip.type}
                </p>
              </div>
              <div className="flex items-start gap-2 bg-status-revoked-bg rounded-lg px-4 py-3">
                <Info className="w-4 h-4 text-status-revoked shrink-0 mt-0.5" />
                <p className="text-sm text-status-revoked">
                  This ship is already registered in ESI by <span className="font-medium">{foundShip.owner}</span>, part of your organization. Would you like to request a transfer?
                </p>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex justify-between pt-2">
            <button
              onClick={() => handleOpenChange(false)}
              className="px-3 py-2.5 rounded-lg border border-border text-sm font-normal text-foreground hover:bg-[#F3F4F6] transition-colors"
            >
              Cancel
            </button>

            {result === null && (
              <button
                onClick={handleContinue}
                disabled={imo.replace(/\s/g, "").length < 7}
                className="px-3 py-2.5 rounded-lg bg-[#061e3a] text-white text-sm font-normal hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                Continue
              </button>
            )}

            {result === "invalid" && (
              <button
                disabled
                className="px-3 py-2.5 rounded-lg bg-[#061e3a] text-white text-sm font-normal transition-colors opacity-40 pointer-events-none"
              >
                Continue
              </button>
            )}

            {result === "new" && (
              <button
                onClick={handleCreateShip}
                className="px-3 py-2.5 rounded-lg bg-[#061e3a] text-white text-sm font-normal hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors"
              >
                Create Ship
              </button>
            )}

            {result === "registered-by-you" && foundShip && (
              <button
                onClick={() => {
                  const ship = ships.find((s) => s.imo === foundShip.imo);
                  setOpen(false);
                  router.push(`/fleet/${ship?.id || "1"}`);
                  reset();
                }}
                className="px-3 py-2.5 rounded-lg bg-[#061e3a] text-white text-sm font-normal hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors"
              >
                Go to Ship Record
              </button>
            )}

            {(result === "third-party" || result === "sister-org") && (
              <button
                onClick={() => { setOpen(false); router.push("/fleet/transfers"); reset(); }}
                className="px-3 py-2.5 rounded-lg bg-[#061e3a] text-white text-sm font-normal hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors"
              >
                Request Transfer
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
