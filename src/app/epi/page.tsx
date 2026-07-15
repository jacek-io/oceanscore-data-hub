"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Database,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  BarChart3,
  Anchor,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* ── Mock EPI port call data ── */
const portCallData = [
  { id: "1", ship: "Arctic Navigator", imo: "912345678", port: "Bergen", country: "Norway", countryCode: "no", arrival: "2026-03-18", departure: "2026-03-20", hours: 48, status: "Submitted" as const, epiScore: 82, vsBaseline: 7 },
  { id: "2", ship: "Astral", imo: "912345678", port: "Amsterdam", country: "Netherlands", countryCode: "nl", arrival: "2026-03-15", departure: "2026-03-17", hours: 36, status: "Pending" as const, epiScore: 86, vsBaseline: 13 },
  { id: "3", ship: "Rosemary", imo: "912345678", port: "Stavanger", country: "Norway", countryCode: "no", arrival: "2026-03-12", departure: "2026-03-14", hours: 42, status: "Submitted" as const, epiScore: null, vsBaseline: null },
  { id: "4", ship: "Shadow", imo: "912345678", port: "Reykjavik", country: "Iceland", countryCode: "is", arrival: "2026-03-10", departure: "2026-03-12", hours: 40, status: "Submitted" as const, epiScore: 67, vsBaseline: -5 },
  { id: "5", ship: "Shadow", imo: "912345678", port: "Bergen", country: "Norway", countryCode: "no", arrival: "2026-03-08", departure: "2026-03-10", hours: 44, status: "Overdue" as const, epiScore: null, vsBaseline: null },
  { id: "6", ship: "Astral", imo: "912345678", port: "Hamburg", country: "Germany", countryCode: "de", arrival: "2026-03-05", departure: "2026-03-07", hours: 36, status: "Submitted" as const, epiScore: 84, vsBaseline: 4 },
  { id: "7", ship: "MV Southern Cross", imo: "912345678", port: "Reykjavik", country: "Iceland", countryCode: "is", arrival: "2026-03-03", departure: "2026-03-05", hours: 36, status: "Submitted" as const, epiScore: 74, vsBaseline: -7 },
  { id: "8", ship: "Arctic Navigator", imo: "912345678", port: "Rotterdam", country: "Netherlands", countryCode: "nl", arrival: "2026-03-01", departure: "2026-03-03", hours: 36, status: "Submitted" as const, epiScore: 74, vsBaseline: 2 },
  { id: "9", ship: "Northern Star", imo: "912345678", port: "Reykjavik", country: "Iceland", countryCode: "is", arrival: "2026-02-27", departure: "2026-03-01", hours: 48, status: "Submitted" as const, epiScore: 84, vsBaseline: 9 },
];

const submittedCount = portCallData.filter((p) => p.status === "Submitted").length;
const pendingCount = portCallData.filter((p) => p.status === "Pending").length;
const overdueCount = portCallData.filter((p) => p.status === "Overdue").length;

const chartLabels = [20, 30, 40, 50, 60, 70, 80, 90];
const chartBarHeights = [33, 69, 11, 27, 9, 64, 92];

type PortCallStatus = "Submitted" | "Pending" | "Overdue";

function StatusBadge({ status }: { status: PortCallStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border",
        status === "Submitted" && "bg-status-active-bg text-[#294215] border-status-active-border",
        status === "Pending" && "bg-[#f3f4f6] text-[#4a5565] border-[#e5e7eb]",
        status === "Overdue" && "bg-status-revoked-bg text-status-revoked border-status-revoked-border"
      )}
    >
      {status}
    </span>
  );
}

function ScorePill({ score }: { score: number }) {
  const colors =
    score >= 75
      ? "bg-status-active-bg text-[#294215] border-status-active-border"
      : "bg-[#ffedd4] text-[#9f2d00] border-[#ffd6a7]";
  return (
    <span className={cn("inline-flex items-center px-2 py-1 rounded-[36px] border leading-[1.45]", colors)}>
      <span className="text-[14px]">{score} </span>
      <span className="text-[9px]">/100</span>
    </span>
  );
}

