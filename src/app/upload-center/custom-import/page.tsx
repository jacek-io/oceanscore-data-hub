"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CloudUpload,
  ArrowLeft,
  Droplets,
  Zap,
  Ship,
  Fan,
  Check,
  ChevronDown,
  ArrowUpDown,
  ArrowRight,
  Trash2,
  CircleCheck,
  ClipboardList,
  Loader2,
  FileText,
  AlertCircle,
  Download,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { number: 1, label: "Data type" },
  { number: 2, label: "Upload file" },
  { number: 3, label: "Map columns" },
  { number: 4, label: "Match values" },
  { number: 5, label: "Formats" },
  { number: 6, label: "Validation" },
];

const dataTypes = [
  {
    id: "bdn",
    title: "Bunker Delivery",
    subtitle: "BDN",
    description:
      "Fuel deliveries: quantity, fuel type, sulphur content, and supplier.",
    icon: Droplets,
  },
  {
    id: "edn",
    title: "Energy Delivery",
    subtitle: "EDN",
    description:
      "Shore power consumption and renewable energy generation.",
    icon: Zap,
  },
  {
    id: "ship-master",
    title: "Ship Master Data",
    subtitle: "",
    description:
      "Core vessel details: IMO number, ship type, tonnage, and specs.",
    icon: Ship,
  },
  {
    id: "engines",
    title: "Engines",
    subtitle: "",
    description:
      "Technical data per engine: type, rated power, and NOx tier.",
    icon: Fan,
  },
];

const previewColumns = [
  "Source system",
  "IMO",
  "BDN Number",
  "Bunker Delivery Date",
  "Bunker Port",
  "Fuel type",
  "Mass",
  "Sulphur Content",
];

