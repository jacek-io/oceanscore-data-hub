"use client";

import { useState } from "react";
import { Pen, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const mockOrg = {
  name: "OceanScore GmbH",
  type: "Corporate" as const,
  parentOrg: null as string | null,
  vatNumber: "DE123456789",
  registrationNumber: "HRB 12345",
  billingAddress: {
    street: "Große Elbstraße 45",
    city: "Hamburg",
    postalCode: "22767",
    country: "Germany",
  },
  contactEmail: "billing@oceanscore.com",
  contactPhone: "+49 40 123 4567",
  subOrgs: [
    { name: "OceanScore Nordic AB", vessels: 4, users: 2 },
    { name: "OceanScore Iberia Lda", vessels: 2, users: 1 },
  ],
};

export default function OrganizationGeneralPage() {
  const [editing, setEditing] = useState(false);
  const [orgName, setOrgName] = useState(mockOrg.name);
  const [vatNumber, setVatNumber] = useState(mockOrg.vatNumber);
  const [regNumber, setRegNumber] = useState(mockOrg.registrationNumber);
  const [street, setStreet] = useState(mockOrg.billingAddress.street);
  const [city, setCity] = useState(mockOrg.billingAddress.city);
  const [postalCode, setPostalCode] = useState(mockOrg.billingAddress.postalCode);
  const [country, setCountry] = useState(mockOrg.billingAddress.country);
  const [contactEmail, setContactEmail] = useState(mockOrg.contactEmail);
  const [contactPhone, setContactPhone] = useState(mockOrg.contactPhone);

  return (
    <div className="space-y-5">
      {/* Org Hierarchy Badge */}
      <div className="bg-white rounded-[16px] p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-medium text-foreground tracking-[-0.48px]">
              {mockOrg.name}
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-[36px] text-[11px] font-medium border bg-primary/5 text-primary border-primary/20">
              {mockOrg.type}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {mockOrg.subOrgs.length} sub-organizations &middot; {mockOrg.subOrgs.reduce((a, s) => a + s.vessels, 0)} vessels total
          </p>
        </div>
        <Link
          href="/account-settings/organization/sub-orgs"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          View hierarchy
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* General Details Card */}
      <div className="bg-white rounded-[16px] p-5 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
              General
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5 tracking-[-0.14px]">
              Organization details and billing address
            </p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-normal text-foreground hover:bg-[#f8f9fa] transition-colors"
            >
              <Pen className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Organization Name" value={orgName} onChange={setOrgName} />
              <InputField label="VAT Number" value={vatNumber} onChange={setVatNumber} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Registration Number" value={regNumber} onChange={setRegNumber} />
              <InputField label="Country" value={country} onChange={setCountry} />
            </div>

            <div className="pt-2 border-t border-[#e5e7eb]">
              <p className="text-xs text-muted-foreground mb-3">Billing Address</p>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Street" value={street} onChange={setStreet} />
                <InputField label="City" value={city} onChange={setCity} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <InputField label="Postal Code" value={postalCode} onChange={setPostalCode} />
                <InputField label="Country" value={country} onChange={setCountry} />
              </div>
            </div>

            <div className="pt-2 border-t border-[#e5e7eb]">
              <p className="text-xs text-muted-foreground mb-3">Contact</p>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Contact Email" value={contactEmail} onChange={setContactEmail} />
                <InputField label="Contact Phone" value={contactPhone} onChange={setContactPhone} />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setEditing(false)}
                className="h-9 px-4 rounded-lg bg-primary text-sm text-white hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setOrgName(mockOrg.name);
                  setVatNumber(mockOrg.vatNumber);
                  setRegNumber(mockOrg.registrationNumber);
                  setStreet(mockOrg.billingAddress.street);
                  setCity(mockOrg.billingAddress.city);
                  setPostalCode(mockOrg.billingAddress.postalCode);
                  setCountry(mockOrg.billingAddress.country);
                  setContactEmail(mockOrg.contactEmail);
                  setContactPhone(mockOrg.contactPhone);
                  setEditing(false);
                }}
                className="h-9 px-4 rounded-lg border border-border text-sm text-foreground hover:bg-[#f8f9fa] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-5">
              <Field label="Organization Name" value={orgName} />
              <Field label="VAT Number" value={vatNumber} />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Field label="Registration Number" value={regNumber} />
              <Field label="Country" value={country} />
            </div>

            <div className="pt-4 border-t border-[#e5e7eb]">
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Billing Address</p>
              <div className="grid grid-cols-2 gap-5">
                <Field label="Street" value={street} />
                <Field label="City" value={city} />
              </div>
              <div className="grid grid-cols-2 gap-5 mt-5">
                <Field label="Postal Code" value={postalCode} />
                <Field label="Country" value={country} />
              </div>
            </div>

            <div className="pt-4 border-t border-[#e5e7eb]">
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Contact</p>
              <div className="grid grid-cols-2 gap-5">
                <Field label="Contact Email" value={contactEmail} />
                <Field label="Contact Phone" value={contactPhone} />
              </div>
            </div>
          </div>
        )}
      </div>
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

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
