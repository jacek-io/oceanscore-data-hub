"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  Plus,
  Pen,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* -- Mock port call data -- */
const portCalls = [
  { id: "1", ship: "Arctic Navigator", imo: "912345678", port: "Bergen", terminal: "Container Terminal", ecaStatus: "Inside ECA", arrival: "2026-03-18", arrivalTime: "08:30", departure: "2026-03-26", departureTime: "14:00" },
  { id: "2", ship: "Astral", imo: "912345678", port: "Bremerhaven", terminal: "NTB North Sea", ecaStatus: "Inside ECA", arrival: "2026-03-14", arrivalTime: "19:30", departure: "2026-03-18", departureTime: "16:15" },
  { id: "3", ship: "Caspian Trader", imo: "912345678", port: "Antwerp", terminal: "Deurganck Dock", ecaStatus: "Inside ECA", arrival: "2026-03-22", arrivalTime: "12:00", departure: "2026-03-29", departureTime: "20:30" },
  { id: "4", ship: "Shadow", imo: "912345678", port: "Rotterdam", terminal: "Europoort Terminal", ecaStatus: "Inside ECA", arrival: "2026-03-18", arrivalTime: "19:30", departure: "2026-03-25", departureTime: "08:00" },
  { id: "5", ship: "MV Mediterranean Pearl", imo: "912345678", port: "Felixstowe", terminal: "Trinity Terminal", ecaStatus: "Inside ECA", arrival: "2026-03-11", arrivalTime: "01:15", departure: "2026-03-19", departureTime: "19:00" },
  { id: "6", ship: "Shadow", imo: "912345678", port: "Oslo", terminal: "Sjursoya Terminal", ecaStatus: "Inside ECA", arrival: "2026-03-14", arrivalTime: "01:15", departure: "2026-03-21", departureTime: "12:00" },
  { id: "7", ship: "Shadow", imo: "912345678", port: "Stavanger", terminal: "Risavika Terminal", ecaStatus: "Inside ECA", arrival: "2026-03-13", arrivalTime: "20:15", departure: "2026-03-20", departureTime: "15:45" },
  { id: "8", ship: "Rosemary", imo: "912345678", port: "Gothenburg", terminal: "APM Terminal", ecaStatus: "Inside ECA", arrival: "2026-03-12", arrivalTime: "14:30", departure: "2026-03-18", departureTime: "07:00" },
  { id: "9", ship: "Shadow", imo: "912345678", port: "Hamburg", terminal: "Burchardkai Terminal", ecaStatus: "Inside ECA", arrival: "2026-03-21", arrivalTime: "04:00", departure: "2026-03-28", departureTime: "17:15" },
  { id: "10", ship: "MV Southern Cross", imo: "912345678", port: "Aarhus", terminal: "Container Terminal", ecaStatus: "Inside ECA", arrival: "2026-03-19", arrivalTime: "12:30", departure: "2026-03-25", departureTime: "10:00" },
];

export default function PortCallsPage() {
  const [search, setSearch] = useState("");

  const filtered = portCalls.filter(
    (pc) =>
      search === "" ||
      pc.ship.toLowerCase().includes(search.toLowerCase()) ||
      pc.port.toLowerCase().includes(search.toLowerCase()) ||
      pc.terminal.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-5 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-medium text-foreground leading-tight">Port calls</h1>
          <p className="text-sm text-muted-foreground mt-1">
            A complete record of your fleet&apos;s port visits.
          </p>
        </div>
        <Link href="/fleet/port-calls/new" className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#061e3a] text-sm font-normal text-white hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors">
          <Plus className="w-4 h-4 text-primary-icon" />
          Add Port Call
        </Link>
      </div>

      {/* Port Call Activity Table */}
      <div className="bg-white rounded-[16px] p-4">
        <div className="flex items-center justify-between px-2 pb-4">
          <div>
            <h2 className="text-xl font-medium text-foreground">Port Call Activity</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              All EPI port calls across the fleet.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                <option>All Ports</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ships or port..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-10 pr-4 w-64 rounded-lg border border-border bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] first:rounded-l-lg">
                <span className="flex items-center gap-1">
                  Ship name / IMO <ArrowUpDown className="w-3 h-3 text-[#D1D5DC]" />
                </span>
              </th>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                <span className="flex items-center gap-1">
                  Port / Terminal <ArrowUpDown className="w-3 h-3 text-[#D1D5DC]" />
                </span>
              </th>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                <span className="flex items-center gap-1">
                  Port ECA Status <ArrowUpDown className="w-3 h-3 text-[#D1D5DC]" />
                </span>
              </th>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                <span className="flex items-center gap-1">
                  Arrival <ArrowUpDown className="w-3 h-3 text-[#D1D5DC]" />
                </span>
              </th>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                <span className="flex items-center gap-1">
                  Departure <ArrowUpDown className="w-3 h-3 text-[#D1D5DC]" />
                </span>
              </th>
              <th className="w-12 px-4 h-10 bg-[#F3F4F6] last:rounded-r-lg" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((pc) => (
              <tr
                key={pc.id}
                className="border-b border-[#f0f1f3] last:border-b-0 hover:bg-[#fafbfc] transition-colors"
              >
                <td className="px-4 py-3.5">
                  <div className="flex flex-col">
                    <span className="text-sm font-normal text-foreground">{pc.ship}</span>
                    <span className="text-xs text-muted-foreground">{pc.imo}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">{pc.port}</span>
                    <span className="text-xs text-muted-foreground">{pc.terminal}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-[#f3f4f6] text-[#4a5565] border border-[#e5e7eb]">
                    {pc.ecaStatus}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">{pc.arrival}</span>
                    <span className="text-xs text-muted-foreground">{pc.arrivalTime}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">{pc.departure}</span>
                    <span className="text-xs text-muted-foreground">{pc.departureTime}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <Link href={`/fleet/port-calls/${pc.id}/edit`}>
                    <Pen className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Showing {filtered.length} of {portCalls.length} Ships
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
    </div>
  );
}
