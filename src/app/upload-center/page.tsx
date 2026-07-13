"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FilePlus2,
  ArrowRight,
  Settings2,
  Droplets,
  Zap,
  Ship,
  Fan,
} from "lucide-react";
import { FileDropZone, type UploadedFile } from "@/components/ui/file-upload";

const templates = [
  {
    title: "Tier III Hours",
    description:
      "Engine operating hours and NOx emissions in Tier III mode, per engine.",
    icon: Settings2,
  },
  {
    title: "Bunker Delivery",
    description:
      "Fuel delivery details from BDN quantity, type, sulphur content, and supplier.",
    icon: Droplets,
  },
  {
    title: "Onshore Power & Solar",
    description:
      "Shore power consumption and renewable energy generation.",
    icon: Zap,
  },
  {
    title: "Ship Master Data",
    description:
      "Core vessel details: IMO number, ship type, tonnage, and engine specs.",
    icon: Ship,
  },
  {
    title: "Engines",
    description:
      "Technical data per engine type, rated power, and NOx tier.",
    icon: Fan,
  },
];

export default function UploadCenterPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center pt-16 px-5 pb-10">
        <div className="w-[1100px] max-w-full flex flex-col items-center gap-8">
          {/* Hero */}
          <div className="text-center flex flex-col items-center gap-2">
            <h1 className="text-[32px] font-medium text-foreground tracking-[-0.96px]">
              Upload Center
            </h1>
            <p className="text-sm text-muted-foreground tracking-[-0.14px] leading-[1.2]">
              Select a data type, download its template,
              <br />
              and upload your populated file.
            </p>
          </div>

          {/* Custom upload banner */}
          <div
            className="w-full rounded-[16px] p-4 flex items-center gap-6 relative overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: "url('/upload-banner-bg.jpg')",
            }}
          >
            <div className="flex items-center gap-4 flex-1 relative z-10">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <FilePlus2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium text-white tracking-[-0.54px]">
                    Have data in your own format?
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-[36px] text-[11px] font-medium leading-[1.45] bg-[#1157b2] border border-[#1157b2] text-white">
                    New
                  </span>
                </div>
                <p className="text-[12px] text-[#d1d5dc] leading-[1.45] max-w-[450px]">
                  Upload a custom CSV or Excel file, no template needed.
                  We&apos;ll guide you through matching your columns and
                  values to OceanScore fields.
                </p>
              </div>
            </div>
            <Link
              href="/upload-center/custom-import"
              className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-[12px] font-normal text-primary shrink-0 hover:bg-[#ebf3ff] active:bg-[#cce1ff] transition-colors"
            >
              Upload Custom File
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Template cards grid */}
          <div className="w-full flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              {templates.slice(0, 3).map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.title}
                    className="bg-white rounded-[16px] py-4 flex flex-col gap-4"
                  >
                    <div className="flex items-start gap-2 px-4">
                      <div className="flex flex-col gap-4 flex-1">
                        <h3 className="text-base font-medium text-foreground">
                          {t.title}
                        </h3>
                        <p className="text-[12px] text-muted-foreground">
                          {t.description}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="px-4">
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-white text-[12px] font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
                        Download Template
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {templates.slice(3).map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.title}
                    className="bg-white rounded-[16px] py-4 flex flex-col gap-4"
                  >
                    <div className="flex items-start gap-2 px-4">
                      <div className="flex flex-col gap-4 flex-1">
                        <h3 className="text-base font-medium text-foreground">
                          {t.title}
                        </h3>
                        <p className="text-[12px] text-muted-foreground">
                          {t.description}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="px-4">
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-white text-[12px] font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors">
                        Download Template
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drop zone */}
          <div className="w-full bg-white rounded-[16px] p-2">
            <FileDropZone
              files={files}
              onFilesChange={setFiles}
              subtitle="Upload your populated template"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
