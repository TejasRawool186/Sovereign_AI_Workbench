"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Upload,
  FileSearch,
  BookOpen,
  FlaskConical,
  UserCheck,
  FileCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const STAGES = [
  {
    id: "01",
    icon: Upload,
    name: "Ingest",
    color: "#38B8B0",
    colorDim: "rgba(56,184,176,0.12)",
    colorBorder: "rgba(56,184,176,0.25)",
    headline: "Field data enters the local staging buffer",
    body: "UT inspection PDFs, vibration FFT JSON, and field photos are ingested directly from local storage. No upload occurs — the network interface is firewalled at the kernel level before this step begins.",
    chip: "Local disk only · Zero egress",
  },
  {
    id: "02",
    icon: FileSearch,
    name: "Understand",
    color: "#5B96C2",
    colorDim: "rgba(91,150,194,0.12)",
    colorBorder: "rgba(91,150,194,0.25)",
    headline: "Multimodal OCR + vision extraction",
    body: "PaddleOCR 2.8 extracts tabular CML measurements from scanned PDFs. Qwen2.5-VL-7B interprets photographs for visual defects — pitting, HAZ corrosion, weld anomalies. All CUDA inference runs on-premise.",
    chip: "PaddleOCR · Qwen2.5-VL-7B · ~850 ms",
  },
  {
    id: "03",
    icon: BookOpen,
    name: "Retrieve",
    color: "#8B78D4",
    colorDim: "rgba(139,120,212,0.12)",
    colorBorder: "rgba(139,120,212,0.25)",
    headline: "SOP evidence retrieved from local vector store",
    body: "BGE-M3 embeddings query a ChromaDB/Qdrant collection of plant SOPs, API 570, and OISD-105 standards. Only clauses with cosine similarity above 0.88 are surfaced. No external API call is made.",
    chip: "ChromaDB · BGE-M3 · avg sim 0.93 · ~420 ms",
  },
  {
    id: "04",
    icon: FlaskConical,
    name: "Execute",
    color: "#E8875A",
    colorDim: "rgba(232,135,90,0.12)",
    colorBorder: "rgba(232,135,90,0.25)",
    headline: "Sandboxed calculation + industrial reasoning",
    body: "Qwen2.5-14B computes corrosion rates, remaining life, and MAWT compliance. Calculation scripts run inside a Docker container with --network none. Self-RAG flags any unsupported claims and routes them for revision.",
    chip: "Qwen2.5-14B · --network none · ~1 200 ms",
  },
  {
    id: "05",
    icon: UserCheck,
    name: "Verify",
    color: "#E6B85C",
    colorDim: "rgba(230,184,92,0.12)",
    colorBorder: "rgba(230,184,92,0.28)",
    headline: "Deterministic human-in-the-loop gate",
    body: "For any finding classified as Critical or High, the pipeline halts at a mandatory approval checkpoint. The Lead Engineer reviews AI findings, edits the recommendation if needed, and authenticates with a PIN-seeded SHA-256 digital signature.",
    chip: "Mandatory · Editable · PIN-authenticated",
  },
  {
    id: "06",
    icon: FileCheck,
    name: "Approve",
    color: "#45C49A",
    colorDim: "rgba(69,196,154,0.12)",
    colorBorder: "rgba(69,196,154,0.25)",
    headline: "Official deliverable + tamper-evident audit trail",
    body: "Approved findings are synthesized into a signed .docx inspection report. Every step — OCR, retrieval, calculation, approval — is recorded in an immutable SHA-256 audit ledger. The chain can be verified at any time without any outbound request.",
    chip: "SHA-256 stamped · Immutable ledger · ~600 ms",
  },
] as const;

