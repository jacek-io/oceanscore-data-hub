"use client";

import { useState } from "react";
import { Pen, ChevronDown } from "lucide-react";

const mockProfile = {
  firstName: "Jacek",
  lastName: "Zabicki",
  email: "jacek@oceanscore.com",
  phone: "+49 123 456 789",
  role: "Admin",
  organization: "OceanScore GmbH",
  lastLogin: "2026-07-08, 14:32 UTC",
};

const languages = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "nl", label: "Nederlands" },
  { code: "no", label: "Norsk" },
  { code: "da", label: "Dansk" },
  { code: "sv", label: "Svenska" },
  { code: "fi", label: "Suomi" },
  { code: "pl", label: "Polski" },
  { code: "it", label: "Italiano" },
  { code: "el", label: "Ελληνικά" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "zh", label: "中文" },
];

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(mockProfile.firstName);
  const [lastName, setLastName] = useState(mockProfile.lastName);
  const [email, setEmail] = useState(mockProfile.email);
  const [phone, setPhone] = useState(mockProfile.phone);
  const [language, setLanguage] = useState("en");

  return (
    <div className="space-y-5">
      {/* Profile Card */}
      <div className="bg-white rounded-[16px] p-5 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
              Profile
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5 tracking-[-0.14px]">
              Your personal information and contact details
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
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
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
                  setFirstName(mockProfile.firstName);
                  setLastName(mockProfile.lastName);
                  setEmail(mockProfile.email);
                  setPhone(mockProfile.phone);
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
              <Field label="First Name" value={firstName} />
              <Field label="Last Name" value={lastName} />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Field label="Email" value={email} />
              <Field label="Phone" value={phone} />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Field label="Role" value={mockProfile.role} />
              <Field label="Organization" value={mockProfile.organization} />
            </div>
          </div>
        )}
      </div>

      {/* Language Preferences */}
      <div className="bg-white rounded-[16px] p-5 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
            Language Preferences
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5 tracking-[-0.14px]">
            Choose your preferred language for the interface
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Interface Language</label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-10 w-full pl-3 pr-10 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
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
