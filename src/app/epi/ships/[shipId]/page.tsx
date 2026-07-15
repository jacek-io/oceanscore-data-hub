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

function EpiSemicircle({ score }: { score: number }) {
  const totalSegments = semicirclePaths.length;
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

function ReadOnlyTableSection({ title, description, columns, rows }: { title: string; description: string; columns: string[]; rows: string[][] }) {
  return (
    <div className="bg-white rounded-[16px] p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">{title}</h2>
          <p className="text-sm text-muted-foreground tracking-[-0.42px]">{description}</p>
        </div>
        <Link
          href="/fleet"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
        >
          <Pen className="w-5 h-5" />
          Edit in Data Hub
        </Link>
      </div>
      <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className="text-left text-xs font-normal text-muted-foreground px-3 h-10 bg-[#F3F4F6] whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i < rows.length - 1 ? "border-b border-[#e5e7eb]" : ""}>
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-3 text-sm text-foreground">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-white hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-[32px] font-medium text-foreground leading-[1.2] tracking-[-0.96px]">
                {data.ship} — {data.port}
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
          className="inline-flex items-center gap-2 h-10 px-3 py-2.5 rounded-lg bg-[#061e3a] text-sm font-normal text-white hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors"
        >
          <Database className="w-4 h-4 text-[#5b9aff]" />
          Open Data Hub
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="flex gap-4">
        {/* EPI Score Gauge */}
        <div className="bg-white rounded-[16px] flex flex-col w-[271px] shrink-0">
          <div className="flex items-center justify-between px-4 pt-4">
            <span className="text-sm text-muted-foreground">EPI Score</span>
            <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <EpiSemicircle score={data.epiScore} />
          </div>
        </div>

        {/* Sub-scores (GHG, SOx, NOx, INN) */}
        <div className="bg-white rounded-[16px] p-2 flex flex-col gap-1 w-[271px] shrink-0">
          <div className="flex gap-1 flex-1">
            <div className="flex-1 bg-[#f3f4f6] rounded-lg p-2 flex flex-col justify-between min-w-[100px]">
              <p className="text-[12px] text-[#697282] leading-[1.45]">GHG</p>
              <p>
                <span className="text-[18px] font-medium text-[#1e2938]">28</span>
                <span className="text-[8px] text-[#697282]">/40</span>
              </p>
            </div>
            <div className="flex-1 bg-[#f3f4f6] rounded-lg p-2 flex flex-col justify-between min-w-[100px]">
              <p className="text-[12px] text-[#697282] leading-[1.45]">SOx</p>
              <p>
                <span className="text-[18px] font-medium text-[#1e2938]">18</span>
                <span className="text-[8px] text-[#697282]">/33.3</span>
              </p>
            </div>
          </div>
          <div className="flex gap-1 flex-1">
            <div className="flex-1 bg-[#f3f4f6] rounded-lg p-2 flex flex-col justify-between min-w-[100px]">
              <p className="text-[12px] text-[#697282] leading-[1.45]">NOx</p>
              <p>
                <span className="text-[18px] font-medium text-[#1e2938]">30</span>
                <span className="text-[8px] text-[#697282]">/66.7</span>
              </p>
            </div>
            <div className="flex-1 bg-[#f3f4f6] rounded-lg p-2 flex flex-col justify-between min-w-[100px]">
              <p className="text-[12px] text-[#697282] leading-[1.45]">INN</p>
              <p>
                <span className="text-[18px] font-medium text-[#1e2938]">16</span>
                <span className="text-[8px] text-[#697282]">/20</span>
              </p>
            </div>
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
          >
            <Pen className="w-5 h-5" />
            Edit in Data Hub
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {/* Row 1 */}
          <div className="flex gap-5">
            <DataField label="Port/ Terminal" value={`${data.port} Container Terminal`} />
            <DataField label="Arrival Datetime" value={`${data.arrival} 08:30`} />
            <DataField label="Total battery power usage [kWh]" value="1 250" />
          </div>
          {/* Row 2 */}
          <div className="flex gap-5">
            <DataField label="Port ECA Status" value="Inside ECA" />
            <DataField label="Departure Datetime" value={`${data.departure} 14:00`} />
            <DataField label="Total solar / wind / fuel cell usage [kWh]" value="320" />
          </div>
          {/* Row 3 */}
          <div className="flex gap-5">
            <DataField label="Port OPS availability" value="Available" />
            <DataField label="Total shore power (OPS) usage [kWh]" value="8 400" />
            <DataField label="Comment" value="Routine cargo operations, no incidents." />
          </div>
        </div>
      </div>

      {/* Engine Usage */}
      <ReadOnlyTableSection
        title="Engine Usage"
        description="Engine operating data including load, fuel consumption, and emissions per engine during the port call."
        columns={["Engine ID", "Engine Type", "Average load [kW]", "Running hours [h]", "Power production [kWh]", "Fuel consumption [kg]", "Pilot fuel cons. [kg]", "Biofuel blend [%]", "Sulphur content [%]"]}
        rows={[
          ["M-1", "Main", "2 160", "48", "103 680", "18 420", "—", "0", "0.10"],
          ["AE-1", "Auxiliary", "310", "48", "14 880", "3 720", "—", "0", "0.10"],
          ["AE-2", "Auxiliary", "285", "36", "10 260", "2 565", "120", "5", "0.10"],
        ]}
      />

      {/* Boiler Usage */}
      <ReadOnlyTableSection
        title="Boiler Usage"
        description="Boiler operating data including fuel type, consumption, and heating values during the port call."
        columns={["Boiler ID", "Running hours [h]", "Fuel type", "Fuel consumption [kg]", "Electrical consum. [kWh]", "Biofuel blend [%]", "Sulphur content [%]", "Lower Heating Value [MJ/kg]"]}
        rows={[
          ["B-1", "48", "VLSFO", "1 840", "—", "0", "0.47", "40.2"],
          ["B-2", "24", "Electric", "—", "3 200", "—", "—", "—"],
        ]}
      />

      {/* SOx Reduction */}
      <ReadOnlyTableSection
        title="SOx Reduction"
        description="SOx abatement technologies and scrubber usage data per engine and boiler."
        columns={["Engine ID", "Engine Type/ Boiler", "Type of SOx reduction", "Average SO2/CO2 ratio", "Duration of scrubber usage [h]", "Average discharge water flow [m³/h]"]}
        rows={[
          ["M-1", "Main", "Open-loop scrubber", "4.3", "48", "120"],
          ["AE-1", "Auxiliary", "Open-loop scrubber", "4.1", "48", "45"],
        ]}
      />

      {/* NOx Reduction */}
      <ReadOnlyTableSection
        title="NOx Reduction"
        description="NOx abatement technologies and emission reduction data per engine."
        columns={["Engine ID", "Engine Type/ Boiler", "Type of NOx reduction", "Average effective NOx emission [g/kWh]", "Share of time with tech active"]}
        rows={[
          ["M-1", "Main", "SCR", "2.8", "100%"],
          ["AE-1", "Auxiliary", "EGR", "3.4", "92%"],
          ["AE-2", "Auxiliary", "DWI", "5.1", "85%"],
        ]}
      />
    </div>
  );
}
