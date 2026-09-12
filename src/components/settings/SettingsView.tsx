"use client";

import React, { useState } from "react";
import {
  Settings,
  Cpu,
  Plus,
  Trash2,
  Server,
  Key,
  Globe,
  X,
  ShieldCheck,
  User,
  Info,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";

/* ── Section header ─────────────────────────────────────────────────────── */
function SectionHeader({
  icon: Icon,
  title,
  right,
}: {
  icon: React.ElementType;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between pb-3"
      style={{ borderBottom: "1px solid var(--wb-border-subtle)" }}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4" style={{ color: "var(--wb-teal)" }} />
        <span className="text-base font-semibold" style={{ color: "var(--wb-text)" }}>
          {title}
        </span>
      </div>
      {right}
    </div>
  );
}

/* ── Form field ─────────────────────────────────────────────────────────── */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1"
        style={{ color: "var(--wb-text-muted)" }}
      >
        {label}
        {required && <span style={{ color: "var(--wb-danger)" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({
  mono,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { mono?: boolean }) {
  return (
    <input
      type={type}
      className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors"
      style={{
        background: "var(--wb-surface)",
        border: "1px solid var(--wb-border-medium)",
        color: "var(--wb-text)",
        fontFamily: mono ? '"JetBrains Mono", ui-monospace, monospace' : "inherit",
      }}
      onFocus={e => (e.currentTarget.style.borderColor = "var(--wb-teal)")}
      onBlur={e => (e.currentTarget.style.borderColor = "var(--wb-border-medium)")}
      {...props}
    />
  );
}

export function SettingsView() {
  const {
    configuredModels,
    addConfiguredModel,
    removeConfiguredModel,
    operatorName,
    operatorRole,
    setOperatorRole,
    networkStats,
  } = useTaskStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newModel, setNewModel] = useState({ name: "", endpoint: "", apiKey: "", provider: "" });

  const handleAdd = () => {
    if (!newModel.name.trim() || !newModel.endpoint.trim()) return;
    addConfiguredModel({
      name: newModel.name.trim(),
      endpoint: newModel.endpoint.trim(),
      apiKey: newModel.apiKey.trim() || undefined,
      provider: newModel.provider.trim() || "Custom",
    });
    setNewModel({ name: "", endpoint: "", apiKey: "", provider: "" });
    setShowAddForm(false);
  };

  const roles = [
    "Lead Corrosion Specialist",
    "Refinery Operations Chief",
    "Plant Safety Auditor",
    "Process Engineer",
    "Maintenance Supervisor",
    "Instrument Technician",
  ];

  const enclaveInfo = [
    { label: "Enclave Status",  value: "VERIFIED_AIRGAP",                ok: true },
    { label: "Outbound Bytes",  value: "0 B (enforced)",                  ok: true },
    { label: "GPU",             value: "RTX 4090 24 GB VRAM (CUDA 12.4)", ok: false },
    { label: "VRAM Budget",     value: "32,768 token context window",      ok: false },
    { label: "Vector DB",       value: "ChromaDB 0.5.3 (embedded)",        ok: false },
    { label: "Inference",       value: "Ollama 0.3.9 + vLLM 0.6.1",        ok: false },
    { label: "OCR Engine",      value: "PaddleOCR 2.8 (CUDA)",             ok: false },
    { label: "Sandbox",         value: "Docker 26.1 --network none",        ok: false },
    { label: "Audit Ledger",    value: "SHA-256 chained, local Postgres",   ok: false },
    { label: "Standards",       value: "API 570 · OISD-105 · ISO 27001",    ok: false },
  ];

  const initials = operatorName
    ? operatorName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  return (
    <div
      className="h-full w-full overflow-y-auto"
      style={{ background: "var(--wb-bg)" }}
    >
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-10">

        {/* ── Page header ── */}
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Settings className="w-5 h-5" style={{ color: "var(--wb-teal)" }} />
            <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--wb-text)" }}>
              Workbench Settings
            </h1>
          </div>
          <p className="text-sm" style={{ color: "var(--wb-text-muted)" }}>
            Operator profile, enclave configuration, and local model endpoints.
          </p>
        </div>

        {/* ── Operator Profile ── */}
        <section className="space-y-4">
          <SectionHeader icon={User} title="Operator Profile" />

          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "var(--wb-surface-card)",
              border: "1px solid var(--wb-border-subtle)",
            }}
          >
            {/* Identity row */}
            <div
              className="flex items-center gap-4 px-5 py-4"
              style={{ borderBottom: "1px solid var(--wb-border-subtle)" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{
                  background: "rgba(56,184,176,0.15)",
                  color: "var(--wb-teal)",
                  border: "1px solid rgba(56,184,176,0.25)",
                }}
              >
                {initials}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: "var(--wb-text)" }}>
                  {operatorName}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--wb-text-muted)" }}>
                  MRPL Enclave Operator · Session Active
                </div>
              </div>
              <span
                className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded"
                style={{
                  background: "rgba(69,196,154,0.10)",
                  color: "var(--wb-success)",
                  border: "1px solid rgba(69,196,154,0.22)",
                }}
              >
                AUTHENTICATED
              </span>
            </div>

            {/* Role selector */}
            <div className="px-5 py-4 space-y-2">
              <div
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--wb-text-muted)" }}
              >
                Active Role
              </div>
              <select
                value={operatorRole}
                onChange={(e) => setOperatorRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors"
                style={{
                  background: "var(--wb-surface)",
                  border: "1px solid var(--wb-border-medium)",
                  color: "var(--wb-text)",
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--wb-teal)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--wb-border-medium)")}
              >
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <p className="text-[11px]" style={{ color: "var(--wb-text-muted)" }}>
                Determines which HITL approval gates you are authorised to sign off.
              </p>
            </div>
          </div>
        </section>

        {/* ── Enclave System Info ── */}
        <section className="space-y-4">
          <SectionHeader
            icon={ShieldCheck}
            title="Enclave System Information"
            right={
              <span
                className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded"
                style={{
                  background: "rgba(69,196,154,0.10)",
                  color: "var(--wb-success)",
                  border: "1px solid rgba(69,196,154,0.22)",
                }}
              >
                AIR-GAPPED
              </span>
            }
          />

          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "var(--wb-surface-card)",
              border: "1px solid var(--wb-border-subtle)",
            }}
          >
            {enclaveInfo.map(({ label, value, ok }, i) => (
              <div
                key={label}
                className="flex items-center justify-between px-5 py-2.5 transition-colors"
                style={{
                  borderBottom: i < enclaveInfo.length - 1 ? "1px solid var(--wb-border-subtle)" : "none",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--wb-surface-hover)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <span className="text-sm" style={{ color: "var(--wb-text-sec)" }}>
                  {label}
                </span>
                <span
                  className="text-[12px] font-semibold font-mono"
                  style={{ color: ok ? "var(--wb-success)" : "var(--wb-text)" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div
            className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-[12px]"
            style={{
              background: "rgba(56,184,176,0.05)",
              border: "1px solid rgba(56,184,176,0.15)",
              color: "var(--wb-text-muted)",
            }}
          >
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--wb-teal)" }} />
            All model weights, vector indices, and audit records are stored on-premise.
            No telemetry, usage data, or prompts leave this enclave. Enforced by kernel firewall policy.
          </div>
        </section>

        {/* ── Local Model Endpoints ── */}
        <section className="space-y-4">
          <SectionHeader
            icon={Cpu}
            title={`Local Model Endpoints (${configuredModels.length})`}
            right={
              !showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-[12px] font-medium transition-colors"
                  style={{
                    background: "var(--wb-teal)",
                    color: "#07151D",
                    border: "none",
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Endpoint
                </button>
              ) : null
            }
          />

          {/* Add form */}
          {showAddForm && (
            <div
              className="rounded-xl p-4 space-y-4"
              style={{
                background: "var(--wb-surface-card)",
                border: "1px solid var(--wb-border-medium)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: "var(--wb-text)" }}>
                  Add New Local Endpoint
                </span>
                <button
                  onClick={() => { setNewModel({ name: "", endpoint: "", apiKey: "", provider: "" }); setShowAddForm(false); }}
                  className="p-1 rounded transition-colors"
                  style={{ color: "var(--wb-text-muted)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--wb-text)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--wb-text-muted)")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Model Name" required>
                  <Input
                    placeholder="e.g. Qwen2.5-14B-Industrial"
                    value={newModel.name}
                    onChange={e => setNewModel({ ...newModel, name: e.target.value })}
                  />
                </Field>
                <Field label="Provider">
                  <Input
                    placeholder="e.g. Ollama (Local)"
                    value={newModel.provider}
                    onChange={e => setNewModel({ ...newModel, provider: e.target.value })}
                  />
                </Field>
                <Field label="Endpoint URL" required>
                  <Input
                    mono
                    placeholder="http://localhost:11434/v1"
                    value={newModel.endpoint}
                    onChange={e => setNewModel({ ...newModel, endpoint: e.target.value })}
                  />
                </Field>
                <Field label="API Key">
                  <Input
                    mono
                    type="password"
                    placeholder="sk-…  (optional)"
                    value={newModel.apiKey}
                    onChange={e => setNewModel({ ...newModel, apiKey: e.target.value })}
                  />
                </Field>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => { setNewModel({ name: "", endpoint: "", apiKey: "", provider: "" }); setShowAddForm(false); }}
                  className="px-3 h-8 rounded-lg text-[12px] font-medium transition-colors"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--wb-border-medium)",
                    color: "var(--wb-text-sec)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newModel.name.trim() || !newModel.endpoint.trim()}
                  className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-[12px] font-medium transition-colors disabled:opacity-40"
                  style={{ background: "var(--wb-teal)", color: "#07151D", border: "none" }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Endpoint
                </button>
              </div>
            </div>
          )}

          {/* Models list */}
          {configuredModels.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <Cpu className="w-8 h-8 mb-3 opacity-20" style={{ color: "var(--wb-text-muted)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--wb-text-muted)" }}>
                No endpoints configured
              </p>
              <p className="text-[12px] mt-1" style={{ color: "var(--wb-text-muted)" }}>
                Add a local Ollama or vLLM endpoint to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {configuredModels.map((model) => (
                <div
                  key={model.id}
                  className="group flex items-start justify-between gap-3 px-4 py-3.5 rounded-xl transition-all"
                  style={{
                    background: "var(--wb-surface-card)",
                    border: "1px solid var(--wb-border-subtle)",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "var(--wb-border-medium)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "var(--wb-border-subtle)")}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "rgba(56,184,176,0.10)", border: "1px solid rgba(56,184,176,0.18)" }}
                    >
                      <Cpu className="w-4 h-4" style={{ color: "var(--wb-teal)" }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold truncate" style={{ color: "var(--wb-text)" }}>
                          {model.name}
                        </span>
                        <span
                          className="text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded"
                          style={{
                            background: "var(--wb-teal-soft)",
                            color: "var(--wb-teal)",
                            border: "1px solid rgba(56,184,176,0.22)",
                          }}
                        >
                          {model.provider}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-1.5 mt-1 text-[11px] font-mono"
                        style={{ color: "var(--wb-text-muted)" }}
                      >
                        <Globe className="w-3 h-3 shrink-0" />
                        <span className="truncate">{model.endpoint}</span>
                      </div>
                      {model.apiKey && (
                        <div
                          className="flex items-center gap-1.5 mt-0.5 text-[11px] font-mono"
                          style={{ color: "var(--wb-text-muted)" }}
                        >
                          <Key className="w-3 h-3 shrink-0" />
                          ••••••••••••
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeConfiguredModel(model.id)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    style={{ color: "var(--wb-text-muted)" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "var(--wb-danger)";
                      e.currentTarget.style.background = "rgba(228,106,106,0.10)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "var(--wb-text-muted)";
                      e.currentTarget.style.background = "transparent";
                    }}
                    title="Remove endpoint"
                    aria-label="Remove endpoint"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
