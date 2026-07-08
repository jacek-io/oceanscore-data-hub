"use client";

import { useState } from "react";
import { Shield, Pen, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Permission = {
  key: string;
  label: string;
  description: string;
};

const permissions: Permission[] = [
  { key: "fleet_view", label: "View Fleet", description: "View vessel list and details" },
  { key: "fleet_edit", label: "Edit Fleet", description: "Add, edit, and remove vessels" },
  { key: "upload", label: "Upload Data", description: "Upload ESI/EPI data via Data Hub" },
  { key: "esi_view", label: "View ESI", description: "View ESI scores and certificates" },
  { key: "epi_view", label: "View EPI", description: "View EPI port calls and scores" },
  { key: "epi_submit", label: "Submit EPI Data", description: "Submit port call utility data" },
  { key: "billing_view", label: "View Billing", description: "View invoices and billing info" },
  { key: "billing_edit", label: "Edit Billing", description: "Modify billing preferences" },
  { key: "users_manage", label: "Manage Users", description: "Invite, edit, and deactivate users" },
  { key: "org_manage", label: "Manage Organization", description: "Edit org details and sub-orgs" },
];

type RoleDef = {
  name: string;
  description: string;
  color: string;
  permissions: string[];
};

const roles: RoleDef[] = [
  {
    name: "Admin",
    description: "Full access to all features and settings",
    color: "bg-primary/5 text-primary border-primary/20",
    permissions: permissions.map((p) => p.key),
  },
  {
    name: "Data Manager",
    description: "Manage fleet data, uploads, and scheme submissions",
    color: "bg-[#d0e5c3] text-[#294215] border-[#b5d49e]",
    permissions: ["fleet_view", "fleet_edit", "upload", "esi_view", "epi_view", "epi_submit"],
  },
  {
    name: "Accountant",
    description: "Access to billing, invoices, and financial data",
    color: "bg-[#ffedd4] text-[#9f2d00] border-[#ffd6a7]",
    permissions: ["fleet_view", "esi_view", "epi_view", "billing_view", "billing_edit"],
  },
  {
    name: "Analyst",
    description: "Read-only access to fleet and scheme data",
    color: "bg-[#cce1ff] text-[#1a4a8a] border-[#99c3ff]",
    permissions: ["fleet_view", "esi_view", "epi_view"],
  },
];

type UserAssignment = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const mockAssignments: UserAssignment[] = [
  { id: "1", name: "Jacek Zabicki", email: "jacek@oceanscore.com", role: "Admin" },
  { id: "2", name: "Oskar Flegel", email: "oskar@oceanscore.com", role: "Admin" },
  { id: "3", name: "Maria Silva", email: "maria@oceanscore.com", role: "Data Manager" },
  { id: "4", name: "Erik Svensson", email: "erik@oceanscore.com", role: "Analyst" },
  { id: "5", name: "Anna Lindqvist", email: "anna@oceanscore.com", role: "Accountant" },
];

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<RoleDef>(roles[0]);
  const [editingUser, setEditingUser] = useState<UserAssignment | null>(null);
  const [editRole, setEditRole] = useState("");

  return (
    <div className="space-y-5">
      {/* Roles Overview */}
      <div className="bg-white rounded-[16px] p-5 flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">
            Roles & Permissions
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5 tracking-[-0.14px]">
            Define what each role can access across the platform
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-4 gap-3">
          {roles.map((role) => (
            <button
              key={role.name}
              onClick={() => setSelectedRole(role)}
              className={cn(
                "flex flex-col gap-2 p-3 rounded-lg border text-left transition-colors",
                selectedRole.name === role.name
                  ? "border-primary bg-primary/5"
                  : "border-[#e5e7eb] hover:border-[#d1d5dc]"
              )}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-[36px] text-[11px] font-medium border", role.color)}>
                  {role.name}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{role.description}</p>
            </button>
          ))}
        </div>

        {/* Permission Matrix for selected role */}
        <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
          <div className="bg-[#F3F4F6] px-4 py-2.5 flex items-center gap-2">
            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-[36px] text-[11px] font-medium border", selectedRole.color)}>
              {selectedRole.name}
            </span>
            <span className="text-xs text-muted-foreground">
              — {selectedRole.permissions.length} of {permissions.length} permissions
            </span>
          </div>
          <div className="divide-y divide-[#f0f1f3]">
            {permissions.map((perm) => {
              const hasAccess = selectedRole.permissions.includes(perm.key);
              return (
                <div key={perm.key} className="flex items-center justify-between px-4 py-2.5">
                  <div>
                    <p className="text-sm text-foreground">{perm.label}</p>
                    <p className="text-xs text-muted-foreground">{perm.description}</p>
                  </div>
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium",
                      hasAccess
                        ? "bg-status-active-bg text-[#294215] border border-status-active-border"
                        : "bg-[#f3f4f6] text-[#d1d5dc] border border-[#e5e7eb]"
                    )}
                  >
                    {hasAccess ? "✓" : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User-Role Assignments */}
      <div className="bg-white rounded-[16px] p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-base font-medium text-foreground tracking-[-0.48px]">
            User Assignments
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5 tracking-[-0.14px]">
            Current role assignments for each user
          </p>
        </div>
        <div className="divide-y divide-[#f0f1f3]">
          {mockAssignments.map((user) => {
            const roleDef = roles.find((r) => r.name === user.role);
            return (
              <div key={user.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {roleDef && (
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-[36px] text-[11px] font-medium border", roleDef.color)}>
                      {user.role}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setEditRole(user.role);
                    }}
                    className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#f3f4f6] transition-colors"
                    title="Edit role"
                  >
                    <Pen className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Role Dialog */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditingUser(null)} />
          <div className="relative bg-white rounded-[16px] w-[400px] flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-5 pb-0">
              <h3 className="text-lg font-medium text-foreground tracking-[-0.54px]">Edit Role</h3>
              <button onClick={() => setEditingUser(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f3f4f6]">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Change role for <strong>{editingUser.name}</strong>
              </p>
              <div className="flex flex-col gap-2">
                {roles.map((role) => (
                  <button
                    key={role.name}
                    onClick={() => setEditRole(role.name)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                      editRole === role.name
                        ? "border-primary bg-primary/5"
                        : "border-[#e5e7eb] hover:border-[#d1d5dc]"
                    )}
                  >
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-[36px] text-[11px] font-medium border", role.color)}>
                      {role.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{role.description}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-5 pt-2">
              <button
                onClick={() => setEditingUser(null)}
                className="h-9 px-4 rounded-lg border border-border text-sm text-foreground hover:bg-[#f8f9fa] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="h-9 px-4 rounded-lg bg-primary text-sm text-white hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
