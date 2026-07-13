"use client";

import { use } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronDown,
  Ship,
  Settings2,
  Droplets,
  Zap,
  Volume2,
  Download,
  Database,
  Pencil,
  BarChart3,
  ChartBarBig,
  Activity,
  DatabaseBackup,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ships } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useState } from "react";

const tabs = [
  { id: "ship-data", label: "Ship Data", icon: Ship },
  { id: "tier-iii", label: "Tier III Hours", icon: Settings2 },
  { id: "bdn", label: "BDN", icon: Droplets },
  { id: "edn-solar", label: "EDN / Solar", icon: Zap },
  { id: "urn", label: "URN", icon: Volume2 },
];

const technologies = [
  { id: "fuel-cells", label: "Fuel Cells", active: false },
  { id: "solar-panels", label: "Solar Panels", active: false },
  { id: "wind-propulsion", label: "Wind Propulsion", active: true },
  { id: "batteries", label: "Batteries", active: false },
  { id: "batteries-2", label: "Batteries", active: false },
  { id: "air-lubrication", label: "Air Lubrication", active: true },
  { id: "particulate-filters", label: "Particulate Filters", active: true },
  { id: "water-fuel-emulsion", label: "Water Fuel Emulsion", active: false },
  { id: "direct-water-injection", label: "Direct Water Injection", active: false },
  { id: "carbon-capture", label: "Carbon Capture", active: false },
];

const powerSources = [
  { type: "Diesel", mainAux: "Main", ratedPower: "4 320", rpm: "600", nox: "9,28", tierIII: true, eiapp: "GTB0/NTL/20160903I...", certDate: "01/01/2028" },
  { type: "Diesel", mainAux: "Auxiliary", ratedPower: "620", rpm: "1 800", nox: "8,9", tierIII: false, eiapp: "GTB0/NTL/20160903I...", certDate: "01/01/2028" },
];

/* Mock ESI score data per ship */
const esiScoreData: Record<string, { esiScore: number; ghg: number[]; sox: number[]; nox: number[]; inn: number[]; urnScore: number }> = {
  "1": { esiScore: 86, ghg: [28, 40], sox: [18, 33.3], nox: [30, 66.7], inn: [16, 20], urnScore: 58 },
  "2": { esiScore: 86, ghg: [18, 40], sox: [16, 33.3], nox: [20, 66.7], inn: [16, 20], urnScore: 35 },
  "3": { esiScore: 54, ghg: [18, 40], sox: [18, 33.3], nox: [20, 66.7], inn: [16, 20], urnScore: 58 },
  "5": { esiScore: 86, ghg: [18, 40], sox: [16, 33.3], nox: [20, 66.7], inn: [16, 20], urnScore: 54 },
  "6": { esiScore: 54, ghg: [18, 40], sox: [18, 33.3], nox: [20, 66.7], inn: [16, 20], urnScore: 35 },
  "7": { esiScore: 54, ghg: [18, 40], sox: [16, 33.3], nox: [20, 66.7], inn: [16, 20], urnScore: 35 },
  "8": { esiScore: 54, ghg: [18, 40], sox: [18, 33.3], nox: [20, 66.7], inn: [16, 20], urnScore: 35 },
  "9": { esiScore: 54, ghg: [18, 40], sox: [18, 33.3], nox: [20, 66.7], inn: [16, 20], urnScore: 35 },
  "10": { esiScore: 54, ghg: [18, 40], sox: [18, 33.3], nox: [20, 66.7], inn: [16, 20], urnScore: 35 },
};

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

function ReadOnlyField({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div>
      <label className="text-sm text-muted-foreground">{label}</label>
      <p className="mt-1 text-sm text-foreground flex items-center gap-2">
        {value}
        {badge && (
          <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
            {badge}
          </span>
        )}
      </p>
    </div>
  );
}

function EditInDataHubButton({ shipId, small }: { shipId: string; small?: boolean }) {
  return (
    <Link
      href={`/fleet/${shipId}`}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-border bg-white font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors",
        small ? "h-8 px-3 py-1.5 text-[12px]" : "h-10 px-3 py-2.5 text-sm"
      )}
    >
      <Pencil className={cn("text-muted-foreground", small ? "w-4 h-4" : "w-4 h-4")} />
      Edit in Data Hub
    </Link>
  );
}

