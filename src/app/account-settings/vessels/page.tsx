"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  ChevronUp,
  ArrowRightLeft,
  Plus,
  X,
  Check,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

type OrgVessel = {
  id: string;
  name: string;
  imo: string;
  type: string;
  subOrg: string;
  esiStatus: "Active" | "Inactive";
  epiEnrolled: boolean;
};

const mockVessels: OrgVessel[] = [
  { id: "1", name: "Arctic Navigator", imo: "9123456", type: "Bulk Carrier", subOrg: "OceanScore GmbH", esiStatus: "Active", epiEnrolled: true },
  { id: "2", name: "Astral", imo: "9234567", type: "Container Ship", subOrg: "OceanScore GmbH", esiStatus: "Active", epiEnrolled: true },
  { id: "3", name: "Northern Star", imo: "9345678", type: "Tanker", subOrg: "OceanScore Nordic AB", esiStatus: "Active", epiEnrolled: true },
  { id: "4", name: "MV Southern Cross", imo: "9456789", type: "General Cargo", subOrg: "OceanScore Nordic AB", esiStatus: "Active", epiEnrolled: false },
  { id: "5", name: "Shadow", imo: "9567890", type: "Bulk Carrier", subOrg: "OceanScore Nordic AB", esiStatus: "Inactive", epiEnrolled: true },
  { id: "6", name: "Rosemary", imo: "9678901", type: "Container Ship", subOrg: "OceanScore Nordic AB", esiStatus: "Active", epiEnrolled: false },
  { id: "7", name: "Caspian Trader", imo: "9789012", type: "Tanker", subOrg: "OceanScore Iberia Lda", esiStatus: "Active", epiEnrolled: true },
  { id: "8", name: "Porto Star", imo: "9890123", type: "General Cargo", subOrg: "OceanScore Iberia Lda", esiStatus: "Active", epiEnrolled: false },
];

const subOrgs = ["OceanScore GmbH", "OceanScore Nordic AB", "OceanScore Iberia Lda"];

/* Mock IMO lookup results */
type LookupResult = {
  name: string;
  imo: string;
  type: string;
  alreadyRegistered: boolean;
};

const mockLookup: Record<string, LookupResult> = {
  "912345202": { name: "MV Odyssey", imo: "912345202", type: "Container Ship", alreadyRegistered: false },
  "912345678": { name: "Arctic Navigator", imo: "912345678", type: "Container Ship", alreadyRegistered: true },
  "912345999": { name: "Nordic Spirit", imo: "912345999", type: "Bulk Carrier", alreadyRegistered: false },
};

