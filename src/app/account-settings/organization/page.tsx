"use client";

import { useState } from "react";
import { Pen, Building2, ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { useOrgContext, OrgType } from "@/lib/org-context";
import { cn } from "@/lib/utils";

const mockCorporateOrg = {
  name: "OceanScore GmbH",
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

const mockSubOrg = {
  name: "OceanScore Nordic AB",
  vatNumber: "SE556677889901",
  registrationNumber: "559012-3456",
  billingAddress: {
    street: "Strandvägen 12",
    city: "Stockholm",
    postalCode: "114 56",
    country: "Sweden",
  },
  contactEmail: "nordic@oceanscore.com",
  contactPhone: "+46 8 123 4567",
  parentOrg: "OceanScore GmbH",
};

export default function OrganizationGeneralPage() {
  const { orgType, setOrgType, parentOrg } = useOrgContext();

  const orgData = orgType === "sub-org" ? mockSubOrg : mockCorporateOrg;

  const [editing, setEditing] = useState(false);
  const [orgName, setOrgName] = useState(orgData.name);
  const [vatNumber, setVatNumber] = useState(orgData.vatNumber);
  const [regNumber, setRegNumber] = useState(orgData.registrationNumber);
  const [street, setStreet] = useState(orgData.billingAddress.street);
  const [city, setCity] = useState(orgData.billingAddress.city);
  const [postalCode, setPostalCode] = useState(orgData.billingAddress.postalCode);
  const [country, setCountry] = useState(orgData.billingAddress.country);
  const [contactEmail, setContactEmail] = useState(orgData.contactEmail);
  const [contactPhone, setContactPhone] = useState(orgData.contactPhone);

  const orgTypes: { value: OrgType; label: string }[] = [
    { value: "standalone", label: "Independent" },
    { value: "sub-org", label: "Sub-organisation" },
    { value: "corporate", label: "Parent organisation" },
  ];

  return (
    <div className="space-y-5">
      {/* DEV: Org type toggle */}
      <div className="bg-[#fef9c3] rounded-[16px] p-3 flex items-center gap-3 border border-[#fde047]">
        <span className="text-xs font-medium text-[#854d0e]">DEV toggle:</span>
        <div className="flex gap-1">
          {orgTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setOrgType(t.value)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs transition-colors",
                orgType === t.value
                  ? "bg-[#854d0e] text-white"
                  : "bg-white text-[#854d0e] border border-[#fde047] hover:bg-[#fef3c7]"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Org Identity Card */}
      {orgType === "corporate" && (
        <div className="bg-white rounded-[16px] p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium text-foreground tracking-[-0.48px]">
                {orgData.name}
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-[36px] text-[11px] font-medium border bg-primary/5 text-primary border-primary/20">
                Corporate
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {"subOrgs" in orgData
                ? `${orgData.subOrgs.length} sub-organizations · ${orgData.subOrgs.reduce((a, s) => a + s.vessels, 0)} vessels total`
                : ""}
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
      )}

      {orgType === "sub-org" && (
        <div className="bg-white rounded-[16px] p-5 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#f3f4f6] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-medium text-foreground tracking-[-0.48px]">
                  {orgData.name}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-[36px] text-[11px] font-medium border bg-[#f3f4f6] text-[#4a5565] border-[#e5e7eb]">
                  Sub-organization
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Part of <span className="font-medium text-foreground">{parentOrg}</span>
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Hierarchy notice — always visible */}
      <div className="bg-white rounded-[16px] p-5 flex items-start gap-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Set your organisation structure</p>
          <p className="mt-0.5">
            You can be: Independent (no links), Sub-organisation (linked to a parent), or Parent organisation (with sub-orgs beneath you). Only one level of hierarchy is allowed — to change your type, remove existing links first.
          </p>
        </div>
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
                  setOrgName(orgData.name);
                  setVatNumber(orgData.vatNumber);
                  setRegNumber(orgData.registrationNumber);
                  setStreet(orgData.billingAddress.street);
                  setCity(orgData.billingAddress.city);
                  setPostalCode(orgData.billingAddress.postalCode);
                  setCountry(orgData.billingAddress.country);
                  setContactEmail(orgData.contactEmail);
                  setContactPhone(orgData.contactPhone);
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
