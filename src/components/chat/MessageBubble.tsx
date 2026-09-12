"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FileText,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Download,
  Copy,
  Check,
  User,
  Sparkles,
  Code2,
  Edit3,
  ImageIcon,
  FileJson,
} from "lucide-react";
import { Message } from "@/types/chat";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CorrosionChart } from "@/components/charts/CorrosionChart";
import { VibrationFFTChart } from "@/components/charts/VibrationFFTChart";
import { formatBytes, truncateHash } from "@/lib/utils";
import { useTaskStore } from "@/store/useTaskStore";

interface MessageBubbleProps {
  message: Message;
}

/* ── File type icon helper ─────────────────────────────────────────────── */
function FileChip({ file }: { file: { id: string; name: string; size: number; type: string } }) {
  const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
  const isImage = file.type.startsWith("image/") || /\.(png|jpg|jpeg|webp)$/i.test(file.name);
  const isJson = file.type === "application/json" || file.name.endsWith(".json");

  const Icon = isImage ? ImageIcon : isJson ? FileJson : FileText;
  const color = isPdf ? "#E8875A" : isImage ? "#38B8B0" : isJson ? "#5B96C2" : "#B8C5CC";

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono"
      style={{
        background: "rgba(13,36,48,0.80)",
        borderColor: "rgba(56,184,176,0.18)",
        color: "#B8C5CC",
      }}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
      <span className="font-medium truncate max-w-[180px]">{file.name}</span>
      <span className="text-[10px] text-[#718B96]">({formatBytes(file.size)})</span>
    </div>
  );
}

/* ── Inline code block extractor ────────────────────────────────────────── */
function extractCodeBlocks(content: string): Array<{ lang: string; code: string }> {
  const blocks: Array<{ lang: string; code: string }> = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({ lang: match[1] || "text", code: match[2].trim() });
  }
  return blocks;
}

