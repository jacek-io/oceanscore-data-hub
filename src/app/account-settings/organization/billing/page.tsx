"use client";

import { useState } from "react";
import {
  Pen,
  Plus,
  X,
  Trash2,
  Search,
  ChevronDown,
  ArrowUpDown,
  ChevronUp,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
type Debtor = {
  id: string;
  name: string;
  street: string;
  city: string;
  country: string;
  vat: string;
};

type VesselBilling = {
  id: string;
  name: string;
  imo: string;
  type: string;
  subOrg: string;
  debtorId: string | null;
};

/* ─── Mock Data ─── */
const mockDebtors: Debtor[] = [
  { id: "d1", name: "OceanScore GmbH", street: "Hafenstraße 12", city: "Hamburg", country: "Germany", vat: "DE123456789" },
  { id: "d2", name: "OceanScore Nordic AB", street: "Strandvägen 45", city: "Gothenburg", country: "Sweden", vat: "SE987654321001" },
  { id: "d3", name: "Maritime Services Ltd", street: "Dock Road 8", city: "London", country: "United Kingdom", vat: "GB112233445" },
];

const mockVesselBilling: VesselBilling[] = [
  { id: "1", name: "Arctic Navigator", imo: "9123456", type: "Bulk Carrier", subOrg: "OceanScore GmbH", debtorId: "d1" },
  { id: "2", name: "Astral", imo: "9234567", type: "Container Ship", subOrg: "OceanScore GmbH", debtorId: "d1" },
  { id: "3", name: "Northern Star", imo: "9345678", type: "Tanker", subOrg: "OceanScore Nordic AB", debtorId: "d2" },
  { id: "4", name: "MV Southern Cross", imo: "9456789", type: "General Cargo", subOrg: "OceanScore Nordic AB", debtorId: null },
  { id: "5", name: "Shadow", imo: "9567890", type: "Bulk Carrier", subOrg: "OceanScore Nordic AB", debtorId: "d3" },
  { id: "6", name: "Rosemary", imo: "9678901", type: "Container Ship", subOrg: "OceanScore Nordic AB", debtorId: null },
  { id: "7", name: "Caspian Trader", imo: "9789012", type: "Tanker", subOrg: "OceanScore Iberia Lda", debtorId: null },
  { id: "8", name: "Porto Star", imo: "9890123", type: "General Cargo", subOrg: "OceanScore Iberia Lda", debtorId: "d3" },
];

const mockBilling = {
  invoiceGrouping: "Per sub-organization",
  currency: "EUR",
  paymentTerms: "Net 30",
  copyFromCorporate: true,
  invoiceEmail: "billing@oceanscore.com",
  poNumber: "PO-2026-0042",
};

const emptyDebtor: Omit<Debtor, "id"> = {
  name: "",
  street: "",
  city: "",
  country: "",
  vat: "",
};

/* ─── Page ─── */
export default function BillingPreferencesPage() {
  /* Billing preferences state */
  const [editing, setEditing] = useState(false);
  const [invoiceGrouping, setInvoiceGrouping] = useState(mockBilling.invoiceGrouping);
  const [currency, setCurrency] = useState(mockBilling.currency);
  const [paymentTerms, setPaymentTerms] = useState(mockBilling.paymentTerms);
  const [copyFromCorporate, setCopyFromCorporate] = useState(mockBilling.copyFromCorporate);
  const [invoiceEmail, setInvoiceEmail] = useState(mockBilling.invoiceEmail);
  const [poNumber, setPoNumber] = useState(mockBilling.poNumber);

  /* Debtors state */
  const [debtors, setDebtors] = useState<Debtor[]>(mockDebtors);
  const [showDebtorDialog, setShowDebtorDialog] = useState(false);
  const [editingDebtor, setEditingDebtor] = useState<Debtor | null>(null);
  const [debtorForm, setDebtorForm] = useState<Omit<Debtor, "id">>(emptyDebtor);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  /* Vessel billing state */
  const [vesselBilling, setVesselBilling] = useState<VesselBilling[]>(mockVesselBilling);
  const [vesselSearch, setVesselSearch] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "subOrg" | "debtor">("name");
  const [sortAsc, setSortAsc] = useState(true);

  /* ─── Debtor CRUD ─── */
  const openNewDebtor = () => {
    setEditingDebtor(null);
    setDebtorForm(emptyDebtor);
    setShowDebtorDialog(true);
  };

  const openEditDebtor = (debtor: Debtor) => {
    setEditingDebtor(debtor);
    setDebtorForm({ name: debtor.name, street: debtor.street, city: debtor.city, country: debtor.country, vat: debtor.vat });
    setShowDebtorDialog(true);
  };

  const saveDebtor = () => {
    if (!debtorForm.name.trim()) return;
    if (editingDebtor) {
      setDebtors((prev) =>
        prev.map((d) => (d.id === editingDebtor.id ? { ...d, ...debtorForm } : d))
      );
    } else {
      const newId = `d${Date.now()}`;
      setDebtors((prev) => [...prev, { id: newId, ...debtorForm }]);
    }
    setShowDebtorDialog(false);
  };

  const deleteDebtor = (id: string) => {
    setDebtors((prev) => prev.filter((d) => d.id !== id));
    // Unassign from vessels
    setVesselBilling((prev) =>
      prev.map((v) => (v.debtorId === id ? { ...v, debtorId: null } : v))
    );
    setDeleteConfirmId(null);
  };

  /* ─── Vessel sort/filter ─── */
  const handleSort = (key: "name" | "subOrg" | "debtor") => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const getDebtorName = (id: string | null) =>
    id ? debtors.find((d) => d.id === id)?.name ?? "—" : "—";

  const filteredVessels = vesselBilling
    .filter((v) => {
      if (!vesselSearch) return true;
      const q = vesselSearch.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.imo.includes(q) ||
        getDebtorName(v.debtorId).toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      if (sortKey === "name") return dir * a.name.localeCompare(b.name);
      if (sortKey === "subOrg") return dir * a.subOrg.localeCompare(b.subOrg);
      return dir * getDebtorName(a.debtorId).localeCompare(getDebtorName(b.debtorId));
    });

  const SortIcon = ({ col }: { col: "name" | "subOrg" | "debtor" }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-[#D1D5DC] ml-1 inline" />;
    return sortAsc ? (
      <ChevronUp className="w-3 h-3 text-muted-foreground ml-1 inline" />
    ) : (
      <ChevronDown className="w-3 h-3 text-muted-foreground ml-1 inline" />
    );
  };

  const assignedCount = vesselBilling.filter((v) => v.debtorId).length;
  const unassignedCount = vesselBilling.length - assignedCount;

  const isDebtorFormValid = debtorForm.name.trim().length > 0;

  return (
    <div className="space-y-5">
      {/* ─── Billing Preferences Card ─── */}
      <div className="bg-white rounded-[16px] p-5 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
              Billing preferences
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5 tracking-[-0.14px]">
              Invoice settings and billing configuration
            </p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
            >
              <Pen className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="flex flex-col gap-4 max-w-[500px]">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Invoice grouping</label>
              <select
                value={invoiceGrouping}
                onChange={(e) => setInvoiceGrouping(e.target.value)}
                className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Per sub-organization</option>
                <option>Consolidated (single invoice)</option>
                <option>Per vessel</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>EUR</option>
                  <option>USD</option>
                  <option>GBP</option>
                  <option>NOK</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Payment terms</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Net 14</option>
                  <option>Net 30</option>
                  <option>Net 60</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Invoice email</label>
              <input
                type="email"
                value={invoiceEmail}
                onChange={(e) => setInvoiceEmail(e.target.value)}
                className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">PO number (optional)</label>
              <input
                type="text"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="copyFromCorporate"
                checked={copyFromCorporate}
                onChange={(e) => setCopyFromCorporate(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="copyFromCorporate" className="text-sm text-foreground">
                Copy billing address from corporate to sub-organizations
              </label>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setEditing(false)}
                className="h-9 px-4 rounded-lg bg-[#061e3a] text-sm text-white hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors"
              >
                Save changes
              </button>
              <button
                onClick={() => {
                  setInvoiceGrouping(mockBilling.invoiceGrouping);
                  setCurrency(mockBilling.currency);
                  setPaymentTerms(mockBilling.paymentTerms);
                  setCopyFromCorporate(mockBilling.copyFromCorporate);
                  setInvoiceEmail(mockBilling.invoiceEmail);
                  setPoNumber(mockBilling.poNumber);
                  setEditing(false);
                }}
                className="h-9 px-4 rounded-lg border border-border text-sm text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-5">
              <Field label="Invoice grouping" value={invoiceGrouping} />
              <Field label="Currency" value={currency} />
              <Field label="Payment terms" value={paymentTerms} />
            </div>
            <div className="grid grid-cols-3 gap-5">
              <Field label="Invoice email" value={invoiceEmail} />
              <Field label="PO number" value={poNumber || "—"} />
              <Field
                label="Copy address from corporate"
                value={copyFromCorporate ? "Yes" : "No"}
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── Debtors Card ─── */}
      <div className="bg-white rounded-[16px] p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
              Debtors
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5 tracking-[-0.14px]">
              Manage billing entities that can be assigned to vessels
            </p>
          </div>
          <button
            onClick={openNewDebtor}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-[#061e3a] text-sm text-white hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add debtor
          </button>
        </div>

        {debtors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Building2 className="w-10 h-10 text-[#D1D5DC] mb-3" />
            <p className="text-sm text-muted-foreground">No debtors created yet</p>
            <p className="text-xs text-[#98a1ae] mt-1">Add a debtor to assign them to vessels for billing</p>
          </div>
        ) : (
          <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] first:rounded-tl-lg">
                    Name
                  </th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                    Address
                  </th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                    Country
                  </th>
                  <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                    VAT
                  </th>
                  <th className="text-center text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                    Vessels
                  </th>
                  <th className="text-right text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] last:rounded-tr-lg w-[80px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {debtors.map((debtor) => {
                  const vesselCount = vesselBilling.filter((v) => v.debtorId === debtor.id).length;
                  return (
                    <tr
                      key={debtor.id}
                      className="border-t border-[#e5e7eb] hover:bg-[#fafbfc] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-foreground">{debtor.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-foreground">{debtor.street}, {debtor.city}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-foreground">{debtor.country}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-foreground font-mono">{debtor.vat}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          "inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-xs font-medium",
                          vesselCount > 0
                            ? "bg-[#ebf3ff] text-[#1a4a8a]"
                            : "bg-[#f3f4f6] text-muted-foreground"
                        )}>
                          {vesselCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditDebtor(debtor)}
                            className="w-7 h-7 rounded-md inline-flex items-center justify-center hover:bg-[#ebf3ff] active:bg-[#cce1ff] transition-colors"
                            title="Edit debtor"
                          >
                            <Pen className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          {deleteConfirmId === debtor.id ? (
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => deleteDebtor(debtor.id)}
                                className="h-7 px-2 rounded-md text-xs text-white bg-[#9e2028] hover:bg-[#8a1b22] transition-colors"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="w-7 h-7 rounded-md inline-flex items-center justify-center hover:bg-[#f3f4f6] transition-colors"
                              >
                                <X className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(debtor.id)}
                              className="w-7 h-7 rounded-md inline-flex items-center justify-center hover:bg-[#fef2f2] active:bg-[#fde8e8] transition-colors"
                              title="Delete debtor"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Vessel Debtor Assignment Card ─── */}
      <div className="bg-white rounded-[16px] p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
              Vessel billing assignment
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5 tracking-[-0.14px]">
              Assign a debtor to each vessel — {assignedCount} assigned, {unassignedCount} unassigned
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search vessel..."
              value={vesselSearch}
              onChange={(e) => setVesselSearch(e.target.value)}
              className="h-10 pl-10 pr-4 w-[220px] rounded-lg border border-border bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] first:rounded-tl-lg cursor-pointer select-none"
                >
                  Vessel / IMO <SortIcon col="name" />
                </th>
                <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                  Type
                </th>
                <th
                  onClick={() => handleSort("subOrg")}
                  className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] cursor-pointer select-none"
                >
                  Organization <SortIcon col="subOrg" />
                </th>
                <th
                  onClick={() => handleSort("debtor")}
                  className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] last:rounded-tr-lg cursor-pointer select-none min-w-[220px]"
                >
                  Debtor <SortIcon col="debtor" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredVessels.map((vessel) => (
                <tr
                  key={vessel.id}
                  className="border-t border-[#e5e7eb] hover:bg-[#fafbfc] transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-normal text-foreground">{vessel.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{vessel.imo}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{vessel.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{vessel.subOrg}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <select
                        value={vessel.debtorId ?? ""}
                        onChange={(e) => {
                          const newDebtorId = e.target.value || null;
                          setVesselBilling((prev) =>
                            prev.map((v) =>
                              v.id === vessel.id ? { ...v, debtorId: newDebtorId } : v
                            )
                          );
                        }}
                        className={cn(
                          "h-9 pl-3 pr-8 rounded-lg border bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary w-full",
                          vessel.debtorId
                            ? "border-border text-foreground"
                            : "border-[#fbbf24] text-muted-foreground"
                        )}
                      >
                        <option value="">Not assigned</option>
                        {debtors.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Debtor Create/Edit Dialog ─── */}
      {showDebtorDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDebtorDialog(false)} />
          <div className="relative bg-white rounded-2xl w-[520px] flex flex-col shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h3 className="text-xl font-medium text-foreground tracking-[-0.6px]">
                {editingDebtor ? "Edit debtor" : "Add debtor"}
              </h3>
              <button
                onClick={() => setShowDebtorDialog(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-[#ebf3ff] active:bg-[#cce1ff] hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[#4a5565]">Company name *</label>
                <input
                  type="text"
                  value={debtorForm.name}
                  onChange={(e) => setDebtorForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. OceanScore GmbH"
                  className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[#4a5565]">Street + number</label>
                <input
                  type="text"
                  value={debtorForm.street}
                  onChange={(e) => setDebtorForm((f) => ({ ...f, street: e.target.value }))}
                  placeholder="e.g. Hafenstraße 12"
                  className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-[#4a5565]">City</label>
                  <input
                    type="text"
                    value={debtorForm.city}
                    onChange={(e) => setDebtorForm((f) => ({ ...f, city: e.target.value }))}
                    placeholder="e.g. Hamburg"
                    className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-[#4a5565]">Country</label>
                  <input
                    type="text"
                    value={debtorForm.country}
                    onChange={(e) => setDebtorForm((f) => ({ ...f, country: e.target.value }))}
                    placeholder="e.g. Germany"
                    className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[#4a5565]">VAT number</label>
                <input
                  type="text"
                  value={debtorForm.vat}
                  onChange={(e) => setDebtorForm((f) => ({ ...f, vat: e.target.value }))}
                  placeholder="e.g. DE123456789"
                  className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 pt-6 pb-6">
              <button
                onClick={() => setShowDebtorDialog(false)}
                className="h-9 px-4 rounded-lg border border-border bg-white text-sm text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveDebtor}
                disabled={!isDebtorFormValid}
                className="h-9 px-4 rounded-lg bg-[#061e3a] text-sm text-white hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingDebtor ? "Save changes" : "Create debtor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Shared ─── */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground leading-[1.45]">{label}</span>
      <span className="text-sm text-foreground leading-[1.45]">{value}</span>
    </div>
  );
}
