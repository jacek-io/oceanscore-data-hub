"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Plus,
  Trash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { UnsavedChangesBar } from "@/components/ui/unsaved-changes-bar";
import { cn } from "@/lib/utils";

/* -- Port data with ECA/OPS info -- */
const portData: Record<string, { ecaStatus: string; opsAvailability: string }> = {
  "Bergen": { ecaStatus: "Inside ECA", opsAvailability: "Available" },
  "Bremerhaven": { ecaStatus: "Inside ECA", opsAvailability: "Available" },
  "Antwerp": { ecaStatus: "Inside ECA", opsAvailability: "Available" },
  "Rotterdam": { ecaStatus: "Inside ECA", opsAvailability: "Available" },
  "Felixstowe": { ecaStatus: "Inside ECA", opsAvailability: "Not available" },
  "Oslo": { ecaStatus: "Inside ECA", opsAvailability: "Available" },
  "Stavanger": { ecaStatus: "Inside ECA", opsAvailability: "Available" },
  "Gothenburg": { ecaStatus: "Inside ECA", opsAvailability: "Available" },
  "Hamburg": { ecaStatus: "Inside ECA", opsAvailability: "Available" },
  "Aarhus": { ecaStatus: "Inside ECA", opsAvailability: "Available" },
  "Amsterdam": { ecaStatus: "Inside ECA", opsAvailability: "Available" },
  "Reykjavik": { ecaStatus: "Outside ECA", opsAvailability: "Not available" },
};
const portNames = Object.keys(portData);

/* -- Ship engine/boiler configurations -- */
const shipConfigs: Record<string, { engines: { id: string; type: string }[]; boilers: { id: string }[] }> = {
  "Arctic Navigator": {
    engines: [{ id: "M-1", type: "Main" }, { id: "AE-1", type: "Auxiliary" }, { id: "AE-2", type: "Auxiliary" }],
    boilers: [{ id: "B-1" }, { id: "B-2" }],
  },
  "Astral": {
    engines: [{ id: "M-1", type: "Main" }, { id: "AE-1", type: "Auxiliary" }],
    boilers: [{ id: "B-1" }],
  },
  "Caspian Trader": {
    engines: [{ id: "M-1", type: "Main" }, { id: "M-2", type: "Main" }, { id: "AE-1", type: "Auxiliary" }],
    boilers: [{ id: "B-1" }, { id: "B-2" }],
  },
  "Shadow": {
    engines: [{ id: "M-1", type: "Main" }, { id: "AE-1", type: "Auxiliary" }],
    boilers: [{ id: "B-1" }],
  },
  "MV Mediterranean Pearl": {
    engines: [{ id: "M-1", type: "Main" }, { id: "AE-1", type: "Auxiliary" }, { id: "AE-2", type: "Auxiliary" }],
    boilers: [{ id: "B-1" }, { id: "B-2" }],
  },
  "Rosemary": {
    engines: [{ id: "M-1", type: "Main" }, { id: "AE-1", type: "Auxiliary" }],
    boilers: [{ id: "B-1" }],
  },
  "MV Southern Cross": {
    engines: [{ id: "M-1", type: "Main" }, { id: "AE-1", type: "Auxiliary" }, { id: "AE-2", type: "Auxiliary" }],
    boilers: [{ id: "B-1" }, { id: "B-2" }],
  },
};

const shipOptions = Object.keys(shipConfigs);

/* -- Section wrapper -- */
function FormSection({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[16px] p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">{title}</h2>
          <p className="text-sm text-muted-foreground tracking-[-0.42px]">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* -- Select wrapper -- */
function SelectField({
  value,
  onChange,
  options,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 pl-4 pr-10 w-full rounded-lg border border-border bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

/* -- Read-only field (gray bg) -- */
function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 flex flex-col gap-1.5">
      <label className="text-xs text-muted-foreground leading-[1.45]">{label}</label>
      <div className="h-10 px-4 rounded-lg bg-[#f3f4f6] text-sm text-muted-foreground flex items-center">
        {value || "-"}
      </div>
    </div>
  );
}

/* -- Field label + input -- */
function LabeledInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex-1 flex flex-col gap-1.5">
      <label className="text-xs text-muted-foreground leading-[1.45]">{label}</label>
      <Input
        type={type}
        placeholder={placeholder || "-"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-lg"
      />
    </div>
  );
}

function LabeledSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div className="flex-1 flex flex-col gap-1.5">
      <label className="text-xs text-muted-foreground leading-[1.45]">{label}</label>
      <SelectField value={value} onChange={onChange} options={options} placeholder={placeholder} />
    </div>
  );
}

