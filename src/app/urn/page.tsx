"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Database,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  BarChart3,
  Ship,
  X,
} from "lucide-react";
import { ships, type ShipStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/* ── Mock URN scores per ship ── */
const urnShipData = [
  { shipId: "1", urnScore: 86 },
  { shipId: "2", urnScore: 92 },
  { shipId: "3", urnScore: 35 },
  { shipId: "5", urnScore: 78 },
  { shipId: "6", urnScore: 20 },
  { shipId: "7", urnScore: 30 },
  { shipId: "8", urnScore: 90 },
  { shipId: "10", urnScore: 82 },
];

/* Only ships enrolled in URN */
const urnShips = ships.filter((s) => s.schemes.includes("URN"));
const urnData = urnShips.map((ship) => {
  const data = urnShipData.find((d) => d.shipId === ship.id);
  return { ...ship, urnScore: data?.urnScore ?? 0 };
});

const activeCount = urnData.filter((s) => s.status === "Active").length;
const inactiveCount = urnData.filter((s) => s.status === "Inactive").length;
const revokedCount = urnData.filter((s) => s.status === "Revoked").length;

/* Score distribution: 8 axis labels, 7 bars between them */
const chartLabels = [20, 30, 40, 50, 60, 70, 80, 90];
/* Hardcoded bar heights (%) to match design presentation */
const chartBarHeights = [27, 11, 9, 15, 33, 64, 92];

function StatusBadge({ status }: { status: ShipStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border",
        status === "Active" && "bg-status-active-bg text-status-active border-status-active-border",
        status === "Inactive" && "bg-status-inactive-bg text-status-inactive border-status-inactive-border",
        status === "Revoked" && "bg-status-revoked-bg text-status-revoked border-status-revoked-border"
      )}
    >
      {status}
    </span>
  );
}

function ScorePill({ score, total }: { score: number; total: number }) {
  const colors =
    score >= 70
      ? "bg-status-active-bg text-status-active border-status-active-border"
      : score >= 50
      ? "bg-[#ffedd4] text-[#9f2d00] border-[#ffd6a7]"
      : "bg-status-revoked-bg text-status-revoked border-status-revoked-border";
  return (
    <span className={cn("inline-flex items-center gap-[6px] px-2 py-1 rounded-[36px] border leading-[1.45]", colors)}>
      <span className="text-[14px]">{score}</span>
      <span className="text-[9px]">/{total}</span>
    </span>
  );
}

type SortKey = "name" | "status" | "urnScore";

