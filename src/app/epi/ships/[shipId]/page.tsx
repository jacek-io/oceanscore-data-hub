"use client";

import Link from "next/link";
import { use } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Database,
  BarChart3,
  Pen,
} from "lucide-react";


/* ── Mock port call detail data ── */
const portCallDetails: Record<string, {
  ship: string;
  status: string;
  port: string;
  country: string;
  countryCode: string;
  arrival: string;
  departure: string;
  hours: number;
  epiScore: number;
  fuelConsumed: number;
  co2Emissions: number;
  sox: number;
  nox: number;
  particulates: number;
  powerUsage: number;
  powerUnit: string;
  epiBaseline: string;
  submittedDate: string;
}> = {
  "1": {
    ship: "Arctic Navigator",
    status: "Submitted",
    port: "Bergen",
    country: "Norway",
    countryCode: "no",
    arrival: "2026-03-18",
    departure: "2026-03-26",
    hours: 48,
    epiScore: 82,
    fuelConsumed: 42.5,
    co2Emissions: 135.2,
    sox: 0.18,
    nox: 1.4,
    particulates: 0.08,
    powerUsage: 179,
    powerUnit: "MWh",
    epiBaseline: "75 / 100",
    submittedDate: "20.03.2026",
  },
  "2": {
    ship: "Astral",
    status: "Pending",
    port: "Amsterdam",
    country: "Netherlands",
    countryCode: "nl",
    arrival: "2026-03-15",
    departure: "2026-03-17",
    hours: 36,
    epiScore: 88,
    fuelConsumed: 28.3,
    co2Emissions: 89.7,
    sox: 0.12,
    nox: 0.9,
    particulates: 0.05,
    powerUsage: 124,
    powerUnit: "MWh",
    epiBaseline: "73 / 100",
    submittedDate: "18.03.2026",
  },
};

function SemicircleGauge({ score }: { score: number }) {
  const segments = 20;
  const filled = Math.round((score / 100) * segments);

  return (
    <div className="relative w-[232px] h-[116px]">
      <svg viewBox="0 0 232 116" className="w-full h-full">
        {Array.from({ length: segments }).map((_, i) => {
          const angle = Math.PI + (i / (segments - 1)) * Math.PI;
          const innerR = 75;
          const outerR = 105;
          const gap = 0.03;
          const startAngle = Math.PI + (i / segments) * Math.PI + gap;
          const endAngle = Math.PI + ((i + 1) / segments) * Math.PI - gap;
          const cx = 116;
          const cy = 112;

          const x1 = cx + innerR * Math.cos(startAngle);
          const y1 = cy + innerR * Math.sin(startAngle);
          const x2 = cx + outerR * Math.cos(startAngle);
          const y2 = cy + outerR * Math.sin(startAngle);
          const x3 = cx + outerR * Math.cos(endAngle);
          const y3 = cy + outerR * Math.sin(endAngle);
          const x4 = cx + innerR * Math.cos(endAngle);
          const y4 = cy + innerR * Math.sin(endAngle);

          return (
            <path
              key={i}
              d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 0 0 ${x1} ${y1}`}
              fill={i < filled ? "#5C8A3E" : "#e5e7eb"}
              rx={4}
            />
          );
        })}
      </svg>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[40px] font-medium text-foreground leading-[1.2] tracking-[-0.4px]">
          {score}
        </span>
        <span className="text-[10px] text-muted-foreground">out of 100</span>
      </div>
    </div>
  );
}

function StatTile({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex-1 bg-[#f3f4f6] rounded-lg p-2 flex flex-col justify-between min-h-[72px]">
      <span className="text-xs text-muted-foreground leading-[1.45]">{label}</span>
      <p>
        <span className="text-[24px] font-medium text-foreground leading-[1.45]">{value} </span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </p>
    </div>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <span className="text-xs text-muted-foreground leading-[1.45]">{label}</span>
      <span className="text-sm text-foreground leading-[1.45]">{value}</span>
    </div>
  );
}

export default function EpiShipDetailPage({ params }: { params: Promise<{ shipId: string }> }) {
  const { shipId } = use(params);
  const data = portCallDetails[shipId] ?? portCallDetails["1"];

  return (
    <div className="px-6 py-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between pb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <Link
              href="/epi/ships"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-white hover:bg-[#f8f9fa] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-[32px] font-medium text-foreground leading-[1.2] tracking-[-0.96px]">
                {data.ship}
              </h1>
              <span className="inline-flex items-center px-3 py-1.5 rounded-[36px] text-xs font-medium leading-[1.45] border bg-status-active-bg text-[#294215] border-status-active-border">
                {data.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 pl-12">
            <span className="text-sm text-muted-foreground">
              {data.country}
            </span>
            <span className="w-px h-3 bg-border" />
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              {data.arrival}
              <ArrowRight className="w-3.5 h-3.5" />
              {data.departure}
            </span>
            <span className="w-px h-3 bg-border" />
            <span className="text-sm text-muted-foreground">{data.hours}h at port</span>
          </div>
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
      <div className="flex gap-4">
        {/* EPI Score Gauge */}
        <div className="bg-white rounded-[16px] w-[271px] py-4 flex flex-col">
          <div className="flex items-center justify-between px-4">
            <span className="text-sm text-muted-foreground">EPI Score</span>
            <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center justify-center p-4">
            <SemicircleGauge score={data.epiScore} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="flex-1 bg-white rounded-[16px] p-2 flex flex-col gap-1">
          <div className="flex gap-1 flex-1">
            <StatTile label="Fuel Consumed" value={String(data.fuelConsumed)} unit="t" />
            <StatTile label="CO₂ Emissions" value={String(data.co2Emissions)} unit="t" />
            <StatTile label="SOx" value={String(data.sox)} unit="t" />
          </div>
          <div className="flex gap-1 flex-1">
            <StatTile label="NOx" value={String(data.nox)} unit="t" />
            <StatTile label="Particulates" value={String(data.particulates)} unit="t" />
            <StatTile label="Power Usage" value={String(data.powerUsage)} unit={data.powerUnit} />
          </div>
        </div>
      </div>

      {/* Submitted Data Card */}
      <div className="bg-white rounded-[16px] p-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
              Submitted Data
            </h2>
            <p className="text-sm text-muted-foreground tracking-[-0.42px]">
              Utility data recorded at departure from {data.port}, submitted via Data Hub on {data.submittedDate}.
            </p>
          </div>
          <Link
            href="/fleet"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-normal text-foreground hover:bg-[#f8f9fa] transition-colors"
          >
            <Pen className="w-5 h-5" />
            Edit in Data Hub
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {/* Row 1 */}
          <div className="flex gap-5">
            <DataField label="Arrival" value={data.arrival} />
            <DataField label="Departure" value={data.departure} />
            <DataField label="Hours at port" value={`${data.hours} h`} />
          </div>
          {/* Row 2 */}
          <div className="flex gap-5">
            <DataField label="Fuel consumed (t)" value={String(data.fuelConsumed)} />
            <DataField label="CO₂ emissions (t)" value={String(data.co2Emissions)} />
            <DataField label="SOx (t)" value={String(data.sox)} />
          </div>
          {/* Row 3 */}
          <div className="flex gap-5">
            <DataField label="NOx (t)" value={String(data.nox)} />
            <DataField label="Particulates (t)" value={String(data.particulates)} />
            <DataField label={`EPI Baseline for ${data.port}`} value={data.epiBaseline} />
          </div>
        </div>
      </div>
    </div>
  );
}