/* -- Engine row type -- */
type EngineRow = {
  id: string;
  engineId: string;
  engineType: string;
  avgLoad: string;
  runningH: string;
  powerProduction: string;
  fuelType: string;
  fuelConsumption: string;
  biofuelBlend: string;
  sulphurContent: string;
  pilotFuelType: string;
  pilotFuelConsumption: string;
  pilotBiofuelBlend: string;
  pilotSulphurContent: string;
};

/* -- Boiler row type -- */
type BoilerRow = {
  id: string;
  boilerId: string;
  runningH: string;
  fuelType: string;
  fuelConsumption: string;
  electricalConsumption: string;
  biofuelBlend: string;
  sulphurContent: string;
  fuelWttEmissionFactor: string;
};

/* -- SOx row type -- */
type SoxRow = {
  id: string;
  engineId: string;
  engineType: string;
  soxReductionType: string;
  avgSo2Co2Ratio: string;
  scrubberDuration: string;
  avgDischargeFlow: string;
};

/* -- NOx row type -- */
type NoxRow = {
  id: string;
  engineId: string;
  engineType: string;
  noxReductionType: string;
  avgNoxEmission: string;
  shareTimeActive: string;
};

const makeEngine = (engineId: string, engineType: string): EngineRow => ({
  id: crypto.randomUUID(),
  engineId,
  engineType,
  avgLoad: "",
  runningH: "",
  powerProduction: "",
  fuelType: "VLSFO",
  fuelConsumption: "",
  biofuelBlend: "",
  sulphurContent: "",
  pilotFuelType: "VLSFO",
  pilotFuelConsumption: "",
  pilotBiofuelBlend: "",
  pilotSulphurContent: "",
});

const makeBoiler = (boilerId: string): BoilerRow => ({
  id: crypto.randomUUID(),
  boilerId,
  runningH: "",
  fuelType: "VLSFO",
  fuelConsumption: "",
  electricalConsumption: "",
  biofuelBlend: "",
  sulphurContent: "",
  fuelWttEmissionFactor: "",
});

const emptySox = (): SoxRow => ({
  id: crypto.randomUUID(),
  engineId: "",
  engineType: "Main",
  soxReductionType: "Open-loop scrubber",
  avgSo2Co2Ratio: "",
  scrubberDuration: "",
  avgDischargeFlow: "",
});

const emptyNox = (): NoxRow => ({
  id: crypto.randomUUID(),
  engineId: "",
  engineType: "Main",
  noxReductionType: "SCR",
  avgNoxEmission: "",
  shareTimeActive: "",
});

const fuelTypes = ["VLSFO", "ULSFO", "HFO", "MGO", "MDO", "LNG", "LPG", "Methanol", "Electric"];
const soxReductionTypes = ["Open-loop scrubber", "Closed-loop scrubber", "Hybrid scrubber", "Low sulphur fuel"];
const noxReductionTypes = ["SCR", "EGR", "DWI", "HAM", "Water injection"];

/* -- Initial data for edit mode -- */
export type PortCallInitialData = {
  ship: string;
  port: string;
  terminal: string;
  arrivalDate: string;
  arrivalTime: string;
  departureDate: string;
  departureTime: string;
  comment?: string;
};

interface PortCallFormProps {
  title: string;
  initialData?: PortCallInitialData;
}

