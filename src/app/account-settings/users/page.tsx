"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  X,
  UserMinus,
  ChevronDown,
  Shield,
  Pen,
} from "lucide-react";
import { cn } from "@/lib/utils";

type UserRole = "Admin" | "Data Manager" | "Accountant" | "Analyst";

type OrgUser = {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  status: "Active" | "Inactive";
  organization: string;
  lastActive: string;
};

const mockUsers: OrgUser[] = [
  { id: "1", name: "Jacek Zabicki", email: "jacek@oceanscore.com", roles: ["Admin"], status: "Active", organization: "OceanScore GmbH", lastActive: "2026-07-08" },
  { id: "2", name: "Oskar Flegel", email: "oskar@oceanscore.com", roles: ["Admin", "Data Manager"], status: "Active", organization: "OceanScore GmbH", lastActive: "2026-07-08" },
  { id: "3", name: "Maria Silva", email: "maria@oceanscore.com", roles: ["Data Manager"], status: "Active", organization: "OceanScore Iberia Lda", lastActive: "2026-07-05" },
  { id: "4", name: "Erik Svensson", email: "erik@oceanscore.com", roles: ["Analyst"], status: "Active", organization: "OceanScore Nordic AB", lastActive: "2026-07-07" },
  { id: "5", name: "Anna Lindqvist", email: "anna@oceanscore.com", roles: ["Accountant"], status: "Active", organization: "OceanScore Nordic AB", lastActive: "2026-07-06" },
  { id: "6", name: "Hans Weber", email: "hans@oceanscore.com", roles: ["Data Manager"], status: "Inactive", organization: "OceanScore GmbH", lastActive: "2026-05-12" },
];

const allRoles: UserRole[] = ["Admin", "Data Manager", "Accountant", "Analyst"];

