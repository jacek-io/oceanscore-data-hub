export type ShipStatus = "Active" | "Inactive" | "Revoked";
export type Scheme = "ESI" | "EPI";

export interface Ship {
  id: string;
  name: string;
  imo: string;
  schemes: Scheme[];
  status: ShipStatus;
  shipType: string;
  lastUpdated: string;
}

export const ships: Ship[] = [
  { id: "1", name: "Arctic Navigator", imo: "912345678", schemes: ["ESI", "EPI"], status: "Active", shipType: "Container Ship", lastUpdated: "01/01/2026" },
  { id: "2", name: "Astral", imo: "912345679", schemes: ["ESI"], status: "Active", shipType: "Bulk Carrier", lastUpdated: "01/01/2026" },
  { id: "3", name: "Caspian Trader", imo: "912345680", schemes: ["ESI"], status: "Active", shipType: "Tanker", lastUpdated: "01/01/2026" },
  { id: "4", name: "Shadow", imo: "912345681", schemes: ["EPI"], status: "Active", shipType: "Container Ship", lastUpdated: "01/01/2026" },
  { id: "5", name: "MV Mediterranean Pearl", imo: "912345682", schemes: ["ESI", "EPI"], status: "Active", shipType: "Cruise Ship", lastUpdated: "01/01/2026" },
  { id: "6", name: "Shadow", imo: "912345683", schemes: ["ESI", "EPI"], status: "Revoked", shipType: "Tanker", lastUpdated: "01/01/2026" },
  { id: "7", name: "Shadow", imo: "912345684", schemes: ["ESI", "EPI"], status: "Inactive", shipType: "Bulk Carrier", lastUpdated: "01/01/2026" },
  { id: "8", name: "Rosemary", imo: "912345685", schemes: ["ESI"], status: "Active", shipType: "Container Ship", lastUpdated: "01/01/2026" },
  { id: "9", name: "Shadow", imo: "912345686", schemes: ["ESI"], status: "Inactive", shipType: "Tanker", lastUpdated: "01/01/2026" },
  { id: "10", name: "MV Southern Cross", imo: "912345687", schemes: ["ESI", "EPI"], status: "Active", shipType: "Container Ship", lastUpdated: "01/01/2026" },
];

export interface Port {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  schemes: Scheme[];
  startingFrom: number;
  tier: "Single-TIER" | "Multi-TIER";
  type: "Relative" | "Absolute";
}

export const ports: Port[] = [
  { id: "1", name: "Aarhus", country: "Denmark", countryCode: "dk", schemes: ["ESI", "EPI"], startingFrom: 80, tier: "Single-TIER", type: "Relative" },
  { id: "2", name: "Acu", country: "Brazil", countryCode: "br", schemes: ["ESI"], startingFrom: 60, tier: "Multi-TIER", type: "Absolute" },
  { id: "3", name: "Amsterdam", country: "Netherlands", countryCode: "nl", schemes: ["ESI"], startingFrom: 50, tier: "Single-TIER", type: "Relative" },
  { id: "4", name: "Anping", country: "China", countryCode: "cn", schemes: ["ESI", "EPI"], startingFrom: 60, tier: "Multi-TIER", type: "Absolute" },
  { id: "5", name: "Antwerp-Bruges", country: "Belgium", countryCode: "be", schemes: ["EPI"], startingFrom: 60, tier: "Single-TIER", type: "Relative" },
  { id: "6", name: "Barcelona", country: "Spain", countryCode: "es", schemes: ["ESI"], startingFrom: 60, tier: "Multi-TIER", type: "Absolute" },
  { id: "7", name: "Bergen", country: "Norway", countryCode: "no", schemes: ["ESI", "EPI"], startingFrom: 70, tier: "Single-TIER", type: "Absolute" },
  { id: "8", name: "Bodo", country: "Norway", countryCode: "no", schemes: ["ESI", "EPI"], startingFrom: 60, tier: "Single-TIER", type: "Absolute" },
  { id: "9", name: "Borg", country: "Norway", countryCode: "no", schemes: ["ESI"], startingFrom: 50, tier: "Single-TIER", type: "Relative" },
  { id: "10", name: "Botany", country: "Australia", countryCode: "au", schemes: ["ESI", "EPI"], startingFrom: 40, tier: "Single-TIER", type: "Absolute" },
];

export const fleetStats = {
  totalShips: 10,
  active: 7,
  inactive: 2,
  revoked: 1,
  esiParticipation: 9,
  epiParticipation: 6,
  dataSources: 3,
  dataSourcesList: ["DNV", "Lloyds Register"],
};