const previewRows = [
  ["Veson IMOS", "9412345", "BDN-2026-0143", "2026-03-14", "Rotterdam", "HFO", "842.5", "0.48"],
  ["Veson IMOS", "9412345", "BDN-2026-0143", "2026-03-21", "Singapore", "MGO", "310.0", "-"],
  ["Veson IMOS", "9509876", "BDN-2026-0143", "2026-04-02", "Hamburg", "LNG", "512.8", "-"],
];

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="bg-white rounded-[16px] p-4">
      <div className="flex items-center">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className="flex items-center flex-1 last:flex-none"
          >
            <div className="flex items-center gap-2">
              {step.number < currentStep ? (
                <div className="w-6 h-6 rounded-full bg-[#e3f0db] border border-[#d0e5c3] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-[#5C8A3E]" />
                </div>
              ) : (
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0",
                    step.number === currentStep
                      ? "bg-[#061e3a] text-white"
                      : "bg-[#f3f4f6] border border-border text-muted-foreground"
                  )}
                >
                  {step.number}
                </div>
              )}
              <span
                className={cn(
                  "text-[12px] whitespace-nowrap font-medium",
                  step.number === currentStep
                    ? "text-[#061e3a]"
                    : step.number < currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-4 border-t border-dashed border-[#d1d5dc]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepDataType({
  selected,
  onSelect,
  onContinue,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="bg-white rounded-[16px] p-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
          What kind of data are you uploading?
        </h2>
        <p className="text-sm text-muted-foreground tracking-[-0.14px]">
          Pick one data type. The next steps adapt to the fields this type
          requires.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {dataTypes.map((dt) => {
          const Icon = dt.icon;
          const isSelected = selected === dt.id;
          return (
            <button
              key={dt.id}
              onClick={() => onSelect(dt.id)}
              className={cn(
                "rounded-[16px] border py-4 px-4 flex items-center gap-2 text-left transition-colors",
                isSelected
                  ? "border-[#1157b2] bg-[#ebf3ff]"
                  : "border-border bg-white hover:bg-[#fafbfc]"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                isSelected ? "bg-white" : "bg-[#f3f4f6]"
              )}>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-foreground">
                    {dt.title}
                    {dt.subtitle && ` (${dt.subtitle})`}
                  </span>
                  <div
                    className={cn(
                      "w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0",
                      isSelected
                        ? "bg-[#1157b2]"
                        : "border-[1.5px] border-[#d1d5dc]"
                    )}
                  >
                    {isSelected && (
                      <div className="w-[7px] h-[7px] rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <p className="text-[12px] text-muted-foreground leading-normal">
                  {dt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-4">
        <span className="text-[12px] text-muted-foreground">
          {selected
            ? "Press Continue to proceed"
            : "Select a data type to continue"}
        </span>
        <button
          disabled={!selected}
          onClick={onContinue}
          className={cn(
            "inline-flex items-center justify-center h-10 px-3 py-2.5 rounded-lg text-sm font-normal transition-colors",
            selected
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-[#e5e7eb] text-[#98a1ae] cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function PreviewTable() {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[12px] font-medium text-muted-foreground">
        Preview – First 3 rows
      </span>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              {previewColumns.map((col, i) => (
                <th
                  key={col}
                  className={cn(
                    "text-left text-[12px] font-normal text-muted-foreground px-4 h-10 bg-[#f3f4f6]",
                    i === 0 && "rounded-tl-lg",
                    i === previewColumns.length - 1 && "rounded-tr-lg"
                  )}
                >
                  <span className="flex items-center gap-1">
                    {col}
                    {i === 0 && (
                      <ArrowUpDown className="w-3.5 h-3.5 text-[#D1D5DC]" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, ri) => (
              <tr
                key={ri}
                className={cn(
                  ri < previewRows.length - 1 &&
                    "border-b border-border"
                )}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      "px-4 h-14 text-sm",
                      cell === "-"
                        ? "text-[#98a1ae]"
                        : "text-foreground"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const MOCK_FILENAME = "bunker_deliveries_2026.xlsx";
const MOCK_FILESIZE = "124 KB";

function StepUploadFile({
  onBack,
  onContinue,
  onFileUploaded,
}: {
  onBack: () => void;
  onContinue: () => void;
  onFileUploaded: (filename: string | null) => void;
}) {
  const [uploaded, setUploaded] = useState(false);
  const [headerRow, setHeaderRow] = useState(1);
  const [headerRowInput, setHeaderRowInput] = useState("1");

  const handleMockUpload = () => {
    setUploaded(true);
    onFileUploaded(MOCK_FILENAME);
  };

  const handleRemove = () => {
    setUploaded(false);
    onFileUploaded(null);
  };

  return (
    <div className="bg-white rounded-[16px] p-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
          Upload your file
        </h2>
        <p className="text-sm text-muted-foreground tracking-[-0.14px]">
          CSV or Excel (.csv, .xlsx) up to 20 MB. The first row should contain
          your column names.
        </p>
      </div>

      {uploaded ? (
        <>
          {/* Completed file item */}
          <div className="bg-[#f3f4f6] border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-[43px] h-[43px] rounded-lg bg-[#f3f4f6] flex items-center justify-center shrink-0">
                <Image
                  src="/file-icon.svg"
                  alt="File"
                  width={22}
                  height={26}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">
                  {MOCK_FILENAME}
                </span>
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <span>{MOCK_FILESIZE}</span>
                  <span className="tracking-[1px]">&bull;</span>
                  <div className="flex items-center gap-1">
                    <CircleCheck className="w-4 h-4 text-[#5C8A3E]" />
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="w-8 h-8 flex items-center justify-center shrink-0 hover:bg-[#ebf3ff] active:bg-[#cce1ff] rounded transition-colors"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Header row selector */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground whitespace-nowrap">
              Header is in row:
            </label>
            <input
              type="number"
              min={1}
              value={headerRowInput}
              onChange={(e) => setHeaderRowInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = parseInt(headerRowInput, 10);
                  if (val >= 1) setHeaderRow(val);
                }
              }}
              className="w-[72px] h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => {
                const val = parseInt(headerRowInput, 10);
                if (val >= 1) setHeaderRow(val);
              }}
              className="inline-flex items-center justify-center h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
            >
              Use this row
            </button>
            {headerRow > 1 && (
              <span className="text-[12px] text-muted-foreground">
                Skipping {headerRow - 1} row{headerRow > 2 ? "s" : ""} before header
              </span>
            )}
          </div>

          {/* Preview table */}
          <PreviewTable />
        </>
      ) : (
        /* Drop zone — clicking anywhere triggers mock upload */
        <button
          onClick={handleMockUpload}
          className="border border-dashed border-[#98a1ae] rounded-[16px] bg-[#f3f4f6] h-[240px] flex flex-col items-center justify-center gap-4 transition-colors hover:border-primary hover:bg-[#f0f6ff] cursor-pointer w-full"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <CloudUpload className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground tracking-[-0.54px]">
            Drop your files here
          </h3>
          <p className="text-sm text-muted-foreground text-center leading-[1.45]">
            CSV or Excel (.csv, .xlsx) up to 20 MB.
            <br />
            The first row should contain your column names.
          </p>
          <span className="inline-flex items-center gap-2 h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground">
            Browse Files
          </span>
        </button>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
        >
          Back
        </button>
        <div className="flex items-center gap-4">
          {!uploaded && (
            <span className="text-[12px] text-muted-foreground">
              Upload a file to continue
            </span>
          )}
          <button
            disabled={!uploaded}
            onClick={onContinue}
            className={cn(
              "inline-flex items-center justify-center h-10 px-3 py-2.5 rounded-lg text-sm font-normal transition-colors",
              uploaded
                ? "bg-[#061e3a] text-white hover:bg-[#0c3c7a] active:bg-[#1157b2]"
                : "bg-[#e5e7eb] text-[#98a1ae] cursor-not-allowed"
            )}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

interface OceanScoreField {
  key: string;
  label: string;
  required: boolean;
}

const oceanScoreFieldList: OceanScoreField[] = [
  { key: "imo", label: "IMO", required: true },
  { key: "bdn_number", label: "BDN number", required: true },
  { key: "delivery_date", label: "Delivery date", required: true },
  { key: "bunker_port", label: "Bunker port", required: true },
  { key: "fuel_type", label: "Fuel type", required: true },
  { key: "sulphur_content_pct", label: "Sulphur content (%)", required: true },
  { key: "mass", label: "Mass", required: true },
  { key: "lower_heating_value", label: "Lower heating value", required: false },
  { key: "higher_heating_value", label: "Higher heating value", required: false },
  { key: "source_system", label: "Source system", required: false },
  { key: "last_updated", label: "Last updated", required: false },
  { key: "used_by_bdn", label: "Used by BDN", required: false },
  { key: "coming_from_bdn", label: "Coming from BDN", required: false },
  { key: "delivery_time", label: "Delivery time", required: false },
  { key: "fuel_pathway_code", label: "Fuel pathway code", required: false },
  { key: "sustainability", label: "Sustainability", required: false },
  { key: "eu_ghg_intensity", label: "EU GHG intensity", required: false },
  { key: "imo_ghg_intensity", label: "IMO GHG intensity", required: false },
  { key: "eu_lower_calorific_value", label: "EU lower calorific value", required: false },
  { key: "fll_energy_share", label: "FLL energy share", required: false },
];

interface SourceColumn {
  name: string;
  example: string;
}

const sourceColumns: SourceColumn[] = [
  { name: "Source System", example: "Veson IMOS" },
  { name: "Last Updated", example: "2026-06-12" },
  { name: "IMO", example: "9412345" },
  { name: "BDN Number", example: "BDN-2026-0141" },
  { name: "Used By BDN", example: "-" },
  { name: "Coming From BDN", example: "-" },
  { name: "Bunker Delivery Date", example: "2026-03-14" },
  { name: "Bunker Delivery Time", example: "14:20" },
  { name: "Bunker Port", example: "Rotterdam" },
  { name: "Fuel Type", example: "HFO" },
  { name: "IMO Fuel Pathway Code", example: "FP-01" },
  { name: "Sustainability", example: "-" },
  { name: "Mass", example: "842.5" },
  { name: "Lower Heating Value", example: "40.2" },
  { name: "Higher Heating Value", example: "42.7" },
  { name: "EU GHG Intensity", example: "91.4" },
  { name: "IMO GHG Intensity", example: "93.3" },
  { name: "EU Lower Calorific Value", example: "0.0405" },
  { name: "FLL Energy Share", example: "0" },
  { name: "Sulphur Content", example: "0.48" },
];

const autoMatchMap: Record<string, string> = {
  imo: "IMO",
  bdn_number: "BDN Number",
  delivery_date: "Bunker Delivery Date",
  bunker_port: "Bunker Port",
  fuel_type: "Fuel Type",
  sulphur_content_pct: "Sulphur Content",
  mass: "Mass",
};

function StepMapColumns({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const [mappings, setMappings] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const field of oceanScoreFieldList) {
      init[field.key] = autoMatchMap[field.key] || "";
    }
    return init;
  });

  const [autoMatched] = useState<Set<string>>(() => new Set(Object.keys(autoMatchMap)));
  const [fixedValues, setFixedValues] = useState<Record<string, string>>({});
  const [fixedMode, setFixedMode] = useState<Set<string>>(new Set());

  const requiredFields = oceanScoreFieldList.filter((f) => f.required);
  const optionalFields = oceanScoreFieldList.filter((f) => !f.required);
  const isMappedOrFixed = (key: string) => mappings[key] !== "" || (fixedMode.has(key) && fixedValues[key]?.trim() !== "");
  const mappedRequired = requiredFields.filter((f) => isMappedOrFixed(f.key));
  const missingRequired = requiredFields.filter((f) => !isMappedOrFixed(f.key));
  const allRequiredMapped = missingRequired.length === 0;

  const usedSourceColumns = new Set(Object.values(mappings).filter(Boolean));

  const handleChange = (fieldKey: string, sourceCol: string) => {
    setMappings((prev) => ({ ...prev, [fieldKey]: sourceCol }));
  };

  const getSourceExample = (sourceName: string) => {
    return sourceColumns.find((s) => s.name === sourceName)?.example || "";
  };

  const enableFixedMode = (fieldKey: string) => {
    setFixedMode((prev) => new Set(prev).add(fieldKey));
    setMappings((prev) => ({ ...prev, [fieldKey]: "" }));
  };

  const disableFixedMode = (fieldKey: string) => {
    setFixedMode((prev) => {
      const next = new Set(prev);
      next.delete(fieldKey);
      return next;
    });
    setFixedValues((prev) => ({ ...prev, [fieldKey]: "" }));
  };

  const renderRow = (field: OceanScoreField) => {
    const isFixed = fixedMode.has(field.key);
    const fixedVal = fixedValues[field.key] || "";
    const isMapped = isFixed ? fixedVal.trim() !== "" : mappings[field.key] !== "";
    const isAutoMatched = !isFixed && isMapped && autoMatched.has(field.key);
    const isMissingRequired = field.required && !isMapped;

    return (
      <div key={field.key} className="flex flex-col gap-2">
        <div className="grid grid-cols-[1fr_32px_1fr] items-center">
          {/* OceanScore field (left) */}
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg border",
              isMapped
                ? "bg-[#f0faf0] border-[#d0e5c3]"
                : isMissingRequired
                ? "bg-[#fef2f2] border-[#fecaca]"
                : "bg-[#f9fafb] border-border"
            )}
          >
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium",
                isMapped
                  ? "bg-[#e3f0db] text-[#3d6b24]"
                  : "bg-[#e5e7eb] text-foreground"
              )}
            >
              {field.label}
              {field.required && " *"}
            </span>
            {isMapped && !isFixed && (
              <span className="text-[12px] text-muted-foreground">
                e.g. {getSourceExample(mappings[field.key])}
              </span>
            )}
            {isFixed && fixedVal.trim() && (
              <span className="text-[12px] text-muted-foreground">
                = {fixedVal} for all rows
              </span>
            )}
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Source column dropdown or fixed value input (right) */}
          <div className="flex items-center gap-2">
            {isFixed ? (
              <div className="relative flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={fixedVal}
                  onChange={(e) => setFixedValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={`Enter ${field.label} number`}
                  className={cn(
                    "w-full h-10 pl-4 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary",
                    fixedVal.trim()
                      ? "bg-[#ebf3ff] border-[#AFD0FF] text-[#1157b2] font-medium"
                      : "bg-white border-[#fecaca]"
                  )}
                />
                <button
                  onClick={() => disableFixedMode(field.key)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="relative flex-1">
                <select
                  value={mappings[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className={cn(
                    "w-full h-10 pl-4 pr-10 rounded-lg border text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary",
                    isMapped
                      ? "bg-[#ebf3ff] border-[#AFD0FF] text-[#1157b2] font-medium"
                      : isMissingRequired
                      ? "bg-white border-[#fecaca] text-muted-foreground"
                      : "bg-white border-border text-muted-foreground"
                  )}
                >
                  <option value="">- not mapped -</option>
                  {sourceColumns.map((sc) => (
                    <option
                      key={sc.name}
                      value={sc.name}
                      disabled={usedSourceColumns.has(sc.name) && mappings[field.key] !== sc.name}
                    >
                      {sc.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            )}
            {isAutoMatched ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium text-[#3d6b24] bg-[#e3f0db] border border-[#d0e5c3] whitespace-nowrap shrink-0">
                Auto-matched
              </span>
            ) : isFixed && fixedVal.trim() ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium text-[#1157b2] bg-[#ebf3ff] border border-[#cce1ff] whitespace-nowrap shrink-0">
                Fixed value
              </span>
            ) : (
              <div className="w-[97px] shrink-0" />
            )}
          </div>
        </div>

        {/* Fixed value hint — show when IMO is unmapped and not in fixed mode */}
        {field.key === "imo" && !isMapped && !isFixed && (
          <div className="grid grid-cols-[1fr_32px_1fr] items-center">
            <div />
            <div />
            <button
              onClick={() => enableFixedMode("imo")}
              className="text-[12px] text-[#1157b2] hover:text-[#0c3c7a] text-left transition-colors"
            >
              No IMO column? Apply a single value to all rows →
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[16px] p-4 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
          Map your columns
        </h2>
        <p className="text-sm text-muted-foreground tracking-[-0.14px]">
          For each OceanScore field, pick the matching column from your file.
          We&apos;ve pre-matched the ones we recognized.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-[#f9fafb] rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground">
            <span className="font-medium">{mappedRequired.length} of {requiredFields.length}</span>{" "}
            <span className="text-muted-foreground">required fields mapped</span>
          </p>
          {missingRequired.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Still missing:{" "}
              <span className="font-medium text-foreground">
                {missingRequired.map((f) => f.label).join(", ")}
              </span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {requiredFields.map((rf) => (
            <div
              key={rf.key}
              className={cn(
                "flex-1 h-2 rounded-full",
                mappings[rf.key] !== "" ? "bg-[#5C8A3E]" : "bg-[#d1d5dc]"
              )}
            />
          ))}
        </div>
      </div>

      {/* Required fields */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-[1fr_32px_1fr] items-center">
          <span className="text-[12px] text-muted-foreground">
            OceanScore fields · required
          </span>
          <div />
          <span className="text-[12px] text-muted-foreground">
            Your file · {sourceColumns.length} columns
          </span>
        </div>
        {requiredFields.map(renderRow)}
      </div>

      {/* Optional fields */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-[1fr_32px_1fr] items-center">
          <span className="text-[12px] text-muted-foreground">
            Optional fields
          </span>
          <div />
          <div />
        </div>
        {optionalFields.map(renderRow)}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
        >
          Back
        </button>
        <div className="flex items-center gap-4">
          {!allRequiredMapped && (
            <span className="text-[12px] text-muted-foreground">
              Map all required fields (*) to continue
            </span>
          )}
          <button
            disabled={!allRequiredMapped}
            onClick={onContinue}
            className={cn(
              "inline-flex items-center justify-center h-10 px-3 py-2.5 rounded-lg text-sm font-normal transition-colors",
              allRequiredMapped
                ? "bg-[#061e3a] text-white hover:bg-[#0c3c7a] active:bg-[#1157b2]"
                : "bg-[#e5e7eb] text-[#98a1ae] cursor-not-allowed"
            )}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

interface ValueMapping {
  fileValue: string;
  rowCount: number;
  osValue: string;
  suggested: boolean;
}

const oceanScoreValues = [
  "- choose value -",
  "Fossil HFO",
  "Fossil MDO/MGO",
  "Fossil LNG",
  "BioDiesel",
  "BioLNG",
  "eDiesel",
  "eMethanol",
  "eHydrogen",
  "Fossil Blend",
  "Other",
];

const initialValueMappings: ValueMapping[] = [
  { fileValue: "HFO", rowCount: 412, osValue: "Fossil HFO", suggested: true },
  { fileValue: "MGO", rowCount: 305, osValue: "Fossil MDO/MGO", suggested: true },
  { fileValue: "LNG", rowCount: 198, osValue: "Fossil LNG", suggested: true },
  { fileValue: "Blend", rowCount: 104, osValue: "- choose value -", suggested: false },
  { fileValue: "FAME", rowCount: 86, osValue: "BioDiesel", suggested: true },
  { fileValue: "MDO", rowCount: 71, osValue: "Fossil MDO/MGO", suggested: true },
  { fileValue: "LBG", rowCount: 38, osValue: "BioLNG", suggested: true },
  { fileValue: "eMGO", rowCount: 26, osValue: "eDiesel", suggested: true },
];

function StepMatchValues({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const [mappings, setMappings] = useState<ValueMapping[]>(initialValueMappings);

  const unmatchedCount = mappings.filter(
    (m) => m.osValue === "- choose value -"
  ).length;
  const allMatched = unmatchedCount === 0;

  const handleChange = (index: number, value: string) => {
    setMappings((prev) =>
      prev.map((m, i) =>
        i === index ? { ...m, osValue: value, suggested: false } : m
      )
    );
  };

  return (
    <div className="bg-white rounded-[16px] p-4 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
          Match your values
        </h2>
        <p className="text-sm text-muted-foreground tracking-[-0.14px]">
          Some values in your file are named differently than in OceanScore.
          Match each one so we can read your data correctly, suggested matches
          are pre-filled.
        </p>
      </div>

      {/* Field tag */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded text-[12px] font-medium bg-[#f3f4f6] text-foreground border border-border">
          fuel_type
        </span>
        <span className="text-sm text-muted-foreground">
          {mappings.length} distinct values found in column &quot;Fuel Type&quot;
        </span>
      </div>

      {/* Value mappings */}
      <div className="flex flex-col gap-3">
        {/* Labels */}
        <div className="flex items-center">
          <div className="flex-1">
            <span className="text-[12px] text-muted-foreground">
              Values in your file
            </span>
          </div>
          <div className="w-8" />
          <div className="flex-1 pl-4">
            <span className="text-[12px] text-muted-foreground">
              OceanScore values
            </span>
          </div>
        </div>

        {/* Mapping rows */}
        {mappings.map((mapping, i) => {
          const isMapped = mapping.osValue !== "- choose value -";
          return (
            <div key={i} className="flex items-center gap-0">
              {/* Source value */}
              <div
                className={cn(
                  "flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border",
                  isMapped
                    ? "bg-[#f0faf0] border-[#d0e5c3]"
                    : "bg-[#fef2f2] border-[#fecaca]"
                )}
              >
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium",
                    isMapped
                      ? "bg-[#e3f0db] text-[#3d6b24]"
                      : "bg-[#e5e7eb] text-foreground"
                  )}
                >
                  &quot;{mapping.fileValue}&quot;
                </span>
                <span className="text-[12px] text-muted-foreground">
                  {mapping.rowCount} rows
                </span>
              </div>

              {/* Arrow */}
              <div className="w-8 flex items-center justify-center shrink-0">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>

              {/* Target dropdown */}
              <div className="flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <select
                    value={mapping.osValue}
                    onChange={(e) => handleChange(i, e.target.value)}
                    className={cn(
                      "w-full h-10 pl-4 pr-10 rounded-lg border text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary",
                      isMapped
                        ? "bg-[#ebf3ff] border-[#AFD0FF] text-[#1157b2] font-medium"
                        : "bg-white border-[#fecaca] text-muted-foreground"
                    )}
                  >
                    {oceanScoreValues.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                {isMapped && mapping.suggested ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium text-[#3d6b24] bg-[#e3f0db] border border-[#d0e5c3] whitespace-nowrap">
                    Suggested
                  </span>
                ) : !isMapped ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] whitespace-nowrap">
                    Needs match
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
        >
          Back
        </button>
        <div className="flex items-center gap-4">
          {!allMatched && (
            <span className="text-[12px] text-muted-foreground">
              {unmatchedCount} value{unmatchedCount > 1 ? "s" : ""} still need
              {unmatchedCount === 1 ? "s" : ""} a match
            </span>
          )}
          <button
            disabled={!allMatched}
            onClick={onContinue}
            className={cn(
              "inline-flex items-center justify-center h-10 px-3 py-2.5 rounded-lg text-sm font-normal transition-colors",
              allMatched
                ? "bg-[#061e3a] text-white hover:bg-[#0c3c7a] active:bg-[#1157b2]"
                : "bg-[#e5e7eb] text-[#98a1ae] cursor-not-allowed"
            )}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

const dateFormats = [
  { value: "YYYY-MM-DD", example: "2026-03-14" },
  { value: "DD/MM/YYYY", example: "14/03/2026" },
  { value: "MM/DD/YYYY", example: "03/14/2026" },
  { value: "DD.MM.YYYY", example: "14.03.2026" },
  { value: "DD-MMM-YYYY", example: "14-Mar-2026" },
];

const decimalSeparators = [
  { value: "period", label: ". (period)", example: "842.5" },
  { value: "comma", label: ", (comma)", example: "842,5" },
];

function StepFormats({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");
  const [decimalSep, setDecimalSep] = useState("period");

  const selectedDate = dateFormats.find((d) => d.value === dateFormat)!;
  const selectedDecimal = decimalSeparators.find((d) => d.value === decimalSep)!;

  return (
    <div className="bg-white rounded-[16px] p-4 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
          Confirm formats
        </h2>
        <p className="text-sm text-muted-foreground tracking-[-0.14px]">
          Tell us how dates and numbers are written in your file, so values are
          read exactly as you meant them.
        </p>
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-4">
        {/* Date format */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Date format
          </label>
          <div className="relative">
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full h-10 pl-4 pr-10 rounded-lg border border-[#AFD0FF] bg-[#ebf3ff] text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary text-[#1157b2] font-medium"
            >
              {dateFormats.map((df) => (
                <option key={df.value} value={df.value}>
                  {df.value} • {df.example}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <p className="text-[12px] text-muted-foreground">
            Detected from your file. Change it if the detection looks wrong.
          </p>
        </div>

        {/* Decimal separator */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Decimal separator
          </label>
          <div className="relative">
            <select
              value={decimalSep}
              onChange={(e) => setDecimalSep(e.target.value)}
              className="w-full h-10 pl-4 pr-10 rounded-lg border border-[#AFD0FF] bg-[#ebf3ff] text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary text-[#1157b2] font-medium"
            >
              {decimalSeparators.map((ds) => (
                <option key={ds.value} value={ds.value}>
                  {ds.label} • {ds.example}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <p className="text-[12px] text-muted-foreground">
            Applies to all numeric columns, e.g. mass and sulphur content.
          </p>
        </div>
      </div>

      {/* Preview row */}
      <div className="bg-[#f9fafb] rounded-lg px-4 py-3 flex items-center gap-4">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          From your file
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded text-[12px] font-medium bg-white border border-border text-foreground">
          {selectedDate.example}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded text-[12px] font-medium bg-white border border-border text-foreground">
          {selectedDecimal.example}
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          <CircleCheck className="w-4 h-4 text-[#5C8A3E]" />
          <span className="text-[12px] text-[#5C8A3E] font-medium">
            Reads as March 14, 2026 · {selectedDecimal.example} t
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
        >
          Back
        </button>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
            <ClipboardList className="w-4 h-4" />
            Save Mapping for Next Time
          </button>
          <button
            onClick={onContinue}
            className="inline-flex items-center justify-center h-10 px-3 py-2.5 rounded-lg bg-[#061e3a] text-white text-sm font-normal hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors"
          >
            Continue to Validation
          </button>
        </div>
      </div>
    </div>
  );
}

const validationErrors = [
  { row: 2, field: "sulphur_content_pct", value: "empty", issue: "Required – add a value between 0 and 5" },
  { row: 3, field: "sulphur_content_pct", value: "empty", issue: "Required – add a value between 0 and 5" },
  { row: 5, field: "sulphur_content_pct", value: "empty", issue: "Required – add a value between 0 and 5" },
  { row: 6, field: "sulphur_content_pct", value: "empty", issue: "Required – add a value between 0 and 5" },
  { row: 8, field: "delivery_date", value: "31.02.2026", issue: "Not a valid date in format YYYY-MM-DD" },
  { row: 9, field: "mass_tonnes", value: "-42.0", issue: "Must be greater than 0" },
  { row: 10, field: "sulphur_content_pct", value: "empty", issue: "Required – add a value between 0 and 5" },
];

const errorSummary = [
  { label: "sulphur_content_pct missing", count: 639 },
  { label: "delivery_date invalid", count: 2 },
  { label: "mass_tonnes out of range", count: 1 },
];

function StepValidation({
  onBack,
}: {
  onBack: () => void;
}) {
  const [phase, setPhase] = useState<"loading" | "errors" | "reloading" | "clean" | "done">("loading");

  useEffect(() => {
    if (phase === "loading") {
      const timer = setTimeout(() => setPhase("errors"), 3000);
      return () => clearTimeout(timer);
    }
    if (phase === "reloading") {
      const timer = setTimeout(() => setPhase("clean"), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Loading state
  if (phase === "loading" || phase === "reloading") {
    return (
      <div className="bg-white rounded-[16px] p-4 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
            Validation Results
          </h2>
          <p className="text-sm text-muted-foreground tracking-[-0.14px]">
            We checked every row against your mapping automatically. Fix the
            issues in your source file and re-upload, or go back to adjust the
            mapping.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-[#061e3a] animate-spin" />
          <span className="text-sm text-muted-foreground">
            Validating 1,240 rows…
          </span>
        </div>
      </div>
    );
  }

  // Clean validation state
  if (phase === "clean") {
    return (
      <div className="bg-white rounded-[16px] p-4 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
            Validation Results
          </h2>
          <p className="text-sm text-muted-foreground tracking-[-0.14px]">
            We checked every row against your mapping automatically. Fix the
            issues in your source file and re-upload, or go back to adjust the
            mapping.
          </p>
        </div>

        {/* Success banner */}
        <div className="rounded-[16px] border border-[#d0e5c3] bg-[#f0faf0] py-10 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#e3f0db] flex items-center justify-center">
            <Check className="w-6 h-6 text-[#5C8A3E]" />
          </div>
          <h3 className="text-lg font-medium text-foreground tracking-[-0.54px]">
            All rows passed validation
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            1,240 of 1,240 rows in{" "}
            <span className="font-medium text-foreground">
              bunker_deliveries_2026_v2.xlsx
            </span>{" "}
            <br />
            are ready to import. Nothing left to fix.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-[16px] border border-border bg-white p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rows checked</span>
              <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <span className="text-[28px] font-medium text-foreground tracking-[-0.84px]">
              1,240
            </span>
          </div>
          <div className="rounded-[16px] border border-border bg-white p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rows ready to import</span>
              <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
                <Check className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <span className="text-[28px] font-medium text-[#5C8A3E] tracking-[-0.84px]">
              1,240
            </span>
          </div>
          <div className="rounded-[16px] border border-border bg-white p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Errors found</span>
              <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
                <Check className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <span className="text-[28px] font-medium text-foreground tracking-[-0.84px]">
              0
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => setPhase("done")}
            className="inline-flex items-center gap-2 h-10 px-4 py-2.5 rounded-lg bg-[#061e3a] text-white text-sm font-normal hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors"
          >
            Import 1,240 Rows
            <ArrowRight className="w-4 h-4 text-[#5b9aff]" />
          </button>
        </div>
      </div>
    );
  }

  // Done state
  if (phase === "done") {
    return (
      <div className="bg-white rounded-[16px] p-4 flex flex-col gap-8">
        <div className="rounded-[16px] border border-[#d0e5c3] bg-[#f0faf0] py-16 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#e3f0db] flex items-center justify-center">
            <Check className="w-7 h-7 text-[#5C8A3E]" />
          </div>
          <h3 className="text-xl font-medium text-foreground tracking-[-0.6px]">
            Import successful
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-[400px]">
            1,240 rows from{" "}
            <span className="font-medium text-foreground">
              bunker_deliveries_2026_v2.xlsx
            </span>{" "}
            have been imported into OceanScore.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <Link
            href="/upload-center"
            className="inline-flex items-center gap-2 h-10 px-4 py-2.5 rounded-lg bg-[#061e3a] text-white text-sm font-normal hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors"
          >
            Back to Upload Center
            <ArrowRight className="w-4 h-4 text-[#5b9aff]" />
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="bg-white rounded-[16px] p-4 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
          Validation Results
        </h2>
        <p className="text-sm text-muted-foreground tracking-[-0.14px]">
          We checked every row against your mapping automatically. Fix the
          issues in your source file and re-upload, or go back to adjust the
          mapping.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-[16px] border border-border bg-white p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rows checked</span>
            <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
              <FileText className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <span className="text-[28px] font-medium text-foreground tracking-[-0.84px]">
            1,240
          </span>
        </div>
        <div className="rounded-[16px] border border-border bg-white p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rows ready to import</span>
            <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
              <Check className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <span className="text-[28px] font-medium text-[#5C8A3E] tracking-[-0.84px]">
            598
          </span>
        </div>
        <div className="rounded-[16px] border border-[#fecaca] bg-[#fef2f2] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Errors found</span>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-[#dc2626]" />
            </div>
          </div>
          <span className="text-[28px] font-medium text-[#dc2626] tracking-[-0.84px]">
            642
          </span>
        </div>
      </div>

      {/* Most affected */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-muted-foreground">Most affected:</span>
        {errorSummary.map((e) => (
          <span
            key={e.label}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[36px] text-[12px] font-medium bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]"
          >
            {e.label}
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[11px] font-medium text-[#dc2626]">
              {e.count}
            </span>
          </span>
        ))}
      </div>

      {/* Error table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f9fafb]">
              <th className="text-left text-[12px] font-normal text-muted-foreground px-4 h-10 w-[72px]">
                Row
              </th>
              <th className="text-left text-[12px] font-normal text-muted-foreground px-4 h-10">
                Field
              </th>
              <th className="text-left text-[12px] font-normal text-muted-foreground px-4 h-10">
                Value
              </th>
              <th className="text-left text-[12px] font-normal text-muted-foreground px-4 h-10">
                Issue
              </th>
            </tr>
          </thead>
          <tbody>
            {validationErrors.map((err, i) => (
              <tr
                key={i}
                className={cn(
                  i < validationErrors.length - 1 && "border-b border-border"
                )}
              >
                <td className="px-4 h-14 text-sm text-foreground">{err.row}</td>
                <td className="px-4 h-14 text-sm">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-[#f3f4f6] text-foreground border border-border">
                    {err.field}
                  </span>
                </td>
                <td className="px-4 h-14 text-sm text-muted-foreground italic">
                  {err.value}
                </td>
                <td className="px-4 h-14 text-sm">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#dc2626] shrink-0" />
                    <span className="text-foreground">{err.issue}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* More rows link */}
      <p className="text-sm text-muted-foreground">
        + 635 more – download the full report to see every row.
      </p>

      {/* Warning banner */}
      <div className="rounded-lg bg-[#fef9ec] border border-[#f5e1a4] px-4 py-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#b45309] shrink-0 mt-0.5" />
        <p className="text-sm text-[#92400e]">
          <span className="font-medium">639 rows are missing sulphur content.</span>{" "}
          If your source system doesn&apos;t track it, add the values to the file
          and re-upload – your mapping is saved, so you&apos;ll skip straight to
          validation.
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
          >
            Back
          </button>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
              <Download className="w-4 h-4" />
              Download Error Report
            </button>
            <button
              onClick={() => setPhase("reloading")}
              className="inline-flex items-center gap-2 h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Fixed File
            </button>
            <button
              disabled
              className="inline-flex items-center justify-center h-10 px-3 py-2.5 rounded-lg bg-[#e5e7eb] text-[#98a1ae] text-sm font-normal cursor-not-allowed"
            >
              Import 1,240 Rows
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <span className="text-[12px] text-muted-foreground">
            Import unlocks once all errors are resolved.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CustomImportPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);

  const selectedLabel = dataTypes.find((dt) => dt.id === selectedType);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <div className="flex-1 flex flex-col px-5 pb-10">
        <div className="w-[1100px] max-w-full mx-auto flex flex-col gap-6">
          {/* Back + Title */}
          <div className="flex items-start gap-4 pt-4 pb-2">
            <Link
              href="/upload-center"
              className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center shrink-0 hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors mt-1"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex flex-col gap-2">
              <h1 className="text-[32px] font-medium text-foreground tracking-[-0.96px] leading-[1.2]">
                Custom File Import
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground tracking-[-0.14px] leading-[1.2]">
                  {currentStep === 1
                    ? "Match your file to OceanScore, one step at a time."
                    : `Importing ${selectedLabel?.subtitle || selectedLabel?.title} data${uploadedFilename ? " from" : ""}`}
                </p>
                {currentStep >= 2 && uploadedFilename && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-[#ebf3ff] text-[#092c54] border border-[#cce1ff]">
                    {uploadedFilename}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stepper */}
          <Stepper currentStep={currentStep} />

          {/* Step content */}
          {currentStep === 1 && (
            <StepDataType
              selected={selectedType}
              onSelect={setSelectedType}
              onContinue={() => selectedType && setCurrentStep(2)}
            />
          )}
          {currentStep === 2 && (
            <StepUploadFile
              onBack={() => setCurrentStep(1)}
              onContinue={() => setCurrentStep(3)}
              onFileUploaded={setUploadedFilename}
            />
          )}
          {currentStep === 3 && (
            <StepMapColumns
              onBack={() => setCurrentStep(2)}
              onContinue={() => setCurrentStep(4)}
            />
          )}
          {currentStep === 4 && (
            <StepMatchValues
              onBack={() => setCurrentStep(3)}
              onContinue={() => setCurrentStep(5)}
            />
          )}
          {currentStep === 5 && (
            <StepFormats
              onBack={() => setCurrentStep(4)}
              onContinue={() => setCurrentStep(6)}
            />
          )}
          {currentStep === 6 && (
            <StepValidation
              onBack={() => setCurrentStep(5)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