const permissions = [
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

const roles = [
  {
    name: "Admin",
    color: "bg-primary/5 text-primary border-primary/20",
    permissions: permissions.map((p) => p.key),
  },
  {
    name: "Data Manager",
    color: "bg-[#d0e5c3] text-[#294215] border-[#b5d49e]",
    permissions: ["fleet_view", "fleet_edit", "upload", "esi_view", "epi_view", "epi_submit"],
  },
  {
    name: "Accountant",
    color: "bg-[#ffedd4] text-[#9f2d00] border-[#ffd6a7]",
    permissions: ["fleet_view", "esi_view", "epi_view", "billing_view", "billing_edit"],
  },
  {
    name: "Analyst",
    color: "bg-[#cce1ff] text-[#1a4a8a] border-[#99c3ff]",
    permissions: ["fleet_view", "esi_view", "epi_view"],
  },
];

type Dialog = null | "invite" | "deactivate" | "editRoles";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [selectedUser, setSelectedUser] = useState<OrgUser | null>(null);

  // Invite form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoles, setInviteRoles] = useState<UserRole[]>([]);

  // Edit roles form
  const [editRoles, setEditRoles] = useState<UserRole[]>([]);

  const toggleInviteRole = (role: UserRole) => {
    setInviteRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.roles.includes(roleFilter as UserRole);
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[16px] p-4 flex flex-col gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-2 pb-4">
          <div>
            <h2 className="text-xl font-medium text-foreground tracking-[-0.6px]">Users</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {mockUsers.filter((u) => u.status === "Active").length} active users across all organizations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Roles</option>
                {allRoles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 pl-4 pr-10 rounded-lg border border-border bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-10 pr-4 w-[200px] rounded-lg border border-border bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => {
                setInviteEmail("");
                setInviteRoles([]);
                setDialog("invite");
              }}
              className="inline-flex items-center gap-2 h-10 px-3 rounded-lg bg-[#061e3a] text-sm text-white hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Invite User
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] first:rounded-l-lg">
                Name
              </th>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                Email
              </th>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                Roles
              </th>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                Organization
              </th>
              <th className="text-left text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6]">
                Status
              </th>
              <th className="text-right text-xs font-normal text-muted-foreground px-4 h-10 bg-[#F3F4F6] last:rounded-r-lg">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={6} className="h-2" /></tr>
            {filtered.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[#f0f1f3] last:border-b-0 hover:bg-[#fafbfc] transition-colors"
              >
                <td className="px-4 py-3.5">
                  <span className="text-sm font-normal text-foreground">{user.name}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-[36px] text-[11px] font-medium border",
                          role === "Admin"
                            ? "bg-primary/5 text-primary border-primary/20"
                            : "bg-[#f3f4f6] text-[#4a5565] border-[#e5e7eb]"
                        )}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-foreground">{user.organization}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] border",
                      user.status === "Active" && "bg-status-active-bg text-[#294215] border-status-active-border",
                      user.status === "Inactive" && "bg-[#f3f4f6] text-[#4a5565] border-[#e5e7eb]"
                    )}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setEditRoles([...user.roles]);
                        setDialog("editRoles");
                      }}
                      className="w-7 h-7 rounded-md inline-flex items-center justify-center hover:bg-[#ebf3ff] active:bg-[#cce1ff] transition-colors"
                      title="Edit roles"
                    >
                      <Pen className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    {user.status === "Active" && (
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setDialog("deactivate");
                        }}
                        className="w-7 h-7 rounded-md inline-flex items-center justify-center hover:bg-[#fef2f2] transition-colors"
                        title="Deactivate user"
                      >
                        <UserMinus className="w-3.5 h-3.5 text-[#9e2028]" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Roles & Permissions Reference */}
      <div className="bg-white rounded-[16px] p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-base font-medium text-foreground tracking-[-0.48px]">
            Roles & Permissions
          </h3>
        </div>
        <p className="text-sm text-muted-foreground tracking-[-0.14px]">
          Each role grants a fixed set of permissions. Assign roles to users above — permissions cannot be customized per user.
        </p>
        <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F3F4F6]">
                <th className="text-left text-xs font-normal text-muted-foreground px-4 h-9 first:rounded-tl-lg">
                  Permission
                </th>
                {roles.map((role) => (
                  <th key={role.name} className="text-center text-xs font-normal text-muted-foreground px-3 h-9 last:rounded-tr-lg">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-[36px] text-[10px] font-medium border", role.color)}>
                      {role.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm) => (
                <tr key={perm.key} className="border-t border-[#f0f1f3]">
                  <td className="px-4 py-2">
                    <p className="text-sm text-foreground">{perm.label}</p>
                    <p className="text-xs text-muted-foreground">{perm.description}</p>
                  </td>
                  {roles.map((role) => (
                    <td key={role.name} className="px-3 py-2 text-center">
                      <span className={cn(
                        "text-xs",
                        role.permissions.includes(perm.key) ? "text-[#294215]" : "text-[#d1d5dc]"
                      )}>
                        {role.permissions.includes(perm.key) ? "✓" : "—"}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Dialog */}
      {dialog === "invite" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDialog(null)} />
          <div className="relative bg-white rounded-[16px] w-[480px] flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-5 pb-0">
              <h3 className="text-lg font-medium text-foreground tracking-[-0.54px]">Invite User</h3>
              <button onClick={() => setDialog(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#ebf3ff] active:bg-[#cce1ff]">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Email Address *</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="user@company.com"
                  className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Assign Roles *</label>
                <div className="flex flex-wrap gap-2">
                  {allRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => toggleInviteRole(role)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm border transition-colors",
                        inviteRoles.includes(role)
                          ? "bg-primary/5 text-primary border-primary/30"
                          : "bg-white text-muted-foreground border-border hover:border-[#d1d5dc]"
                      )}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-5 pt-2">
              <button
                onClick={() => setDialog(null)}
                className="h-9 px-4 rounded-lg border border-border text-sm text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!inviteEmail || inviteRoles.length === 0}
                onClick={() => setDialog(null)}
                className="h-9 px-4 rounded-lg bg-[#061e3a] text-sm text-white hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Roles Dialog */}
      {dialog === "editRoles" && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDialog(null)} />
          <div className="relative bg-white rounded-[16px] w-[400px] flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-5 pb-0">
              <h3 className="text-lg font-medium text-foreground tracking-[-0.54px]">Edit Roles</h3>
              <button onClick={() => setDialog(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#ebf3ff] active:bg-[#cce1ff]">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Update roles for <strong>{selectedUser.name}</strong>
              </p>
              <div className="flex flex-col gap-2">
                {allRoles.map((role) => {
                  const roleDef = roles.find((r) => r.name === role);
                  const isSelected = editRoles.includes(role);
                  return (
                    <button
                      key={role}
                      onClick={() =>
                        setEditRoles((prev) =>
                          prev.includes(role)
                            ? prev.filter((r) => r !== role)
                            : [...prev, role]
                        )
                      }
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-[#e5e7eb] hover:border-[#d1d5dc]"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center text-[10px]",
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "border-[#d1d5dc]"
                      )}>
                        {isSelected && "✓"}
                      </div>
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-[36px] text-[11px] font-medium border", roleDef?.color)}>
                        {role}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-5 pt-2">
              <button
                onClick={() => setDialog(null)}
                className="h-9 px-4 rounded-lg border border-border text-sm text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={editRoles.length === 0}
                onClick={() => setDialog(null)}
                className="h-9 px-4 rounded-lg bg-[#061e3a] text-sm text-white hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Dialog */}
      {dialog === "deactivate" && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDialog(null)} />
          <div className="relative bg-white rounded-[16px] w-[440px] flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-5 pb-0">
              <h3 className="text-lg font-medium text-foreground tracking-[-0.54px]">Deactivate User</h3>
              <button onClick={() => setDialog(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#ebf3ff] active:bg-[#cce1ff]">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to deactivate <strong>{selectedUser.name}</strong> ({selectedUser.email})?
                They will lose access to the platform but their data will be preserved.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 p-5 pt-2">
              <button
                onClick={() => setDialog(null)}
                className="h-9 px-4 rounded-lg border border-border text-sm text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setDialog(null)}
                className="h-9 px-4 rounded-lg bg-[#dc2626] text-sm text-white hover:bg-[#b91c1c] transition-colors"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
