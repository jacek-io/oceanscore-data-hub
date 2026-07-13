"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export function AddVesselDialog() {
  const [open, setOpen] = useState(false);
  const [imo, setImo] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#061e3a] text-white text-sm font-normal hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors">
            <Plus className="w-4 h-4 text-primary-icon" />
            Add Ship
          </button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Ship</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <label
              htmlFor="imo-number"
              className="text-sm font-medium text-foreground"
            >
              IMO Number
            </label>
            <Input
              id="imo-number"
              placeholder="7-digit number"
              value={imo}
              onChange={(e) => setImo(e.target.value)}
              className="mt-1.5 rounded-lg"
            />
          </div>
          <div className="flex justify-between pt-2">
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-normal text-foreground hover:bg-[#F3F4F6] transition-colors"
            >
              Cancel
            </button>
            <button className="px-3 py-2.5 rounded-lg bg-[#061e3a] text-white text-sm font-normal hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors">
              Save Ship Record
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
