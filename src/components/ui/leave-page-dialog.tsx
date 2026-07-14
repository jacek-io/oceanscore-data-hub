"use client";

import { X } from "lucide-react";

interface LeavePageDialogProps {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
}

export function LeavePageDialog({ open, onStay, onLeave }: LeavePageDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onStay} />
      <div className="relative bg-white rounded-lg shadow-[0px_8px_12px_rgba(0,0,0,0.1)] w-[480px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
          <h3 className="text-2xl font-semibold text-foreground tracking-[-0.24px]">
            Unsaved Changes
          </h3>
          <button
            onClick={onStay}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-foreground">
            You have unsaved changes. Are you sure you want to leave this page?
            Your changes will be lost.
          </p>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-end gap-4 px-6 py-4">
          <button
            onClick={onStay}
            className="h-10 px-4 rounded-lg border border-[#d1d5dc] bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
          >
            Stay on page
          </button>
          <button
            onClick={onLeave}
            className="h-10 px-4 rounded-lg bg-[#c1272d] text-sm font-normal text-white hover:bg-[#9e2028] active:bg-[#82181a] transition-colors"
          >
            Leave page
          </button>
        </div>
      </div>
    </div>
  );
}
