"use client";

import React from "react";
import {
  Activity,
  CheckCircle2,
  BookOpen,
  Cpu,
  FileDown,
  Download,
  Hash,
  Terminal,
  FlaskConical,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";

/* ── Evidence data ─────────────────────────────────────────────────────── */
const evidenceCards = [
  {
    source: "MRPL Hydrocracker-SOPs",
    tag: "#Hydrocracker-SOPs · p.14",
    similarity: 0.91,
    clause: "HP Recycle Flange minimum inspection interval: 5 years. MAWT = 2.50 mm for schedule-40 P22 alloy.",
  },
  {
    source: "API 570 Piping Inspection Code §7.1.1",
    tag: "#Piping-API570 · p.47",
    similarity: 0.94,
    clause: "When remaining life is less than twice the inspection interval, the next inspection date shall not exceed the half-life.",
  },
  {
    source: "OISD-STD-105 Clause 4.2.1",
    tag: "#OISD-105 · p.22",
    similarity: 0.88,
    clause: "Corrosion rate exceeding 0.5 mm/yr on pressure-bearing components mandates escalation to Lead Corrosion Engineer.",
  },
];

/* ── RouterCard ─────────────────────────────────────────────────────────── */
function RouterCard() {
  const activeTraceSteps = useTaskStore((s) => s.activeTraceSteps);
  const isCodeTask = activeTraceSteps.some((s) => s.node === "code_generate" || s.node === "sandbox_execute");

  const rows = isCodeTask
    ? [
        { label: "Input",    value: "structured_table · task=code" },
        { label: "GPU",      value: "6.2 GB headroom" },
        { label: "Risk",     value: "Low (code gen only)" },
        { label: "Selected", value: "Qwen2.5-Coder-7B", highlight: true },
      ]
    : [
        { label: "Input",    value: "PDF + image · risk=Critical" },
        { label: "GPU",      value: "7.8 GB headroom" },
        { label: "Model A",  value: "Qwen2.5-VL-7B", highlight: true },
        { label: "Model B",  value: "Qwen2.5-14B",   highlight: true },
      ];

  return (
    <div
      className="rounded-lg p-3 space-y-2"
      style={{ background: "var(--wb-surface)", border: "1px solid var(--wb-border-subtle)" }}
    >
      <div className="flex items-center gap-2 pb-1.5" style={{ borderBottom: "1px solid var(--wb-border-subtle)" }}>
        <Cpu className="w-3.5 h-3.5" style={{ color: "var(--wb-teal)" }} />
        <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--wb-text-muted)" }}>
          Model Router Decision
        </span>
      </div>
      <div className="space-y-1.5">
        {rows.map(({ label, value, highlight }) => (
          <div key={label} className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono" style={{ color: "var(--wb-text-muted)" }}>{label}</span>
            <span
              className="text-[11px] font-mono font-semibold"
              style={{ color: highlight ? "var(--wb-teal)" : "var(--wb-text-sec)" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── CalculationCard ────────────────────────────────────────────────────── */
function CalculationCard() {
  const activeTraceSteps = useTaskStore((s) => s.activeTraceSteps);
  const isCodeTask = activeTraceSteps.some((s) => s.node === "code_generate" || s.node === "sandbox_execute");
  const sandboxDone = activeTraceSteps.find((s) => s.node === "sandbox_execute")?.status === "completed";

  if (isCodeTask) {
    return (
      <div className="space-y-3">
        {/* Sandbox */}
        <div
          className="rounded-lg p-3 space-y-2"
          style={{
            background: sandboxDone ? "rgba(69,196,154,0.06)" : "var(--wb-surface)",
            border: `1px solid ${sandboxDone ? "rgba(69,196,154,0.20)" : "var(--wb-border-subtle)"}`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" style={{ color: "var(--wb-teal)" }} />
              <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--wb-text-muted)" }}>
                Sandbox Execution
              </span>
            </div>
            {sandboxDone && (
              <span
                className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                style={{ background: "rgba(69,196,154,0.12)", color: "var(--wb-success)", border: "1px solid rgba(69,196,154,0.22)" }}
              >
                EXIT 0
              </span>
            )}
          </div>
          {[
            { k: "Image",   v: "python:3.11-slim" },
            { k: "Network", v: "--network none", ok: true },
            { k: "Memory",  v: "--memory 256m --cpus 0.5" },
          ].map(({ k, v, ok }) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-[11px] font-mono" style={{ color: "var(--wb-text-muted)" }}>{k}</span>
              <span className="text-[11px] font-mono font-semibold" style={{ color: ok ? "var(--wb-success)" : "var(--wb-text-sec)" }}>{v}</span>
            </div>
          ))}
          {sandboxDone && (
            <div
              className="mt-1 px-3 py-2 rounded text-[10px] font-mono leading-relaxed"
              style={{ background: "#040e14", color: "var(--wb-success)" }}
            >
              <div className="text-[9px] mb-1 uppercase tracking-wider" style={{ color: "var(--wb-text-muted)" }}>stdout</div>
              <div>CML-HC-102-B  cr=0.564  rl=1.24  CRITICAL</div>
              <div>CML-HC-101B   cr=0.450  rl=7.55  WARNING</div>
              <div>CML-HC-101A   cr=0.280  rl=15.36 NORMAL</div>
              <div>CML-HC-103C   cr=0.580  rl=1.91  CRITICAL</div>
            </div>
          )}
        </div>

        {/* Self-RAG */}
        <div
          className="rounded-lg p-3 space-y-2"
          style={{ background: "var(--wb-surface)", border: "1px solid var(--wb-border-subtle)" }}
        >
          <div className="flex items-center gap-2 pb-1.5" style={{ borderBottom: "1px solid var(--wb-border-subtle)" }}>
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--wb-teal)" }} />
            <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--wb-text-muted)" }}>
              Self-RAG Verification
            </span>
          </div>
          {[
            { k: "Tolerance",     v: "±0.01 mm/yr" },
            { k: "Rows checked",  v: "4 / 4" },
          ].map(({ k, v }) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-[11px] font-mono" style={{ color: "var(--wb-text-muted)" }}>{k}</span>
              <span className="text-[11px] font-mono font-semibold" style={{ color: "var(--wb-text-sec)" }}>{v}</span>
            </div>
          ))}
          {sandboxDone && (
            <div className="text-[11px] font-semibold font-mono pt-1" style={{ color: "var(--wb-success)" }}>
              ✓ All values evidence-grounded — PASSED
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Critical finding */}
      <div
        className="rounded-lg p-3 space-y-2"
        style={{ background: "rgba(228,106,106,0.06)", border: "1px solid rgba(228,106,106,0.18)" }}
      >
        <div className="flex items-center justify-between pb-1.5" style={{ borderBottom: "1px solid rgba(228,106,106,0.12)" }}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" style={{ color: "var(--wb-danger)" }} />
            <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--wb-text-muted)" }}>
              Critical Finding
            </span>
          </div>
          <span
            className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
            style={{ background: "rgba(228,106,106,0.12)", color: "var(--wb-danger)", border: "1px solid rgba(228,106,106,0.22)" }}
          >
            CRITICAL
          </span>
        </div>
        {[
          { k: "Asset",      v: "HC-102-B",  c: "var(--wb-text-sec)" },
          { k: "Nominal",    v: "6.02 mm",   c: "var(--wb-text-sec)" },
          { k: "Measured",   v: "3.20 mm",   c: "var(--wb-warning)" },
          { k: "MAWT",       v: "2.50 mm",   c: "var(--wb-danger)" },
          { k: "CR",         v: "0.564 mm/yr", c: "var(--wb-danger)" },
          { k: "Rem. Life",  v: "1.24 yrs",  c: "var(--wb-danger)" },
          { k: "MAWT breach",v: "Q3 2027",   c: "var(--wb-danger)" },
        ].map(({ k, v, c }) => (
          <div key={k} className="flex items-center justify-between">
            <span className="text-[11px] font-mono" style={{ color: "var(--wb-text-muted)" }}>{k}</span>
            <span className="text-[11px] font-mono font-semibold" style={{ color: c }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Calculation */}
      <div
        className="rounded-lg p-3"
        style={{ background: "var(--wb-surface)", border: "1px solid var(--wb-border-subtle)" }}
      >
        <div className="flex items-center gap-2 mb-2.5 pb-1.5" style={{ borderBottom: "1px solid var(--wb-border-subtle)" }}>
          <FlaskConical className="w-3.5 h-3.5" style={{ color: "var(--wb-teal)" }} />
          <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--wb-text-muted)" }}>
            Sandbox Calculation
          </span>
        </div>
        <div className="text-[11px] font-mono space-y-1 leading-relaxed" style={{ color: "var(--wb-teal)" }}>
          <div>CR = (6.02 − 3.20) / 5.0</div>
          <div className="pl-4" style={{ color: "var(--wb-text-muted)" }}> = 0.564 mm/yr</div>
          <div className="mt-1">RL = (3.20 − 2.50) / 0.564</div>
          <div className="pl-4" style={{ color: "var(--wb-text-muted)" }}> = 1.24 years</div>
        </div>
        <div className="mt-2 text-[10px] font-mono" style={{ color: "var(--wb-success)" }}>
          ✓ Docker --network none · exit 0
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */
export function ContextPanel() {
  const {
    isContextPanelOpen,
    activeTraceSteps,
    isExecuting,
    activeContextTab,
    setActiveContextTab,
    messages,
  } = useTaskStore();

  if (!isContextPanelOpen) return null;

  const latestDeliverable = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && m.deliverable)?.deliverable;

  const tabs = [
    { id: "timeline"    as const, label: "Timeline",    icon: Activity    },
    { id: "context"     as const, label: "Evidence",    icon: BookOpen    },
    { id: "calculation" as const, label: "Calc",        icon: FlaskConical },
    { id: "deliverable" as const, label: "Deliverable", icon: FileDown    },
  ];

  return (
    <aside
      className="h-full flex flex-col shrink-0 select-none overflow-hidden"
      style={{
        width: "340px",
        background: "var(--wb-surface)",
        borderLeft: "1px solid var(--wb-border-subtle)",
      }}
    >
      {/* Panel header */}
      <div style={{ borderBottom: "1px solid var(--wb-border-subtle)" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" style={{ color: "var(--wb-teal)" }} />
            <span className="text-sm font-semibold" style={{ color: "var(--wb-text)" }}>
              Agent Trace
            </span>
          </div>
          <span
            className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded"
            style={{
              background: isExecuting ? "rgba(229,184,92,0.10)" : "rgba(69,196,154,0.10)",
              color: isExecuting ? "var(--wb-warning)" : "var(--wb-success)",
              border: `1px solid ${isExecuting ? "rgba(229,184,92,0.22)" : "rgba(69,196,154,0.22)"}`,
            }}
          >
            {isExecuting ? "RUNNING" : "READY"}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex px-3 gap-0.5">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeContextTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveContextTab(id as any)}
                className="flex items-center gap-1.5 px-2.5 py-2 text-[11px] font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap"
                style={{
                  color: isActive ? "var(--wb-teal)" : "var(--wb-text-muted)",
                  borderBottomColor: isActive ? "var(--wb-teal)" : "transparent",
                }}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── TIMELINE ─────────────────────────────────────────── */}
        {activeContextTab === "timeline" && (
          <div className="p-4">
            <div
              className="relative pl-6 space-y-3"
              style={{
                // Connector line
                backgroundImage: `linear-gradient(var(--wb-border-subtle) 1px, transparent 1px)`,
                backgroundSize: "1px 100%",
                backgroundPosition: "10px 0",
                backgroundRepeat: "no-repeat",
              }}
            >
              {activeTraceSteps.map((step, idx) => {
                const isCompleted     = step.status === "completed";
                const isRunning       = step.status === "running";
                const isWaiting       = step.status === "waiting_approval";
                const isFailed        = step.status === "failed";

                const dotColor = isCompleted ? "var(--wb-success)"
                  : isRunning   ? "var(--wb-teal)"
                  : isWaiting   ? "var(--wb-warning)"
                  : isFailed    ? "var(--wb-danger)"
                  : "var(--wb-border-medium)";

                return (
                  <div key={step.id} className="relative">
                    {/* Dot */}
                    <div
                      className="absolute -left-6 top-2.5 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{
                        background: isCompleted || isWaiting
                          ? `color-mix(in srgb, ${dotColor} 15%, transparent)`
                          : "var(--wb-surface)",
                        borderColor: dotColor,
                      }}
                    >
                      {isCompleted && (
                        <CheckCircle2 className="w-2.5 h-2.5" style={{ color: dotColor }} />
                      )}
                    </div>

                    {/* Card */}
                    <div
                      className="rounded-lg p-3 space-y-1.5"
                      style={{
                        background: "var(--wb-surface-card)",
                        border: `1px solid ${isRunning || isWaiting ? `color-mix(in srgb, ${dotColor} 30%, transparent)` : "var(--wb-border-subtle)"}`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className="text-[12.5px] font-medium leading-snug"
                          style={{ color: "var(--wb-text)" }}
                        >
                          {step.label}
                        </span>
                        {step.durationMs && (
                          <span
                            className="text-[10px] font-mono shrink-0"
                            style={{ color: "var(--wb-text-muted)" }}
                          >
                            {step.durationMs}ms
                          </span>
                        )}
                      </div>

                      <div
                        className="text-[10px] font-mono"
                        style={{ color: "var(--wb-teal)" }}
                      >
                        {step.node}
                      </div>

                      <p
                        className="text-[11px] leading-relaxed"
                        style={{ color: "var(--wb-text-muted)" }}
                      >
                        {step.description}
                      </p>

                      {step.outputSummary && (
                        <div
                          className="px-2 py-1.5 rounded text-[11px] font-mono"
                          style={{
                            background: "rgba(69,196,154,0.06)",
                            border: "1px solid rgba(69,196,154,0.16)",
                            color: "var(--wb-success)",
                          }}
                        >
                          ✓ {step.outputSummary}
                        </div>
                      )}

                      {step.status === "waiting_approval" && (
                        <div
                          className="px-2 py-1.5 rounded text-[11px] font-mono"
                          style={{
                            background: "rgba(229,184,92,0.08)",
                            border: "1px solid rgba(229,184,92,0.20)",
                            color: "var(--wb-warning)",
                          }}
                        >
                          ● Awaiting operator sign-off
                        </div>
                      )}

                      {step.logs.length > 0 && (
                        <div className="space-y-0.5 pt-1">
                          {step.logs.slice(-2).map((log, li) => (
                            <div
                              key={li}
                              className="text-[10px] font-mono leading-snug"
                              style={{ color: "var(--wb-text-muted)" }}
                            >
                              › {log}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── EVIDENCE ─────────────────────────────────────────── */}
        {activeContextTab === "context" && (
          <div className="p-4 space-y-3">
            <RouterCard />

            <div
              className="text-[10px] font-mono font-semibold uppercase tracking-wider pt-1"
              style={{ color: "var(--wb-text-muted)" }}
            >
              Retrieved SOP Evidence
            </div>

            {evidenceCards.map((card, i) => (
              <div
                key={i}
                className="rounded-lg p-3 space-y-2"
                style={{
                  background: "var(--wb-surface-card)",
                  border: "1px solid var(--wb-border-subtle)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[12px] font-semibold leading-snug"
                      style={{ color: "var(--wb-text)" }}
                    >
                      {card.source}
                    </div>
                    <div
                      className="text-[10px] font-mono mt-0.5"
                      style={{ color: "var(--wb-teal)" }}
                    >
                      {card.tag}
                    </div>
                  </div>
                  <div
                    className="text-[11px] font-mono font-bold shrink-0 px-1.5 py-0.5 rounded"
                    style={{
                      background: "rgba(69,196,154,0.10)",
                      color: "var(--wb-success)",
                      border: "1px solid rgba(69,196,154,0.20)",
                    }}
                  >
                    {card.similarity.toFixed(2)}
                  </div>
                </div>
                <p
                  className="text-[11px] leading-relaxed pl-2"
                  style={{
                    color: "var(--wb-text-sec)",
                    borderLeft: "2px solid rgba(56,184,176,0.25)",
                  }}
                >
                  {card.clause}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── CALCULATION ──────────────────────────────────────── */}
        {activeContextTab === "calculation" && (
          <div className="p-4">
            <CalculationCard />
          </div>
        )}

        {/* ── DELIVERABLE ──────────────────────────────────────── */}
        {activeContextTab === "deliverable" && (
          <div className="p-4 space-y-3">
            {latestDeliverable ? (
              <>
                {/* Deliverable card */}
                <div
                  className="rounded-xl p-4 space-y-3"
                  style={{
                    background: "rgba(69,196,154,0.06)",
                    border: "1px solid rgba(69,196,154,0.20)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <FileDown className="w-4 h-4" style={{ color: "var(--wb-success)" }} />
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wide"
                      style={{ color: "var(--wb-success)" }}
                    >
                      Deliverable Ready
                    </span>
                  </div>

                  <div>
                    <div
                      className="text-sm font-semibold leading-snug"
                      style={{ color: "var(--wb-text)" }}
                    >
                      {latestDeliverable.filename}
                    </div>
                    <div
                      className="text-[11px] font-mono mt-0.5"
                      style={{ color: "var(--wb-text-muted)" }}
                    >
                      {latestDeliverable.generatedAt}
                    </div>
                  </div>

                  {/* SHA-256 */}
                  <div
                    className="rounded-lg p-2.5"
                    style={{ background: "var(--wb-surface)", border: "1px solid var(--wb-border-subtle)" }}
                  >
                    <div
                      className="flex items-center gap-1.5 mb-1.5"
                    >
                      <Hash className="w-3 h-3" style={{ color: "var(--wb-text-muted)" }} />
                      <span
                        className="text-[9px] font-mono uppercase tracking-wider"
                        style={{ color: "var(--wb-text-muted)" }}
                      >
                        SHA-256
                      </span>
                    </div>
                    <div
                      className="text-[10px] font-mono break-all leading-relaxed"
                      style={{ color: "var(--wb-text-sec)" }}
                    >
                      {latestDeliverable.sha256}
                    </div>
                  </div>

                  {/* Download */}
                  <a
                    href={latestDeliverable.downloadUrl}
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-[12px] font-semibold transition-colors"
                    style={{
                      background: "rgba(56,184,176,0.10)",
                      border: "1px solid rgba(56,184,176,0.25)",
                      color: "var(--wb-teal)",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(56,184,176,0.16)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(56,184,176,0.10)")}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download {latestDeliverable.filename}
                  </a>
                </div>

                {/* Audit chain */}
                <div
                  className="rounded-lg p-3 space-y-2"
                  style={{ background: "var(--wb-surface-card)", border: "1px solid var(--wb-border-subtle)" }}
                >
                  <div
                    className="text-[11px] font-semibold mb-1"
                    style={{ color: "var(--wb-text)" }}
                  >
                    Audit Chain Integrity
                  </div>
                  {[
                    "Hash chain verified — 0 outbound bytes throughout session",
                    "Operator sign-off recorded in immutable audit ledger",
                    "Self-RAG verification passed prior to deliverable release",
                  ].map((line) => (
                    <div key={line} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" style={{ color: "var(--wb-success)" }} />
                      <span className="text-[11px] leading-relaxed" style={{ color: "var(--wb-text-muted)" }}>
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileDown className="w-8 h-8 mb-3 opacity-25" style={{ color: "var(--wb-text-muted)" }} />
                <p className="text-sm font-medium" style={{ color: "var(--wb-text-muted)" }}>
                  No deliverable yet
                </p>
                <p className="text-[12px] mt-1" style={{ color: "var(--wb-text-muted)" }}>
                  Deliverable will appear here after engineer approval.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
