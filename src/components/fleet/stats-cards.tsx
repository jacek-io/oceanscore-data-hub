"use client";

import { Ship, Layers, FolderGit2, ChevronRight } from "lucide-react";
import { fleetStats } from "@/lib/mock-data";

export function StatsCards() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Total Ships */}
      <div className="bg-white rounded-[16px] p-4 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Ships</span>
          <div className="w-8 h-8 rounded-full bg-[#98A1AE]/15 flex items-center justify-center">
            <Ship className="w-4 h-4 text-[#98A1AE]" />
          </div>
        </div>
        <div className="flex-1 flex items-center">
          <p className="text-[40px] font-medium text-foreground leading-none">
            {fleetStats.totalShips}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-active-bg text-status-active border border-status-active-border">
            {fleetStats.active} active
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-inactive-bg text-status-inactive border border-status-inactive-border">
            {fleetStats.inactive} inactive
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-revoked-bg text-status-revoked border border-status-revoked-border">
            {fleetStats.revoked} revoked
          </span>
        </div>
      </div>

      {/* Scheme Participation */}
      <div className="bg-white rounded-[16px] pt-4 px-2 pb-2 flex flex-col">
        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-sm text-muted-foreground">
            Scheme Participation
          </span>
          <div className="w-8 h-8 rounded-full bg-[#98A1AE]/15 flex items-center justify-center">
            <Layers className="w-4 h-4 text-[#98A1AE]" />
          </div>
        </div>
        <div className="flex-1 flex items-center">
          <div className="flex gap-2 w-full">
            <div className="flex-1 bg-[#F3F4F6] rounded-lg px-4 py-3">
              <span className="text-xs font-medium text-muted-foreground">
                ESI
              </span>
              <p className="text-[40px] font-medium text-foreground leading-none mt-1">
                {fleetStats.esiParticipation}
                <span className="text-base text-muted-foreground font-normal ml-0.5">
                  /{fleetStats.totalShips}
                </span>
              </p>
            </div>
            <div className="flex-1 bg-[#F3F4F6] rounded-lg px-4 py-3">
              <span className="text-xs font-medium text-muted-foreground">
                EPI
              </span>
              <p className="text-[40px] font-medium text-foreground leading-none mt-1">
                {fleetStats.epiParticipation}
                <span className="text-base text-muted-foreground font-normal ml-0.5">
                  /{fleetStats.totalShips}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-white rounded-[16px] p-4 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Data Sources</span>
          <div className="w-8 h-8 rounded-full bg-[#98A1AE]/15 flex items-center justify-center">
            <FolderGit2 className="w-4 h-4 text-[#98A1AE]" />
          </div>
        </div>
        <div className="flex-1 flex items-center">
          <p className="text-[40px] font-medium text-foreground leading-none">
            {fleetStats.dataSources}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {fleetStats.dataSourcesList.map((source) => (
            <span
              key={source}
              className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-status-inactive-bg text-status-inactive border border-status-inactive-border"
            >
              {source}
            </span>
          ))}
          <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-epi-blue-light text-epi-blue border border-epi-blue-border">
            +1
          </span>
          <button className="ml-auto inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-border bg-white text-xs font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
            Manage
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