export function ComplianceShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = STAGES[activeIdx];
  const ActiveIcon = active.icon;

  return (
    <section
      id="how-it-works"
      className="relative section-divider overflow-hidden"
      style={{
        paddingTop: "clamp(4rem,8vw,7rem)",
        paddingBottom: "clamp(4rem,8vw,7rem)",
      }}
    >
      {/* Background image — next/image fill for lazy-loaded WebP/AVIF */}
      <Image
        src="/img/hero.png"
        alt=""
        fill
        loading="lazy"
        quality={80}
        sizes="100vw"
        className="object-cover object-center pointer-events-none select-none"
        style={{ zIndex: 0 }}
      />
      {/* Dark overlay to keep content readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,19,28,0.82) 0%, rgba(6,19,28,0.75) 50%, rgba(6,19,28,0.88) 100%)",
        }}
      />
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(56,184,176,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,184,176,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 container-landing">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div
            className="inline-flex items-center gap-2 status-badge mb-5"
            style={{
              background: "rgba(56,184,176,0.10)",
              border: "1px solid rgba(56,184,176,0.25)",
              color: "#38B8B0",
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Six-Stage Deterministic Pipeline
          </div>
          <h2 className="heading-section" style={{ color: "#F0F4F6" }}>
            What Actually Happens
          </h2>
          <p className="mt-4 body-md">
            Not a chatbot that returns a text answer. Six deterministic stages,
            each with a verifiable output — from raw field scan to signed deliverable.
          </p>
        </div>

        {/* Stage pills row */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeIdx === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveIdx(idx)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold transition-all duration-150"
                style={{
                  background: isActive ? stage.colorDim : "rgba(13,36,48,0.60)",
                  border: `1px solid ${isActive ? stage.colorBorder : "rgba(56,184,176,0.10)"}`,
                  color: isActive ? stage.color : "#718B96",
                  boxShadow: isActive ? `0 0 12px ${stage.colorDim}` : "none",
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>
                  {stage.id} · {stage.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active stage detail card */}
        <div
          className="max-w-3xl mx-auto rounded-2xl overflow-hidden"
          style={{
            background: "rgba(10,29,40,0.92)",
            border: `1px solid ${active.colorBorder}`,
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: `0 4px 40px rgba(0,0,0,0.35), 0 0 0 1px ${active.colorDim}`,
          }}
        >
          {/* Card header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: `1px solid ${active.colorBorder}30` }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
                style={{ background: active.colorDim, border: `1px solid ${active.colorBorder}` }}
              >
                <ActiveIcon className="w-6 h-6" style={{ color: active.color }} />
              </div>
              <div>
                <div
                  className="text-[11px] font-mono font-bold uppercase tracking-wider mb-0.5"
                  style={{ color: active.color }}
                >
                  Stage {active.id} of 06 — {active.name}
                </div>
                <h3
                  className="text-lg font-bold leading-snug"
                  style={{ color: "#F0F4F6" }}
                >
                  {active.headline}
                </h3>
              </div>
            </div>
            {/* Progress dots */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              {STAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === activeIdx ? 20 : 6,
                    height: 6,
                    background: i === activeIdx ? active.color : "rgba(113,139,150,0.30)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Card body */}
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-0">
            {/* Description */}
            <div
              className="sm:col-span-2 pr-0 sm:pr-6"
              style={{ borderRight: "1px solid rgba(56,184,176,0.08)" }}
            >
              <p
                className="text-[1rem] leading-relaxed"
                style={{ color: "#B8C5CC" }}
              >
                {active.body}
              </p>
              {/* Nav arrows */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                  disabled={activeIdx === 0}
                  className="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all disabled:opacity-30"
                  style={{
                    background: "rgba(56,184,176,0.08)",
                    border: "1px solid rgba(56,184,176,0.18)",
                    color: "#38B8B0",
                  }}
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setActiveIdx((i) => Math.min(STAGES.length - 1, i + 1))}
                  disabled={activeIdx === STAGES.length - 1}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all disabled:opacity-30"
                  style={{
                    background: active.colorDim,
                    border: `1px solid ${active.colorBorder}`,
                    color: active.color,
                  }}
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tech chip */}
            <div className="pl-0 sm:pl-6 mt-4 sm:mt-0 flex flex-col justify-between gap-4">
              <div>
                <div
                  className="text-[10px] font-mono uppercase tracking-wider mb-2"
                  style={{ color: "#718B96" }}
                >
                  Enclave Engine
                </div>
                <div
                  className="px-3 py-2.5 rounded-xl text-[11px] font-mono font-semibold leading-relaxed"
                  style={{
                    background: active.colorDim,
                    border: `1px solid ${active.colorBorder}`,
                    color: active.color,
                    whiteSpace: "pre-line",
                  }}
                >
                  {active.chip.split(" · ").join("\n")}
                </div>
              </div>
              <div
                className="flex items-center gap-1.5 text-[11px] font-mono"
                style={{ color: "#45C49A" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#45C49A", display: "inline-block" }}
                />
                Zero Cloud Egress
              </div>
            </div>
          </div>
        </div>

        {/* Linear chain illustration — small, below the card */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-1">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isPast = idx <= activeIdx;
            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => setActiveIdx(idx)}
                  className="flex flex-col items-center gap-1.5 group"
                  title={stage.name}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      background: isPast ? stage.colorDim : "rgba(13,36,48,0.60)",
                      border: `1px solid ${isPast ? stage.colorBorder : "rgba(56,184,176,0.08)"}`,
                    }}
                  >
                    <Icon
                      className="w-3.5 h-3.5"
                      style={{ color: isPast ? stage.color : "#718B96" }}
                    />
                  </div>
                  <span
                    className="text-[9px] font-mono uppercase tracking-wider"
                    style={{ color: isPast ? stage.color : "#718B96" }}
                  >
                    {stage.name}
                  </span>
                </button>
                {idx < STAGES.length - 1 && (
                  <div
                    className="w-6 h-px mb-4 transition-all"
                    style={{
                      background: idx < activeIdx
                        ? STAGES[idx].color
                        : "rgba(56,184,176,0.15)",
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
