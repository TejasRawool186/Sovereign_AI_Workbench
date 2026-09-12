"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  FileScan,
  Activity,
  Terminal,
  CheckCircle2,
  Clock,
  Loader2,
  UserCheck,
  Award,
  ShieldCheck,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { MessageBubble } from "./MessageBubble";
import { Composer } from "./Composer";
import { AttachedFile } from "@/types/chat";
import { simulateAgentTraceStream, simulateCodingScenarioStream } from "@/lib/sse";
import { codeVerifyExecutionSteps } from "@/mocks/mockAgentTrace";
import { mockCorrosionDegradationCurve } from "@/mocks/mockInspectionData";
import { mockPumpVibrationFFTSpectrum } from "@/mocks/mockVibrationData";
import { AgentNodeStatus } from "@/types/agent";

/* ─── Step icon map ─────────────────────────────────────────────────────── */
const STEP_ICONS: Record<string, React.ElementType> = {
  ocr_extract:     FileScan,
  rag_search:      Activity,
  recommend:       ShieldCheck,
  code_generate:   Terminal,
  sandbox_execute: Terminal,
  sandbox_verify:  CheckCircle2,
  human_checkpoint:UserCheck,
  generate_docx:   Award,
};

const STATUS_CFG: Record<AgentNodeStatus, { color: string; bg: string; border: string }> = {
  pending:          { color: "var(--wb-text-muted)",  bg: "transparent",             border: "var(--wb-border-subtle)" },
  running:          { color: "var(--wb-teal)",         bg: "rgba(56,184,176,0.08)",   border: "rgba(56,184,176,0.25)"   },
  completed:        { color: "var(--wb-success)",      bg: "rgba(69,196,154,0.08)",   border: "rgba(69,196,154,0.22)"   },
  failed:           { color: "var(--wb-danger)",       bg: "rgba(228,106,106,0.08)",  border: "rgba(228,106,106,0.22)"  },
  waiting_approval: { color: "var(--wb-warning)",      bg: "rgba(229,184,92,0.08)",   border: "rgba(229,184,92,0.22)"   },
};