export function PortCallForm({ title, initialData }: PortCallFormProps) {
  const router = useRouter();

  // Basic info
  const [ship, setShip] = useState(initialData?.ship || "");
  const [port, setPort] = useState(initialData?.port || "");
  const [terminal, setTerminal] = useState(initialData?.terminal || "");
  const [arrivalDate, setArrivalDate] = useState(initialData?.arrivalDate || "");
  const [arrivalTime, setArrivalTime] = useState(initialData?.arrivalTime || "");
  const [departureDate, setDepartureDate] = useState(initialData?.departureDate || "");
  const [departureTime, setDepartureTime] = useState(initialData?.departureTime || "");
  const [comment, setComment] = useState(initialData?.comment || "");

  // Derived from port selection
  const selectedPortData = port ? portData[port] : null;

  // Electrification
  const [shorePower, setShorePower] = useState("");
  const [batteryPower, setBatteryPower] = useState("");
  const [solarPower, setSolarPower] = useState("");
  const [fuelCellPower, setFuelCellPower] = useState("");

  // Engine/Boiler rows - populated from ship selection
  const [engines, setEngines] = useState<EngineRow[]>([]);
  const [boilers, setBoilers] = useState<BoilerRow[]>([]);
  const [soxRows, setSoxRows] = useState<SoxRow[]>([emptySox()]);
  const [noxRows, setNoxRows] = useState<NoxRow[]>([emptyNox()]);

  // Track changes for floating save bar
  const initialized = useRef(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Populate engines/boilers from initial ship on mount
  useEffect(() => {
    if (initialData?.ship && !initialized.current) {
      const config = shipConfigs[initialData.ship];
      if (config) {
        setEngines(config.engines.map((e) => makeEngine(e.id, e.type)));
        setBoilers(config.boilers.map((b) => makeBoiler(b.id)));
      }
      initialized.current = true;
    }
  }, [initialData?.ship]);

  // Mark changes after first interaction
  const markChanged = () => {
    if (initialized.current || !initialData) {
      setHasChanges(true);
    }
  };

  const handleShipChange = (shipName: string) => {
    setShip(shipName);
    const config = shipConfigs[shipName];
    if (config) {
      setEngines(config.engines.map((e) => makeEngine(e.id, e.type)));
      setBoilers(config.boilers.map((b) => makeBoiler(b.id)));
    } else {
      setEngines([]);
      setBoilers([]);
    }
    markChanged();
  };

  const updateEngine = (id: string, field: keyof EngineRow, value: string) => {
    setEngines((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
    markChanged();
  };

  const updateBoiler = (id: string, field: keyof BoilerRow, value: string) => {
    setBoilers((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
    markChanged();
  };

  const updateSox = (id: string, field: keyof SoxRow, value: string) => {
    setSoxRows((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    markChanged();
  };

  const updateNox = (id: string, field: keyof NoxRow, value: string) => {
    setNoxRows((prev) => prev.map((n) => (n.id === id ? { ...n, [field]: value } : n)));
    markChanged();
  };

  const handleFieldChange = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    markChanged();
  };

  const handleSave = async () => {
    router.push("/fleet/port-calls");
  };

  const handleDiscard = () => {
    router.push("/fleet/port-calls");
  };

  return (
    <div className="px-6 py-5 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 pb-2">
        <Link
          href="/fleet/port-calls"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-white hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="text-[32px] font-medium text-foreground leading-[1.2] tracking-[-0.96px]">
          {title}
        </h1>
      </div>

      {/* Basic Info */}
      <FormSection
        title="Port Call Details"
        description="Basic information about the port visit."
      >
        <div className="flex flex-col gap-5">
          <div className="flex gap-4">
            <LabeledSelect label="Ship" value={ship} onChange={handleShipChange} options={shipOptions} placeholder="Select ship..." />
            <LabeledSelect label="Port" value={port} onChange={handleFieldChange(setPort)} options={portNames} placeholder="Select port..." />
            <LabeledInput label="Terminal" value={terminal} onChange={handleFieldChange(setTerminal)} placeholder="e.g. Container Terminal" />
          </div>
          <div className="flex gap-4">
            <LabeledInput label="Arrival date" type="date" value={arrivalDate} onChange={handleFieldChange(setArrivalDate)} />
            <LabeledInput label="Arrival time" type="time" value={arrivalTime} onChange={handleFieldChange(setArrivalTime)} />
            <ReadOnlyField label="Port ECA Status" value={selectedPortData?.ecaStatus || ""} />
          </div>
          <div className="flex gap-4">
            <LabeledInput label="Departure date" type="date" value={departureDate} onChange={handleFieldChange(setDepartureDate)} />
            <LabeledInput label="Departure time" type="time" value={departureTime} onChange={handleFieldChange(setDepartureTime)} />
            <ReadOnlyField label="Port OPS availability" value={selectedPortData?.opsAvailability || ""} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground leading-[1.45]">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => { setComment(e.target.value); markChanged(); }}
              placeholder="Optional notes about this port call..."
              className="w-full rounded-lg border border-border bg-white text-sm px-4 py-3 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
            />
          </div>
        </div>
      </FormSection>

      {/* Electrification */}
      <FormSection
        title="Electrification"
        description="Alternative power sources used during the port call, excluding main engine and boiler consumption."
      >
        <div className="flex gap-4">
          <LabeledInput label="Total shore power (OPS) usage [kWh]" value={shorePower} onChange={handleFieldChange(setShorePower)} />
          <LabeledInput label="Total battery power usage [kWh]" value={batteryPower} onChange={handleFieldChange(setBatteryPower)} />
          <LabeledInput label="Total solar power usage [kWh]" value={solarPower} onChange={handleFieldChange(setSolarPower)} />
          <LabeledInput label="Total fuel-cell power usage [kWh]" value={fuelCellPower} onChange={handleFieldChange(setFuelCellPower)} />
        </div>
      </FormSection>

      {/* Engine Usage */}
      <FormSection
        title="Engine Usage"
        description="Engine operating data including load, fuel consumption, and emissions per engine during the port call."
        action={
          engines.length > 0 ? (
            <button
              onClick={() => {/* pilot fuel rows are always shown */}}
              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-border bg-white text-xs font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
            >
              Add pilot fuel
              <Plus className="w-3.5 h-3.5" />
            </button>
          ) : undefined
        }
      >
        {engines.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Select a ship to populate engine data.</p>
        ) : (
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] pl-3">Engine ID</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Engine Type</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Avg. load [kW]</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Running h</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Power prod. [kWh]</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Fuel type</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Fuel cons. [kg]</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Biofuel bl...</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Sulphur content [%]</th>
                </tr>
              </thead>
              <tbody>
                {engines.map((eng, i) => (
                  <>
                    <tr key={eng.id} className={i < engines.length - 1 ? "border-b border-[#e5e7eb]" : ""}>
                      <td className="py-4 px-2 pl-3">
                        <div className="h-10 px-4 rounded-lg bg-[#f3f4f6] text-sm text-muted-foreground flex items-center">{eng.engineId}</div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="h-10 px-4 rounded-lg bg-[#f3f4f6] text-sm text-muted-foreground flex items-center">{eng.engineType}</div>
                      </td>
                      <td className="py-4 px-2">
                        <Input value={eng.avgLoad} onChange={(e) => updateEngine(eng.id, "avgLoad", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                      </td>
                      <td className="py-4 px-2">
                        <Input value={eng.runningH} onChange={(e) => updateEngine(eng.id, "runningH", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                      </td>
                      <td className="py-4 px-2">
                        <Input value={eng.powerProduction} onChange={(e) => updateEngine(eng.id, "powerProduction", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                      </td>
                      <td className="py-4 px-2">
                        <SelectField value={eng.fuelType} onChange={(v) => updateEngine(eng.id, "fuelType", v)} options={fuelTypes} className="w-full" />
                      </td>
                      <td className="py-4 px-2">
                        <Input value={eng.fuelConsumption} onChange={(e) => updateEngine(eng.id, "fuelConsumption", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                      </td>
                      <td className="py-4 px-2">
                        <Input value={eng.biofuelBlend} onChange={(e) => updateEngine(eng.id, "biofuelBlend", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                      </td>
                      <td className="py-4 px-2">
                        <Input value={eng.sulphurContent} onChange={(e) => updateEngine(eng.id, "sulphurContent", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                      </td>
                    </tr>
                    {/* Pilot fuel sub-row */}
                    <tr key={`${eng.id}-pilot`} className={cn("bg-[#fafbfc]", i < engines.length - 1 ? "border-b border-[#e5e7eb]" : "")}>
                      <td className="py-4 px-2 pl-3">
                        <span className="text-sm text-muted-foreground inline-flex items-center gap-1">↳ Pilot fuel</span>
                      </td>
                      <td className="py-4 px-2"><span className="text-sm text-muted-foreground">-</span></td>
                      <td className="py-4 px-2"><span className="text-sm text-muted-foreground">-</span></td>
                      <td className="py-4 px-2"><span className="text-sm text-muted-foreground">-</span></td>
                      <td className="py-4 px-2"><span className="text-sm text-muted-foreground">-</span></td>
                      <td className="py-4 px-2">
                        <SelectField value={eng.pilotFuelType} onChange={(v) => updateEngine(eng.id, "pilotFuelType", v)} options={fuelTypes} className="w-full" />
                      </td>
                      <td className="py-4 px-2">
                        <Input value={eng.pilotFuelConsumption} onChange={(e) => updateEngine(eng.id, "pilotFuelConsumption", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                      </td>
                      <td className="py-4 px-2">
                        <Input value={eng.pilotBiofuelBlend} onChange={(e) => updateEngine(eng.id, "pilotBiofuelBlend", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                      </td>
                      <td className="py-4 px-2">
                        <Input value={eng.pilotSulphurContent} onChange={(e) => updateEngine(eng.id, "pilotSulphurContent", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FormSection>

      {/* Boiler Usage */}
      <FormSection
        title="Boiler Usage"
        description="Boiler operating data including fuel type, consumption, and heating values during the port call."
      >
        {boilers.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Select a ship to populate boiler data.</p>
        ) : (
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] pl-3">Boiler ID</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Running hours [h]</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Fuel type</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Fuel consumption [kg]</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Electrical consumptio...</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Biofuel blend [%]</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Sulphur content [%]</th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Fuel WTT Emission Factor</th>
                </tr>
              </thead>
              <tbody>
                {boilers.map((b, i) => (
                  <tr key={b.id} className={i < boilers.length - 1 ? "border-b border-[#e5e7eb]" : ""}>
                    <td className="py-4 px-2 pl-3">
                      <div className="h-10 px-4 rounded-lg bg-[#f3f4f6] text-sm text-muted-foreground flex items-center">{b.boilerId}</div>
                    </td>
                    <td className="py-4 px-2">
                      <Input value={b.runningH} onChange={(e) => updateBoiler(b.id, "runningH", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                    </td>
                    <td className="py-4 px-2">
                      <SelectField value={b.fuelType} onChange={(v) => updateBoiler(b.id, "fuelType", v)} options={fuelTypes} className="w-full" />
                    </td>
                    <td className="py-4 px-2">
                      <Input value={b.fuelConsumption} onChange={(e) => updateBoiler(b.id, "fuelConsumption", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                    </td>
                    <td className="py-4 px-2">
                      <Input value={b.electricalConsumption} onChange={(e) => updateBoiler(b.id, "electricalConsumption", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                    </td>
                    <td className="py-4 px-2">
                      <Input value={b.biofuelBlend} onChange={(e) => updateBoiler(b.id, "biofuelBlend", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                    </td>
                    <td className="py-4 px-2">
                      <Input value={b.sulphurContent} onChange={(e) => updateBoiler(b.id, "sulphurContent", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                    </td>
                    <td className="py-4 px-2">
                      <Input value={b.fuelWttEmissionFactor} onChange={(e) => updateBoiler(b.id, "fuelWttEmissionFactor", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FormSection>

      {/* SOx Reduction */}
      <FormSection
        title="SOx Reduction"
        description="SOx abatement technologies and scrubber usage data per engine and boiler."
        action={
          <button
            onClick={() => { setSoxRows((prev) => [...prev, emptySox()]); markChanged(); }}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-border bg-white text-xs font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
          >
            Add +
          </button>
        }
      >
        <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] pl-3">Engine ID</th>
                <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Engine Type / Boiler</th>
                <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Type of SOx reduction</th>
                <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Avg SO2/CO2 ratio</th>
                <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Scrubber duration [h]</th>
                <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Avg discharge flow [m3/h]</th>
                <th className="w-10 h-10 bg-[#F3F4F6]" />
              </tr>
            </thead>
            <tbody>
              {soxRows.map((s, i) => (
                <tr key={s.id} className={i < soxRows.length - 1 ? "border-b border-[#e5e7eb]" : ""}>
                  <td className="py-4 px-2 pl-3">
                    <Input value={s.engineId} onChange={(e) => updateSox(s.id, "engineId", e.target.value)} placeholder="M-1" className="h-10 rounded-lg" />
                  </td>
                  <td className="py-4 px-2">
                    <SelectField value={s.engineType} onChange={(v) => updateSox(s.id, "engineType", v)} options={["Main", "Auxiliary", "Boiler"]} className="w-full" />
                  </td>
                  <td className="py-4 px-2">
                    <SelectField value={s.soxReductionType} onChange={(v) => updateSox(s.id, "soxReductionType", v)} options={soxReductionTypes} className="w-full" />
                  </td>
                  <td className="py-4 px-2">
                    <Input value={s.avgSo2Co2Ratio} onChange={(e) => updateSox(s.id, "avgSo2Co2Ratio", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                  </td>
                  <td className="py-4 px-2">
                    <Input value={s.scrubberDuration} onChange={(e) => updateSox(s.id, "scrubberDuration", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                  </td>
                  <td className="py-4 px-2">
                    <Input value={s.avgDischargeFlow} onChange={(e) => updateSox(s.id, "avgDischargeFlow", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                  </td>
                  <td className="py-4 px-2">
                    {soxRows.length > 1 && (
                      <button onClick={() => { setSoxRows((prev) => prev.filter((x) => x.id !== s.id)); markChanged(); }} className="text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>

      {/* NOx Reduction */}
      <FormSection
        title="NOx Reduction"
        description="NOx abatement technologies and emission reduction data per engine."
        action={
          <button
            onClick={() => { setNoxRows((prev) => [...prev, emptyNox()]); markChanged(); }}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-border bg-white text-xs font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
          >
            Add +
          </button>
        }
      >
        <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6] pl-3">Engine ID</th>
                <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Engine Type / Boiler</th>
                <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Type of NOx reduction</th>
                <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Avg effective NOx [g/kWh]</th>
                <th className="text-left text-xs font-normal text-muted-foreground px-2 h-10 bg-[#F3F4F6]">Share of time with tech active</th>
                <th className="w-10 h-10 bg-[#F3F4F6]" />
              </tr>
            </thead>
            <tbody>
              {noxRows.map((n, i) => (
                <tr key={n.id} className={i < noxRows.length - 1 ? "border-b border-[#e5e7eb]" : ""}>
                  <td className="py-4 px-2 pl-3">
                    <Input value={n.engineId} onChange={(e) => updateNox(n.id, "engineId", e.target.value)} placeholder="M-1" className="h-10 rounded-lg" />
                  </td>
                  <td className="py-4 px-2">
                    <SelectField value={n.engineType} onChange={(v) => updateNox(n.id, "engineType", v)} options={["Main", "Auxiliary", "Boiler"]} className="w-full" />
                  </td>
                  <td className="py-4 px-2">
                    <SelectField value={n.noxReductionType} onChange={(v) => updateNox(n.id, "noxReductionType", v)} options={noxReductionTypes} className="w-full" />
                  </td>
                  <td className="py-4 px-2">
                    <Input value={n.avgNoxEmission} onChange={(e) => updateNox(n.id, "avgNoxEmission", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                  </td>
                  <td className="py-4 px-2">
                    <Input value={n.shareTimeActive} onChange={(e) => updateNox(n.id, "shareTimeActive", e.target.value)} placeholder="-" className="h-10 rounded-lg text-right" />
                  </td>
                  <td className="py-4 px-2">
                    {noxRows.length > 1 && (
                      <button onClick={() => { setNoxRows((prev) => prev.filter((x) => x.id !== n.id)); markChanged(); }} className="text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>

      {/* Floating save bar */}
      <UnsavedChangesBar
        hasChanges={hasChanges}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
}
