import { CloudUpload, Plus } from "lucide-react";
import { StatsCards } from "@/components/fleet/stats-cards";
import { ShipTable } from "@/components/fleet/ship-table";
import { AddVesselDialog } from "@/components/fleet/add-vessel-dialog";

export default function FleetPage() {
  return (
    <div className="px-6 py-5 space-y-5">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-medium text-foreground leading-tight">Data Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Centralized ship master data, BDN, EDN, and Tier III hours
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
            <CloudUpload className="w-4 h-4 text-muted-foreground" />
            Import Data
          </button>
          <AddVesselDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Ship Table */}
      <ShipTable />
    </div>
  );
}
