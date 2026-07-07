"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { ships, type Scheme, type ShipStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function SchemeBadge({ scheme }: { scheme: Scheme }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border",
        scheme === "ESI"
          ? "bg-status-active-bg text-status-active border-status-active-border"
          : "bg-epi-blue-light text-epi-blue border-epi-blue-border"
      )}
    >
      {scheme}
    </span>
  );
}

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

export function ShipTable() {
  const [search, setSearch] = useState("");
  const [schemeFilter, setSchemeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = ships.filter((ship) => {
    const matchSearch =
      search === "" ||
      ship.name.toLowerCase().includes(search.toLowerCase()) ||
      ship.imo.includes(search);
    const matchScheme =
      schemeFilter === "all" || ship.schemes.includes(schemeFilter as Scheme);
    const matchStatus =
      statusFilter === "all" || ship.status === statusFilter;
    return matchSearch && matchScheme && matchStatus;
  });

  return (
    <>
    <div className="bg-white rounded-[16px] p-4">
      {/* Header */}
      <div className="flex items-center justify-between px-2 pb-4">
        <div>
          <h2 className="text-xl font-medium text-foreground">Ships</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Click a ship to edit its data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={schemeFilter}
              onChange={(e) => setSchemeFilter(e.target.value)}
              className="h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Schemes</option>
              <option value="ESI">ESI</option>
              <option value="EPI">EPI</option>
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
            <th className="text-left text-xs font-medium text-muted-foreground px-4 h-10 bg-[#F3F4F6] first:rounded-l-lg last:rounded-r-lg">
              Ship name / IMO
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
              Schemes
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
              Status
            </th>
            <th className="w-12 px-4 h-10 bg-[#F3F4F6] first:rounded-l-lg last:rounded-r-lg" />
          </tr>
        </thead>
        <tbody>
          {filtered.map((ship) => (
            <tr
              key={ship.id}
              className="border-b border-[#f0f1f3] last:border-b-0 hover:bg-[#fafbfc] transition-colors"
            >
              <td className="px-4 py-3.5">
                <Link href={`/fleet/${ship.id}`} className="block">
                  <p className="text-sm font-normal text-foreground">
                    {ship.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {ship.imo}
                  </p>
                </Link>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex gap-1.5">
                  {ship.schemes.map((s) => (
                    <SchemeBadge key={s} scheme={s} />
                  ))}
                </div>
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={ship.status} />
              </td>
              <td className="px-4 py-3.5">
                <Link href={`/fleet/${ship.id}`}>
                  <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>

      {/* Pagination - outside the table card */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Showing {filtered.length} of {ships.length} Ships
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
    </>
  );
}
