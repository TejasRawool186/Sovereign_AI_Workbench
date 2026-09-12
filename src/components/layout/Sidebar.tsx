"use client";

import React, { useEffect } from "react";
import {
  Plus,
  MessageSquare,
  FileCheck,
  ShieldCheck,
  Pin,
  Trash2,
  Settings,
  PanelLeftClose,
  MoreHorizontal,
  FileScan,
  Terminal,
  Activity,
} from "lucide-react";
import { useTaskStore, WorkspaceView } from "@/store/useTaskStore";

function formatTaskTime(dateStr?: string): string {
  if (!dateStr) return "Just now";
  if (dateStr.includes(" ")) {
    const parts = dateStr.split(" ");
    if (parts[1]?.includes(":")) return `${parts[1].slice(0, 5)} UTC`;
  }
  if (dateStr.includes("T")) return `${dateStr.slice(11, 16)} UTC`;
  return dateStr;
}

const CATEGORY_LABELS: Record<string, string> = {
  UT_AUDIT:      "NDT",
  CODE_VERIFY:   "CODE",
  VIBRATION_FFT: "FFT",
  OISD_PERMIT:   "OISD",
  CORROSION_RATE:"CR",
  CUSTOM:        "",
};

const STATUS_COLORS: Record<string, string> = {
  COMPLETED:        "var(--wb-success)",
  AWAITING_APPROVAL:"var(--wb-warning)",
  RUNNING:          "var(--wb-teal)",
  REJECTED:         "var(--wb-danger)",
  DRAFT:            "var(--wb-text-muted)",
};