/* Segmented semicircle chart — paths extracted from Figma SVG */
const semicirclePaths = [
  "M225.63 114.204C229.148 114.15 231.974 111.222 231.727 107.712C231.479 104.203 228.278 101.759 224.787 102.198L199.652 105.36C197.247 105.662 195.553 107.83 195.723 110.248C195.894 112.665 197.876 114.627 200.299 114.59L225.63 114.204Z",
  "M224.276 98.6191C227.751 98.0643 230.132 94.772 229.385 91.3332C228.639 87.8944 225.117 85.9257 221.725 86.8609L197.29 93.5973C194.961 94.2394 193.603 96.6313 194.115 98.992C194.628 101.353 196.861 102.996 199.246 102.615L224.276 98.6191Z",
  "M220.707 83.3947C224.067 82.3472 225.954 78.7544 224.722 75.4579C223.49 72.1612 219.72 70.7096 216.496 72.1209L193.282 82.283C191.066 83.2529 190.066 85.825 190.913 88.0907C191.759 90.3565 194.205 91.6569 196.515 90.9369L220.707 83.3947Z",
  "M214.993 68.8354C218.169 67.3184 219.525 63.4982 217.836 60.4108C216.147 57.3232 212.206 56.4175 209.215 58.2732L187.694 71.6285C185.633 72.9074 185.009 75.607 186.173 77.7349C187.337 79.8628 189.95 80.7987 192.139 79.7532L214.993 68.8354Z",
  "M207.26 55.2338C210.188 53.281 210.991 49.3109 208.881 46.4941C206.771 43.6772 202.738 43.3347 200.04 45.5952L180.634 61.8579C178.771 63.4189 178.536 66.187 179.993 68.1322C181.451 70.0775 184.174 70.6321 186.196 69.2834L207.26 55.2338Z",
  "M197.674 42.8628C200.296 40.5153 200.532 36.4748 198.045 33.9848C195.558 31.4946 191.514 31.7231 189.164 34.3427L172.254 53.1884C170.631 54.9973 170.791 57.7716 172.509 59.4912C174.226 61.2109 177 61.3736 178.81 59.7523L197.674 42.8628Z",
  "M186.435 31.9729C188.698 29.2779 188.364 25.2478 185.549 23.1355C182.734 21.0231 178.759 21.8212 176.805 24.748L162.739 45.813C161.392 47.8301 161.946 50.5491 163.886 52.0049C165.826 53.4607 168.587 53.2282 170.147 51.3707L186.435 31.9729Z",
  "M173.768 22.7908C175.624 19.8013 174.725 15.863 171.638 14.1737C168.551 12.4843 164.726 13.8396 163.21 17.0156L152.295 39.8864C151.253 42.0691 152.191 44.6757 154.312 45.8367C156.434 46.9978 159.123 46.3744 160.399 44.3196L173.768 22.7908Z",
  "M159.925 15.5129C161.334 12.2887 159.888 8.52278 156.591 7.29326C153.294 6.0637 149.696 7.95102 148.651 11.3113L141.126 35.5169C140.409 37.8236 141.717 40.268 143.98 41.112C146.243 41.9561 148.805 40.9527 149.772 38.7392L159.925 15.5129Z",
  "M145.182 10.2945C146.115 6.90194 144.152 3.38499 140.714 2.63978C137.275 1.89456 133.974 4.2737 133.419 7.74814L129.424 32.7666C129.042 35.1595 130.701 37.4015 133.069 37.9147C135.438 38.428 137.825 37.0606 138.468 34.724L145.182 10.2945Z",
  "M129.836 7.23974C130.278 3.74693 127.804 0.540068 124.292 0.288346C120.781 0.0366255 117.875 2.85788 117.813 6.37788L117.371 31.6704C117.328 34.1128 119.275 36.1151 121.712 36.2898C124.148 36.4644 126.361 34.7602 126.667 32.3368L129.836 7.23974Z",
  "M114.194 6.36991C114.141 2.85191 111.213 0.0263124 107.703 0.273447C104.194 0.52058 101.75 3.72172 102.189 7.21259L105.351 32.3501C105.653 34.7544 107.821 36.4483 110.238 36.2781C112.656 36.1079 114.618 34.1254 114.581 31.7025L114.194 6.36991Z",
  "M98.6104 7.72403C98.0557 4.24919 94.7634 1.86797 91.3247 2.61468C87.8861 3.36138 85.9175 6.88258 86.8526 10.2748L93.589 34.7118C94.2309 37.0406 96.6228 38.3991 98.9835 37.8865C101.344 37.3739 102.987 35.141 102.606 32.7556L98.6104 7.72403Z",
  "M83.3867 11.2934C82.3393 7.93372 78.7465 6.0467 75.4499 7.27848C72.1535 8.51022 70.702 12.2801 72.1131 15.5038L82.275 38.7195C83.2449 40.9353 85.817 41.9357 88.0828 41.0891C90.3484 40.2426 91.6486 37.7965 90.9288 35.4874L83.3867 11.2934Z",
  "M68.8281 17.0078C67.3112 13.8321 63.4908 12.4753 60.4034 14.1646C57.3161 15.8538 56.4105 19.795 58.2659 22.7852L71.6209 44.308C72.8998 46.369 75.5995 46.9929 77.7274 45.8287C79.8552 44.6645 80.791 42.0523 79.7456 39.8637L68.8281 17.0078Z",
  "M55.2272 24.7415C53.2744 21.8136 49.3041 21.0105 46.4873 23.1205C43.6707 25.2303 43.3282 29.2631 45.5885 31.9606L61.8506 51.3682C63.4116 53.2312 66.1799 53.4657 68.1252 52.0086C70.0703 50.5515 70.6248 47.8285 69.2763 45.8066L55.2272 24.7415Z",
  "M42.8569 34.3276C40.5093 31.7055 36.4686 31.4692 33.9785 33.9564C31.4886 36.4434 31.7172 40.4875 34.3365 42.8379L53.1814 59.7485C54.9904 61.3718 57.7649 61.2113 59.4846 59.4936C61.2041 57.7761 61.3667 55.0029 59.7456 53.1922L42.8569 34.3276Z",
  "M31.9677 45.5674C29.2725 43.3041 25.2422 43.6384 23.1299 46.4535C21.0177 49.2684 21.8157 53.243 24.7423 55.1974L45.8062 69.2635C47.8234 70.6105 50.5427 70.0568 51.9985 68.1167C53.4542 66.1766 53.2217 63.4156 51.3643 61.8559L31.9677 45.5674Z",
  "M22.7861 58.235C19.7965 56.3783 15.8578 57.2773 14.1685 60.3646C12.4793 63.4518 13.8345 67.2769 17.0104 68.7928L39.8798 79.7087C42.0627 80.7507 44.6695 79.8125 45.8305 77.6906C46.9916 75.5688 46.3682 72.8804 44.3135 71.6043L22.7861 58.235Z",
  "M15.5086 72.0785C12.2842 70.6689 8.51797 72.1153 7.28847 75.4125C6.05902 78.7095 7.9463 82.3078 11.3065 83.3526L35.5105 90.8778C37.8173 91.5951 40.2619 90.2871 41.106 88.0236C41.95 85.7602 40.9466 83.199 38.7332 82.2314L15.5086 72.0785Z",
  "M10.2904 86.8218C6.89765 85.8892 3.38046 87.8516 2.63527 91.2904C1.89011 94.729 4.26927 98.03 7.74373 98.5849L32.7603 102.58C35.1534 102.962 37.3955 101.303 37.9088 98.9347C38.422 96.5664 37.0546 94.1787 34.718 93.5364L10.2904 86.8218Z",
  "M0.283984 107.712C0.535694 104.201 3.74268 101.727 7.23561 102.168L32.3307 105.338C34.7542 105.644 36.4585 107.856 36.2838 110.293C36.1092 112.73 34.1068 114.676 31.6644 114.634L6.37381 114.192C2.85365 114.13 0.032275 111.224 0.283984 107.712Z",
];

