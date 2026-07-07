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

/* ── Mock ESI scores per ship ── */
const esiShipData = [
  { shipId: "1", ghg: [28, 40], sox: [32, 40], nox: [8, 10], inn: [6, 10], esiScore: 83, urnScore: 86 },
  { shipId: "2", ghg: [35, 40], sox: [38, 40], nox: [9, 10], inn: [8, 10], esiScore: 88, urnScore: 92 },
  { shipId: "3", ghg: [20, 40], sox: [25, 40], nox: [5, 10], inn: [4, 10], esiScore: 35, urnScore: 35 },
  { shipId: "5", ghg: [30, 40], sox: [35, 40], nox: [7, 10], inn: [7, 10], esiScore: 72, urnScore: 78 },
  { shipId: "6", ghg: [10, 40], sox: [12, 40], nox: [3, 10], inn: [2, 10], esiScore: 25, urnScore: 20 },
  { shipId: "7", ghg: [15, 40], sox: [18, 40], nox: [4, 10], inn: [5, 10], esiScore: 55, urnScore: 30 },
  { shipId: "8", ghg: [33, 40], sox: [36, 40], nox: [9, 10], inn: [9, 10], esiScore: 37, urnScore: 90 },
  { shipId: "9", ghg: [18, 40], sox: [20, 40], nox: [6, 10], inn: [3, 10], esiScore: 62, urnScore: 40 },
  { shipId: "10", ghg: [31, 40], sox: [34, 40], nox: [8, 10], inn: [7, 10], esiScore: 80, urnScore: 82 },
];

/* Only ships enrolled in ESI */
const esiShips = ships.filter((s) => s.schemes.includes("ESI"));
const esiData = esiShips.map((ship) => {
  const data = esiShipData.find((d) => d.shipId === ship.id);
  return { ...ship, ...(data ?? { ghg: [0, 40], sox: [0, 40], nox: [0, 10], inn: [0, 10], esiScore: 0, urnScore: 0 }) };
});

const activeCount = esiData.filter((s) => s.status === "Active").length;
const inactiveCount = esiData.filter((s) => s.status === "Inactive").length;
const revokedCount = esiData.filter((s) => s.status === "Revoked").length;

/* Score distribution: 8 axis labels, 7 bars between them */
const chartLabels = [20, 30, 40, 50, 60, 70, 80, 90];
/* Hardcoded bar heights (%) to match design presentation */
const chartBarHeights = [33, 69, 11, 27, 9, 64, 92];

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

type SortKey = "name" | "status" | "ghg" | "sox" | "nox" | "inn" | "esiScore" | "urnScore";