/* ─── Execution Timeline ─────────────────────────────────────────────────── */
function ExecutionTimeline() {
  const { activeTraceSteps, isExecuting } = useTaskStore();
  const hasActivity = activeTraceSteps.some((s) => s.status !== "pending");
  if (!hasActivity) return null;

  const doneCount = activeTraceSteps.filter((s) => s.status === "completed").length;
  const total = activeTraceSteps.length;

  return (
    <div
      className="mx-auto w-full max-w-3xl mb-3 rounded-xl overflow-hidden"
      style={{
        background: "var(--wb-surface-card)",
        border: "1px solid var(--wb-border-subtle)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: "1px solid var(--wb-border-subtle)" }}
      >
        <div className="flex items-center gap-2">
          {isExecuting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "var(--wb-teal)" }} />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--wb-success)" }} />
          )}
          <span
            className="text-[11px] font-semibold font-mono uppercase tracking-wider"
            style={{ color: isExecuting ? "var(--wb-teal)" : "var(--wb-success)" }}
          >
            {isExecuting ? "Executing Pipeline…" : "Pipeline Complete"}
          </span>
        </div>
        <span
          className="text-[11px] font-mono"
          style={{ color: "var(--wb-text-muted)" }}
        >
          {doneCount} / {total} nodes
        </span>
      </div>

      {/* Steps */}
      <div className="px-3 py-2 space-y-0.5">
        {activeTraceSteps.map((step, idx) => {
          const cfg = STATUS_CFG[step.status];
          const Icon = STEP_ICONS[step.node] ?? Activity;
          const isPending = step.status === "pending";
          const isRunning = step.status === "running";
          const isComplete = step.status === "completed";

          // Show active + done steps; show the next pending step dimmed
          const nextPendingIdx = activeTraceSteps.findIndex((s) => s.status === "pending");
          if (isPending && idx !== nextPendingIdx) return null;

          return (
            <div
              key={step.id}
              className="flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all"
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                opacity: isPending ? 0.45 : 1,
              }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center w-6 h-6 rounded-md shrink-0 mt-0.5"
                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
              >
                {isRunning
                  ? <Loader2 className="w-3 h-3 animate-spin" style={{ color: cfg.color }} />
                  : <Icon className="w-3 h-3" style={{ color: cfg.color }} />
                }
              </div>

              {/* Label + summary */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-[12.5px] font-medium"
                    style={{ color: isPending ? "var(--wb-text-muted)" : "var(--wb-text)" }}
                  >
                    {step.label}
                  </span>
                  {step.durationMs && isComplete && (
                    <span
                      className="flex items-center gap-1 text-[10px] font-mono"
                      style={{ color: "var(--wb-text-muted)" }}
                    >
                      <Clock className="w-2.5 h-2.5" />
                      {step.durationMs}ms
                    </span>
                  )}
                  {step.status === "waiting_approval" && (
                    <span
                      className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(229,184,92,0.12)",
                        color: "var(--wb-warning)",
                        border: "1px solid rgba(229,184,92,0.25)",
                      }}
                    >
                      AWAITING SIGN-OFF
                    </span>
                  )}
                </div>
                {step.outputSummary && (
                  <div
                    className="mt-0.5 text-[11px] font-mono"
                    style={{ color: isComplete ? "var(--wb-success)" : "var(--wb-teal)" }}
                  >
                    ✓ {step.outputSummary}
                  </div>
                )}
                {isRunning && step.logs.slice(-1).map((log, li) => (
                  <div
                    key={li}
                    className="mt-0.5 text-[10px] font-mono"
                    style={{ color: "var(--wb-text-muted)" }}
                  >
                    › {log}
                  </div>
                ))}
              </div>

              {/* Status dot */}
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0 mt-2"
                style={{ background: cfg.color }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Welcome screen ─────────────────────────────────────────────────────── */
function WorkbenchWelcome({
  onLaunch,
}: {
  onLaunch: (prompt: string, attachments: AttachedFile[]) => void;
}) {
  const quickPresets = [
    {
      title: "NDT Corrosion Audit",
      description: "Extract CML wall-thickness readings, compute corrosion rate, project remaining life, verify MAWT compliance.",
      prompt: "Analyze the attached UT inspection log for MRPL Hydrocracker Unit 3, Asset HC-102-B (Report NDT-2026-00481). Extract nominal vs measured wall thickness at all CMLs, compute corrosion rates, project remaining life, and check MAWT compliance (2.50 mm, 5-year interval).",
      file: { id: "att-preset-1", name: "HC_102_B_UT_Inspection_Report.pdf", size: 2450000, type: "application/pdf" },
      icon: FileScan,
      tag: "Multimodal · Vision",
      tagColor: "var(--wb-orange)",
    },
    {
      title: "Code Verification",
      description: "Generate a Python script for CR and RL calculations. Execute in an isolated sandbox. Verify output against SOP values.",
      prompt: "Write and verify a Python script to compute corrosion rate and remaining life from the CML measurement table for HC-102-B. Run it in a sandboxed environment and confirm the output matches the NDT inspection values.",
      icon: Terminal,
      tag: "Qwen2.5-Coder · Sandbox",
      tagColor: "var(--wb-teal)",
    },
    {
      title: "Pump Vibration FFT",
      description: "Analyse P-102B FFT spectrum for bearing defects and unbalance spikes against ISO 10816 severity limits.",
      prompt: "Evaluate pump P-102B FFT vibration spectrum for bearing wear, unbalance, and misalignment frequencies against ISO 10816 vibration severity limits.",
      file: { id: "att-preset-2", name: "vibration_fft_sample.json", size: 480000, type: "application/json" },
      icon: Activity,
      tag: "Signal Analysis",
      tagColor: "var(--wb-info)",
    },
  ] as const;

  return (
    <div
      className="py-12 px-4 max-w-3xl mx-auto w-full"
      style={{ color: "var(--wb-text)" }}
    >
      {/* Identity block */}
      <div className="mb-8">
        {/* Status row */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-5"
          style={{
            background: "rgba(69,196,154,0.08)",
            border: "1px solid rgba(69,196,154,0.20)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--wb-success)" }}
          />
          <span
            className="text-[11px] font-semibold font-mono uppercase tracking-wider"
            style={{ color: "var(--wb-success)" }}
          >
            AIR-GAPPED · 0 OUTBOUND BYTES · ENCLAVE VERIFIED
          </span>
        </div>

        <h1
          className="text-2xl font-bold leading-tight tracking-tight mb-1"
          style={{ color: "var(--wb-text)" }}
        >
          ABHEDYA AI Workbench
        </h1>
        <p
          className="text-sm"
          style={{ color: "var(--wb-text-muted)" }}
        >
          MRPL Hydrocracker Unit 3 Enclave · Local inference · Human-in-the-loop verification
        </p>
      </div>

      {/* Workflow section */}
      <div className="mb-3">
        <div
          className="text-[11px] font-semibold uppercase tracking-wider mb-3"
          style={{ color: "var(--wb-text-muted)" }}
        >
          Start a workflow
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {quickPresets.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <button
                key={idx}
                onClick={() =>
                  onLaunch(
                    preset.prompt,
                    (preset as any).file ? [(preset as any).file] : []
                  )
                }
                className="p-4 rounded-xl text-left group transition-all"
                style={{
                  background: "var(--wb-surface-card)",
                  border: "1px solid var(--wb-border-subtle)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "var(--wb-surface-hover)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--wb-border-medium)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "var(--wb-surface-card)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--wb-border-subtle)";
                }}
              >
                {/* Icon + tag row */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "var(--wb-surface)",
                      border: "1px solid var(--wb-border-subtle)",
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "var(--wb-teal)" }} />
                  </div>
                  <span
                    className="text-[9.5px] font-semibold font-mono px-1.5 py-0.5 rounded"
                    style={{
                      background: `color-mix(in srgb, ${preset.tagColor} 12%, transparent)`,
                      color: preset.tagColor,
                      border: `1px solid color-mix(in srgb, ${preset.tagColor} 25%, transparent)`,
                    }}
                  >
                    {preset.tag}
                  </span>
                </div>

                {/* Title */}
                <div
                  className="text-[13.5px] font-semibold mb-1.5 leading-snug"
                  style={{ color: "var(--wb-text)" }}
                >
                  {preset.title}
                </div>

                {/* Description */}
                <p
                  className="text-[12px] leading-relaxed"
                  style={{ color: "var(--wb-text-muted)" }}
                >
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Keyboard hint */}
      <p
        className="text-[11px] font-mono mt-5"
        style={{ color: "var(--wb-text-muted)" }}
      >
        Type a task below · Ctrl+N for new task · Ctrl+B to toggle sidebar · / for workflow shortcuts
      </p>
    </div>
  );
}

/* ─── ChatContainer ──────────────────────────────────────────────────────── */
export function ChatContainer() {
  const {
    messages,
    addMessage,
    updateMessage,
    isExecuting,
    setExecuting,
    setTraceStepStatus,
    addTraceStepLog,
    resetTraceSteps,
    setApprovalModalOpen,
  } = useTaskStore();

  const streamAbortRef = useRef<{ abort: () => void } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const handleSendMessageRef = useRef<(prompt: string, attachments: AttachedFile[]) => void>(() => {});

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { prompt, file } = (e as CustomEvent).detail;
      handleSendMessageRef.current(prompt, file ? [file] : []);
    };
    window.addEventListener("abhedya:preset", handler);
    return () => window.removeEventListener("abhedya:preset", handler);
  }, []);

  const handleSendMessage = (prompt: string, attachments: AttachedFile[]) => {
    if (isExecuting) return;

    const asstMsgId = addMessage({ role: "user", content: prompt, attachments });
    const assistantId = addMessage({ role: "assistant", content: "", isStreaming: true, reasoningSteps: [] });

    const lower = prompt.toLowerCase();
    const isVibration = lower.includes("vibration") || lower.includes("fft") || lower.includes("bearing");
    const isCoding = lower.includes("script") || lower.includes("code") || lower.includes("python")
      || lower.includes("write and verify") || lower.includes("sandbox");

    if (isCoding) {
      useTaskStore.setState({
        activeTraceSteps: codeVerifyExecutionSteps.map((s) => ({ ...s, status: "pending", logs: [] })),
      });
    } else {
      resetTraceSteps();
    }
    setExecuting(true);

    let currentText = "";

    const streamCallbacks = {
      onStepStart: (stepId: string) => setTraceStepStatus(stepId, "running"),
      onStepLog: (stepId: string, log: string) => addTraceStepLog(stepId, log),
      onStepComplete: (stepId: string, durationMs: number, summary: string) =>
        setTraceStepStatus(stepId, "completed", summary, durationMs),
      onTokenStream: (token: string) => {
        currentText += token;
        updateMessage(assistantId, {
          content: currentText,
          isStreaming: true,
          chartData: isVibration
            ? { type: "vibration_fft", title: "P-102B Crude Charge Pump FFT Vibration Spectrum", description: "Spectral analysis highlighting BPFO outer race defect spike at 148.5 Hz (5.12 mm/s).", data: mockPumpVibrationFFTSpectrum, threshold: 2.8 }
            : !isCoding
            ? { type: "corrosion_curve", title: "CML-HC-102-B Wall Thickness Degradation Curve vs MAWT Limit", description: "Historical UT measurements projecting MAWT breach (2.50 mm) by Q3 2027.", data: mockCorrosionDegradationCurve, threshold: 2.5 }
            : undefined,
          reasoningSteps: isCoding
            ? [
                "1. Router: input=structured_table · task=code · GPU headroom=6.2GB → Qwen2.5-Coder-7B selected.",
                "2. Code generated: corrosion_rate_calc.py — 42 lines, zero external dependencies.",
                "3. Docker sandbox spawned: python:3.11-slim --network none --memory 256m.",
                "4. Container exited 0. Stdout captured. Network: BLOCKED throughout.",
                "5. Self-RAG verified: all 4 CML rows within ±0.01 mm/yr of SOP-grounded expected values.",
              ]
            : [
                "1. Qwen2.5-VL-7B: Processed corrosion_flange.png → localized pitting near weld HAZ, confidence 0.89.",
                "2. PaddleOCR 2.8 (CUDA): Extracted 18 thickness rows from HC_102_B_UT_Inspection_Report.pdf.",
                "3. Router: Qwen2.5-VL-7B (visual) + Qwen2.5-14B (structured reasoning) — modality + risk + VRAM.",
                "4. Self-RAG: Sandbox calc CR = (6.02-3.20)/5.0 = 0.564 mm/yr · RL = (3.20-2.50)/0.564 = 1.24 yrs.",
              ],
        });
      },
      onRequiresApproval: (approvalData: any) => {
        updateMessage(assistantId, { isStreaming: false, requiresApproval: true, approvalStatus: "pending" });
        setTraceStepStatus("step-4", "waiting_approval", "Awaiting Lead Corrosion Specialist digital PIN sign-off");
        useTaskStore.setState({ activeApprovalData: approvalData, isApprovalModalOpen: true });
      },
      onTaskComplete: () => {
        updateMessage(assistantId, { isStreaming: false });
        setExecuting(false);
      },
      onError: (err: string) => {
        console.error("Trace error", err);
        setExecuting(false);
      },
    };

    const stream = isCoding
      ? simulateCodingScenarioStream(prompt, streamCallbacks)
      : simulateAgentTraceStream(prompt, streamCallbacks);
    streamAbortRef.current = stream;
  };

  useEffect(() => { handleSendMessageRef.current = handleSendMessage; });

  return (
    <div
      className="flex-1 flex flex-col h-full w-full min-h-0 overflow-hidden"
      style={{ background: "var(--wb-bg)" }}
    >
      {/* Scrollable message area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {messages.length === 0 ? (
            <WorkbenchWelcome onLaunch={handleSendMessage} />
          ) : (
            messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Sticky bottom: pipeline + composer */}
      <div
        className="shrink-0 pt-3"
        style={{
          background: `linear-gradient(to top, var(--wb-bg) 80%, transparent)`,
          borderTop: "1px solid var(--wb-border-subtle)",
        }}
      >
        {messages.length > 0 && (
          <div className="px-4">
            <ExecutionTimeline />
          </div>
        )}
        <Composer onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