type SortKey = "ship" | "status" | "port" | "arrival" | "departure" | "hours" | "epiScore" | "vsBaseline";

export default function EpiPortCallsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [portFilter, setPortFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("arrival");
  const [sortAsc, setSortAsc] = useState(false);
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

  const filtered = portCallData
    .filter((pc) => {
      const matchSearch =
        search === "" ||
        pc.ship.toLowerCase().includes(search.toLowerCase()) ||
        pc.port.toLowerCase().includes(search.toLowerCase()) ||
        pc.imo.includes(search);
      const matchPort = portFilter === "all" || pc.port === portFilter;
      const matchStatus = statusFilter === "all" || pc.status === statusFilter;
      return matchSearch && matchPort && matchStatus;
    })
    .sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      switch (sortKey) {
        case "ship":
          return dir * a.ship.localeCompare(b.ship);
        case "status":
          return dir * a.status.localeCompare(b.status);
        case "port":
          return dir * a.port.localeCompare(b.port);
        case "arrival":
          return dir * a.arrival.localeCompare(b.arrival);
        case "departure":
          return dir * a.departure.localeCompare(b.departure);
        case "hours":
          return dir * (a.hours - b.hours);
        case "epiScore":
          return dir * ((a.epiScore ?? 0) - (b.epiScore ?? 0));
        case "vsBaseline":
          return dir * ((a.vsBaseline ?? 0) - (b.vsBaseline ?? 0));
        default:
          return 0;
      }
    });

  const uniquePorts = [...new Set(portCallData.map((p) => p.port))];

  return (
    <div className="px-6 py-5 space-y-5">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-medium text-foreground leading-tight tracking-[-0.96px]">
            Environmental Port Index
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Per-port-call environmental reporting - read-only activity log
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
        {/* Port Calls YTD */}
        <div className="bg-white rounded-[16px] py-4 flex flex-col justify-between">
          <div className="flex items-center justify-between px-4">
            <span className="text-sm text-muted-foreground">Port Calls YTD</span>
            <div className="w-8 h-8 rounded-full bg-[#98A1AE]/15 flex items-center justify-center">
              <Anchor className="w-4 h-4 text-[#98A1AE]" />
            </div>
          </div>
          <div className="px-4">
            <p className="text-[40px] font-medium text-foreground leading-[1.2] tracking-[-0.4px]">
              {portCallData.length + 1}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 px-4">
            <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border bg-status-active-bg text-[#294215] border-status-active-border">
              {submittedCount} Submitted
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[12px] font-normal leading-[1.45] border bg-[#f3f4f6] text-[#697282] border-[#e5e7eb]">
              {pendingCount + 1} Pending
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border bg-status-revoked-bg text-status-revoked border-status-revoked-border">
              {overdueCount} Overdue
            </span>
          </div>
        </div>

        {/* EPI Score Distribution */}
        <div className="bg-white rounded-[16px] flex-1 p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">EPI Score Distribution</p>
            <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="relative h-[92px]">
            <div className="absolute inset-0 flex justify-between">
              {chartLabels.map((l) => (
                <div key={l} className="w-px h-full border-l border-dashed border-[#e5e7eb]" />
              ))}
            </div>
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
              2 Open
            </span>
            <button
              onClick={() => setShowActionsDialog(true)}
              className="ml-auto text-sm font-medium text-foreground hover:underline"
            >
              Show All
            </button>
          </div>
          <div className="mt-4 space-y-0 flex-1">
            <button className="w-full flex items-center justify-between py-2 border-b border-[#f0f1f3] hover:bg-[#fafbfc] transition-colors text-left">
              <div>
                <p className="text-sm font-medium text-foreground">Shadow II Reykjavík</p>
                <p className="text-[11px] text-muted-foreground">
                  Awaiting submission - departed 2026-03-14
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 ml-3" />
            </button>
            <button className="w-full flex items-center justify-between py-2 hover:bg-[#fafbfc] transition-colors text-left">
              <div>
                <p className="text-sm font-medium text-foreground">Caspian Trader</p>
                <p className="text-[11px] text-muted-foreground">
                  Submission overdue - departed 2026-03-07
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 ml-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Port Call Activity Table */}
      <div className="bg-white rounded-[16px] p-4">
        <div className="flex items-center justify-between px-2 pb-4">
          <div>
            <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">Port Call Activity</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              All EPI port calls across the fleet
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={portFilter}
                onChange={(e) => setPortFilter(e.target.value)}
                className="h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Ports</option>
                {uniquePorts.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vessel or port..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-10 pr-4 w-[240px] rounded-lg border border-border bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("ship")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] first:rounded-l-lg cursor-pointer select-none"
              >
                Ship name / IMO <SortIcon col="ship" />
              </th>
              <th
                onClick={() => handleSort("status")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
              >
                Status <SortIcon col="status" />
              </th>
              <th
                onClick={() => handleSort("port")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
              >
                Port <SortIcon col="port" />
              </th>
              <th
                onClick={() => handleSort("arrival")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
              >
                Arrival <SortIcon col="arrival" />
              </th>
              <th
                onClick={() => handleSort("departure")}
                className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
              >
                Departure <SortIcon col="departure" />
              </th>
              <th
                onClick={() => handleSort("hours")}
                className="text-center text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
              >
                Hours
              </th>
              <th
                onClick={() => handleSort("epiScore")}
                className="text-center text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
              >
                EPI Score
              </th>
              <th
                onClick={() => handleSort("vsBaseline")}
                className="text-center text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] last:rounded-r-lg cursor-pointer select-none"
              >
                vs Baseline
              </th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={8} className="h-2" /></tr>
            {filtered.map((pc) => (
              <tr
                key={pc.id}
                onClick={() => router.push(`/epi/ships/${pc.id}`)}
                className="border-b border-[#f0f1f3] last:border-b-0 hover:bg-[#fafbfc] transition-colors cursor-pointer"
              >
                <td className="px-4 py-3.5">
                  <p className="text-sm font-normal text-foreground">{pc.ship}</p>
                  <p className="text-xs text-muted-foreground font-mono">{pc.imo}</p>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={pc.status} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-sm text-foreground">{pc.port}</p>
                      <p className="text-xs text-muted-foreground font-mono">{pc.country}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-foreground">{pc.arrival}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-foreground">{pc.departure}</span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className="text-sm text-foreground">{pc.hours}</span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  {pc.epiScore !== null ? (
                    <ScorePill score={pc.epiScore} />
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-center">
                  {pc.vsBaseline !== null ? (
                    <span
                      className={cn(
                        "text-sm",
                        pc.vsBaseline > 0 && "text-[#33561c]",
                        pc.vsBaseline < 0 && "text-[#9e2028]",
                        pc.vsBaseline === 0 && "text-muted-foreground"
                      )}
                    >
                      {pc.vsBaseline > 0 ? `+${pc.vsBaseline}` : pc.vsBaseline}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Showing {filtered.length} of {portCallData.length} Calls YTD
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
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-foreground">All Actions</span>
                <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border bg-status-revoked-bg text-status-revoked border-status-revoked-border">
                  2 Open
                </span>
              </div>
              <button
                onClick={() => setShowActionsDialog(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#ebf3ff] active:bg-[#cce1ff] transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {[
                { ship: "Shadow II Reykjavík", action: "Awaiting submission - departed 2026-03-14", urgent: true },
                { ship: "Caspian Trader", action: "Submission overdue - departed 2026-03-07", urgent: true },
                { ship: "Arctic Navigator", action: "Shore power data incomplete for Bergen call" },
                { ship: "MV Southern Cross", action: "Waste receipt missing for Reykjavik call" },
                { ship: "Astral", action: "Fuel switching log not submitted for Hamburg" },
                { ship: "Northern Star", action: "Ballast water report pending review" },
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
