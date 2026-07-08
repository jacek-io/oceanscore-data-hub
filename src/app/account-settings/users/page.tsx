"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  X,
  UserMinus,
  ChevronDown,
  ArrowUpDown,
  ChevronUp,
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

type Dialog = null | "invite" | "deactivate";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [selectedUser, setSelectedUser] = useState<OrgUser | null>(null);

  // Invite form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoles, setInviteRoles] = useState<UserRole[]>([]);

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
              className="inline-flex items-center gap-2 h-10 px-3 rounded-lg bg-primary text-sm text-white hover:bg-primary/90 transition-colors"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Dialog */}
      {dialog === "invite" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDialog(null)} />
          <div className="relative bg-white rounded-[16px] w-[480px] flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-5 pb-0">
              <h3 className="text-lg font-medium text-foreground tracking-[-0.54px]">Invite User</h3>
              <button onClick={() => setDialog(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f3f4f6]">
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
                className="h-9 px-4 rounded-lg border border-border text-sm text-foreground hover:bg-[#f8f9fa] transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!inviteEmail || inviteRoles.length === 0}
                onClick={() => setDialog(null)}
                className="h-9 px-4 rounded-lg bg-primary text-sm text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Invitation
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
              <button onClick={() => setDialog(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f3f4f6]">
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
                className="h-9 px-4 rounded-lg border border-border text-sm text-foreground hover:bg-[#f8f9fa] transition-colors"
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
