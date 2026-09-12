"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Edit3,
  KeyRound,
  FileCheck,
  UserCheck,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function ApprovalCheckpoint() {
  const {
    isApprovalModalOpen,
    setApprovalModalOpen,
    activeApprovalData,
    approveStep,
    rejectStep,
    operatorName,
    operatorRole,
  } = useTaskStore();

  const [pin, setPin] = useState("8921");
  const [isEditing, setIsEditing] = useState(false);
  const [customComment, setCustomComment] = useState(
    activeApprovalData?.recommendedAction ||
    "Schedule emergency ASTM A335 P22 replacement spool installation during October 2026 mini-shutdown. Perform PAUT confirmation within 60 days."
  );
  const [isSigning, setIsSigning] = useState(false);

  if (!isApprovalModalOpen) return null;

  const handleApprove = async () => {
    setIsSigning(true);
    await approveStep(pin, customComment);
    setIsSigning(false);
  };

  const handleReject = () => {
    const reason = prompt("Enter reason for rejection:");
    if (reason) rejectStep(reason);
  };

  const gridItems = [
    { label: "Asset / Report",     value: activeApprovalData?.asset || "MRPL HC Unit 3 · HC-102-B",   sub: activeApprovalData?.reportId || "NDT-2026-00481" },
    { label: "Monitoring Point",   value: activeApprovalData?.criticalPoint || "CML-HC-102-B",         sub: null },
    { label: "Measured Wall",      value: activeApprovalData?.currentThickness || "3.20 mm",           sub: null, warn: true },
    { label: "MAWT Limit",         value: activeApprovalData?.mawt || "2.50 mm",                       sub: null, danger: true },
    { label: "Remaining Life",     value: activeApprovalData?.remainingLife || "1.24 Years",           sub: null, danger: true },
    { label: "Corrosion Rate",     value: "0.564 mm/yr",                                               sub: null, danger: true },
  ];

  return (
    <Modal
      isOpen={isApprovalModalOpen}
      onClose={() => setApprovalModalOpen(false)}
      maxWidth="2xl"
      title="Human-in-the-Loop Safety Gate"
      description="Mandatory verification gate — OISD-105 & API 570 compliance policies require authorised engineer sign-off."
    >
      <div className="space-y-4">

        {/* ── Warning banner ── */}
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
          style={{
            background: "rgba(229,184,92,0.08)",
            border: "1px solid rgba(229,184,92,0.25)",
          }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(229,184,92,0.12)", border: "1px solid rgba(229,184,92,0.25)" }}
          >
            <AlertTriangle className="w-5 h-5" style={{ color: "var(--wb-warning)" }} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-sm font-bold" style={{ color: "var(--wb-warning)" }}>
                CRITICAL THICKNESS LOSS DETECTED
              </span>
              <span
                className="text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(228,106,106,0.12)",
                  color: "var(--wb-danger)",
                  border: "1px solid rgba(228,106,106,0.22)",
                }}
              >
                Remaining Life &lt; 2 Years
              </span>
            </div>
            <p className="text-[12px]" style={{ color: "var(--wb-text-muted)" }}>
              Automated execution halted. API 570 mandates authorised engineer digital sign-off before official deliverable synthesis.
            </p>
          </div>
        </div>

        {/* ── Telemetry grid ── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3.5 rounded-xl"
          style={{
            background: "var(--wb-surface)",
            border: "1px solid var(--wb-border-subtle)",
          }}
        >
          {gridItems.map(({ label, value, sub, warn, danger }) => (
            <div key={label} className="space-y-0.5">
              <div
                className="text-[10px] font-mono uppercase tracking-wider"
                style={{ color: "var(--wb-text-muted)" }}
              >
                {label}
              </div>
              <div
                className="text-[12px] font-bold font-mono"
                style={{
                  color: danger
                    ? "var(--wb-danger)"
                    : warn
                    ? "var(--wb-warning)"
                    : "var(--wb-text)",
                }}
              >
                {value}
              </div>
              {sub && (
                <div className="text-[10px] font-mono" style={{ color: "var(--wb-text-muted)" }}>
                  {sub}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Recommendation ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: "var(--wb-text)" }}>
              Proposed Maintenance Recommendation
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 text-[11px] font-medium transition-colors"
              style={{ color: "var(--wb-teal)" }}
            >
              <Edit3 className="w-3 h-3" />
              {isEditing ? "Lock" : "Edit"}
            </button>
          </div>

          {isEditing ? (
            <textarea
              rows={3}
              value={customComment}
              onChange={(e) => setCustomComment(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-[13px] focus:outline-none resize-none leading-relaxed"
              style={{
                background: "var(--wb-surface)",
                border: "1px solid var(--wb-teal)",
                color: "var(--wb-text)",
              }}
            />
          ) : (
            <div
              className="px-3.5 py-2.5 rounded-lg text-[13px] leading-relaxed"
              style={{
                background: "var(--wb-surface)",
                border: "1px solid var(--wb-border-subtle)",
                color: "var(--wb-text-sec)",
              }}
            >
              {customComment}
            </div>
          )}
        </div>

        {/* ── PIN sign-off ── */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{
            background: "var(--wb-surface)",
            border: "1px solid var(--wb-border-medium)",
          }}
        >
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5"
            style={{ borderBottom: "1px solid var(--wb-border-subtle)" }}
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" style={{ color: "var(--wb-teal)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--wb-text)" }}>
                Operator Sign-off
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold font-mono" style={{ color: "var(--wb-text)" }}>
                {operatorName}
              </span>
              <span
                className="text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded"
                style={{
                  background: "var(--wb-teal-soft)",
                  color: "var(--wb-teal)",
                  border: "1px solid rgba(56,184,176,0.22)",
                }}
              >
                {operatorRole}
              </span>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <label
                className="text-[10px] font-mono uppercase tracking-wider"
                style={{ color: "var(--wb-text-muted)" }}
              >
                Authorization PIN (SHA-256 Seed)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN…"
                  className="w-full pl-8 pr-3 py-2 rounded-lg text-[13px] font-mono focus:outline-none transition-colors"
                  style={{
                    background: "var(--wb-surface-card)",
                    border: "1px solid var(--wb-border-medium)",
                    color: "var(--wb-text)",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--wb-teal)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--wb-border-medium)")}
                />
                <KeyRound
                  className="w-3.5 h-3.5 absolute left-2.5 top-2.5"
                  style={{ color: "var(--wb-text-muted)" }}
                />
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 text-[11px] font-semibold font-mono pb-2"
              style={{ color: "var(--wb-success)" }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Hardware Key Valid
            </div>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={handleReject}
            className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-[13px] font-semibold transition-colors"
            style={{
              background: "rgba(228,106,106,0.08)",
              border: "1px solid rgba(228,106,106,0.25)",
              color: "var(--wb-danger)",
            }}
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setApprovalModalOpen(false)}
              className="px-3 h-9 rounded-lg text-[13px] font-medium transition-colors"
              style={{
                background: "transparent",
                border: "1px solid var(--wb-border-medium)",
                color: "var(--wb-text-sec)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              disabled={isSigning}
              className="flex items-center gap-1.5 px-5 h-9 rounded-lg text-[13px] font-bold transition-colors disabled:opacity-50"
              style={{
                background: "var(--wb-teal)",
                color: "#07151D",
                border: "none",
                cursor: isSigning ? "wait" : "pointer",
              }}
            >
              <FileCheck className="w-4 h-4" />
              {isSigning ? "Signing…" : "Approve & Sign"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
