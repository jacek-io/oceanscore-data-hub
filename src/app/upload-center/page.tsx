"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download,
  Upload,
  ArrowUpDown,
  ChevronDown,
  Droplets,
  Zap,
  Ship,
  Fan,
  Settings2,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const dataTypes = [
  {
    id: "bdn",
    title: "Bunker Delivery (BDN)",
    description: "Fuel deliveries: quantity, fuel type, sulphur content, and supplier.",
    icon: Droplets,
    iconBg: "bg-[#f3f4f6]",
    iconColor: "text-muted-foreground",
    hasTemplate: true,
  },
  {
    id: "edn",
    title: "Energy Delivery (EDN)",
    description: "Shore power consumption and renewable energy generation.",
    icon: Zap,
    iconBg: "bg-[#f3f4f6]",
    iconColor: "text-muted-foreground",
    hasTemplate: true,
  },
  {
    id: "ship-master",
    title: "Ship Master Data",
    description: "Core ship details: IMO number, ship type, tonnage, and specs.",
    icon: Ship,
    iconBg: "bg-[#f3f4f6]",
    iconColor: "text-muted-foreground",
    hasTemplate: true,
  },
  {
    id: "engines",
    title: "Engines",
    description: "Technical data per engine: type, rated power, and NOx tier.",
    icon: Fan,
    iconBg: "bg-[#f3f4f6]",
    iconColor: "text-muted-foreground",
    hasTemplate: true,
  },
  {
    id: "tier3",
    title: "Engine Hours in Tier III",
    description: "Engine operating hours and NOx emissions.",
    icon: Settings2,
    iconBg: "bg-[#f3f4f6]",
    iconColor: "text-muted-foreground",
    hasTemplate: true,
  },
  {
    id: "ovd",
    title: "Operational Vessel Data (OVD)",
    description: "Automatically upload BDNs, EDNs, Log Abstracts, etc. in OVD Format.",
    icon: Star,
    iconBg: "bg-[#fef9c3]",
    iconColor: "text-[#ca8a04]",
    hasTemplate: false,
  },
];

const uploadHistory = [
  { id: "1", type: "Bunker Delivery (BDN)", date: "2026-08-30", status: "Processing" },
  { id: "2", type: "Energy Delivery (EDN)", date: "2026-08-30", status: "Validation Failed" },
  { id: "3", type: "Ship Master Data", date: "2026-08-23", status: "General Error" },
  { id: "4", type: "Operational Vessel Data (OVD)", date: "2026-08-15", status: "Processed" },
  { id: "5", type: "Operational Vessel Data (OVD)", date: "2026-08-15", status: "Processed" },
];

const statusStyles: Record<string, string> = {
  Processing: "bg-[#fef9c3] text-[#854d0e] border-[#fde68a]",
  "Validation Failed": "bg-[#fee2e2] text-[#991b1b] border-[#fecaca]",
  "General Error": "bg-[#fee2e2] text-[#991b1b] border-[#fecaca]",
  Processed: "bg-[#dcfce7] text-[#166534] border-[#bbf7d0]",
};

export default function UploadCenterPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center pt-16 px-5 pb-10">
        <div className="w-[1100px] max-w-full flex flex-col items-center gap-8">
          {/* Hero */}
          <div className="text-center flex flex-col items-center gap-2">
            <h1 className="text-[32px] font-medium text-foreground tracking-[-0.96px]">
              Upload Center
            </h1>
            <p className="text-sm text-muted-foreground tracking-[-0.14px] leading-[1.2]">
              Select a data type, download its template,
              <br />
              and upload your populated file.
            </p>
          </div>

          {/* Data type cards */}
          <div className="w-full grid grid-cols-2 gap-4">
            {dataTypes.map((dt) => {
              const Icon = dt.icon;
              const isSelected = selected === dt.id;
              return (
                <button
                  key={dt.id}
                  type="button"
                  onClick={() => setSelected(dt.id)}
                  className={cn(
                    "rounded-[16px] p-4 flex items-center gap-4 text-left transition-colors border-2",
                    isSelected
                      ? "bg-white border-[#1157b2]"
                      : "bg-white border-transparent hover:border-[#e5e7eb]"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", dt.iconBg)}>
                    <Icon className={cn("w-5 h-5", dt.iconColor)} />
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      {dt.title}
                      {dt.hasTemplate && <Download className="w-3.5 h-3.5 text-muted-foreground" />}
                    </span>
                    <span className="text-xs text-muted-foreground">{dt.description}</span>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? "border-[#1157b2]" : "border-[#d1d5dc]"
                  )}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1157b2]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Upload action row */}
          <div className="w-full flex items-center justify-end gap-3">
            <span className="text-sm text-muted-foreground">Select a data type to start</span>
            {selected ? (
              <Link
                href={`/upload-center/custom-import?type=${selected}`}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#061e3a] text-sm font-normal text-white hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors"
              >
                Upload
                <Upload className="w-4 h-4" />
              </Link>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#061e3a]/40 text-sm font-normal text-white/60 cursor-not-allowed"
              >
                Upload
                <Upload className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Uploads history */}
          <div className="w-full bg-white rounded-[16px] p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">Uploads</h2>
              <div className="relative">
                <select className="h-9 pl-3 pr-9 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>All Statuses</option>
                  <option>Processing</option>
                  <option>Processed</option>
                  <option>Validation Failed</option>
                  <option>General Error</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] first:rounded-l-lg">
                    <span className="flex items-center gap-1">
                      Upload type <ArrowUpDown className="w-3 h-3 text-[#D1D5DC]" />
                    </span>
                  </th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                    <span className="flex items-center gap-1">
                      Date <ArrowUpDown className="w-3 h-3 text-[#D1D5DC]" />
                    </span>
                  </th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] last:rounded-r-lg">
                    <span className="flex items-center gap-1">
                      Status <ArrowUpDown className="w-3 h-3 text-[#D1D5DC]" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {uploadHistory.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#f0f1f3] last:border-b-0 hover:bg-[#fafbfc] transition-colors"
                  >
                    <td className="px-4 py-3.5 text-sm text-foreground">{row.type}</td>
                    <td className="px-4 py-3.5 text-sm text-foreground">{row.date}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border",
                        statusStyles[row.status] || "bg-[#f3f4f6] text-[#4a5565] border-[#e5e7eb]"
                      )}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