export default function VesselsPage() {
  const [search, setSearch] = useState("");
  const [orgFilter, setOrgFilter] = useState("all");
  const [sortKey, setSortKey] = useState<"name" | "subOrg">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [imoInput, setImoInput] = useState("");
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
  const [lookupNotFound, setLookupNotFound] = useState(false);

  const handleImoLookup = (value: string) => {
    setImoInput(value);
    setLookupNotFound(false);
    setLookupResult(null);
    // Simulate lookup when 9 digits entered
    if (value.length >= 7) {
      const result = mockLookup[value];
      if (result) {
        setLookupResult(result);
      } else if (value.length >= 9) {
        setLookupNotFound(true);
      }
    }
  };

  const openAddDialog = () => {
    setImoInput("");
    setLookupResult(null);
    setLookupNotFound(false);
    setShowAddDialog(true);
  };

  const handleSort = (key: "name" | "subOrg") => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ col }: { col: "name" | "subOrg" }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-[#D1D5DC] ml-1 inline" />;
    return sortAsc ? (
      <ChevronUp className="w-3 h-3 text-muted-foreground ml-1 inline" />
    ) : (
      <ChevronDown className="w-3 h-3 text-muted-foreground ml-1 inline" />
    );
  };

  const filtered = mockVessels
    .filter((v) => {
      const matchSearch =
        search === "" ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.imo.includes(search);
      const matchOrg = orgFilter === "all" || v.subOrg === orgFilter;
      return matchSearch && matchOrg;
    })
    .sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      if (sortKey === "name") return dir * a.name.localeCompare(b.name);
      return dir * a.subOrg.localeCompare(b.subOrg);
    });

  // Group by sub-org for the summary
  const orgCounts = subOrgs.map((org) => ({
    name: org,
    count: mockVessels.filter((v) => v.subOrg === org).length,
  }));

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {orgCounts.map((org) => (
          <button
            key={org.name}
            onClick={() => setOrgFilter(orgFilter === org.name ? "all" : org.name)}
            className={cn(
              "flex flex-col gap-1 p-3 rounded-lg border text-left transition-colors",
              orgFilter === org.name
                ? "border-primary bg-primary/5"
                : "border-[#e5e7eb] bg-white hover:border-[#d1d5dc]"
            )}
          >
            <span className="text-[20px] font-medium text-foreground">{org.count}</span>
            <span className="text-xs text-muted-foreground truncate">{org.name}</span>
          </button>
        ))}
      </div>

      {/* Vessel Table */}
      <div className="bg-white rounded-[16px] p-4 flex flex-col gap-0">
        <div className="flex items-center justify-between px-2 pb-4">
          <div>
            <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">Vessel List</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {mockVessels.length} vessels across all organizations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={orgFilter}
                onChange={(e) => setOrgFilter(e.target.value)}
                className="h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Organizations</option>
                {subOrgs.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vessel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-10 pr-4 w-[200px] rounded-lg border border-border bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={openAddDialog}
              className="inline-flex items-center gap-2 h-10 px-3 rounded-lg bg-primary text-sm text-white hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Vessel
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("name")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] first:rounded-l-lg cursor-pointer select-none"
              >
                Vessel / IMO <SortIcon col="name" />
              </th>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                Type
              </th>
              <th
                onClick={() => handleSort("subOrg")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
              >
                Organization <SortIcon col="subOrg" />
              </th>
              <th className="text-center text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                ESI
              </th>
              <th className="text-center text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                EPI
              </th>
              <th className="text-right text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] last:rounded-r-lg">
                Move
              </th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={6} className="h-2" /></tr>
            {filtered.map((vessel) => (
              <tr
                key={vessel.id}
                className="border-b border-[#f0f1f3] last:border-b-0 hover:bg-[#fafbfc] transition-colors"
              >
                <td className="px-4 py-3.5">
                  <p className="text-sm font-normal text-foreground">{vessel.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{vessel.imo}</p>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-foreground">{vessel.type}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-foreground">{vessel.subOrg}</span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border",
                      vessel.esiStatus === "Active"
                        ? "bg-status-active-bg text-[#294215] border-status-active-border"
                        : "bg-[#f3f4f6] text-[#4a5565] border-[#e5e7eb]"
                    )}
                  >
                    {vessel.esiStatus}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border",
                      vessel.epiEnrolled
                        ? "bg-[#cce1ff] text-[#1a4a8a] border-[#99c3ff]"
                        : "bg-[#f3f4f6] text-[#4a5565] border-[#e5e7eb]"
                    )}
                  >
                    {vessel.epiEnrolled ? "Enrolled" : "—"}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    className="w-7 h-7 rounded-md inline-flex items-center justify-center hover:bg-[#f3f4f6] transition-colors"
                    title="Move to another sub-org (coming soon)"
                    disabled
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Move vessel between sub-organizations — coming soon
      </p>

      {/* Add New Ship Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddDialog(false)} />
          <div className="relative bg-white rounded-2xl w-[520px] flex flex-col shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h3 className="text-2xl font-medium text-[#1e2938]">
                Add New Ship
              </h3>
              <button
                onClick={() => setShowAddDialog(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-[#f3f4f6] hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* IMO Input */}
            <div className="px-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[#4a5565]">IMO Number</label>
                <input
                  type="text"
                  value={imoInput}
                  onChange={(e) => handleImoLookup(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter IMO number"
                  maxLength={9}
                  className="h-10 px-4 rounded-lg border border-[#d1d5dc] bg-white text-sm text-[#1e2938] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>
            </div>

            {/* Lookup Result */}
            {lookupResult && (
              <div className="px-6 pt-4">
                <div className="bg-[#f3f4f6] rounded-[16px] px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-medium text-[#1e2938] tracking-[-0.6px]">
                      {lookupResult.name}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-[36px] text-[11px] font-medium bg-[#e3f0db] text-[#294215] border border-[#d0e5c3]">
                      <Check className="w-3.5 h-3.5" />
                      Found
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-sm text-[#697282]">
                      IMO: {lookupResult.imo}
                    </span>
                    <span className="w-px h-3 bg-[#d1d5dc]" />
                    <span className="text-sm text-[#697282]">
                      {lookupResult.type}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Already registered warning */}
            {lookupResult?.alreadyRegistered && (
              <div className="px-6 pt-3">
                <div className="flex items-start gap-2 bg-[#ffedd4] rounded-[16px] px-4 py-3">
                  <Info className="w-5 h-5 text-[#9f2d00] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#9f2d00] leading-[1.6]">
                    This ship is already registered in ESI. Would you want to request a transfer?
                  </p>
                </div>
              </div>
            )}

            {/* Not found */}
            {lookupNotFound && (
              <div className="px-6 pt-4">
                <div className="flex items-start gap-2 bg-[#f3f4f6] rounded-[16px] px-4 py-4">
                  <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    No vessel found with this IMO number. Please check and try again.
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between px-6 pt-6 pb-6">
              <button
                onClick={() => setShowAddDialog(false)}
                className="h-10 px-4 rounded-lg border border-[#d1d5dc] bg-white text-sm text-[#1e2938] hover:bg-[#f8f9fa] transition-colors"
              >
                Cancel
              </button>
              <div className="flex items-center gap-2">
                {lookupResult?.alreadyRegistered && (
                  <button
                    onClick={() => setShowAddDialog(false)}
                    className="h-10 px-4 rounded-lg bg-primary text-sm text-white hover:bg-primary/90 transition-colors"
                  >
                    Request Transfer
                  </button>
                )}
                <button
                  onClick={() => setShowAddDialog(false)}
                  disabled={!lookupResult || lookupResult.alreadyRegistered}
                  className="h-10 px-4 rounded-lg bg-primary text-sm text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Ship Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
