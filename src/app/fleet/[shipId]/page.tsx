"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  CloudUpload,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Ship,
  Settings2,
  Droplets,
  Zap,
  Volume2,
  Trash,
  PowerOff,
  X,
  Plus,
  ArrowRight,
  Download,
  Calendar,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UnsavedChangesBar } from "@/components/ui/unsaved-changes-bar";
import { LeavePageDialog } from "@/components/ui/leave-page-dialog";
import { ships } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const tabs = [
  { id: "ship-data", label: "Ship Data", icon: Ship },
  { id: "tier-iii", label: "Tier III Hours", icon: Settings2 },
  { id: "bdn", label: "BDN", icon: Droplets },
  { id: "edn-solar", label: "EDN / Solar", icon: Zap },
  { id: "urn", label: "URN", icon: Volume2 },
];

type BdnRow = {
  id: string;
  bdnId: string;
  deliveryDate: string;
  fuelType: string;
  fuelWtt: string;
  mass: string;
  sulphur: string;
  bunkerPort: string;
  isNew: boolean;
};

const initialBdnRows: BdnRow[] = [
  { id: "row1", bdnId: "1928376", deliveryDate: "2025-05-11", fuelType: "Diesel", fuelWtt: "8.9", mass: "8.9", sulphur: "8.9", bunkerPort: "Rotterdam", isNew: true },
  { id: "row2", bdnId: "5638291", deliveryDate: "2025-05-11", fuelType: "Diesel", fuelWtt: "8.9", mass: "8.9", sulphur: "8.9", bunkerPort: "Rotterdam", isNew: false },
  { id: "row3", bdnId: "8472639", deliveryDate: "2025-05-11", fuelType: "Diesel", fuelWtt: "8.9", mass: "8.9", sulphur: "8.9", bunkerPort: "Rotterdam", isNew: false },
];

let bdnCounter = 4;

const technologies = [
  { id: "fuel-cells", label: "Fuel Cells", autoSelected: true, checked: true },
  { id: "solar-panels", label: "Solar Panels", autoSelected: true, checked: true },
  { id: "wind-propulsion", label: "Wind Propulsion", autoSelected: false, checked: true, expanded: true },
  { id: "batteries", label: "Batteries", autoSelected: false, checked: true, expanded: true },
  { id: "air-lubrication", label: "Air Lubrication", autoSelected: false, checked: true },
  { id: "particulate-filters", label: "Particulate Filters", autoSelected: false, checked: false },
  { id: "direct-water-injection", label: "Direct Water Injection", autoSelected: false, checked: false },
  { id: "carbon-capture", label: "Carbon Capture", autoSelected: false, checked: false },
  { id: "water-fuel-emulsion", label: "Water Fuel Emulsion", autoSelected: false, checked: false },
];

