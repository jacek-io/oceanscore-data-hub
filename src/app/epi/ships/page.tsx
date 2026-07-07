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
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Mock EPI ship data ── */
const epiShipData = [
  { id: "1", name: "Arctic Navigator", imo: "912345678", status: "Active" as const, portCallsYtd: 3, epiScore: 82, pending: 0 },
  { id: "2", name: "Astral", imo: "912345678", status: "Inactive" as const, portCallsYtd: 2, epiScore: 88, pending: 0 },
  { id: "3", name: "Rosemary", imo: "912345678", status: "Active" as const, portCallsYtd: 0, epiScore: null, pending: 0 },
  { id: "4", name: "Shadow", imo: "912345678", status: "Active" as const, portCallsYtd: 1, epiScore: 67, pending: 1 },
  { id: "5", name: "Shadow", imo: "912345678", status: "Active" as const, portCallsYtd: 2, epiScore: null, pending: 1 },
  { id: "6", name: "Astral", imo: "912345678", status: "Active" as const, portCallsYtd: 2, epiScore: 88, pending: 0 },
];

type ShipStatus = "Active" | "Inactive";

function StatusBadge({ status }: { status: ShipStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border",
        status === "Active" && "bg-status-active-bg text-[#294215] border-status-active-border",
        status === "Inactive" && "bg-[#f3f4f6] text-[#4a5565] border-[#e5e7eb]"
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

function PendingBadge({ count }: { count: number }) {
  if (count === 0) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border bg-white text-foreground border-[#e5e7eb]">
        0
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-6 px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border bg-status-revoked-bg text-status-revoked border-status-revoked-border">
      {count}
    </span>
  );
}

type SortKey = "name" | "status" | "portCallsYtd" | "epiScore" | "pending";

export default function EpiShipsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

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

  const filtered = epiShipData
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
        case "portCallsYtd":
          return dir * (a.portCallsYtd - b.portCallsYtd);
        case "epiScore":
          return dir * ((a.epiScore ?? 0) - (b.epiScore ?? 0));
        case "pending":
          return dir * (a.pending - b.pending);
        default:
          return 0;
      }
    });

  return (
    <div className="px-6 py-5 space-y-5">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-medium text-foreground leading-tight tracking-[-0.96px]">
            Ships
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fleet-level summary of EPI participation per ship
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

      {/* Ships Table Card */}
      <div className="bg-white rounded-[16px] p-4">
        <div className="flex items-center justify-between px-2 pb-4">
          <div>
            <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">EPI-enrolled ships</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {epiShipData.length} vessels participating in EPI
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ship..."
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
                onClick={() => handleSort("portCallsYtd")}
                className="text-center text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
              >
                Port Calls YTD
              </th>
              <th
                onClick={() => handleSort("epiScore")}
                className="text-center text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
              >
                EPI Score
              </th>
              <th
                onClick={() => handleSort("pending")}
                className="text-center text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] last:rounded-r-lg cursor-pointer select-none"
              >
                Pending
              </th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={5} className="h-2" /></tr>
            {filtered.map((ship, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === filtered.length - 1;
              return (
                <tr
                  key={ship.id}
                  className="border-b border-[#f0f1f3] last:border-b-0 hover:bg-[#fafbfc] transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/epi/ships/${ship.id}`}
                >
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-normal text-foreground">{ship.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{ship.imo}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={ship.status} />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-sm text-foreground">{ship.portCallsYtd}</span>
                  </td>
                  <td className={cn(
                    "px-4 py-3.5 text-center bg-[#f9fafb]",
                    isFirst && "rounded-tl-lg rounded-tr-lg",
                    isLast && "rounded-bl-lg rounded-br-lg"
                  )}>
                    {ship.epiScore !== null ? (
                      <ScorePill score={ship.epiScore} />
                    ) : (
                      <span className="text-sm text-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <PendingBadge count={ship.pending} />
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
          Showing {filtered.length} of {epiShipData.length} Ships
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
    </div>
  );
}
