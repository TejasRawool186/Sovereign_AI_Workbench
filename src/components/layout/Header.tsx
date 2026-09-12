"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PanelLeft,
  PanelRight,
  Download,
  FileText,
  FileCode,
  ShieldCheck,
  ShieldAlert,
  Server,
  Lock,
  Activity,
  X,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";

export function Header() {
  const {
    isSidebarOpen,
    toggleSidebar,
    isContextPanelOpen,
    toggleContextPanel,
    messages,
    networkStats,
    activeSockets,
  } = useTaskStore();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isEnclaveOpen, setIsEnclaveOpen] = useState(false);
  const enclaveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (enclaveRef.current && !enclaveRef.current.contains(e.target as Node)) {
        setIsEnclaveOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  const isAirGapped = networkStats.airGapStatus === "VERIFIED_AIRGAP";
  const outboundBytes = networkStats.outboundBytesTotal ?? 0;
  const blocked = networkStats.blockedOutboundAttempts ?? 0;

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

        <Link href="/" className="flex items-center gap-2.5 ml-1 min-w-0">
          <Image
            src="/img/Abhedya_logo.png"
            alt="ABHEDYA AI"
            width={36}
            height={36}
            className="rounded-lg object-contain shrink-0"
            priority
          />
          <div className="hidden sm:block min-w-0">
            <div
              className="text-sm font-semibold leading-tight tracking-tight truncate"
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
        </Link>
      </div>

      {/* ── Centre: Air-gap status indicator ── */}
      <div className="flex-1 flex justify-center" ref={enclaveRef}>
        <div className="relative">
          <button
            onClick={() => setIsEnclaveOpen(!isEnclaveOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: isAirGapped
                ? "rgba(69,196,154,0.08)"
                : "rgba(229,184,92,0.08)",
              border: `1px solid ${isAirGapped ? "rgba(69,196,154,0.22)" : "rgba(229,184,92,0.22)"}`,
            }}
            title="Click to view enclave telemetry"
            aria-label="Enclave status"
          >
            {isAirGapped
              ? <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--wb-success)" }} />
              : <ShieldAlert className="w-3.5 h-3.5" style={{ color: "var(--wb-warning)" }} />
            }
            <span
              className="hidden sm:inline text-[11px] font-semibold font-mono"
              style={{ color: isAirGapped ? "var(--wb-success)" : "var(--wb-warning)" }}
            >
              AIR-GAPPED
            </span>
            <span
              className="hidden sm:inline text-[11px] font-mono"
              style={{ color: "var(--wb-text-muted)" }}
            >
              ·
            </span>
            <span
              className="text-[11px] font-semibold font-mono"
              style={{ color: isAirGapped ? "var(--wb-success)" : "var(--wb-warning)" }}
            >
              {outboundBytes === 0 ? "0 OUTBOUND BYTES" : `${outboundBytes} B EGRESS`}
            </span>
          </button>

          {/* Enclave telemetry popover */}
          {isEnclaveOpen && (
            <div
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-80 z-50 rounded-xl p-4 space-y-3"
              style={{
                background: "var(--wb-surface-card)",
                border: "1px solid var(--wb-border-medium)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.32)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" style={{ color: "var(--wb-success)" }} />
                  <span className="text-sm font-semibold" style={{ color: "var(--wb-text)" }}>
                    Enclave Telemetry
                  </span>
                </div>
                <button
                  onClick={() => setIsEnclaveOpen(false)}
                  className="p-0.5 rounded transition-colors"
                  style={{ color: "var(--wb-text-muted)" }}
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Lock,     label: "Air-Gap",     value: isAirGapped ? "VERIFIED" : "DEGRADED", ok: isAirGapped },
                  { icon: Activity, label: "Egress Bytes", value: `${outboundBytes} B`,                  ok: true },
                  { icon: ShieldAlert, label: "Blocked",  value: `${blocked} probes`,                   ok: true },
                  { icon: Server,   label: "Sockets",     value: `${networkStats.totalSockets} local`,   ok: true },
                ].map(({ icon: Icon, label, value, ok }) => (
                  <div
                    key={label}
                    className="p-2.5 rounded-lg"
                    style={{ background: "var(--wb-surface)", border: "1px solid var(--wb-border-subtle)" }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3 h-3" style={{ color: "var(--wb-text-muted)" }} />
                      <span className="text-[10px] font-mono uppercase" style={{ color: "var(--wb-text-muted)" }}>
                        {label}
                      </span>
                    </div>
                    <div
                      className="text-[11px] font-bold font-mono"
                      style={{ color: ok ? "var(--wb-success)" : "var(--wb-warning)" }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase" style={{ color: "var(--wb-text-muted)" }}>
                  Active Socket Registry
                </div>
                {activeSockets.slice(0, 4).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between py-1 px-2 rounded text-[10px] font-mono"
                    style={{
                      background: s.isBlocked
                        ? "rgba(228,106,106,0.08)"
                        : "rgba(69,196,154,0.06)",
                      color: s.isBlocked ? "var(--wb-danger)" : "var(--wb-success)",
                    }}
                  >
                    <span className="truncate max-w-[160px]">{s.processName}</span>
                    <span>{s.isBlocked ? "BLOCKED" : s.localPort}</span>
                  </div>
                ))}
              </div>

              <div
                className="pt-2 border-t text-[10px] font-mono"
                style={{ borderColor: "var(--wb-border-subtle)", color: "var(--wb-text-muted)" }}
              >
                Interface: {networkStats.hardwareInterface}
              </div>
            </div>
          )}
        </div>
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
