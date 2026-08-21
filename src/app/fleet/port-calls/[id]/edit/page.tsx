"use client";

import { use } from "react";
import { PortCallForm, type PortCallInitialData } from "@/components/fleet/port-call-form";

/* -- Mock port call data for edit (matches the list page) -- */
const portCallsData: Record<string, PortCallInitialData> = {
  "1": { ship: "Arctic Navigator", port: "Bergen", terminal: "Container Terminal", arrivalDate: "2026-03-18", arrivalTime: "08:30", departureDate: "2026-03-26", departureTime: "14:00" },
  "2": { ship: "Astral", port: "Bremerhaven", terminal: "NTB North Sea", arrivalDate: "2026-03-14", arrivalTime: "19:30", departureDate: "2026-03-18", departureTime: "16:15" },
  "3": { ship: "Caspian Trader", port: "Antwerp", terminal: "Deurganck Dock", arrivalDate: "2026-03-22", arrivalTime: "12:00", departureDate: "2026-03-29", departureTime: "20:30" },
  "4": { ship: "Shadow", port: "Rotterdam", terminal: "Europoort Terminal", arrivalDate: "2026-03-18", arrivalTime: "19:30", departureDate: "2026-03-25", departureTime: "08:00" },
  "5": { ship: "MV Mediterranean Pearl", port: "Felixstowe", terminal: "Trinity Terminal", arrivalDate: "2026-03-11", arrivalTime: "01:15", departureDate: "2026-03-19", departureTime: "19:00" },
  "6": { ship: "Shadow", port: "Oslo", terminal: "Sjursoya Terminal", arrivalDate: "2026-03-14", arrivalTime: "01:15", departureDate: "2026-03-21", departureTime: "12:00" },
  "7": { ship: "Shadow", port: "Stavanger", terminal: "Risavika Terminal", arrivalDate: "2026-03-13", arrivalTime: "20:15", departureDate: "2026-03-20", departureTime: "15:45" },
  "8": { ship: "Rosemary", port: "Gothenburg", terminal: "APM Terminal", arrivalDate: "2026-03-12", arrivalTime: "14:30", departureDate: "2026-03-18", departureTime: "07:00" },
  "9": { ship: "Shadow", port: "Hamburg", terminal: "Burchardkai Terminal", arrivalDate: "2026-03-21", arrivalTime: "04:00", departureDate: "2026-03-28", departureTime: "17:15" },
  "10": { ship: "MV Southern Cross", port: "Aarhus", terminal: "Container Terminal", arrivalDate: "2026-03-19", arrivalTime: "12:30", departureDate: "2026-03-25", departureTime: "10:00" },
};

export default function EditPortCallPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const data = portCallsData[id];

  return (
    <PortCallForm
      title="Edit Port Call"
      initialData={data}
    />
  );
}
