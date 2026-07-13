"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  CloudUpload,
  Trash2,
  RefreshCcw,
  CircleCheck,
  CircleX,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type FileStatus = "processing" | "completed" | "failed";

export interface UploadedFile {
  file: File;
  status: FileStatus;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileUploadItem({
  uploadedFile,
  onRemove,
  onRetry,
}: {
  uploadedFile: UploadedFile;
  onRemove: () => void;
  onRetry: () => void;
}) {
  const { file, status } = uploadedFile;

  return (
    <div className="bg-white border border-border rounded-lg px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-[43px] h-[43px] rounded-lg bg-[#f3f4f6] flex items-center justify-center shrink-0">
          <Image
            src="/file-icon.svg"
            alt="File"
            width={22}
            height={26}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">
            {file.name}
          </span>
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <span>{formatFileSize(file.size)}</span>
            <span className="tracking-[1px]">&bull;</span>
            <div className="flex items-center gap-1">
              {status === "processing" && (
                <>
                  <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                  <span>Processing</span>
                </>
              )}
              {status === "completed" && (
                <>
                  <CircleCheck className="w-4 h-4 text-[#5C8A3E]" />
                  <span>Completed</span>
                </>
              )}
              {status === "failed" && (
                <>
                  <CircleX className="w-4 h-4 text-[#dc2626]" />
                  <span>Failed</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={status === "failed" ? onRetry : onRemove}
        className="w-8 h-8 flex items-center justify-center shrink-0 hover:bg-[#ebf3ff] active:bg-[#cce1ff] rounded transition-colors"
      >
        {status === "failed" ? (
          <RefreshCcw className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Trash2 className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

export function FileDropZone({
  files,
  onFilesChange,
  subtitle,
}: {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  subtitle?: string;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFile = (file: File) => {
    const newFile: UploadedFile = { file, status: "processing" };
    const updated = [...files, newFile];
    onFilesChange(updated);

    // Simulate processing → completed
    setTimeout(() => {
      onFilesChange(
        updated.map((f) =>
          f === newFile ? { ...f, status: "completed" as FileStatus } : f
        )
      );
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) addFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) addFile(selectedFile);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const handleRetry = (index: number) => {
    const updated = [...files];
    updated[index] = { ...updated[index], status: "processing" };
    onFilesChange(updated);

    setTimeout(() => {
      onFilesChange(
        updated.map((f, i) =>
          i === index ? { ...f, status: "completed" as FileStatus } : f
        )
      );
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "border border-dashed border-[#98a1ae] rounded-[16px] bg-[#f3f4f6] h-[240px] flex flex-col items-center justify-center gap-4 transition-colors",
          isDragOver && "border-primary bg-[#f0f6ff]"
        )}
      >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <CloudUpload className="w-5 h-5 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground tracking-[-0.54px]">
          Drop your files here
        </h3>
        <p className="text-sm text-muted-foreground text-center leading-[1.45]">
          {subtitle || (
            <>
              CSV or Excel (.csv, .xlsx) up to 20 MB.
              <br />
              The first row should contain your column names.
            </>
          )}
        </p>
        <label className="inline-flex items-center gap-2 h-10 px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors cursor-pointer">
          Browse Files
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((f, i) => (
            <FileUploadItem
              key={`${f.file.name}-${i}`}
              uploadedFile={f}
              onRemove={() => handleRemove(i)}
              onRetry={() => handleRetry(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
