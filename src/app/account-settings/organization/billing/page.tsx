"use client";

import { useState } from "react";
import { Pen } from "lucide-react";

const mockBilling = {
  invoiceGrouping: "Per sub-organization",
  currency: "EUR",
  paymentTerms: "Net 30",
  copyFromCorporate: true,
  invoiceEmail: "billing@oceanscore.com",
  poNumber: "PO-2026-0042",
};

export default function BillingPreferencesPage() {
  const [editing, setEditing] = useState(false);
  const [invoiceGrouping, setInvoiceGrouping] = useState<string>(mockBilling.invoiceGrouping);
  const [currency, setCurrency] = useState(mockBilling.currency);
  const [paymentTerms, setPaymentTerms] = useState(mockBilling.paymentTerms);
  const [copyFromCorporate, setCopyFromCorporate] = useState(mockBilling.copyFromCorporate);
  const [invoiceEmail, setInvoiceEmail] = useState(mockBilling.invoiceEmail);
  const [poNumber, setPoNumber] = useState(mockBilling.poNumber);

  return (
    <div className="bg-white rounded-[16px] p-5 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
            Billing Preferences
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
            <label className="text-xs text-muted-foreground">Invoice Grouping</label>
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
              <label className="text-xs text-muted-foreground">Payment Terms</label>
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
            <label className="text-xs text-muted-foreground">Invoice Email</label>
            <input
              type="email"
              value={invoiceEmail}
              onChange={(e) => setInvoiceEmail(e.target.value)}
              className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">PO Number (optional)</label>
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
              Save Changes
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
            <Field label="Invoice Grouping" value={invoiceGrouping} />
            <Field label="Currency" value={currency} />
            <Field label="Payment Terms" value={paymentTerms} />
          </div>
          <div className="grid grid-cols-3 gap-5">
            <Field label="Invoice Email" value={invoiceEmail} />
            <Field label="PO Number" value={poNumber || "—"} />
            <Field
              label="Copy address from corporate"
              value={copyFromCorporate ? "Yes" : "No"}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground leading-[1.45]">{label}</span>
      <span className="text-sm text-foreground leading-[1.45]">{value}</span>
    </div>
  );
}