export function Sidebar() {
  const {
    isSidebarOpen,
    toggleSidebar,
    activeView,
    setActiveView,
    tasks,
    activeTaskId,
    setActiveTaskId,
    createNewTask,
    deleteTask,
    pinTask,
    operatorName,
    operatorRole,
    setModelModalOpen,
    isExecuting,
  } = useTaskStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        createNewTask();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleSidebar, createNewTask]);

  if (!isSidebarOpen) return null;

  const navItems: { view: WorkspaceView; label: string; icon: React.ElementType }[] = [
    { view: "tasks",    label: "Tasks",       icon: MessageSquare },
    { view: "audit",    label: "Audit Trail", icon: FileCheck     },
    { view: "network",  label: "Network",     icon: ShieldCheck   },
    { view: "settings", label: "Settings",    icon: Settings      },
  ];

  const presets = [
    {
      icon: FileScan,
      label: "NDT Corrosion Audit",
      category: "UT_AUDIT",
      prompt:
        "Analyze the attached UT inspection log for MRPL Hydrocracker Unit 3, Asset HC-102-B (Report NDT-2026-00481). Extract nominal vs measured wall thickness at all CMLs, compute corrosion rates, project remaining life, and check MAWT compliance (2.50 mm, 5-year interval).",
      file: { id: "att-preset-sb-1", name: "HC_102_B_UT_Inspection_Report.pdf", size: 2450000, type: "application/pdf" },
    },
    {
      icon: Terminal,
      label: "Code Verification",
      category: "CODE_VERIFY",
      prompt:
        "Write and verify a Python script to compute corrosion rate and remaining life from the CML measurement table for HC-102-B. Run it in a sandboxed environment and confirm the output matches the NDT inspection values.",
    },
    {
      icon: Activity,
      label: "Pump Vibration FFT",
      category: "VIBRATION_FFT",
      prompt:
        "Evaluate pump P-102B FFT vibration spectrum for bearing wear, unbalance, and misalignment frequencies against ISO 10816 vibration severity limits.",
      file: { id: "att-preset-sb-2", name: "vibration_fft_sample.json", size: 480000, type: "application/json" },
    },
  ];

  const handlePresetClick = (preset: typeof presets[0]) => {
    setActiveView("tasks");
    window.dispatchEvent(
      new CustomEvent("abhedya:preset", {
        detail: { prompt: preset.prompt, file: (preset as any).file },
      })
    );
  };

  const initials = operatorName
    ? operatorName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  return (
    <aside
      className="h-full flex flex-col shrink-0 select-none"
      style={{
        width: "260px",
        background: "var(--wb-surface)",
        borderRight: "1px solid var(--wb-border-subtle)",
      }}
    >
      {/* ── Top: close toggle ── */}
      <div
        className="flex items-center justify-between px-3 pt-3 pb-1"
        style={{ borderBottom: "1px solid var(--wb-border-subtle)" }}
      >
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: "var(--wb-text-muted)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--wb-surface-hover)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          title="Close sidebar (Ctrl+B)"
          aria-label="Close sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* ── WORKSPACE navigation ── */}
      <div className="px-3 pt-4 pb-2">
        <div className="wb-group-label mb-2">Workspace</div>
        <nav className="space-y-0.5">
          {navItems.map(({ view, label, icon: Icon }) => {
            const isActive = activeView === view;
            return (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: isActive ? "var(--wb-text)" : "var(--wb-text-muted)",
                  background: isActive ? "rgba(56,184,176,0.10)" : "transparent",
                  borderLeft: isActive ? "2px solid var(--wb-teal)" : "2px solid transparent",
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.background = "var(--wb-surface-hover)";
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon
                  className="w-4 h-4 shrink-0"
                  style={{ color: isActive ? "var(--wb-teal)" : "var(--wb-text-muted)" }}
                />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── QUICK LAUNCH presets ── */}
      <div
        className="px-3 py-3"
        style={{ borderTop: "1px solid var(--wb-border-subtle)" }}
      >
        <div className="wb-group-label mb-2">Quick Launch</div>
        <div className="space-y-0.5">
          {presets.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.category}
                onClick={() => handlePresetClick(preset)}
                disabled={isExecuting}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ color: "var(--wb-text-muted)" }}
                onMouseEnter={e => {
                  if (!isExecuting) {
                    e.currentTarget.style.background = "var(--wb-surface-hover)";
                    e.currentTarget.style.color = "var(--wb-text-sec)";
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--wb-text-muted)";
                }}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RECENT tasks ── */}
      <div
        className="flex-1 flex flex-col min-h-0 overflow-hidden"
        style={{ borderTop: "1px solid var(--wb-border-subtle)" }}
      >
        <div className="flex items-center justify-between px-3 pt-3 pb-1">
          <div className="wb-group-label">Recent</div>
          <button
            onClick={createNewTask}
            className="flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded transition-colors"
            style={{ color: "var(--wb-text-muted)" }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "var(--wb-surface-hover)";
              e.currentTarget.style.color = "var(--wb-teal)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--wb-text-muted)";
            }}
            title="New task (Ctrl+N)"
          >
            <Plus className="w-3 h-3" />
            New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-0.5">
          {tasks.map((task) => {
            const isSelected = activeTaskId === task.id;
            const catLabel = CATEGORY_LABELS[task.category] ?? "";
            const statusColor = STATUS_COLORS[task.status] ?? "var(--wb-text-muted)";

            return (
              <div
                key={task.id}
                onClick={() => { setActiveTaskId(task.id); setActiveView("tasks"); }}
                className="group relative p-2.5 rounded-lg cursor-pointer transition-all"
                style={{
                  background: isSelected ? "var(--wb-surface-card)" : "transparent",
                  border: `1px solid ${isSelected ? "var(--wb-border-medium)" : "transparent"}`,
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.background = "var(--wb-surface-hover)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                {/* Title row */}
                <div className="flex items-start justify-between gap-1.5">
                  <span
                    className="text-[12.5px] leading-snug truncate font-medium"
                    style={{ color: isSelected ? "var(--wb-text)" : "var(--wb-text-sec)" }}
                    title={task.title}
                  >
                    {task.title}
                  </span>
                  {task.pinned && (
                    <Pin className="w-3 h-3 shrink-0 mt-0.5" style={{ color: "var(--wb-teal)", fill: "var(--wb-teal)" }} />
                  )}
                </div>

                {/* Meta row */}
                <div className="flex items-center justify-between mt-1.5 gap-1.5">
                  <div className="flex items-center gap-1.5">
                    {catLabel && (
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background: "var(--wb-teal-soft)",
                          color: "var(--wb-teal)",
                          border: "1px solid rgba(56,184,176,0.20)",
                        }}
                      >
                        {catLabel}
                      </span>
                    )}
                    <span className="text-[10px] font-mono" style={{ color: "var(--wb-text-muted)" }}>
                      {formatTaskTime(task.updatedAt)}
                    </span>
                  </div>

                  {/* Status dot */}
                  <div className="flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: statusColor }}
                    />
                    <span
                      className="text-[9px] font-mono font-semibold"
                      style={{ color: statusColor }}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Hover actions */}
                <div
                  className="absolute right-2 top-2 hidden group-hover:flex items-center gap-0.5 rounded-lg p-0.5"
                  style={{
                    background: "var(--wb-surface-card)",
                    border: "1px solid var(--wb-border-subtle)",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.18)",
                  }}
                >
                  <button
                    onClick={e => { e.stopPropagation(); pinTask(task.id); }}
                    className="p-1 rounded transition-colors"
                    style={{ color: "var(--wb-text-muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--wb-teal)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--wb-text-muted)")}
                    title="Pin task"
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); deleteTask(task.id); }}
                    className="p-1 rounded transition-colors"
                    style={{ color: "var(--wb-text-muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--wb-danger)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--wb-text-muted)")}
                    title="Delete task"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Operator profile ── */}
      <div
        className="p-3"
        style={{ borderTop: "1px solid var(--wb-border-subtle)" }}
      >
        <button
          onClick={() => setModelModalOpen(true)}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors"
          onMouseEnter={e => (e.currentTarget.style.background = "var(--wb-surface-hover)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              background: "rgba(56,184,176,0.15)",
              color: "var(--wb-teal)",
              border: "1px solid rgba(56,184,176,0.25)",
            }}
          >
            {initials}
          </div>

          <div className="flex-1 overflow-hidden text-left">
            <div
              className="text-sm font-semibold leading-tight truncate"
              style={{ color: "var(--wb-text)" }}
            >
              {operatorName}
            </div>
            <div
              className="text-[11px] leading-tight truncate"
              style={{ color: "var(--wb-text-muted)" }}
            >
              {operatorRole}
            </div>
          </div>

          <MoreHorizontal className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--wb-text-muted)" }} />
        </button>
      </div>
    </aside>
  );
}
