"use client";

import { useState } from "react";
import {
  Building2,
  Plus,
  Trash2,
  Unlink,
  Merge,
  X,
  ChevronRight,
  AlertTriangle,
  Ship,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SubOrg = {
  id: string;
  name: string;
  vatNumber: string;
  country: string;
  vessels: number;
  users: number;
};

const mockCorporate = {
  name: "OceanScore GmbH",
  vessels: 8,
  users: 5,
};

const initialSubOrgs: SubOrg[] = [
  { id: "1", name: "OceanScore Nordic AB", vatNumber: "SE556677889901", country: "Sweden", vessels: 4, users: 2 },
  { id: "2", name: "OceanScore Iberia Lda", vatNumber: "PT123456789", country: "Portugal", vessels: 2, users: 1 },
  { id: "3", name: "OceanScore Hellas SA", vatNumber: "EL012345678", country: "Greece", vessels: 0, users: 0 },
];

type Dialog = null | "create" | "delete" | "delink" | "merge";

export default function SubOrgsPage() {
  const [subOrgs] = useState<SubOrg[]>(initialSubOrgs);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [selectedOrg, setSelectedOrg] = useState<SubOrg | null>(null);

  // Create form
  const [newName, setNewName] = useState("");
  const [newVat, setNewVat] = useState("");
  const [newCountry, setNewCountry] = useState("");

  // Merge form
  const [mergeTarget, setMergeTarget] = useState("");

  const openDialog = (type: Dialog, org?: SubOrg) => {
    setSelectedOrg(org ?? null);
    setDialog(type);
    if (type === "create") {
      setNewName("");
      setNewVat("");
      setNewCountry("");
    }
    if (type === "merge") {
      setMergeTarget("");
    }
  };

  const closeDialog = () => {
    setDialog(null);
    setSelectedOrg(null);
  };

  return (
    <div className="space-y-5">
      {/* Hierarchy View */}
      <div className="bg-white rounded-[16px] p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
              Organization Hierarchy
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5 tracking-[-0.14px]">
              Corporate structure with sub-organizations
            </p>
          </div>
          <button
            onClick={() => openDialog("create")}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-primary text-sm text-white hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Sub-org
          </button>
        </div>

        {/* Tree View */}
        <div className="flex flex-col">
          {/* Corporate (parent) */}
          <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/15">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{mockCorporate.name}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-[36px] text-[10px] font-medium border bg-primary/5 text-primary border-primary/20">
                  Corporate
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {mockCorporate.vessels} vessels &middot; {mockCorporate.users} users
              </p>
            </div>
          </div>

          {/* Sub-orgs */}
          <div className="ml-6 border-l-2 border-[#e5e7eb] pl-0">
            {subOrgs.map((org, i) => (
              <div key={org.id} className="relative">
                {/* Branch connector */}
                <div className="absolute left-0 top-[28px] w-5 h-px bg-[#e5e7eb]" />

                <div className="ml-5 my-2 flex items-center gap-3 p-3 bg-white rounded-lg border border-[#e5e7eb] hover:border-[#d1d5dc] transition-colors group">
                  <div className="w-9 h-9 rounded-full bg-[#f3f4f6] flex items-center justify-center">
                    <Building2 className="w-4.5 h-4.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground">{org.name}</span>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Ship className="w-3 h-3" /> {org.vessels} vessels
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" /> {org.users} users
                      </span>
                      <span className="text-xs text-muted-foreground">{org.country}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openDialog("merge", org)}
                      className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#f3f4f6] transition-colors"
                      title="Merge"
                    >
                      <Merge className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => openDialog("delink", org)}
                      className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#f3f4f6] transition-colors"
                      title="De-link from parent"
                    >
                      <Unlink className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => openDialog("delete", org)}
                      className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#fef2f2] transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[#9e2028]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Dialogs ── */}

      {/* Create Sub-org */}
      {dialog === "create" && (
        <DialogOverlay onClose={closeDialog}>
          <DialogHeader title="Create Sub-organization" onClose={closeDialog} />
          <div className="p-5 flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              The new sub-organization will be linked to {mockCorporate.name}.
            </p>
            <InputField label="Organization Name *" value={newName} onChange={setNewName} placeholder="e.g. OceanScore Baltic OÜ" />
            <InputField label="VAT Number *" value={newVat} onChange={setNewVat} placeholder="e.g. EE123456789" />
            <InputField label="Country *" value={newCountry} onChange={setNewCountry} placeholder="e.g. Estonia" />
          </div>
          <DialogFooter
            onCancel={closeDialog}
            onConfirm={closeDialog}
            confirmLabel="Create Sub-org"
            confirmDisabled={!newName || !newVat || !newCountry}
          />
        </DialogOverlay>
      )}

      {/* Delete Sub-org */}
      {dialog === "delete" && selectedOrg && (
        <DialogOverlay onClose={closeDialog}>
          <DialogHeader title="Delete Sub-organization" onClose={closeDialog} />
          <div className="p-5 flex flex-col gap-4">
            {(selectedOrg.vessels > 0 || selectedOrg.users > 0) ? (
              <div className="flex items-start gap-3 p-3 bg-[#fff8f0] rounded-lg border border-[#ffd6a7]">
                <AlertTriangle className="w-5 h-5 text-[#9f2d00] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#9f2d00]">Cannot delete this sub-organization</p>
                  <p className="text-sm text-[#9f2d00] mt-1">
                    <strong>{selectedOrg.name}</strong> still has{" "}
                    {selectedOrg.vessels > 0 && `${selectedOrg.vessels} vessel${selectedOrg.vessels > 1 ? "s" : ""}`}
                    {selectedOrg.vessels > 0 && selectedOrg.users > 0 && " and "}
                    {selectedOrg.users > 0 && `${selectedOrg.users} user${selectedOrg.users > 1 ? "s" : ""}`}
                    {" "}attached. Move or remove them before deleting.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete <strong>{selectedOrg.name}</strong>? This action cannot be undone.
              </p>
            )}
          </div>
          <DialogFooter
            onCancel={closeDialog}
            onConfirm={closeDialog}
            confirmLabel="Delete"
            confirmDisabled={selectedOrg.vessels > 0 || selectedOrg.users > 0}
            destructive
          />
        </DialogOverlay>
      )}

      {/* De-link Sub-org */}
      {dialog === "delink" && selectedOrg && (
        <DialogOverlay onClose={closeDialog}>
          <DialogHeader title="De-link Sub-organization" onClose={closeDialog} />
          <div className="p-5 flex flex-col gap-4">
            {selectedOrg.users === 0 ? (
              <div className="flex items-start gap-3 p-3 bg-[#fff8f0] rounded-lg border border-[#ffd6a7]">
                <AlertTriangle className="w-5 h-5 text-[#9f2d00] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#9f2d00]">Cannot de-link this sub-organization</p>
                  <p className="text-sm text-[#9f2d00] mt-1">
                    <strong>{selectedOrg.name}</strong> has no users. Every standalone organization needs at least one user. Add a user before de-linking.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                De-linking <strong>{selectedOrg.name}</strong> will remove it from {mockCorporate.name}.
                It will become a standalone organization with its own billing. This action can be reversed by re-linking later.
              </p>
            )}
          </div>
          <DialogFooter
            onCancel={closeDialog}
            onConfirm={closeDialog}
            confirmLabel="De-link"
            confirmDisabled={selectedOrg.users === 0}
          />
        </DialogOverlay>
      )}

      {/* Merge Sub-orgs */}
      {dialog === "merge" && selectedOrg && (
        <DialogOverlay onClose={closeDialog}>
          <DialogHeader title="Merge Sub-organizations" onClose={closeDialog} />
          <div className="p-5 flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Merge <strong>{selectedOrg.name}</strong> into another sub-organization.
              All vessels and users will be moved to the target organization.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Merge into *</label>
              <select
                value={mergeTarget}
                onChange={(e) => setMergeTarget(e.target.value)}
                className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select target organization...</option>
                {subOrgs
                  .filter((o) => o.id !== selectedOrg.id)
                  .map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
              </select>
            </div>
            {mergeTarget && (
              <div className="bg-[#f3f4f6] rounded-lg p-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">After merge:</p>
                <ul className="space-y-0.5 text-xs">
                  <li>&bull; {selectedOrg.vessels} vessel{selectedOrg.vessels !== 1 ? "s" : ""} will be moved</li>
                  <li>&bull; {selectedOrg.users} user{selectedOrg.users !== 1 ? "s" : ""} will be reassigned</li>
                  <li>&bull; {selectedOrg.name} will be deleted</li>
                </ul>
              </div>
            )}
          </div>
          <DialogFooter
            onCancel={closeDialog}
            onConfirm={closeDialog}
            confirmLabel="Merge"
            confirmDisabled={!mergeTarget}
          />
        </DialogOverlay>
      )}
    </div>
  );
}

/* ── Shared dialog components ── */

function DialogOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-[16px] w-[480px] max-h-[80vh] flex flex-col shadow-xl">
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between p-5 pb-0">
      <h3 className="text-lg font-medium text-foreground tracking-[-0.54px]">{title}</h3>
      <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f3f4f6] transition-colors">
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}

function DialogFooter({
  onCancel,
  onConfirm,
  confirmLabel,
  confirmDisabled,
  destructive,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  confirmDisabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-2 p-5 pt-2">
      <button
        onClick={onCancel}
        className="h-9 px-4 rounded-lg border border-border text-sm text-foreground hover:bg-[#f8f9fa] transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={confirmDisabled}
        className={cn(
          "h-9 px-4 rounded-lg text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          destructive
            ? "bg-[#dc2626] hover:bg-[#b91c1c]"
            : "bg-primary hover:bg-primary/90"
        )}
      >
        {confirmLabel}
      </button>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
