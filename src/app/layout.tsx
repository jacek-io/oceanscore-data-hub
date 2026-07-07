import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: "OceanScore Data Hub",
  description: "Centralized ship master data, BDNs, EDNs, and Tier III hours",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex font-sans">
        <TooltipProvider>
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </TooltipProvider>
      </body>
    </html>
  );
}