function EsiSemicircle({ score }: { score: number }) {
  const totalSegments = semicirclePaths.length;
  // Paths are ordered right-to-left (clockwise), so we fill from the end
  const filledCount = Math.round((score / 100) * totalSegments);
  const filledFrom = totalSegments - filledCount;

  return (
    <div className="relative w-[280px] h-[140px]">
      <svg width="280" height="140" viewBox="0 0 232 116" fill="none" className="w-full h-full">
        {semicirclePaths.map((d, i) => (
          <path key={i} d={d} fill={i >= filledFrom ? "#61A335" : "#F3F4F6"} />
        ))}
      </svg>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="text-[40px] font-medium text-[#1e2938] leading-[1.2] tracking-[-0.4px]">{score}</span>
        <span className="text-[10px] text-muted-foreground leading-[10px]">out of 100</span>
      </div>
    </div>
  );
}

export default function EsiShipDetailPage({
  params,
}: {
  params: Promise<{ shipId: string }>;
}) {
  const { shipId } = use(params);
  const ship = ships.find((s) => s.id === shipId) ?? ships[0];
  const scores = esiScoreData[ship.id] ?? esiScoreData["1"];
  const [activeTab, setActiveTab] = useState("ship-data");

  return (
    <div className="px-6 py-5 space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/esi"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-muted-foreground hover:bg-[#ebf3ff] active:bg-[#cce1ff] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[32px] font-medium text-foreground leading-tight">{ship.name}</h1>
              <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border bg-status-active-bg text-status-active border-status-active-border">
                {ship.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              IMO: {ship.imo} &nbsp;|&nbsp; {ship.shipType}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
            <Download className="w-4 h-4 text-muted-foreground" />
            ESI Certificate
          </button>
          <Link
            href={`/fleet/${ship.id}`}
            className="inline-flex items-center gap-2 h-10 px-3 py-2.5 rounded-lg bg-[#061e3a] text-sm font-normal text-white hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors"
          >
            <Database className="w-4 h-4 text-[#5b9aff]" />
            Open Data Hub
          </Link>
        </div>
      </div>

      {/* Score Overview Row */}
      <div className="grid grid-cols-[300px_300px_1fr] gap-4">
        {/* ESI Score Card */}
        <div className="bg-white rounded-[16px] flex flex-col">
          <div className="flex items-center justify-between px-4 pt-4">
            <span className="text-sm text-muted-foreground">ESI Score</span>
            <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <EsiSemicircle score={scores.esiScore} />
          </div>
        </div>

        {/* Sub-scores + URN */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-[16px] p-2 flex-1 flex flex-col gap-1">
            <div className="flex gap-1 flex-1">
              <div className="flex-1 bg-[#f3f4f6] rounded-lg p-2 flex flex-col justify-between">
                <p className="text-[12px] text-[#697282] leading-[1.45]">GHG</p>
                <p>
                  <span className="text-[18px] font-medium text-[#1e2938]">{scores.ghg[0]}</span>
                  <span className="text-[8px] text-[#697282]">/{scores.ghg[1]}</span>
                </p>
              </div>
              <div className="flex-1 bg-[#f3f4f6] rounded-lg p-2 flex flex-col justify-between">
                <p className="text-[12px] text-[#697282] leading-[1.45]">SOx</p>
                <p>
                  <span className="text-[18px] font-medium text-[#1e2938]">{scores.sox[0]}</span>
                  <span className="text-[8px] text-[#697282]">/{scores.sox[1]}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-1 flex-1">
              <div className="flex-1 bg-[#f3f4f6] rounded-lg p-2 flex flex-col justify-between">
                <p className="text-[12px] text-[#697282] leading-[1.45]">NOx</p>
                <p>
                  <span className="text-[18px] font-medium text-[#1e2938]">{scores.nox[0]}</span>
                  <span className="text-[8px] text-[#697282]">/{scores.nox[1]}</span>
                </p>
              </div>
              <div className="flex-1 bg-[#f3f4f6] rounded-lg p-2 flex flex-col justify-between">
                <p className="text-[12px] text-[#697282] leading-[1.45]">INN</p>
                <p>
                  <span className="text-[18px] font-medium text-[#1e2938]">{scores.inn[0]}</span>
                  <span className="text-[8px] text-[#697282]">/{scores.inn[1]}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[16px] p-2">
            <div className="bg-[#f3f4f6] rounded-lg h-10 flex items-center justify-between px-3">
              <span className="text-[12px] text-[#697282] leading-[1.45]">Underwater Radiated Noise</span>
              <p>
                <span className="text-[18px] font-medium text-[#1e2938]">{scores.urnScore}</span>
                <span className="text-[8px] text-[#697282]">/100</span>
              </p>
            </div>
          </div>
        </div>

        {/* ESI Period Cycle */}
        <div className="bg-white rounded-[16px] pt-4 pb-4 overflow-hidden">
          <div className="flex flex-col gap-[16px] h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4">
              <span className="text-[14px] text-[#697282]">ESI Period Cycle</span>
              <div className="relative w-8 h-8 rounded-full border border-[#e5e7eb] flex items-center justify-center">
                <DatabaseBackup className="w-4 h-4 text-[#697282]" />
                <div className="absolute -top-0.5 -right-0.5 w-[10px] h-[10px] rounded-full bg-[#f54900] border-2 border-white" />
              </div>
            </div>

            {/* Timeline area — shared coordinate system for lines, labels, and bars */}
            <div className="flex flex-col justify-between flex-1 px-4 relative">
              {/* Dashed year dividers: between Dec and Jan */}
              {/* Each month = 1/24. Boundary before Jan'26 = 8/24 = 33.33%, before Jan'27 = 19/24 = 79.17% */}
              <div className="absolute top-0 bottom-0 z-0 border-l border-dashed border-[#e5e7eb]" style={{ left: '33.33%' }} />
              <div className="absolute top-0 bottom-0 z-0 border-l border-dashed border-[#e5e7eb]" style={{ left: '79.17%' }} />

              {/* Year labels — aligned with Jan month labels at dashed line positions */}
              <div className="relative z-30 h-[18px] mb-1">
                <span className="absolute text-[12px] font-medium text-[#1e2938]" style={{ left: '0' }}>2025</span>
                <span className="absolute text-[12px] font-medium text-[#1e2938]" style={{ left: '33.33%' }}>2026</span>
                <span className="absolute text-[12px] font-medium text-[#1e2938]" style={{ left: '79.17%' }}>2027</span>
              </div>

              {/* TODAY badge + line */}
              <div className="absolute z-20" style={{ left: '50%', top: '0' }}>
                <div className="flex flex-col items-center -translate-x-1/2">
                  <span className="px-1.5 py-1 rounded-full bg-[#f54900] text-white text-[8px] font-medium uppercase leading-[1.45]">Today</span>
                  <div className="w-0 h-[200px] border-l-2 border-dashed border-[#f54900]/40" />
                </div>
              </div>

              {/* Month labels */}
              <div className="flex text-[8px] text-[#697282] leading-[1.45] mb-3 relative z-10">
                {["May","June","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"].map((m, i) => (
                  <span key={i} className="flex-1">{m}</span>
                ))}
              </div>

              {/* Period bars */}
              <div className="flex flex-col gap-[8px] relative z-10">
                {/* Row 1: Submit(1mo) + Score valid(~13mo) = May'25 to ~Jun'26 */}
                <div className="flex gap-[2px] h-[24px] items-center" style={{ width: '58.33%' }}>
                  <div className="bg-[#e3f0db] rounded-lg px-2 py-1 shrink-0 h-full flex items-center">
                    <span className="text-[12px] text-[#33561c] leading-[1.45]">Submit</span>
                  </div>
                  <div className="bg-[#ebf3ff] rounded-lg px-2 py-1 flex-1 h-full flex items-center">
                    <span className="text-[12px] text-[#092c54] leading-[1.45]">Score valid</span>
                  </div>
                </div>

                {/* Row 2: Ref Period(May'25–Dec'25=33.33%) + Submit(Jan'26–Jun'26) + Score valid(Jun'26–May'27) */}
                <div className="flex h-[24px] items-center">
                  <div className="bg-[#f3f4f6] rounded-lg px-2 py-1 h-full flex items-center" style={{ width: '33.33%' }}>
                    <span className="text-[12px] text-[#697282] leading-[1.45]">Reference Period</span>
                  </div>
                  <div className="flex gap-[2px] flex-1 h-full items-center">
                    <div className="border border-[#8dc26f] rounded-lg h-full flex items-center" style={{ width: '30%' }}>
                      <div className="bg-[#61a335] border border-white rounded-lg px-2 py-1 h-full w-full flex items-center">
                        <span className="text-[12px] text-white leading-[1.45]">Submit</span>
                      </div>
                    </div>
                    <div className="bg-[#ebf3ff] rounded-lg px-2 py-1 flex-1 h-full flex items-center">
                      <span className="text-[12px] text-[#092c54] leading-[1.45]">Score valid</span>
                    </div>
                  </div>
                </div>

                {/* Row 3: starts Jan'26(33.33%), Ref Period(Jan'26–Dec'26), Submit starts Jan'27 */}
                <div className="flex h-[24px] items-center" style={{ marginLeft: '33.33%' }}>
                  {/* 12mo ref + 5mo submit within remaining 16 months. Ref=12/16=75%, Submit=4/16≈25% but must start at 79.17% of total */}
                  {/* From 33.33% to 79.17% = 45.84% of total for Ref. From 79.17% to 100% = 20.83% for Submit */}
                  {/* As fraction of remaining 66.67%: Ref = 45.84/66.67 ≈ 68.75%, Submit = 31.25% */}
                  <div className="bg-[#f3f4f6] rounded-lg px-2 py-1 h-full flex items-center" style={{ flex: '45.84' }}>
                    <span className="text-[12px] text-[#697282] leading-[1.45]">Reference Period</span>
                  </div>
                  <div className="bg-[#e3f0db] rounded-lg px-2 py-1 h-full flex items-center" style={{ flex: '20.83' }}>
                    <span className="text-[12px] text-[#33561c] leading-[1.45]">Submit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-1 flex gap-1 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 h-10 px-4 text-sm font-normal rounded-lg transition-colors",
                activeTab === tab.id
                  ? "bg-[#cce1ff] text-foreground"
                  : "text-foreground hover:bg-[#ebf3ff] active:bg-[#cce1ff]"
              )}
            >
              <Icon className={cn("w-5 h-5", activeTab !== tab.id && "text-[#98a1ae]")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-5">
        {activeTab === "ship-data" && (
          <>
            {/* General Information */}
            <section className="bg-white rounded-[16px] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-medium text-foreground">General Information</h2>
                <EditInDataHubButton shipId={ship.id} small />
              </div>
              <div className="grid grid-cols-4 gap-5">
                <ReadOnlyField label="Ship name" value={ship.name} />
                <ReadOnlyField label="IMO Number" value={ship.imo} />
                <ReadOnlyField label="Ship type" value={ship.shipType} />
                <ReadOnlyField label="Keel laid year" value="2020" />
                <ReadOnlyField label="Gross Tonnage" value="68 000" />
                <ReadOnlyField label="Deadweight Tonnage" value="72 000" />
                <ReadOnlyField label="Validation Period" value="01/01/2025 – 01/01/2028" badge="ESI" />
                <ReadOnlyField label="Last updated" value="01/01/2026" />
              </div>
            </section>

            {/* IAPP Certificate */}
            <section className="bg-white rounded-[16px] p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-medium text-foreground">IAPP Certificate</h2>
                  <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
                    ESI
                  </span>
                </div>
                <EditInDataHubButton shipId={ship.id} small />
              </div>
              <div className="grid grid-cols-4 gap-5">
                <ReadOnlyField label="City" value="Hamburg" />
                <ReadOnlyField label="Authority" value="DNV" />
                <ReadOnlyField label="Valid until" value="01/01/2028" />
              </div>
            </section>

            {/* Technologies */}
            <section className="bg-white rounded-[16px] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-medium text-foreground">Technologies</h2>
                <EditInDataHubButton shipId={ship.id} small />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {technologies.map((tech) => (
                  <div
                    key={tech.id}
                    className={cn(
                      "h-10 rounded-lg flex items-center gap-2 pl-4 pr-3.5",
                      tech.active ? "bg-[#ebf3ff]" : "bg-[#f9fafb]"
                    )}
                  >
                    {tech.active ? (
                      <CheckCircle2 className="w-4 h-4 text-[#1157b2] shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#98a1ae] shrink-0" />
                    )}
                    <span className={cn("text-sm", tech.active ? "text-foreground" : "text-muted-foreground")}>
                      {tech.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Power Sources */}
            <section className="bg-white rounded-[16px] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-medium text-foreground">Power Sources</h2>
                <EditInDataHubButton shipId={ship.id} small />
              </div>
              <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] first:rounded-tl-lg">Type</th>
                      <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">Main/Auxiliary</th>
                      <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">Rated Power (kw)</th>
                      <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">RPM</th>
                      <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">NOx (g/kWh)</th>
                      <th className="text-center text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">TIER III</th>
                      <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">EIAPP Certificate</th>
                      <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] last:rounded-tr-lg">Cert. Issue Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {powerSources.map((ps, i) => (
                      <tr key={i} className="border-t border-[#e5e7eb]">
                        <td className="px-4 py-3 text-sm text-foreground">{ps.type}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{ps.mainAux}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{ps.ratedPower}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{ps.rpm}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{ps.nox}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex justify-center">
                            {ps.tierIII ? (
                              <CheckCircle2 className="w-5 h-5 text-[#4a7c59]" />
                            ) : (
                              <XCircle className="w-5 h-5 text-[#98a1ae]" />
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">{ps.eiapp}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{ps.certDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === "tier-iii" && (
          <>
            {/* Header */}
            <section className="bg-white rounded-[16px] p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-medium text-[#1e2938] tracking-[-0.6px]">Tier III Hours</h2>
                  <p className="text-sm text-[#697282]">Track engine operating hours and NOx emissions in Tier III compliance mode across your fleet.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <EditInDataHubButton shipId={ship.id} small />
                  <button className="inline-flex items-center gap-2 h-8 px-3 py-1.5 rounded-lg border border-border bg-white text-[12px] font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
                    <Download className="w-5 h-5 text-muted-foreground" />
                    Export
                  </button>
                  <div className="relative">
                    <select className="appearance-none h-8 pl-3 pr-8 rounded-lg border border-border bg-white text-[14px] text-[#1e2938]">
                      <option>Ref. period: 2026</option>
                      <option>Ref. period: 2025</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#697282] pointer-events-none" />
                  </div>
                </div>
              </div>
            </section>

            {/* Top stat cards */}
            <div className="grid grid-cols-[auto_1fr] gap-4">
              {/* Fleet Tier III Utilization */}
              <div className="bg-white rounded-[16px] py-4 w-[414px]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between px-4">
                    <span className="text-[14px] text-[#697282]">Fleet Tier III Utilization</span>
                    <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
                      <ChartBarBig className="w-4 h-4 text-[#697282]" />
                    </div>
                  </div>
                  <div className="px-4">
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-[32px] font-medium text-[#1e2938] leading-[1.2] tracking-[-0.32px]">37.5%</p>
                        <div className="flex items-center gap-1">
                          <span className="text-[12px] text-[#697282] leading-[10px]">Power-Weighted Efficiency</span>
                          <Info className="w-4 h-4 text-[#697282]" />
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="h-[13px] bg-[#f3f4f6] rounded-[4px] overflow-hidden">
                        <div className="h-full bg-[#4780cf] rounded-[4px]" style={{ width: '37.5%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier III Operational Log */}
              <div className="bg-white rounded-[16px] py-4">
                <div className="flex flex-col gap-2 h-full">
                  <div className="flex items-center justify-between px-4">
                    <span className="text-[14px] text-[#697282]">Tier III Operational Log</span>
                    <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
                      <Activity className="w-4 h-4 text-[#697282]" />
                    </div>
                  </div>
                  <div className="flex-1 flex gap-2 px-4">
                    <div className="flex-1 bg-[#f3f4f6] rounded-lg p-4 flex flex-col justify-between">
                      <span className="text-[12px] text-[#697282] leading-[1.45]">Cumulative Tier III Hours</span>
                      <div className="flex items-end gap-1">
                        <span className="text-[24px] font-medium text-[#1e2938] leading-[20px]">450</span>
                        <span className="text-[12px] text-[#697282] leading-[10px]">hrs</span>
                      </div>
                    </div>
                    <div className="flex-1 bg-[#f3f4f6] rounded-lg p-4 flex flex-col justify-between">
                      <span className="text-[12px] text-[#697282] leading-[1.45]">Cumulative Fleet Hours</span>
                      <div className="flex items-end gap-1">
                        <span className="text-[24px] font-medium text-[#1e2938] leading-[20px]">1 200</span>
                        <span className="text-[12px] text-[#697282] leading-[10px]">hrs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Engine Specific Performance Tracking */}
            <section className="bg-white rounded-[16px] p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-[#1e2938] tracking-[-0.6px]">Engine Specific Performance Tracking</h2>
                <span className="text-[12px] text-[#697282]">*Hours are used to calculate the power-weighted share</span>
              </div>
              <div className="border border-[#e5e7eb] rounded-lg overflow-hidden pb-4">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-normal text-[#697282] leading-[1.45] pl-4 pr-2 h-10 bg-[#F3F4F6] rounded-tl-lg">Engine ID</th>
                      <th className="text-left text-xs font-normal text-[#697282] leading-[1.45] px-2 h-10 bg-[#F3F4F6]">Type</th>
                      <th className="text-left text-xs font-normal text-[#697282] leading-[1.45] px-2 h-10 bg-[#F3F4F6]">Main/Auxiliary</th>
                      <th className="text-right text-xs font-normal text-[#697282] leading-[1.45] px-2 h-10 bg-[#F3F4F6] w-[160px]">NOx - TIER III (g/kWh)</th>
                      <th className="text-right text-xs font-normal text-[#697282] leading-[1.45] px-2 h-10 bg-[#F3F4F6] w-[160px]">Hours in TIER III</th>
                      <th className="text-right text-xs font-normal text-[#697282] leading-[1.45] px-2 pr-4 h-10 bg-[#F3F4F6] rounded-tr-lg w-[160px]">Total Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="pl-4 pr-2 py-3 text-[14px] text-[#1e2938]">AE-1</td>
                      <td className="px-2 py-3 text-[14px] text-[#1e2938]">Diesel engine, 2-stroke</td>
                      <td className="px-2 py-3 text-[14px] text-[#1e2938]">Auxiliary</td>
                      <td className="px-2 py-3 text-[14px] text-[#1e2938] text-right">2.4</td>
                      <td className="px-2 py-3 text-[14px] text-[#1e2938] text-right">450</td>
                      <td className="px-2 pr-4 py-3 text-[14px] text-[#1e2938] text-right">1 200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === "bdn" && (
          <section className="bg-white rounded-[16px] p-4">
            <div className="flex gap-6 items-end mb-6">
              <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-xl font-medium text-[#1e2938] tracking-[-0.6px]">Bunker Delivery Notes</h2>
                <p className="text-[14px] text-[#697282] leading-[1.45]">Global record of fuel supply compliance and environmental metrics.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <EditInDataHubButton shipId={ship.id} small />
                <button className="inline-flex items-center gap-2 h-8 px-3 py-1.5 rounded-lg border border-border bg-white text-[12px] font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
                  <Download className="w-5 h-5 text-muted-foreground" />
                  Export
                </button>
                <div className="relative">
                  <select className="appearance-none h-8 pl-3 pr-8 rounded-lg border border-border bg-white text-[14px] text-[#1e2938]">
                    <option>Ref. period: 2026</option>
                    <option>Ref. period: 2025</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#697282] pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden pb-2">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-normal text-[#697282] leading-[1.45] pl-4 pr-2 h-10 bg-[#F3F4F6] rounded-tl-lg">Delivery date</th>
                    <th className="text-left text-xs font-normal text-[#697282] leading-[1.45] px-2 h-10 bg-[#F3F4F6]">Fuel Type</th>
                    <th className="text-center text-xs font-normal text-[#697282] leading-[1.45] px-2 h-10 bg-[#F3F4F6]">Fuel WTT (gCO<sub>2</sub>eq/MJ)</th>
                    <th className="text-center text-xs font-normal text-[#697282] leading-[1.45] px-2 h-10 bg-[#F3F4F6]">Mass (Tonnes)</th>
                    <th className="text-center text-xs font-normal text-[#697282] leading-[1.45] px-2 h-10 bg-[#F3F4F6]">Sulphur Content (%)</th>
                    <th className="text-left text-xs font-normal text-[#697282] leading-[1.45] px-2 pr-4 h-10 bg-[#F3F4F6] rounded-tr-lg">Bunker Port</th>
                  </tr>
                </thead>
              </table>
              <p className="text-center text-[12px] text-[#98a1ae] leading-[1.45] h-10 flex items-center justify-center">
                No bunker delivery notes recorded yet.
              </p>
            </div>
          </section>
        )}

        {activeTab === "edn-solar" && (
          <section className="bg-white rounded-[16px] p-4">
            <div className="flex gap-6 items-end mb-6">
              <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-xl font-medium text-[#1e2938] tracking-[-0.6px]">Onshore Power & Solar Delivery</h2>
                <p className="text-[14px] text-[#697282] leading-[1.2] tracking-[-0.14px]">Registry of clean energy intake from port facilities and renewable generation.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <EditInDataHubButton shipId={ship.id} small />
                <button className="inline-flex items-center gap-2 h-8 px-3 py-1.5 rounded-lg border border-border bg-white text-[12px] font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
                  <Download className="w-5 h-5 text-muted-foreground" />
                  Export
                </button>
                <div className="relative">
                  <select className="appearance-none h-8 pl-3 pr-8 rounded-lg border border-border bg-white text-[14px] text-[#1e2938]">
                    <option>Ref. period: 2026</option>
                    <option>Ref. period: 2025</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#697282] pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden pb-2">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-normal text-[#697282] leading-[1.45] pl-4 pr-2 h-10 bg-[#F3F4F6] rounded-tl-lg">Delivery date</th>
                    <th className="text-left text-xs font-normal text-[#697282] leading-[1.45] px-2 h-10 bg-[#F3F4F6]">Onshore Power (kWh)</th>
                    <th className="text-center text-xs font-normal text-[#697282] leading-[1.45] px-2 h-10 bg-[#F3F4F6]">Solar Panel Output (kWh)</th>
                    <th className="text-center text-xs font-normal text-[#697282] leading-[1.45] px-2 pr-4 h-10 bg-[#F3F4F6] rounded-tr-lg">Port</th>
                  </tr>
                </thead>
              </table>
              <p className="text-center text-[12px] text-[#98a1ae] leading-[1.45] h-10 flex items-center justify-center">
                No bunker delivery notes recorded yet.
              </p>
            </div>
          </section>
        )}

        {activeTab === "urn" && (
          <>
            {/* Top section */}
            <div className="bg-white rounded-t-[16px] px-4 pt-4 pb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-[#1e2938] tracking-[-0.6px]">Underwater Radiated Noise</h2>
                <EditInDataHubButton shipId={ship.id} small />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 bg-[#ebf3ff] rounded-lg h-10 flex items-center justify-between pl-4 pr-3.5">
                  <span className="text-[14px] text-[#092c54] leading-[1.45]">Does the vessel have a underwater noice class notation?</span>
                  <CheckCircle2 className="w-5 h-5 text-[#1157b2] shrink-0" />
                </div>
                <div className="flex-1 bg-[#f9fafb] rounded-lg h-10 flex items-center justify-between pl-4 pr-3.5">
                  <span className="text-[14px] text-[#697282] leading-[1.45]">Did the vessel participate in any vessel speed reductions (VSR)?</span>
                  <XCircle className="w-5 h-5 text-[#98a1ae] shrink-0" />
                </div>
              </div>
            </div>

            {/* Technologies section */}
            <div className="bg-white rounded-b-[16px] border-t border-[#e5e7eb] px-4 pt-6 pb-4">
              <div className="flex flex-col gap-2 mb-6">
                <h3 className="text-lg font-medium text-[#1e2938] tracking-[-0.54px]">Technologies</h3>
                <p className="text-[14px] text-[#697282] leading-[1.2] tracking-[-0.14px]">Select which technologies that improve wake flow and/or reduce cavitation apply to the vessel</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Ducted propeller / absorption in duct (multiple)", active: false },
                  { label: "Espro propeller (MMG)", active: true },
                  { label: "Espro slient propeller (MMG)", active: false },
                  { label: "GPX propeller (Nakashima Propeller Co Ltd.)", active: false },
                  { label: "Schneekluth duct (Schneekluth)", active: true },
                  { label: "Vortex generator (Kristo)", active: false },
                  { label: "Pre swirl duct (HHI)", active: false },
                  { label: "Neighbour duct (Nakashima Propeller Co Ltd.)", active: false },
                  { label: "Propeller air masker system - prairie type (emerging)", active: false },
                  { label: "Composite stator (Nakashima Propeller Co Ltd.)", active: false },
                  { label: "Gate rudder system (Kamome propeller - Wartsila)", active: false },
                  { label: "Air lubrication system", active: false },
                ].map((tech, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-10 rounded-lg flex items-center gap-2 pl-4 pr-3.5",
                      tech.active ? "bg-[#ebf3ff]" : "bg-[#f9fafb]"
                    )}
                  >
                    {tech.active ? (
                      <CheckCircle2 className="w-5 h-5 text-[#1157b2] shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#98a1ae] shrink-0" />
                    )}
                    <span className={cn("text-[14px] leading-[1.45]", tech.active ? "text-[#092c54]" : "text-[#697282]")}>
                      {tech.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-[#e5e7eb] my-4" />

              {/* Bottom row */}
              <div className="flex gap-4 items-center">
                <div className="flex-1 bg-[#f9fafb] rounded-lg h-10 flex items-center justify-between pl-4 pr-3.5">
                  <span className="text-[14px] text-[#697282] leading-[1.45]">Does the vessel have a underwater noice class notation?</span>
                  <XCircle className="w-5 h-5 text-[#98a1ae] shrink-0" />
                </div>
                <div className="flex-1 px-4">
                  <p className="text-[10px] text-[#697282] leading-[1.35]">
                    Aligned with the IMO revised guidelines for the reduction of underwater radiated noise from shipping to address adverse impacts on marine life (IMO MEPC.1/Circ.906 & MEPC.1/Circ.906/Rev.1).
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
