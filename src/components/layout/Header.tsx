"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  PanelLeft,
  PanelRight,
  Download,
  FileText,
  FileCode,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";

export function Header() {
  const {
    isSidebarOpen,
    toggleSidebar,
    isContextPanelOpen,
    toggleContextPanel,
    messages,
  } = useTaskStore();

  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleExport = (format: "md" | "json") => {
    setIsExportOpen(false);
    let dataStr = "";
    let filename = `ABHEDYA_AI_Export_${Date.now()}`;
    if (format === "md") {
      dataStr = messages.map((m) => `## ${m.role.toUpperCase()} [${m.timestamp}]\n\n${m.content}\n\n---\n`).join("\n");
      filename += ".md";
    } else {
      dataStr = JSON.stringify(messages, null, 2);
      filename += ".json";
    }
    const blob = new Blob([dataStr], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header
      className="flex items-center justify-between px-4 z-30 select-none shrink-0"
      style={{
        height: "64px",
        background: "var(--wb-surface)",
        borderBottom: "1px solid var(--wb-border-subtle)",
      }}
    >
      {/* ── Left: sidebar toggle + brand ── */}
      <div className="flex items-center gap-2 min-w-0">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--wb-text-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--wb-surface-hover)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            title="Open sidebar (Ctrl+B)"
            aria-label="Open sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "/";
          }}
          className="flex items-center gap-2.5 ml-1 min-w-0 cursor-pointer group"
          title="ABHEDYA AI - Return to Landing Page"
        >
          <Image
            src="/img/Abhedya_logo.png"
            alt="ABHEDYA AI"
            width={36}
            height={36}
            className="rounded-lg object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
            priority
          />
          <div className="hidden sm:block min-w-0">
            <div
              className="text-sm font-semibold leading-tight tracking-tight truncate transition-colors duration-200 group-hover:text-[var(--wb-teal)]"
              style={{ color: "var(--wb-text)" }}
            >
              ABHEDYA AI
            </div>
            <div
              className="text-[10px] font-mono leading-tight"
              style={{ color: "var(--wb-text-muted)" }}
            >
              Sovereign Workbench
            </div>
          </div>
        </a>
      </div>


      {/* ── Right: export + panel toggle ── */}
      <div className="flex items-center gap-1">
        {/* Export */}
        <div className="relative">
          <button
            onClick={() => setIsExportOpen(!isExportOpen)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--wb-text-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--wb-surface-hover)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            title="Export session"
            aria-label="Export"
          >
            <Download className="w-4 h-4" />
          </button>

          {isExportOpen && (
            <div
              className="absolute right-0 mt-1.5 w-44 rounded-xl py-1 z-50"
              style={{
                background: "var(--wb-surface-card)",
                border: "1px solid var(--wb-border-medium)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.28)",
              }}
            >
              <div
                className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--wb-text-muted)" }}
              >
                Export Session
              </div>
              {[
                { format: "md" as const,   icon: FileText, label: "Markdown (.md)" },
                { format: "json" as const, icon: FileCode, label: "Audit JSON (.json)" },
              ].map(({ format, icon: Icon, label }) => (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  className="w-full text-left px-3 py-2 text-sm flex items-center gap-2.5 transition-colors"
                  style={{ color: "var(--wb-text-sec)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--wb-surface-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: "var(--wb-text-muted)" }} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Context Panel Toggle */}
        <button
          onClick={toggleContextPanel}
          className="p-2 rounded-lg transition-colors"
          style={{
            color: isContextPanelOpen ? "var(--wb-teal)" : "var(--wb-text-muted)",
            background: isContextPanelOpen ? "var(--wb-teal-soft)" : "transparent",
          }}
          onMouseEnter={e => {
            if (!isContextPanelOpen) e.currentTarget.style.background = "var(--wb-surface-hover)";
          }}
          onMouseLeave={e => {
            if (!isContextPanelOpen) e.currentTarget.style.background = "transparent";
          }}
          title="Toggle Agent Trace panel"
          aria-label="Toggle Agent Trace"
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
