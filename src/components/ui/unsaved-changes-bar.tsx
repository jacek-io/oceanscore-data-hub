"use client";

import { useState, useEffect, useCallback } from "react";
import { Info, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type SaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

interface UnsavedChangesBarProps {
  hasChanges: boolean;
  onSave: () => Promise<void> | void;
  onDiscard: () => void;
}

export function UnsavedChangesBar({
  hasChanges,
  onSave,
  onDiscard,
}: UnsavedChangesBarProps) {
  const [status, setStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    if (hasChanges && status === "idle") {
      setStatus("unsaved");
    }
    if (!hasChanges && status === "unsaved") {
      setStatus("idle");
    }
  }, [hasChanges, status]);

  // Auto-hide saved/error status after delay
  useEffect(() => {
    if (status === "saved") {
      const timer = setTimeout(() => setStatus("idle"), 2500);
      return () => clearTimeout(timer);
    }
    if (status === "error") {
      const timer = setTimeout(() => setStatus("unsaved"), 3500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Warn on browser close/refresh
  useEffect(() => {
    if (status === "unsaved" || status === "saving") {
      const handler = (e: BeforeUnloadEvent) => {
        e.preventDefault();
      };
      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }
  }, [status]);

  const handleSave = useCallback(async () => {
    setStatus("saving");
    try {
      // Simulate network delay for prototype
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await onSave();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }, [onSave]);

  const handleDiscard = useCallback(() => {
    onDiscard();
    setStatus("idle");
  }, [onDiscard]);

  if (status === "idle") return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      {status === "unsaved" && (
        <div className="flex items-center gap-8 h-14 pl-4 pr-2 rounded-xl bg-[#061e3a] shadow-lg">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[#6ba1e6]" />
            <span className="text-sm text-white whitespace-nowrap">
              Unsaved changes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDiscard}
              className="h-10 px-3 rounded-lg border border-white text-sm text-white hover:bg-white/10 active:bg-white/20 transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="h-10 px-3 rounded-lg bg-white text-sm text-[#061e3a] font-normal hover:bg-white/90 active:bg-white/80 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {status === "saving" && (
        <div className="flex items-center gap-2 h-14 px-5 rounded-xl bg-[#061e3a] shadow-lg">
          <Loader2 className="w-5 h-5 text-white animate-spin" />
          <span className="text-sm text-white whitespace-nowrap">
            Saving...
          </span>
        </div>
      )}

      {status === "saved" && (
        <div className="flex items-center gap-2 h-14 px-5 rounded-xl bg-[#2e4a3e] shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-[#6ee7a0]" />
          <span className="text-sm text-white whitespace-nowrap">
            Changes saved
          </span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 h-14 px-5 rounded-xl bg-[#6b2125] shadow-lg">
          <XCircle className="w-5 h-5 text-[#fca5a5]" />
          <span className="text-sm text-white whitespace-nowrap">
            An Error Occurred
          </span>
        </div>
      )}
    </div>
  );
}
