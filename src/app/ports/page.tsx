"use client";

import { useState } from "react";
import {
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  ArrowUpDown,
  Anchor,
  MapPin,
  ChartColumnStacked,
  CalendarCheck2,
} from "lucide-react";
import { CircleFlag } from "react-circle-flags";
import { ports, type Port, type Scheme } from "@/lib/mock-data";
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

function TierBadge({ tier }: { tier: string }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-epi-blue-light text-epi-blue border border-epi-blue-border uppercase">
      {tier}
    </span>
  );
}

export default function PortsPage() {
  const [search, setSearch] = useState("");
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);

  const filtered = ports.filter(
    (p) =>
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-5 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-medium text-foreground leading-tight">Partner Ports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Explore the global network of partner ports across all schemes
        </p>
      </div>

      {/* Map Placeholder + Info Card */}
      <div className="relative rounded-[16px] overflow-hidden bg-[#e8edf2] h-[430px]">
        {/* Map placeholder */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-2 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <p className="text-sm">Interactive map</p>
          </div>
        </div>

        {/* Port Info Card */}
        {selectedPort && (
          <div className="absolute top-2 right-2 bottom-2 w-[505px] bg-white rounded-lg border border-[#e5e7eb] shadow-[0px_32px_64px_-12px_rgba(10,13,18,0.2)] p-4 flex flex-col gap-4 overflow-auto">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CircleFlag countryCode={selectedPort.countryCode} width={20} height={20} />
                  <h3 className="text-2xl font-medium text-foreground leading-[1.5]">{selectedPort.name}</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
                    Active Hub
                  </span>
                </div>
                <button onClick={() => setSelectedPort(null)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {selectedPort.country}
                </span>
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <ChartColumnStacked className="w-4 h-4 text-muted-foreground" />
                  {selectedPort.type}
                </span>
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <CalendarCheck2 className="w-4 h-4 text-muted-foreground" />
                  12/2016
                </span>
              </div>
            </div>

            {/* Scheme badges */}
            <div className="flex gap-2">
              {selectedPort.schemes.map((s) => (
                <SchemeBadge key={s} scheme={s} />
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-[#e5e7eb]" />

            {/* Description */}
            <div className="flex flex-col gap-4 py-2">
              <p className="text-sm text-foreground leading-[1.5]">
                Port due incentives from ESI Air points
              </p>
              <p className="text-sm text-muted-foreground leading-[1.5]">
                Seagoing vessels with an ESI (and possible NOx) score, are eligible for a discount on the sustainability component due. Ships receive discounts on the sustainability component according to the following Table from our general terms and conditions which can be found at our website. The discount applies to all vessels that have an ESI score upon their actual time of arrival (ATA) in Rotterdam.
              </p>
            </div>

            {/* Visit Website link */}
            <a href="#" className="text-sm text-primary border-b border-primary self-start pb-0.5">
              Visit Website
            </a>
          </div>
        )}
      </div>

      {/* Ports Table */}
      <div className="bg-white rounded-[16px] p-4">
        <div className="flex items-center justify-between px-2 pb-4">
          <div>
            <h2 className="text-xl font-medium text-foreground">Ports</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Worldwide offering discounts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                <option>All Schemes</option>
                <option>ESI</option>
                <option>EPI</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <select className="h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                <option>All Status</option>
                <option>Active</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ports or countries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-10 pr-4 w-64 rounded-lg border border-border bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#f8f9fa] transition-colors">
              <Download className="w-4 h-4 text-muted-foreground" />
              Export
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] first:rounded-l-lg last:rounded-r-lg">
                <span className="flex items-center gap-1">
                  Port name <ArrowUpDown className="w-3 h-3 text-[#D1D5DC]" />
                </span>
              </th>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                <span className="flex items-center gap-1">
                  Country <ArrowUpDown className="w-3 h-3 text-[#D1D5DC]" />
                </span>
              </th>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                <span className="flex items-center gap-1">
                  Schemes <ArrowUpDown className="w-3 h-3 text-[#D1D5DC]" />
                </span>
              </th>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                <span className="flex items-center gap-1">
                  Starting from <ArrowUpDown className="w-3 h-3 text-[#D1D5DC]" />
                </span>
              </th>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                <span className="flex items-center gap-1">
                  Type <ArrowUpDown className="w-3 h-3 text-[#D1D5DC]" />
                </span>
              </th>
              <th className="w-12 px-4 h-10 bg-[#F3F4F6] first:rounded-l-lg last:rounded-r-lg" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((port) => (
              <tr
                key={port.id}
                className="border-b border-[#f0f1f3] last:border-b-0 hover:bg-[#fafbfc] transition-colors cursor-pointer"
                onClick={() => setSelectedPort(port)}
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#f3f4f6] flex items-center justify-center shrink-0">
                      <Anchor className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-normal text-foreground">
                      {port.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-2 text-sm">
                    <CircleFlag countryCode={port.countryCode} width={20} height={20} />
                    {port.country}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5">
                    {port.schemes.map((s) => (
                      <SchemeBadge key={s} scheme={s} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
                    <span className="text-[14px] font-normal">{port.startingFrom} </span>
                    <span className="text-[9px] font-normal">/100</span>
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-[#f3f4f6] text-[#4a5565] border border-[#e5e7eb]">
                    {port.type}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Showing {filtered.length} of {ports.length} Ports
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
