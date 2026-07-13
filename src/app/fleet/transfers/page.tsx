"use client";

import { useState } from "react";
import {
  ArrowLeftRight,
  ClockAlert,
  UserRoundPlus,
  Search,
  ArrowUpDown,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TransferStatus = "pending" | "declined" | "approved";

interface IncomingTransfer {
  id: string;
  shipName: string;
  imo: string;
  requestedBy: string;
}

interface OutgoingTransfer {
  id: string;
  shipName: string;
  imo: string;
  from: string;
  status: TransferStatus;
}

const mockIncoming: IncomingTransfer[] = [
  { id: "1", shipName: "Arctic Navigator", imo: "912345678", requestedBy: "Horizon Fleet" },
  { id: "2", shipName: "Astral", imo: "912345679", requestedBy: "Meridian Marine" },
];

const mockOutgoing: OutgoingTransfer[] = [
  { id: "1", shipName: "Arctic Navigator", imo: "912345678", from: "Baltic Shipping", status: "pending" },
  { id: "2", shipName: "Astral", imo: "912345679", from: "Meridian Marine", status: "pending" },
  { id: "3", shipName: "Caspian Trader", imo: "912345680", from: "Oceanic Lines", status: "declined" },
];

const statusConfig: Record<TransferStatus, { label: string; bg: string; border: string; text: string }> = {
  pending: {
    label: "Pending approval",
    bg: "bg-[#ffedd4]",
    border: "border-[#ffd6a7]",
    text: "text-[#7f2a0c]",
  },
  declined: {
    label: "Declined",
    bg: "bg-[#ffe2e1]",
    border: "border-[#ffcaca]",
    text: "text-[#82181a]",
  },
  approved: {
    label: "Approved",
    bg: "bg-status-active-bg",
    border: "border-status-active-border",
    text: "text-status-active",
  },
};

export default function ShipTransfersPage() {
  const [incomingSearch, setIncomingSearch] = useState("");
  const [outgoingSearch, setOutgoingSearch] = useState("");
  const [incoming, setIncoming] = useState(mockIncoming);
  const [outgoing, setOutgoing] = useState(mockOutgoing);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestImo, setRequestImo] = useState("");

  const filteredIncoming = incoming.filter(
    (t) =>
      t.shipName.toLowerCase().includes(incomingSearch.toLowerCase()) ||
      t.imo.includes(incomingSearch) ||
      t.requestedBy.toLowerCase().includes(incomingSearch.toLowerCase())
  );

  const filteredOutgoing = outgoing.filter(
    (t) =>
      t.shipName.toLowerCase().includes(outgoingSearch.toLowerCase()) ||
      t.imo.includes(outgoingSearch) ||
      t.from.toLowerCase().includes(outgoingSearch.toLowerCase())
  );

  const totalTransfers = incoming.length + outgoing.length;
  const awaitingApproval = incoming.length;
  const yourRequests = outgoing.length;

  const handleApprove = (id: string) => {
    setIncoming((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDecline = (id: string) => {
    setIncoming((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="px-6 py-4 flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-medium text-foreground leading-[1.2] tracking-[-0.96px]">
          Ship Transfers
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Request ships from other organizations, or approve transfers others have requested from you.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Transfers" value={totalTransfers} icon={<ArrowLeftRight className="w-4 h-4 text-muted-foreground" />} />
        <StatCard label="Awaiting your Approval" value={awaitingApproval} icon={<ClockAlert className="w-4 h-4 text-muted-foreground" />} />
        <StatCard label="Your Requests" value={yourRequests} icon={<UserRoundPlus className="w-4 h-4 text-muted-foreground" />} />
      </div>

      {/* Transfers awaiting your approval */}
      <div className="bg-white rounded-[16px] p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
            Transfers awaiting your approval
          </h2>
          <div className="relative w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#98a1ae]" />
            <input
              type="text"
              placeholder="Search ships..."
              value={incomingSearch}
              onChange={(e) => setIncomingSearch(e.target.value)}
              className="w-full h-10 pl-11 pr-4 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-[#98a1ae] focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {filteredIncoming.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No transfers awaiting approval.</p>
        ) : (
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-[#f3f4f6] rounded-lg">
              <div className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
                Ship name / IMO <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
                Requested by <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground justify-end">
                Action <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
            </div>
            {/* Table Rows */}
            {filteredIncoming.map((transfer, idx) => (
              <div
                key={transfer.id}
                className={cn(
                  "grid grid-cols-3 items-center h-14",
                  idx < filteredIncoming.length - 1 && "border-b border-[#e5e7eb]"
                )}
              >
                <div className="px-4">
                  <p className="text-sm text-foreground">{transfer.shipName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{transfer.imo}</p>
                </div>
                <div className="px-4">
                  <p className="text-sm text-foreground">{transfer.requestedBy}</p>
                </div>
                <div className="px-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleDecline(transfer.id)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-white text-xs text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleApprove(transfer.id)}
                    className="px-3 py-1.5 rounded-lg border border-[#1157b2] bg-white text-xs text-[#1157b2] hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transfers you requested */}
      <div className="bg-white rounded-[16px] p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
            Transfers you requested
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative w-[240px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#98a1ae]" />
              <input
                type="text"
                placeholder="Search vessels..."
                value={outgoingSearch}
                onChange={(e) => setOutgoingSearch(e.target.value)}
                className="w-full h-10 pl-11 pr-4 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-[#98a1ae] focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => setRequestDialogOpen(true)}
              className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Request Transfer
            </button>
          </div>
        </div>

        {filteredOutgoing.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No transfer requests yet.</p>
        ) : (
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-[#f3f4f6] rounded-lg">
              <div className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
                Ship name / IMO <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
                From <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
                Status <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
            </div>
            {/* Table Rows */}
            {filteredOutgoing.map((transfer, idx) => {
              const config = statusConfig[transfer.status];
              return (
                <div
                  key={transfer.id}
                  className={cn(
                    "grid grid-cols-3 items-center h-14",
                    idx < filteredOutgoing.length - 1 && "border-b border-[#e5e7eb]"
                  )}
                >
                  <div className="px-4">
                    <p className="text-sm text-foreground">{transfer.shipName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{transfer.imo}</p>
                  </div>
                  <div className="px-4">
                    <p className="text-sm text-foreground">{transfer.from}</p>
                  </div>
                  <div className="px-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border",
                        config.bg,
                        config.border,
                        config.text
                      )}
                    >
                      {config.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Request Transfer Dialog */}
      {requestDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => { setRequestDialogOpen(false); setRequestImo(""); }}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-[480px] p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground tracking-[-0.36px]">
                Request Ship Transfer
              </h3>
              <button
                onClick={() => { setRequestDialogOpen(false); setRequestImo(""); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ebf3ff] active:bg-[#cce1ff] transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter the IMO number of the ship you want to request a transfer for. The current owner will be notified and asked to approve.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">IMO Number</label>
              <input
                type="text"
                placeholder="e.g. 912345678"
                value={requestImo}
                onChange={(e) => setRequestImo(e.target.value)}
                className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-[#98a1ae] focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
            </div>
            <div className="flex items-center gap-2 justify-end pt-2">
              <button
                onClick={() => { setRequestDialogOpen(false); setRequestImo(""); }}
                className="h-9 px-4 rounded-lg border border-border text-sm text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (requestImo.trim()) {
                    setOutgoing((prev) => [
                      ...prev,
                      {
                        id: String(Date.now()),
                        shipName: "Unknown Vessel",
                        imo: requestImo.trim(),
                        from: "Unknown Org",
                        status: "pending" as TransferStatus,
                      },
                    ]);
                    setRequestDialogOpen(false);
                    setRequestImo("");
                  }
                }}
                disabled={!requestImo.trim()}
                className="h-9 px-4 rounded-lg bg-[#061e3a] text-sm text-white hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[16px] p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-[40px] font-medium text-foreground leading-[1.2] tracking-[-0.4px]">
        {value}
      </p>
    </div>
  );
}