export default function EsiOverviewPage() {
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

  const filtered = esiData
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
        case "ghg":
          return dir * (a.ghg[0] - b.ghg[0]);
        case "sox":
          return dir * (a.sox[0] - b.sox[0]);
        case "nox":
          return dir * (a.nox[0] - b.nox[0]);
        case "inn":
          return dir * (a.inn[0] - b.inn[0]);
        case "esiScore":
          return dir * (a.esiScore - b.esiScore);
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
            Environmental Ship Index
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fleet overview — read-only analytics view
          </p>
        </div>
        <Link
          href="/fleet"
          className="inline-flex items-center gap-2 h-10 px-3 py-2.5 rounded-lg bg-primary text-sm font-normal text-white hover:bg-primary/90 transition-colors"
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
              {esiData.length}
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

        {/* ESI Score Distribution */}
        <div className="bg-white rounded-[16px] p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">ESI Score Distribution</p>
            <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="relative h-[92px]">
            {/* Grid lines — 8 evenly spaced dashed vertical lines */}
            <div className="absolute inset-0 flex justify-between">
              {chartLabels.map((l) => (
                <div key={l} className="w-px h-full border-l border-dashed border-[#e5e7eb]" />
              ))}
            </div>
            {/* 7 bars — positioned to fill the spaces between lines */}
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
                <p className="text-sm font-medium text-foreground">Arctic Navigator</p>
                <p className="text-sm text-muted-foreground mt-0.5">Improve Score — NOx levels above threshold</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-3" />
            </button>
            <button className="w-full flex items-center justify-between py-3 hover:bg-[#fafbfc] transition-colors text-left">
              <div>
                <p className="text-sm font-medium text-foreground">Caspian Trader</p>
                <p className="text-sm text-muted-foreground mt-0.5">Improve Score — SOx levels above threshold</p>
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
              Click a ship to edit its data
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
                onClick={() => handleSort("ghg")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
              >
                GHG <SortIcon col="ghg" />
              </th>
              <th
                onClick={() => handleSort("sox")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
              >
                SOX <SortIcon col="sox" />
              </th>
              <th
                onClick={() => handleSort("nox")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
              >
                NOX <SortIcon col="nox" />
              </th>
              <th
                onClick={() => handleSort("inn")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
              >
                INN <SortIcon col="inn" />
              </th>
              <th
                onClick={() => handleSort("esiScore")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
              >
                ESI Score <SortIcon col="esiScore" />
              </th>
              <th
                onClick={() => handleSort("urnScore")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] last:rounded-r-lg cursor-pointer select-none"
              >
                URN <SortIcon col="urnScore" />
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Spacer row for gap between header and grouped bg */}
            <tr>
              <td colSpan={2} className="h-2" />
              <td colSpan={5} className="h-2" />
              <td className="h-2" />
            </tr>
            {filtered.map((ship, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === filtered.length - 1;
              return (
                <tr
                  key={ship.id}
                  className="border-b border-[#f0f1f3] last:border-b-0 hover:bg-[#fafbfc] transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <Link href={`/esi/${ship.id}`} className="block">
                      <p className="text-sm font-normal text-foreground">{ship.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{ship.imo}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={ship.status} />
                  </td>
                  <td className={cn("px-4 py-3.5 text-foreground bg-[#f9fafb]", isFirst && "rounded-tl-lg", isLast && "rounded-bl-lg")}>
                    <span className="text-sm">{ship.ghg[0]}</span>
                    <span className="text-[9px] text-muted-foreground"> /{ship.ghg[1]}</span>
                  </td>
                  <td className="px-4 py-3.5 text-foreground bg-[#f9fafb]">
                    <span className="text-sm">{ship.sox[0]}</span>
                    <span className="text-[9px] text-muted-foreground"> /{ship.sox[1]}</span>
                  </td>
                  <td className="px-4 py-3.5 text-foreground bg-[#f9fafb]">
                    <span className="text-sm">{ship.nox[0]}</span>
                    <span className="text-[9px] text-muted-foreground"> /{ship.nox[1]}</span>
                  </td>
                  <td className="px-4 py-3.5 text-foreground bg-[#f9fafb]">
                    <span className="text-sm">{ship.inn[0]}</span>
                    <span className="text-[9px] text-muted-foreground"> /{ship.inn[1]}</span>
                  </td>
                  <td className={cn("px-4 py-3.5 bg-[#f9fafb]", isFirst && "rounded-tr-lg", isLast && "rounded-br-lg")}>
                    <ScorePill score={ship.esiScore} total={100} />
                  </td>
                  <td className="px-4 py-3.5">
                    <ScorePill score={ship.urnScore} total={100} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Showing {filtered.length} of {esiData.length} Ships
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
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:bg-[#f8f9fa] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-white text-sm font-medium text-foreground">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:bg-[#f8f9fa] transition-colors">
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
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f3f4f6] transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2">
              {[
                { ship: "Arctic Navigator", action: "Improve Score — NOx levels above threshold", urgent: true },
                { ship: "Caspian Trader", action: "Improve Score — SOx levels above threshold", urgent: true },
                { ship: "Nordic Voyager", action: "Missing BDN — upload bunker delivery for March" },
                { ship: "Pacific Explorer", action: "CII rating dropped to D — review fuel consumption" },
                { ship: "Baltic Carrier", action: "Tier III hours incomplete — update engine records" },
                { ship: "Coral Spirit", action: "ETS data gap — verify EU port calls for Q1" },
                { ship: "Iron Meridian", action: "Shore power usage unrecorded — check port stays" },
                { ship: "Jade Horizon", action: "Sulphur content missing — add BDN details" },
              ].map((item, i, arr) => (
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