export default function UrnOverviewPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [showActionsDialog, setShowActionsDialog] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-[#D1D5DC] ml-1 inline" />;
    return sortAsc ? (
      <ChevronUp className="w-3 h-3 text-muted-foreground ml-1 inline" />
    ) : (
      <ChevronDown className="w-3 h-3 text-muted-foreground ml-1 inline" />
    );
  };

  const filtered = urnData
    .filter((ship) => {
      const matchSearch =
        search === "" ||
        ship.name.toLowerCase().includes(search.toLowerCase()) ||
        ship.imo.includes(search);
      const matchStatus = statusFilter === "all" || ship.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      switch (sortKey) {
        case "name":
          return dir * a.name.localeCompare(b.name);
        case "status":
          return dir * a.status.localeCompare(b.status);
        case "urnScore":
          return dir * (a.urnScore - b.urnScore);
        default:
          return 0;
      }
    });

  return (
    <div className="px-6 py-5 space-y-5">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-medium text-foreground leading-tight">
            Underwater Radiated Noise
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fleet overview - read-only analytics view
          </p>
        </div>
        <Link
          href="/fleet"
          className="inline-flex items-center gap-2 h-10 px-3 py-2.5 rounded-lg bg-[#061e3a] text-sm font-normal text-white hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors"
        >
          <Database className="w-4 h-4 text-[#5b9aff]" />
          Open Data Hub
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-[1fr_2fr_1.5fr] gap-5">
        {/* Total Ships */}
        <div className="bg-white rounded-[16px] p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Ships</span>
            <div className="w-8 h-8 rounded-full bg-[#98A1AE]/15 flex items-center justify-center">
              <Ship className="w-4 h-4 text-[#98A1AE]" />
            </div>
          </div>
          <div className="flex-1 flex items-center">
            <p className="text-[40px] font-medium text-foreground leading-none">
              {urnData.length}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border bg-status-active-bg text-status-active border-status-active-border">
              {activeCount} active
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border bg-status-inactive-bg text-status-inactive border-status-inactive-border">
              {inactiveCount} inactive
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border bg-status-revoked-bg text-status-revoked border-status-revoked-border">
              {revokedCount} revoked
            </span>
          </div>
        </div>

        {/* URN Score Distribution */}
        <div className="bg-white rounded-[16px] p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">URN Score Distribution</p>
            <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="relative h-[92px]">
            {/* Grid lines - 8 evenly spaced dashed vertical lines */}
            <div className="absolute inset-0 flex justify-between">
              {chartLabels.map((l) => (
                <div key={l} className="w-px h-full border-l border-dashed border-[#e5e7eb]" />
              ))}
            </div>
            {/* 7 bars - positioned to fill the spaces between lines */}
            <div
              className="absolute inset-0 grid items-end"
              style={{ gridTemplateColumns: `repeat(${chartBarHeights.length}, 1fr)`, paddingLeft: 1, paddingRight: 1 }}
            >
              {chartBarHeights.map((pct, i) => (
                <div key={i} className="flex items-end justify-center h-full px-[2px]">
                  <div
                    className="w-full rounded-[4px] bg-[#4780cf]"
                    style={{ height: `${pct}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            {chartLabels.map((label) => (
              <p key={label} className="text-[11px] text-muted-foreground leading-[1.45] text-center w-[22px]">
                {label}
              </p>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-[16px] p-4 flex flex-col">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Actions</span>
            <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border bg-status-revoked-bg text-status-revoked border-status-revoked-border">
              2 urgent
            </span>
            <button
              onClick={() => setShowActionsDialog(true)}
              className="ml-auto text-sm font-medium text-foreground hover:underline"
            >
              Show All
            </button>
          </div>
          <div className="mt-4 space-y-0 flex-1">
            <button className="w-full flex items-center justify-between py-3 border-b border-[#f0f1f3] hover:bg-[#fafbfc] transition-colors text-left">
              <div>
                <p className="text-sm font-medium text-foreground">Caspian Trader</p>
                <p className="text-sm text-muted-foreground mt-0.5">Noise level critical - broadband above 188 dB re 1uPa</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-3" />
            </button>
            <button className="w-full flex items-center justify-between py-3 hover:bg-[#fafbfc] transition-colors text-left">
              <div>
                <p className="text-sm font-medium text-foreground">Shadow</p>
                <p className="text-sm text-muted-foreground mt-0.5">Noise level critical - low-frequency output exceeds limit</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Ships Table Card */}
      <div className="bg-white rounded-[16px] p-4">
        {/* Table Header */}
        <div className="flex items-center justify-between px-2 pb-4">
          <div>
            <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">Ships</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Click a ship to view its noise data
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Revoked">Revoked</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ships..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-10 pr-4 w-56 rounded-lg border border-border bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("name")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] first:rounded-l-lg cursor-pointer select-none"
              >
                Ship name / IMO <SortIcon col="name" />
              </th>
              <th
                onClick={() => handleSort("status")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
              >
                Status <SortIcon col="status" />
              </th>
              <th
                onClick={() => handleSort("urnScore")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] last:rounded-r-lg cursor-pointer select-none"
              >
                URN Score <SortIcon col="urnScore" />
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Spacer row for gap between header and body */}
            <tr>
              <td colSpan={3} className="h-2" />
            </tr>
            {filtered.map((ship) => (
              <tr
                key={ship.id}
                className="border-b border-[#f0f1f3] last:border-b-0 hover:bg-[#fafbfc] transition-colors"
              >
                <td className="px-4 py-3.5">
                  <Link href={`/urn/${ship.id}`} className="block">
                    <p className="text-sm font-normal text-foreground">{ship.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ship.imo}</p>
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={ship.status} />
                </td>
                <td className="px-4 py-3.5">
                  <ScorePill score={ship.urnScore} total={100} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Showing {filtered.length} of {urnData.length} Ships
          <div className="relative">
            <select className="h-8 pl-2 pr-8 rounded-lg border border-border bg-white text-sm appearance-none">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-white text-sm font-medium text-foreground">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Actions Dialog */}
      {showActionsDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowActionsDialog(false)}
          />
          <div className="relative bg-white rounded-[16px] w-[560px] max-h-[80vh] flex flex-col shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-foreground">All Actions</span>
                <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border bg-status-revoked-bg text-status-revoked border-status-revoked-border">
                  2 urgent
                </span>
              </div>
              <button
                onClick={() => setShowActionsDialog(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#ebf3ff] active:bg-[#cce1ff] transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2">
              {[
                { ship: "Caspian Trader", action: "Noise level critical - broadband above 188 dB re 1uPa", urgent: true },
                { ship: "Shadow", action: "Noise level critical - low-frequency output exceeds limit", urgent: true },
                { ship: "Arctic Navigator", action: "Cavitation detected - propeller maintenance recommended" },
                { ship: "Astral", action: "Measurement overdue - last URN assessment expired" },
                { ship: "MV Mediterranean Pearl", action: "Speed reduction advisory - noise threshold at 14 kts" },
                { ship: "Rosemary", action: "Hydrophone calibration - sensor drift detected" },
                { ship: "MV Southern Cross", action: "Transit corridor noise - review routing plan" },
              ].map((item, i) => (
                <button
                  key={i}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-[#f9fafb] transition-colors text-left"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {item.urgent && (
                      <div className="w-2 h-2 rounded-full bg-[#dc2626] shrink-0" />
                    )}
                    <div className={!item.urgent ? "pl-5" : ""}>
                      <p className="text-sm font-medium text-foreground">{item.ship}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.action}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
