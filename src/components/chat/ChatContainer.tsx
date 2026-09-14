"use client";

import React, { useRef, useEffect } from "react";
import {
  FileScan,
  Activity,
  Terminal,
  CheckCircle2,
  UserCheck,
  Award,
  ShieldCheck,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { MessageBubble } from "./MessageBubble";
import { Composer } from "./Composer";
import { AttachedFile } from "@/types/chat";
import { AgentTraceStep } from "@/types/agent";
import { simulateAgentTraceStream, simulateCodingScenarioStream } from "@/lib/sse";
import { codeVerifyExecutionSteps, defaultExecutionSteps } from "@/mocks/mockAgentTrace";
import { mockCorrosionDegradationCurve } from "@/mocks/mockInspectionData";
import { mockPumpVibrationFFTSpectrum } from "@/mocks/mockVibrationData";

/* ─── Welcome screen ─────────────────────────────────────────────────────── */
function WorkbenchWelcome() {
  const quickPresets = [
    {
      title: "NDT Corrosion Audit",
      description:
        "Extract CML wall-thickness readings, compute corrosion rate, project remaining life, verify MAWT compliance.",
      prompt:
        "Analyze the attached UT inspection log for MRPL Hydrocracker Unit 3, Asset HC-102-B (Report NDT-2026-00481). Extract nominal vs measured wall thickness at all CMLs, compute corrosion rates, project remaining life, and check MAWT compliance (2.50 mm, 5-year interval).",
      file: {
        id: "att-preset-1",
        name: "HC_102_B_UT_Inspection_Report.pdf",
        size: 2450000,
        type: "application/pdf",
      },
      icon: FileScan,
      tag: "Multimodal · Vision",
      tagColor: "var(--wb-orange)",
    },
    {
      title: "Code Verification",
      description:
        "Generate a Python script for CR and RL calculations. Execute in an isolated sandbox. Verify output against SOP values.",
      prompt:
        "Write and verify a Python script to compute corrosion rate and remaining life from the CML measurement table for HC-102-B. Run it in a sandboxed environment and confirm the output matches the NDT inspection values.",
      icon: Terminal,
      tag: "Qwen2.5-Coder · Sandbox",
      tagColor: "var(--wb-teal)",
    },
    {
      title: "Pump Vibration FFT",
      description:
        "Analyse P-102B FFT spectrum for bearing defects and unbalance spikes against ISO 10816 severity limits.",
      prompt:
        "Evaluate pump P-102B FFT vibration spectrum for bearing wear, unbalance, and misalignment frequencies against ISO 10816 vibration severity limits.",
      file: {
        id: "att-preset-2",
        name: "vibration_fft_sample.json",
        size: 480000,
        type: "application/json",
      },
      icon: Activity,
      tag: "Signal Analysis",
      tagColor: "var(--wb-info)",
    },
  ] as const;

  const handleCardClick = (prompt: string, file?: { id: string; name: string; size: number; type: string }) => {
    // Pre-fill the composer — do NOT execute. User must click Run Task.
    window.dispatchEvent(
      new CustomEvent("abhedya:prefill", {
        detail: { prompt, file: file ?? null },
      })
    );
  };

  return (
    <div className="py-12 px-4 max-w-3xl mx-auto w-full" style={{ color: "var(--wb-text)" }}>
      {/* Identity block */}
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-5"
          style={{ background: "rgba(69,196,154,0.08)", border: "1px solid rgba(69,196,154,0.20)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--wb-success)" }} />
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
        <p className="text-sm" style={{ color: "var(--wb-text-muted)" }}>
          MRPL Hydrocracker Unit 3 Enclave · Local inference · Human-in-the-loop verification
        </p>
      </div>

      {/* Workflow cards */}
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
                onClick={() => handleCardClick(preset.prompt, (preset as any).file)}
                className="p-4 rounded-xl text-left group transition-all"
                style={{
                  background: "var(--wb-surface-card)",
                  border: "1px solid var(--wb-border-subtle)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--wb-surface-hover)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--wb-border-medium)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--wb-surface-card)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--wb-border-subtle)";
                }}
              >
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
                <div
                  className="text-[13.5px] font-semibold mb-1.5 leading-snug"
                  style={{ color: "var(--wb-text)" }}
                >
                  {preset.title}
                </div>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--wb-text-muted)" }}>
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-[11px] font-mono mt-5" style={{ color: "var(--wb-text-muted)" }}>
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
  } = useTaskStore();

  const streamAbortRef = useRef<{ abort: () => void } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const handleSendMessageRef = useRef<(prompt: string, attachments: AttachedFile[]) => void>(() => {});
  // Track whether the user is near the bottom — updated on every scroll event
  const isNearBottomRef = useRef(true);
  // Debounce handle so we don't call scrollIntoView on every single token
  const scrollDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep isNearBottom in sync with actual scroll position
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      // Once user scrolls more than 200px from bottom, stop following entirely
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      isNearBottomRef.current = distFromBottom < 200;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-scroll: debounced so it fires at most once per 120ms, and only if user
  // is still near the bottom. Uses scrollTop (instant, no fighting) not scrollIntoView.
  useEffect(() => {
    if (!isNearBottomRef.current) return;
    if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);
    scrollDebounceRef.current = setTimeout(() => {
      if (isNearBottomRef.current && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }, 120);
    return () => {
      if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);
    };
  }, [messages]);

  // Listen for sidebar preset events
  useEffect(() => {
    const handler = (e: Event) => {
      const { prompt, file } = (e as CustomEvent).detail;
      // abhedya:preset now only pre-fills — Composer handles it directly
      // Nothing to do here; kept for future extension
      void prompt; void file;
    };
    window.addEventListener("abhedya:preset", handler);
    return () => window.removeEventListener("abhedya:preset", handler);
  }, []);

  const handleSendMessage = (prompt: string, attachments: AttachedFile[]) => {
    if (isExecuting) return;

    // Force scroll to bottom when task starts — user just submitted
    isNearBottomRef.current = true;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }

    // 1. Add user message
    addMessage({ role: "user", content: prompt, attachments });

    // 2. Determine task type
    const lower = prompt.toLowerCase();
    const isVibration =
      lower.includes("vibration") || lower.includes("fft") || lower.includes("bearing");
    const isCoding =
      lower.includes("script") ||
      lower.includes("code") ||
      lower.includes("python") ||
      lower.includes("write and verify") ||
      lower.includes("sandbox");

    // 3. Build the initial pending trace steps for this message
    const initialSteps: AgentTraceStep[] = isCoding
      ? codeVerifyExecutionSteps.map((s) => ({ ...s, status: "pending" as const, logs: [] }))
      : defaultExecutionSteps.map((s) => ({ ...s, status: "pending" as const, logs: [] }));

    // 4. Add assistant message carrying the live trace steps
    const assistantId = addMessage({
      role: "assistant",
      content: "",
      isStreaming: true,
      reasoningSteps: [],
      traceSteps: initialSteps,
    });

    // 5. Sync global trace store too (for the right-panel Agent Trace tab)
    if (isCoding) {
      useTaskStore.setState({ activeTraceSteps: initialSteps });
    } else {
      resetTraceSteps();
    }
    setExecuting(true);

    // Helper: update the trace steps inside the assistant message
    const updateStepInMessage = (
      updater: (steps: AgentTraceStep[]) => AgentTraceStep[]
    ) => {
      const current = useTaskStore.getState().messages.find((m) => m.id === assistantId);
      const steps = current?.traceSteps ?? initialSteps;
      updateMessage(assistantId, { traceSteps: updater([...steps]) });
    };

    let currentText = "";

    const streamCallbacks = {
      onStepStart: (stepId: string) => {
        // Update global store
        setTraceStepStatus(stepId, "running");
        // Update inline message steps
        updateStepInMessage((steps) =>
          steps.map((s) => (s.id === stepId ? { ...s, status: "running" as const } : s))
        );
      },

      onStepLog: (stepId: string, log: string) => {
        addTraceStepLog(stepId, log);
        updateStepInMessage((steps) =>
          steps.map((s) =>
            s.id === stepId ? { ...s, logs: [...s.logs, log] } : s
          )
        );
      },

      onStepComplete: (stepId: string, durationMs: number, summary: string) => {
        setTraceStepStatus(stepId, "completed", summary, durationMs);
        updateStepInMessage((steps) =>
          steps.map((s) =>
            s.id === stepId
              ? { ...s, status: "completed" as const, durationMs, outputSummary: summary }
              : s
          )
        );
      },

      onTokenStream: (token: string) => {
        currentText += token;
        updateMessage(assistantId, {
          content: currentText,
          isStreaming: true,
          chartData: isVibration
            ? {
                type: "vibration_fft",
                title: "P-102B Crude Charge Pump FFT Vibration Spectrum",
                description:
                  "Spectral analysis highlighting BPFO outer race defect spike at 148.5 Hz (5.12 mm/s).",
                data: mockPumpVibrationFFTSpectrum,
                threshold: 2.8,
              }
            : !isCoding
            ? {
                type: "corrosion_curve",
                title: "CML-HC-102-B Wall Thickness Degradation Curve vs MAWT Limit",
                description:
                  "Historical UT measurements projecting MAWT breach (2.50 mm) by Q3 2027.",
                data: mockCorrosionDegradationCurve,
                threshold: 2.5,
              }
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
        updateMessage(assistantId, {
          isStreaming: false,
          requiresApproval: true,
          approvalStatus: "pending",
        });
        // Mark human checkpoint step as waiting
        setTraceStepStatus(
          "step-4",
          "waiting_approval",
          "Awaiting Lead Corrosion Specialist digital PIN sign-off"
        );
        updateStepInMessage((steps) =>
          steps.map((s) =>
            s.node === "human_checkpoint"
              ? {
                  ...s,
                  status: "waiting_approval" as const,
                  outputSummary: "Awaiting Lead Corrosion Specialist digital PIN sign-off",
                }
              : s
          )
        );
        useTaskStore.setState({
          activeApprovalData: approvalData,
          isApprovalModalOpen: true,
        });
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

  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  });

  return (
    <div
      className="flex-1 flex flex-col h-full w-full min-h-0 overflow-hidden"
      style={{ background: "var(--wb-bg)" }}
    >
      {/* Scrollable message area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {messages.length === 0 ? (
            <WorkbenchWelcome />
          ) : (
            messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Bottom: composer only — pipeline is now inline in the message */}
      <div
        className="shrink-0"
        style={{
          background: `linear-gradient(to top, var(--wb-bg) 85%, transparent)`,
          borderTop: "1px solid var(--wb-border-subtle)",
          paddingTop: "12px",
        }}
      >
        <Composer onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