/* ── Expandable code viewer ─────────────────────────────────────────────── */
function CodeExpandable({ blocks }: { blocks: Array<{ lang: string; code: string }> }) {
  const [open, setOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (blocks.length === 0) return null;

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div
      className="mt-4 rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(56,184,176,0.15)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-mono transition-colors"
        style={{
          background: "rgba(10,29,40,0.90)",
          color: "#38B8B0",
        }}
      >
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5" />
          <span>View Generated Code</span>
          <span
            className="px-1.5 py-0.5 rounded text-[10px]"
            style={{ background: "rgba(56,184,176,0.12)", border: "1px solid rgba(56,184,176,0.20)" }}
          >
            {blocks.length} block{blocks.length > 1 ? "s" : ""}
          </span>
        </div>
        {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {open && (
        <div className="divide-y" style={{ borderColor: "rgba(56,184,176,0.08)" }}>
          {blocks.map((block, idx) => (
            <div key={idx} style={{ background: "rgba(6,16,24,0.95)" }}>
              {/* Code header */}
              <div
                className="flex items-center justify-between px-4 py-1.5"
                style={{ borderBottom: "1px solid rgba(56,184,176,0.08)" }}
              >
                <span
                  className="text-[10px] font-mono font-bold uppercase tracking-wider"
                  style={{ color: "#718B96" }}
                >
                  {block.lang}
                </span>
                <button
                  onClick={() => handleCopy(block.code, idx)}
                  className="flex items-center gap-1 text-[10px] font-mono transition-colors"
                  style={{ color: copiedIdx === idx ? "#45C49A" : "#718B96" }}
                >
                  {copiedIdx === idx ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copiedIdx === idx ? "Copied" : "Copy"}
                </button>
              </div>
              {/* Code body */}
              <pre
                className="overflow-x-auto px-4 py-3 text-[12px] leading-relaxed"
                style={{ fontFamily: "ui-monospace, monospace", color: "#B8C5CC" }}
              >
                <code>{block.code}</code>
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export function MessageBubble({ message }: MessageBubbleProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [copied, setCopied] = useState(false);
  const { setApprovalModalOpen } = useTaskStore();

  const isUser = message.role === "user";

  // Detect code task messages so we show the expandable code viewer
  const codeBlocks = !isUser ? extractCodeBlocks(message.content) : [];
  const hasCode = codeBlocks.length > 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // "Human edited" signal — approval comment differs from the stock default
  const DEFAULT_COMMENT = "Emergency ASTM A335 Grade P22 spool piece fabrication authorized.";
  const approvalWasEdited =
    message.approvalDetails?.comment &&
    !message.approvalDetails.comment.startsWith(DEFAULT_COMMENT) &&
    message.approvalDetails.comment.trim().length > 0;

  return (
    <div
      className={`flex flex-col gap-2 w-full ${isUser ? "items-end" : "items-start"}`}
    >
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-1 text-xs text-primary-muted">
        <div className="flex items-center gap-1.5">
          {isUser ? (
            <>
              <User className="w-3.5 h-3.5 text-primary-secondary" />
              <span className="font-medium text-primary-secondary">Operator</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="font-medium text-accent">ABHEDYA AI</span>
            </>
          )}
        </div>
        <span>•</span>
        <span>{message.timestamp}</span>
      </div>

      {/* ── Bubble ───────────────────────────────────────────────────── */}
      <div
        className={`rounded-2xl w-full transition-all ${
          isUser
            ? "bg-surface-card/80 border border-border-subtle p-5 max-w-3xl"
            : "p-5"
        }`}
      >
        {/* File chips (user messages) */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 pb-3 border-b border-border-subtle">
            {message.attachments.map((file) => (
              <FileChip key={file.id} file={file} />
            ))}
          </div>
        )}

        {/* Reasoning trace (assistant) */}
        {!isUser && message.reasoningSteps && message.reasoningSteps.length > 0 && (
          <div className="mb-4 rounded-xl bg-surface border border-border-subtle overflow-hidden">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="w-full px-3 py-2 text-xs font-mono flex items-center justify-between text-primary-secondary hover:text-primary hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>
                  Chain of Thought Reasoning Trace ({message.reasoningSteps.length} Steps)
                </span>
              </div>
              {showReasoning ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {showReasoning && (
              <div className="p-3 bg-canvas/60 border-t border-border-subtle space-y-1.5 text-xs font-mono text-primary-secondary">
                {message.reasoningSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-accent">❯</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Markdown content */}
        <div className="prose-claude max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Expandable code viewer — only shown when code blocks are present */}
        {hasCode && <CodeExpandable blocks={codeBlocks} />}

        {/* Inline charts */}
        {message.chartData?.type === "corrosion_curve" && (
          <CorrosionChart
            data={message.chartData.data}
            title={message.chartData.title}
            description={message.chartData.description}
            threshold={message.chartData.threshold}
          />
        )}

        {message.chartData?.type === "vibration_fft" && (
          <VibrationFFTChart
            data={message.chartData.data}
            title={message.chartData.title}
            description={message.chartData.description}
            threshold={message.chartData.threshold}
          />
        )}

        {/* HITL pending banner */}
        {message.requiresApproval && message.approvalStatus === "pending" && (
          <div
            className="mt-5 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              background: "rgba(230,184,92,0.08)",
              border: "1px solid rgba(230,184,92,0.28)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(230,184,92,0.15)", border: "1px solid rgba(230,184,92,0.30)" }}
              >
                <AlertTriangle className="w-5 h-5" style={{ color: "#E6B85C" }} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold" style={{ color: "#E6B85C" }}>
                  Lead Engineer Review Required
                </h4>
                <p className="text-[11px] text-primary-secondary mt-0.5">
                  Remaining life &lt; 2 years — AI execution halted at HITL gate. Awaiting operator sign-off.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setApprovalModalOpen(true)}
              className="shrink-0 text-xs px-4"
              size="sm"
            >
              Review &amp; Sign
            </Button>
          </div>
        )}

        {/* Approved stamp — with "human edited" signal */}
        {message.approvalStatus === "approved" && message.approvalDetails && (
          <div
            className="mt-5 p-4 rounded-xl"
            style={{
              background: "rgba(69,196,154,0.08)",
              border: "1px solid rgba(69,196,154,0.28)",
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(69,196,154,0.15)" }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: "#45C49A" }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold" style={{ color: "#45C49A" }}>
                      APPROVED &amp; DIGITALLY SIGNED
                    </span>
                    <Badge variant="success" size="sm">
                      {message.approvalDetails.operatorRole}
                    </Badge>
                    {/* "Human edited" badge — key realism signal from §7 of the plan */}
                    {approvalWasEdited && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          background: "rgba(232,135,90,0.12)",
                          border: "1px solid rgba(232,135,90,0.28)",
                          color: "#E8875A",
                        }}
                      >
                        <Edit3 className="w-2.5 h-2.5" />
                        Engineer Edited
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-primary-muted mt-0.5">
                    Signed by {message.approvalDetails.approvedBy} · {message.approvalDetails.approvedAt}
                  </div>
                </div>
              </div>
              <div className="text-[11px] font-mono text-primary-muted shrink-0">
                SHA: {truncateHash(message.approvalDetails.signatureHash || "", 6, 6)}
              </div>
            </div>

            {/* Edited recommendation — shown inline when it differs from default */}
            {approvalWasEdited && (
              <div
                className="mt-3 px-3 py-2.5 rounded-lg text-[11px] leading-relaxed"
                style={{
                  background: "rgba(232,135,90,0.07)",
                  border: "1px solid rgba(232,135,90,0.18)",
                  color: "#B8C5CC",
                  borderLeft: "3px solid rgba(232,135,90,0.45)",
                }}
              >
                <span className="font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#E8875A" }}>
                  Engineer&apos;s revised recommendation:
                </span>
                <p className="mt-1">{message.approvalDetails.comment}</p>
              </div>
            )}
          </div>
        )}

        {/* Deliverable download card */}
        {message.deliverable && (
          <div
            className="mt-4 p-4 rounded-xl flex items-center justify-between gap-4 shadow-card"
            style={{
              background: "rgba(13,36,48,0.88)",
              border: "1px solid rgba(56,184,176,0.18)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(56,184,176,0.12)", border: "1px solid rgba(56,184,176,0.25)" }}
              >
                <FileCheck className="w-5 h-5" style={{ color: "#38B8B0" }} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-primary">
                  {message.deliverable.filename}
                </h4>
                <div className="text-[10px] sm:text-[11px] font-mono text-primary-muted">
                  {formatBytes(message.deliverable.fileSize)} · SHA-256:{" "}
                  {truncateHash(message.deliverable.sha256, 8, 6)}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => {
                alert(`Downloading official deliverable: ${message.deliverable?.filename}`);
              }}
              className="shrink-0 gap-1.5 font-semibold text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        )}

        {/* Footer copy action */}
        <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-border-subtle/50 text-[11px] font-mono text-primary-muted">
          <button
            onClick={handleCopy}
            className="p-1 hover:text-primary transition-colors flex items-center gap-1"
            title="Copy Message Text"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-status-success" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