export default function ShipDetailPage({
  params,
}: {
  params: Promise<{ shipId: string }>;
}) {
  const { shipId } = use(params);
  const ship = ships.find((s) => s.id === shipId) ?? ships[0];
  const [activeTab, setActiveTab] = useState("ship-data");
  const [esiMenuOpen, setEsiMenuOpen] = useState(false);
  const [epiMenuOpen, setEpiMenuOpen] = useState(false);
  const [optOutScheme, setOptOutScheme] = useState<"ESI" | "EPI" | null>(null);
  const [optedOut, setOptedOut] = useState<Set<string>>(new Set());
  const [checkedTechs, setCheckedTechs] = useState<Set<string>>(
    new Set(technologies.filter((t) => t.checked).map((t) => t.id))
  );
  const [bdnRows, setBdnRows] = useState<BdnRow[]>(initialBdnRows);
  const [selectedBdnRows, setSelectedBdnRows] = useState<Set<string>>(new Set());
  const [bdnForm, setBdnForm] = useState({ bdnId: "", deliveryDate: "11.05.2026", fuelType: "Select", fuelWtt: "", mass: "", sulphur: "", bunkerPort: "" });
  const [selectedEdnRows, setSelectedEdnRows] = useState<Set<string>>(new Set());
  const [urnNoiceNotation, setUrnNoiceNotation] = useState(true);
  const [urnVsr, setUrnVsr] = useState(true);
  const [checkedUrnTechs, setCheckedUrnTechs] = useState<Set<string>>(new Set(["urn-espro-propeller", "urn-schneekluth-duct"]));
  const [checkedVsrLocations, setCheckedVsrLocations] = useState<Set<string>>(new Set());

  const recordedBdnRef = useRef<HTMLElement>(null);

  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const pendingNavRef = useRef<string | null>(null);
  const router = useRouter();

  const markDirty = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const handleSave = useCallback(async () => {
    // Prototype: simulate save
    setHasUnsavedChanges(false);
  }, []);

  const handleDiscard = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        pendingNavRef.current = href;
        setLeaveDialogOpen(true);
      }
    },
    [hasUnsavedChanges]
  );

  const handleLeave = useCallback(() => {
    setHasUnsavedChanges(false);
    setLeaveDialogOpen(false);
    if (pendingNavRef.current) {
      router.push(pendingNavRef.current);
      pendingNavRef.current = null;
    }
  }, [router]);

  const handleStay = useCallback(() => {
    setLeaveDialogOpen(false);
    pendingNavRef.current = null;
  }, []);

  return (
    <div className="px-6 py-5 space-y-5 pb-24" onInput={markDirty} onChange={markDirty}>
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/fleet"
            onClick={(e) => handleNavClick(e, "/fleet")}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#d1d5dc] bg-white text-muted-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-[32px] font-medium text-foreground leading-tight">{ship.name}</h1>
            <p className="text-sm text-muted-foreground">
              IMO: {ship.imo} &nbsp;|&nbsp; {ship.shipType}
            </p>
          </div>
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
          <button className="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
            <CloudUpload className="w-4 h-4 text-muted-foreground" />
            Import Data
          </button>
        </div>
      </div>

      {/* Score Cards */}
      <div className="flex gap-4">
        {ship.schemes.includes("ESI") && (
          optedOut.has("ESI") ? (
            <div className="flex items-center gap-4 flex-1 pl-1 pr-4 py-1 bg-[#e5e7eb] border border-dashed border-[#d1d5dc] rounded-[16px]">
              <Image src="/esi-logo-gray.svg" alt="ESI" width={86} height={86} className="rounded-xl" />
              <div className="flex-1 py-3 pr-3">
                <p className="text-sm text-[#98a1ae]">Environmental Ship Index</p>
                <p className="text-xl font-medium text-[#98a1ae] tracking-[-0.2px] mt-2">Not enrolled</p>
              </div>
              <button
                onClick={() => { const next = new Set(optedOut); next.delete("ESI"); setOptedOut(next); }}
                className="h-10 pl-1.5 pr-3 flex items-center gap-1 rounded-lg border border-[#1157b2] bg-white text-sm text-[#1157b2] hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Enroll
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 flex-1 p-2 bg-white rounded-[16px]">
              <Image src="/esi-logo.svg" alt="ESI" width={86} height={86} className="rounded-xl" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Current ESI Score
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
                    Enrolled
                  </span>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setEsiMenuOpen(!esiMenuOpen)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {esiMenuOpen && (
                  <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-border py-2 px-1 z-10 w-48">
                    <button
                      onClick={() => { setOptOutScheme("ESI"); setEsiMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-[#f9fafb] rounded-lg transition-colors"
                    >
                      <PowerOff className="w-4 h-4" />
                      Opt Out of ESI
                    </button>
                  </div>
                )}
              </div>
              <Link href={`/esi/${shipId}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )
        )}
        {ship.schemes.includes("EPI") && (
          optedOut.has("EPI") ? (
            <div className="flex items-center gap-4 flex-1 pl-1 pr-4 py-1 bg-[#e5e7eb] border border-dashed border-[#d1d5dc] rounded-[16px]">
              <Image src="/epi-logo-gray.svg" alt="EPI" width={86} height={86} className="rounded-xl" />
              <div className="flex-1 py-3 pr-3">
                <p className="text-sm text-[#98a1ae]">Environmental Port Index</p>
                <p className="text-xl font-medium text-[#98a1ae] tracking-[-0.2px] mt-2">Not enrolled</p>
              </div>
              <button
                onClick={() => { const next = new Set(optedOut); next.delete("EPI"); setOptedOut(next); }}
                className="h-10 pl-1.5 pr-3 flex items-center gap-1 rounded-lg border border-[#1157b2] bg-white text-sm text-[#1157b2] hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Enroll
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 flex-1 p-2 bg-white rounded-[16px]">
              <Image src="/epi-logo.svg" alt="EPI" width={86} height={86} className="rounded-xl" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Current EPI Score
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
                    Enrolled
                  </span>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setEpiMenuOpen(!epiMenuOpen)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {epiMenuOpen && (
                  <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-border py-2 px-1 z-10 w-48">
                    <button
                      onClick={() => { setOptOutScheme("EPI"); setEpiMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-[#f9fafb] rounded-lg transition-colors"
                    >
                      <PowerOff className="w-4 h-4" />
                      Opt Out of EPI
                    </button>
                  </div>
                )}
              </div>
              <Link href={`/epi/ships/${shipId}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )
        )}
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

      {/* Content */}
      <div className="space-y-5">
        {activeTab === "ship-data" && (
          <>
        {/* General Information */}
        <section className="bg-white rounded-[16px] p-6">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-lg font-medium text-foreground">
              General Information
            </h2>
            {ship.schemes.map((s) => (
              <span
                key={s}
                className={cn(
                  "inline-flex items-center justify-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border",
                  s === "ESI"
                    ? "bg-status-active-bg text-status-active border-status-active-border"
                    : "bg-epi-blue-light text-epi-blue border-epi-blue-border"
                )}
              >
                {s}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Ship name</label>
              <Input defaultValue={ship.name} className="mt-1 rounded-lg" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                IMO Number
              </label>
              <Input
                defaultValue={ship.imo}
                disabled
                className="mt-1 rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Ship type</label>
              <div className="relative">
                <select className="mt-1 w-full h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>{ship.shipType}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 mt-[2px] -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                Keel laid year
              </label>
              <Input defaultValue="2020" className="mt-1 rounded-lg" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                Gross Tonnage
              </label>
              <Input defaultValue="68 000" className="mt-1 rounded-lg" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                Deadweight Tonnage
              </label>
              <Input defaultValue="72 000" className="mt-1 rounded-lg" />
            </div>
          </div>
        </section>

        {/* IAPP Certificate */}
        <section className="bg-white rounded-[16px] p-6">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-lg font-medium text-foreground">
              IAPP Certificate
            </h2>
            <span className="inline-flex items-center justify-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
              ESI
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">City</label>
              <Input defaultValue="Hamburg" className="mt-1 rounded-lg" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Authority</label>
              <Input defaultValue="DNV" className="mt-1 rounded-lg" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                Valid until
              </label>
              <Input
                type="text"
                defaultValue="01/01/2028"
                className="mt-1 rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Technologies */}
        <section className="bg-white rounded-[16px] p-4">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-medium text-foreground">
              Technologies
            </h2>
            <span className="inline-flex items-center justify-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
              ESI
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {technologies.map((tech) => {
              const isChecked = checkedTechs.has(tech.id);
              const toggleTech = () => {
                if (tech.autoSelected) return;
                const next = new Set(checkedTechs);
                if (next.has(tech.id)) next.delete(tech.id);
                else next.add(tech.id);
                setCheckedTechs(next);
                markDirty();
              };
              return (
              <div
                key={tech.id}
                className={cn(
                  "rounded-lg cursor-pointer transition-colors",
                  tech.autoSelected
                    ? "bg-[#f9fafb] h-10 flex items-center justify-between pl-4 pr-3.5 cursor-default"
                    : isChecked && tech.expanded
                    ? "bg-[#ebf3ff] px-4 py-3"
                    : isChecked
                    ? "bg-[#ebf3ff] h-10 flex items-center pl-4 pr-3.5"
                    : "bg-[#f9fafb] h-10 flex items-center pl-4 pr-3.5"
                )}
                onClick={toggleTech}
              >
                {tech.autoSelected ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isChecked}
                        disabled
                        id={tech.id}
                      />
                      <label
                        className="text-sm font-normal text-[#98a1ae]"
                      >
                        {tech.label}
                      </label>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-white text-foreground border border-[#e5e7eb]">
                      Autom. Selected
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleTech()}
                        id={tech.id}
                      />
                      <label
                        className="text-sm font-normal text-foreground cursor-pointer"
                      >
                        {tech.label}
                      </label>
                    </div>
                    {isChecked && tech.expanded && tech.id === "wind-propulsion" && (
                      <div className="mt-4 grid grid-cols-2 gap-4" onClick={(e) => e.stopPropagation()}>
                        <div>
                          <label className="text-sm text-muted-foreground">
                            P_me
                          </label>
                          <div className="relative mt-1">
                            <Input
                              defaultValue="0"
                              className="pr-10 rounded-lg"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#98a1ae]">
                              kW
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">
                            P_eff
                          </label>
                          <div className="relative mt-1">
                            <Input
                              defaultValue="0"
                              className="pr-10 rounded-lg"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#98a1ae]">
                              kW
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {isChecked && tech.expanded && tech.id === "batteries" && (
                      <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                        <label className="text-sm text-muted-foreground">
                          Batteries capacity
                        </label>
                        <div className="relative mt-1">
                          <Input
                            defaultValue="0"
                            className="pr-12 rounded-lg"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#98a1ae]">
                            kWh
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              );
            })}
          </div>
        </section>

        {/* Power Sources */}
        <section className="bg-white rounded-[16px] p-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-medium text-foreground">
                Power Sources
              </h2>
              <span className="inline-flex items-center justify-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
                ESI
              </span>
              <span className="inline-flex items-center justify-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-epi-blue-light text-epi-blue border border-epi-blue-border">
                EPI
              </span>
            </div>
            <button className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-border bg-white text-xs font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
              Add +
            </button>
          </div>
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-xs font-normal text-muted-foreground pl-4 pr-2 h-10 bg-[#F3F4F6] w-[100px]">Engine ID</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Main/Auxiliary</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Type</th>
                  <th className="text-right text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] w-[124px]">Rated Power <span className="text-[10px]">(kW)</span></th>
                  <th className="text-right text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] w-[124px]">RPM</th>
                  <th className="text-right text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] w-[124px]">NOx (g/kWh)</th>
                  <th className="text-center text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] w-14">TIER III</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">EIAPP Certificate</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Cert. Issue Date</th>
                  <th className="w-10 h-10 bg-[#F3F4F6]" />
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="py-4 pl-4 pr-2 w-[100px]">
                    <Input defaultValue="M-1" className="h-10 rounded-lg" />
                  </td>
                  <td className="py-4 px-2">
                    <div className="relative">
                      <select className="h-10 pl-4 pr-10 w-full rounded-lg border border-border bg-white text-sm appearance-none">
                        <option>Main</option>
                        <option>Auxiliary</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="relative">
                      <select className="h-10 pl-4 pr-10 w-full rounded-lg border border-border bg-white text-sm appearance-none">
                        <option>Diesel</option>
                        <option>Gas</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </td>
                  <td className="py-4 px-2 w-[124px]">
                    <Input defaultValue="4 320" className="h-10 rounded-lg text-right" />
                  </td>
                  <td className="py-4 px-2 w-[124px]">
                    <Input defaultValue="600" className="h-10 rounded-lg text-right" />
                  </td>
                  <td className="py-4 px-2 w-[124px]">
                    <Input defaultValue="9,28" className="h-10 rounded-lg text-right" />
                  </td>
                  <td className="py-4 px-2 w-14 text-center">
                    <Checkbox defaultChecked />
                  </td>
                  <td className="py-4 px-2">
                    <Input defaultValue="GTB0/NTL/20160903120834" className="h-10 rounded-lg" />
                  </td>
                  <td className="py-4 px-2">
                    <Input defaultValue="01/01/2028" className="h-10 rounded-lg" />
                  </td>
                  <td className="py-4 pl-2 pr-4">
                    <button className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pl-4 pr-2 w-[100px]">
                    <Input defaultValue="AE-1" className="h-10 rounded-lg" />
                  </td>
                  <td className="py-4 px-2">
                    <div className="relative">
                      <select className="h-10 pl-4 pr-10 w-full rounded-lg border border-border bg-white text-sm appearance-none">
                        <option>Auxiliary</option>
                        <option>Main</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="relative">
                      <select className="h-10 pl-4 pr-10 w-full rounded-lg border border-border bg-white text-sm appearance-none">
                        <option>Diesel</option>
                        <option>Gas</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </td>
                  <td className="py-4 px-2 w-[124px]">
                    <Input defaultValue="620" className="h-10 rounded-lg text-right" />
                  </td>
                  <td className="py-4 px-2 w-[124px]">
                    <Input defaultValue="1 800" className="h-10 rounded-lg text-right" />
                  </td>
                  <td className="py-4 px-2 w-[124px]">
                    <Input defaultValue="8,9" className="h-10 rounded-lg text-right" />
                  </td>
                  <td className="py-4 px-2 w-14 text-center">
                    <Checkbox />
                  </td>
                  <td className="py-4 px-2">
                    <Input defaultValue="GTB0/NTL/20160903120834" className="h-10 rounded-lg" />
                  </td>
                  <td className="py-4 px-2">
                    <Input defaultValue="01/01/2028" className="h-10 rounded-lg" />
                  </td>
                  <td className="py-4 pl-2 pr-4">
                    <button className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
          </>
        )}

        {activeTab === "tier-iii" && (
          <section className="bg-white rounded-[16px] p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
                    Engine Specific Tier III Hours and Emissions
                  </h2>
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
                    ESI
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Please add the Hours and NOx Emissions in Tier III mode for each Engine. Only Tier III capable Engines are listed in the table below.
                </p>
              </div>
              <div className="relative shrink-0">
                <select className="h-8 pl-3 pr-8 rounded-lg border border-border bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Ref. period: 2026</option>
                  <option>Ref. period: 2025</option>
                  <option>Ref. period: 2024</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-normal text-muted-foreground pl-4 pr-2 h-10 bg-[#F3F4F6] w-[120px]">Engine ID</th>
                    <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] w-[197px]">Type</th>
                    <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] w-[117px]">Main/Auxiliary</th>
                    <th className="text-right text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] w-[160px]">NOx - TIER III <span className="text-[10px]">(g/kWh)</span></th>
                    <th className="text-right text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] w-[160px]">Hours in TIER III</th>
                    <th className="text-right text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] w-[160px]">Total Hours</th>
                    <th className="w-[54px] h-10 bg-[#F3F4F6]" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4 pl-4 pr-2 text-sm text-foreground">AE-1</td>
                    <td className="py-4 px-2 text-sm text-foreground">Diesel engine 2-stroke</td>
                    <td className="py-4 px-2 text-sm text-foreground">Auxiliary</td>
                    <td className="py-4 px-2 text-sm text-foreground text-right">2.4</td>
                    <td className="py-4 px-2">
                      <Input defaultValue="450" className="h-10 rounded-lg text-right" />
                    </td>
                    <td className="py-4 px-2">
                      <Input defaultValue="1 200" className="h-10 rounded-lg text-right" />
                    </td>
                    <td className="py-4 pl-2 pr-4">
                      <button className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "bdn" && (
          <>
          {/* Bunker Delivery Notes - Input */}
          <section className="bg-white rounded-[16px] p-4">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
                    Bunker Delivery Notes
                  </h2>
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
                    ESI
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Global record of fuel supply compliance and environmental metrics.
                </p>
              </div>

              {/* Manual Input Card */}
              <div className="border border-[#e8eaed] rounded-[16px] p-4 flex flex-col gap-6">
                <h3 className="text-base font-medium text-foreground tracking-[-0.48px]">Manual input</h3>
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-4 gap-5">
                    <div>
                      <label className="text-sm text-[#4a5565]">BDN ID</label>
                      <Input placeholder="Enter BDN ID" value={bdnForm.bdnId} onChange={(e) => setBdnForm(f => ({ ...f, bdnId: e.target.value }))} className="mt-1 rounded-lg" />
                    </div>
                    <div>
                      <label className="text-sm text-[#4a5565]">Delivery Date</label>
                      <div className="relative mt-1">
                        <select value={bdnForm.deliveryDate} onChange={(e) => setBdnForm(f => ({ ...f, deliveryDate: e.target.value }))} className="w-full h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                          <option>11.05.2026</option>
                          <option>10.05.2026</option>
                          <option>09.05.2026</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-[#4a5565]">Fuel Type</label>
                      <div className="relative mt-1">
                        <select value={bdnForm.fuelType} onChange={(e) => setBdnForm(f => ({ ...f, fuelType: e.target.value }))} className={cn("w-full h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary", bdnForm.fuelType === "Select" && "text-[#98a1ae]")}>
                          <option>Select</option>
                          <option>Diesel</option>
                          <option>LNG</option>
                          <option>HFO</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-[#4a5565]">Fuel WTT (gCO2e/MJ)</label>
                      <Input placeholder="0" value={bdnForm.fuelWtt} onChange={(e) => setBdnForm(f => ({ ...f, fuelWtt: e.target.value }))} className="mt-1 rounded-lg" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-5">
                    <div>
                      <label className="text-sm text-[#4a5565]">Mass (tonnes)</label>
                      <Input placeholder="0" value={bdnForm.mass} onChange={(e) => setBdnForm(f => ({ ...f, mass: e.target.value }))} className="mt-1 rounded-lg" />
                    </div>
                    <div>
                      <label className="text-sm text-[#4a5565]">Sulphur Content (%)</label>
                      <Input placeholder="0" value={bdnForm.sulphur} onChange={(e) => setBdnForm(f => ({ ...f, sulphur: e.target.value }))} className="mt-1 rounded-lg" />
                    </div>
                    <div>
                      <label className="text-sm text-[#4a5565]">Bunker Port</label>
                      <Input placeholder="Enter port name" value={bdnForm.bunkerPort} onChange={(e) => setBdnForm(f => ({ ...f, bunkerPort: e.target.value }))} className="mt-1 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        const newRow: BdnRow = {
                          id: `row${bdnCounter++}`,
                          bdnId: bdnForm.bdnId || String(Math.floor(Math.random() * 9000000) + 1000000),
                          deliveryDate: bdnForm.deliveryDate,
                          fuelType: bdnForm.fuelType === "Select" ? "Diesel" : bdnForm.fuelType,
                          fuelWtt: bdnForm.fuelWtt || "0",
                          mass: bdnForm.mass || "0",
                          sulphur: bdnForm.sulphur || "0",
                          bunkerPort: bdnForm.bunkerPort || "—",
                          isNew: true,
                        };
                        setBdnRows(prev => [newRow, ...prev]);
                        setBdnForm({ bdnId: "", deliveryDate: "11.05.2026", fuelType: "Select", fuelWtt: "", mass: "", sulphur: "", bunkerPort: "" });
                        markDirty();
                        setTimeout(() => {
                          recordedBdnRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 50);
                      }}
                      className="h-10 px-3 py-2.5 rounded-lg bg-[#061e3a] text-sm font-normal text-white hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors"
                    >
                      Add BDN
                    </button>
                  </div>
                </div>
              </div>

              {/* Bulk Upload Banner */}
              <div className="bg-[#ebf3ff] rounded-[16px] p-4 flex items-center gap-6">
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className="text-base font-medium text-foreground tracking-[-0.48px]">Bulk Upload</h3>
                  <p className="text-sm text-muted-foreground">Use upload center to add more delivery notes at once</p>
                </div>
                <button className="inline-flex items-center gap-2 h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
                  Upload BDN
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

          {/* Recorded Delivery Notes */}
          <section ref={recordedBdnRef} className="bg-white rounded-[16px] p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
                Recorded Delivery Notes
              </h2>
              <div className="flex items-center gap-2">
                {selectedBdnRows.size > 0 && (
                  <button onClick={() => { setBdnRows(prev => prev.filter(r => !selectedBdnRows.has(r.id))); setSelectedBdnRows(new Set()); markDirty(); }} className="h-10 px-3 py-2.5 rounded-lg bg-[#9e2028] text-sm font-normal text-white hover:bg-[#82181a] transition-colors">
                    Delete Selected ({selectedBdnRows.size})
                  </button>
                )}
                <button className="inline-flex items-center gap-2 h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
                  <Download className="w-5 h-5 text-muted-foreground" />
                  Export
                </button>
              </div>
            </div>
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="w-[34px] h-10 bg-[#F3F4F6]" />
                    <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] w-[111px]">ID</th>
                    <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] w-[160px]">Delivery date</th>
                    <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Fuel Type</th>
                    <th className="text-right text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Fuel WTT <span className="text-[10px]">(gCO₂eq/MJ)</span></th>
                    <th className="text-right text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] w-[101px]">Mass <span className="text-[10px]">(Tonnes)</span></th>
                    <th className="text-right text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Sulphur Content <span className="text-[10px]">(%)</span></th>
                    <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Bunker Port</th>
                    <th className="w-[44px] h-10 bg-[#F3F4F6]" />
                  </tr>
                </thead>
                <tbody>
                  {bdnRows.map((row, idx) => (
                    <tr key={row.id} className={`${idx < bdnRows.length - 1 ? "border-b border-[#e5e7eb]" : ""} ${row.isNew ? "bg-[#f8fbff]" : ""}`}>
                      <td className={`py-2 ${row.isNew ? "pl-0" : "pl-4"}`}>
                        {row.isNew ? (
                          <div className="flex items-center">
                            <div className="w-[3px] h-8 bg-[#4780cf] rounded-full shrink-0" />
                            <div className="pl-[13px]">
                              <Checkbox checked={selectedBdnRows.has(row.id)} onCheckedChange={(checked) => { const next = new Set(selectedBdnRows); checked ? next.add(row.id) : next.delete(row.id); setSelectedBdnRows(next); }} />
                            </div>
                          </div>
                        ) : (
                          <Checkbox checked={selectedBdnRows.has(row.id)} onCheckedChange={(checked) => { const next = new Set(selectedBdnRows); checked ? next.add(row.id) : next.delete(row.id); setSelectedBdnRows(next); }} />
                        )}
                      </td>
                      <td className="py-2 px-2">
                        <Input defaultValue={row.bdnId} className="h-10 rounded-lg" />
                      </td>
                      <td className="py-2 px-2">
                        <div className="relative">
                          <Input defaultValue={row.deliveryDate} className="h-10 rounded-lg pr-10" />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <div className="relative">
                          <select defaultValue={row.fuelType} className="w-full h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                            <option>Diesel</option>
                            <option>LNG</option>
                            <option>HFO</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <Input defaultValue={row.fuelWtt} className="h-10 rounded-lg text-right" />
                      </td>
                      <td className="py-2 px-2">
                        <Input defaultValue={row.mass} className="h-10 rounded-lg text-right" />
                      </td>
                      <td className="py-2 px-2">
                        <Input defaultValue={row.sulphur} className="h-10 rounded-lg text-right" />
                      </td>
                      <td className="py-2 px-2">
                        <Input defaultValue={row.bunkerPort} className="h-10 rounded-lg" />
                      </td>
                      <td className="py-2 pl-2 pr-4">
                        <button onClick={() => { setBdnRows(prev => prev.filter(r => r.id !== row.id)); setSelectedBdnRows(prev => { const next = new Set(prev); next.delete(row.id); return next; }); markDirty(); }} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          </>
        )}

        {activeTab === "edn-solar" && (
          <>
          <section className="bg-white rounded-[16px] p-4">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
                    Onshore Power & Solar Delivery
                  </h2>
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
                    ESI
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Registry of clean energy intake from port facilities and renewable generation.
                </p>
              </div>

              {/* Manual Input Card */}
              <div className="border border-[#e8eaed] rounded-[16px] p-4 flex flex-col gap-6">
                <h3 className="text-base font-medium text-foreground tracking-[-0.48px]">Manual input</h3>
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-3 gap-5">
                    <div>
                      <label className="text-sm text-[#4a5565]">EDN ID</label>
                      <Input placeholder="Enter EDN ID" className="mt-1 rounded-lg" />
                    </div>
                    <div>
                      <label className="text-sm text-[#4a5565]">Delivery Date</label>
                      <div className="relative mt-1">
                        <select className="w-full h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                          <option>11.05.2026</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-[#4a5565]">Port Name</label>
                      <Input placeholder="Enter port name" className="mt-1 rounded-lg" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-5">
                    <div>
                      <label className="text-sm text-[#4a5565]">Onshore Power (kWh)</label>
                      <Input placeholder="0" className="mt-1 rounded-lg" />
                    </div>
                    <div>
                      <label className="text-sm text-[#4a5565]">Solar Panel Output (kWh)</label>
                      <Input placeholder="0" className="mt-1 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <button className="h-10 px-3 py-2.5 rounded-lg bg-primary text-sm font-normal text-white hover:bg-primary/90 transition-colors">
                      Submit EDN
                    </button>
                  </div>
                </div>
              </div>

              {/* Bulk Upload Banner */}
              <div className="bg-[#ebf3ff] rounded-[16px] p-4 flex items-center gap-6">
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className="text-base font-medium text-foreground tracking-[-0.48px]">Bulk Upload</h3>
                  <p className="text-sm text-muted-foreground">Use upload center to add more delivery notes at once</p>
                </div>
                <button className="inline-flex items-center gap-2 h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
                  Upload EDN
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

          {/* Recorded Delivery Notes */}
          <section className="bg-white rounded-[16px] p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
                Recorded Delivery Notes
              </h2>
              <div className="flex items-center gap-2">
                {selectedEdnRows.size > 0 && (
                  <button className="h-10 px-3 py-2.5 rounded-lg bg-[#9e2028] text-sm font-normal text-white hover:bg-[#82181a] transition-colors">
                    Delete Selected ({selectedEdnRows.size})
                  </button>
                )}
                <button className="inline-flex items-center gap-2 h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
                  <Download className="w-5 h-5 text-muted-foreground" />
                  Export
                </button>
              </div>
            </div>
            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="w-[44px] h-10 bg-[#F3F4F6]" />
                    <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] w-[111px]">ID</th>
                    <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] w-[160px]">Delivery date</th>
                    <th className="text-right text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Onshore Power (kWh)</th>
                    <th className="text-right text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Solar Panel Output (kWh)</th>
                    <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Port name</th>
                    <th className="w-[44px] h-10 bg-[#F3F4F6]" />
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1 - Disabled/loading */}
                  <tr className="border-b border-[#e5e7eb]">
                    <td className="py-2 pl-4">
                      <Checkbox disabled />
                    </td>
                    <td className="py-2 px-2">
                      <Input defaultValue="4729183" disabled className="h-10 rounded-lg" />
                    </td>
                    <td className="py-2 px-2">
                      <div className="relative">
                        <Input defaultValue="2025-05-11" disabled className="h-10 rounded-lg pr-10" />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#98a1ae] pointer-events-none" />
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <Input defaultValue="8.9" disabled className="h-10 rounded-lg text-right" />
                    </td>
                    <td className="py-2 px-2">
                      <Input defaultValue="8.9" disabled className="h-10 rounded-lg text-right" />
                    </td>
                    <td className="py-2 px-2">
                      <Input defaultValue="Rotterdam" disabled className="h-10 rounded-lg" />
                    </td>
                    <td className="py-2 pl-2 pr-4">
                      <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr>
                    <td className="py-2 pl-4">
                      <Checkbox checked={selectedEdnRows.has("edn-row1")} onCheckedChange={(checked) => { const next = new Set(selectedEdnRows); checked ? next.add("edn-row1") : next.delete("edn-row1"); setSelectedEdnRows(next); }} />
                    </td>
                    <td className="py-2 px-2">
                      <Input defaultValue="8361024" className="h-10 rounded-lg" />
                    </td>
                    <td className="py-2 px-2">
                      <div className="relative">
                        <Input defaultValue="2025-05-11" className="h-10 rounded-lg pr-10" />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <Input defaultValue="8.9" className="h-10 rounded-lg text-right" />
                    </td>
                    <td className="py-2 px-2">
                      <Input defaultValue="8.9" className="h-10 rounded-lg text-right" />
                    </td>
                    <td className="py-2 px-2">
                      <Input defaultValue="Rotterdam" className="h-10 rounded-lg" />
                    </td>
                    <td className="py-2 pl-2 pr-4">
                      <button className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          </>
        )}

        {activeTab === "urn" && (
          <section className="bg-white rounded-[16px]">
            {/* Top section */}
            <div className="pt-4 pb-6 px-4 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
                  Underwater Radiated Noise
                </h2>
                <span className="inline-flex items-center justify-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
                  ESI
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {/* Toggle switches row */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setUrnNoiceNotation(!urnNoiceNotation); markDirty(); }}
                    className={cn(
                      "h-10 rounded-lg flex items-center justify-between pl-4 pr-3.5 text-sm text-foreground text-left transition-colors",
                      urnNoiceNotation ? "bg-[#ebf3ff]" : "bg-[#f9fafb]"
                    )}
                  >
                    Does the vessel have a underwater noice class notation?
                    <div className={cn("w-[38px] h-[22px] rounded-full flex items-center px-1 transition-colors shrink-0 ml-2", urnNoiceNotation ? "bg-[#0c3c7a] justify-end" : "bg-[#98a1ae]")}>
                      <div className="w-3.5 h-3.5 rounded-full bg-white" />
                    </div>
                  </button>
                  <button
                    onClick={() => { setUrnVsr(!urnVsr); markDirty(); }}
                    className={cn(
                      "h-10 rounded-lg flex items-center justify-between pl-4 pr-3.5 text-sm text-foreground text-left transition-colors",
                      urnVsr ? "bg-[#ebf3ff]" : "bg-[#f9fafb]"
                    )}
                  >
                    Did the vessel participate in any vessel speed reductions (VSR)?
                    <div className={cn("w-[38px] h-[22px] rounded-full flex items-center px-1 transition-colors shrink-0 ml-2", urnVsr ? "bg-[#0c3c7a] justify-end" : "bg-[#98a1ae]")}>
                      <div className="w-3.5 h-3.5 rounded-full bg-white" />
                    </div>
                  </button>
                </div>

                {/* Select Notation */}
                {urnNoiceNotation && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <select className="w-full h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm text-[#98a1ae] appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Select noise class notation</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* VSR Locations */}
              {urnVsr && (
                <div className="flex flex-col gap-6">
                  <p className="text-sm text-muted-foreground tracking-[-0.14px]">
                    Select which vessel speed reductions
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: "vsr-blue-whales", label: "Blue whales & Blue Skies, Central & Northern, California Coast" },
                      { id: "vsr-ny-nj", label: "Port Authority of New York & New Jersey, New York & New Jersey" },
                      { id: "vsr-haro", label: "Haro Strait-Boundary Pass, British Columbia" },
                      { id: "vsr-san-diego", label: "Port of San Diego, California" },
                      { id: "vsr-la-lb", label: "Port of Los Angeles & Port of Long Beach, Southern California" },
                      { id: "vsr-swiftsure", label: "Swiftsure Bank, British Columbia" },
                      { id: "vsr-st-lawrence-river", label: "St. Lawrence River, Quebec, Canada" },
                      { id: "vsr-other", label: "Other" },
                      { id: "vsr-gulf-st-lawrence", label: "Gulf of St. Lawrence, Eastern Canada" },
                    ].map((loc) => {
                      const isChecked = checkedVsrLocations.has(loc.id);
                      const toggle = () => {
                        const next = new Set(checkedVsrLocations);
                        isChecked ? next.delete(loc.id) : next.add(loc.id);
                        setCheckedVsrLocations(next);
                        markDirty();
                      };
                      return (
                        <div
                          key={loc.id}
                          onClick={toggle}
                          className={cn(
                            "rounded-lg cursor-pointer transition-colors flex items-center gap-2 pl-4 pr-3.5 py-3",
                            isChecked ? "bg-[#ebf3ff]" : "bg-[#f9fafb]"
                          )}
                        >
                          <Checkbox checked={isChecked} onCheckedChange={() => toggle()} />
                          <span className="text-sm text-foreground">{loc.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Technologies section */}
            <div className="border-t border-[#e5e7eb] pt-6 pb-4 px-4 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium text-foreground tracking-[-0.54px]">Technologies</h3>
                <p className="text-sm text-muted-foreground tracking-[-0.14px]">
                  Select which technologies that improve wake flow and/or reduce cavitation apply to the vessel
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "urn-ducted-propeller", label: "Ducted propeller / absorption in duct (multiple)" },
                  { id: "urn-espro-propeller", label: "Espro propeller (MMG)" },
                  { id: "urn-espro-silent", label: "Espro slient propeller (MMG)" },
                  { id: "urn-gpx-propeller", label: "GPX propeller (Nakashima Propeller Co Ltd.)" },
                  { id: "urn-schneekluth-duct", label: "Schneekluth duct (Schneekluth)" },
                  { id: "urn-vortex-generator", label: "Vortex generator (Kristo)" },
                  { id: "urn-pre-swirl-duct", label: "Pre swirl duct (HHI)" },
                  { id: "urn-neighbour-duct", label: "Neighbour duct (Nakashima Propeller Co Ltd.)" },
                  { id: "urn-prairie-type", label: "Propeller air masker system - prairie type (emerging)" },
                  { id: "urn-composite-stator", label: "Composite stator (Nakashima Propeller Co Ltd.)" },
                  { id: "urn-gate-rudder", label: "Gate rudder system (Kamome propeller - Wartsila)" },
                  { id: "urn-air-lubrication", label: "Air lubrication system" },
                ].map((tech) => {
                  const isChecked = checkedUrnTechs.has(tech.id);
                  const toggle = () => {
                    const next = new Set(checkedUrnTechs);
                    isChecked ? next.delete(tech.id) : next.add(tech.id);
                    setCheckedUrnTechs(next);
                    markDirty();
                  };
                  return (
                    <div
                      key={tech.id}
                      onClick={toggle}
                      className={cn(
                        "h-10 rounded-lg cursor-pointer transition-colors flex items-center justify-between pl-4 pr-1 py-3",
                        isChecked ? "bg-[#ebf3ff]" : "bg-[#f9fafb]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox checked={isChecked} onCheckedChange={() => toggle()} />
                        <span className="text-sm text-foreground">{tech.label}</span>
                      </div>
                      {isChecked && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <Input placeholder="0" className="h-8 w-[76px] rounded-lg text-right text-sm" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-[10px] text-muted-foreground leading-[1.35]">
                Aligned with the IMO revised guidelines for the reduction of underwater radiated noise from shipping to address adverse impacts on marine life (IMO MEPC.1/Circ.906 & MEPC.1/Circ.906/Rev.1).
              </p>
            </div>
          </section>
        )}
      </div>

      {/* Opt-Out Confirmation Dialog */}
      {optOutScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOptOutScheme(null)} />
          <div className="relative bg-white rounded-lg shadow-[0px_8px_12px_rgba(0,0,0,0.1)] w-[480px]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
              <h3 className="text-2xl font-semibold text-foreground tracking-[-0.24px]">
                Opt out of {optOutScheme}?
              </h3>
              <button
                onClick={() => setOptOutScheme(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-foreground">
                Are you sure you want to opt out of the {optOutScheme === "ESI" ? "Environmental Ship Index" : "Environmental Port Index"}? This will remove your current score and all associated data. You can re-enroll at any time.
              </p>
            </div>
            {/* Footer */}
            <div className="flex items-center justify-end gap-4 px-6 py-4">
              <button
                onClick={() => setOptOutScheme(null)}
                className="h-10 px-4 rounded-lg border border-[#e5e7eb] bg-white text-sm font-normal text-[#33561c] hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
              >
                Keep enrolled
              </button>
              <button
                onClick={() => {
                  setOptedOut(new Set([...optedOut, optOutScheme]));
                  setOptOutScheme(null);
                }}
                className="h-10 px-4 rounded-lg bg-[#c1272d] text-sm font-normal text-white hover:bg-[#9e2028] active:bg-[#82181a] transition-colors"
              >
                Opt out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Bar */}
      <UnsavedChangesBar
        hasChanges={hasUnsavedChanges}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />

      {/* Leave Page Confirmation */}
      <LeavePageDialog
        open={leaveDialogOpen}
        onStay={handleStay}
        onLeave={handleLeave}
      />
    </div>
  );
}
