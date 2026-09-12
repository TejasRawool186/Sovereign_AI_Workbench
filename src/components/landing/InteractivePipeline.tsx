"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Upload,
  FileSearch,
  BookOpen,
  Cpu,
  UserCheck,
  FileCheck,
} from "lucide-react";

export function InteractivePipeline() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "01",
      icon: Upload,
      name: "Field Upload",
      node: "input_stage",
      shortDesc: "UT Log & PDF Ingestion",
      latency: "Local Disk",
      details:
        "Field inspectors ingest raw ultrasonic thickness (UT) inspection scans, vibration time-series FFT JSON, or mobile photos of refinery P&ID tags into the local air-gapped staging buffer. No cloud upload occurs at any point.",
      tech: "Local File System · Zero Cloud Upload · Zero Egress",
    },
    {
      id: "02",
      icon: FileSearch,
      name: "Multimodal OCR",
      node: "ocr_extract",
      shortDesc: "PaddleOCR Extraction",
      latency: "~850 ms",
      details:
        "Local PaddleOCR 2.8 and PyMuPDF parse noisy engineering tables, extracting Condition Monitoring Location (CML) coordinates, nominal thicknesses, and measured values into structured JSON. Qwen2.5-VL-7B handles visual interpretation of photographs.",
      tech: "PaddleOCR 2.8 + PyMuPDF + Qwen2.5-VL-7B (CUDA)",
    },
    {
      id: "03",
      icon: BookOpen,
      name: "SOP RAG Search",
      node: "rag_search",
      shortDesc: "Semantic SOP Retrieval",
      latency: "~420 ms",
      details:
        "Embeddings are computed locally using BGE-M3. ChromaDB retrieves the most relevant sections from API 570, OISD-STD-105, and MRPL plant operating manuals with cosine similarity above 0.90 — all without any external API call.",
      tech: "ChromaDB / Qdrant Embedded · BGE-M3 · Avg similarity 0.93",
    },
    {
      id: "04",
      icon: Cpu,
      name: "Industrial Reasoning",
      node: "recommend",
      shortDesc: "Corrosion Rate Calculation",
      latency: "~1200 ms",
      details:
        "Qwen 2.5 14B calculates short-term and long-term corrosion rates (mm/year), projects remaining equipment life, flags MAWT retirement threshold breaches, and formats maintenance recommendations grounded in the retrieved SOP evidence.",
      tech: "Qwen2.5-14B Industrial (CUDA Q4_K_M) · Sandboxed calc",
    },
    {
      id: "05",
      icon: UserCheck,
      name: "HITL Verification",
      node: "human_checkpoint",
      shortDesc: "Mandatory Engineer Sign-off",
      latency: "Human Gated",
      details:
        "The agent automatically suspends execution at this deterministic gate. The Lead Corrosion Engineer reviews findings, edits the recommended replacement timeline if needed, and authenticates using a PIN-based SHA-256 digital signature.",
      tech: "Deterministic State Gate · SHA-256 Signature · PIN Auth",
    },
    {
      id: "06",
      icon: FileCheck,
      name: "Signed Deliverable",
      node: "generate_docx",
      shortDesc: "Verified DOCX Release",
      latency: "~600 ms",
      details:
        "Approved findings are synthesized into an official inspection report (.docx) stamped with the operator's digital signature and SHA-256 hash. Every step is recorded in the immutable audit ledger for statutory compliance.",
      tech: "Docx Synthesizer · SHA-256 Audit Trail · Immutable Ledger",
    },
  ];

  const active = steps[activeStep];
  const ActiveIcon = active.icon;

  return (
    <section
      id="pipeline"
      className="relative section-divider overflow-hidden"
      style={{ paddingTop: "clamp(4rem,8vw,7rem)", paddingBottom: "clamp(4rem,8vw,7rem)" }}
    >
      {/* Background image — next/image fill for lazy-loaded WebP/AVIF */}
      <Image
        src="/img/hero3.png"
        alt=""
        fill
        loading="lazy"
        quality={80}
        sizes="100vw"
        className="object-cover object-center pointer-events-none select-none opacity-40"
        style={{ zIndex: 0 }}
      />
      {/* Pipeline overlay — content must dominate */}
      <div className="absolute inset-0 pointer-events-none overlay-pipeline" />

      <div className="relative z-10 container-landing">

        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block status-badge mb-4"
            style={{ background: "rgba(56,184,176,0.10)", borderColor: "rgba(56,184,176,0.22)", color: "#38B8B0", border: "1px solid" }}
          >
            LangGraph 6-Node Orchestration
          </div>
          <h2 className="heading-section" style={{ color: "#F0F4F6" }}>
            Deterministic Agentic Execution Pipeline
          </h2>
          <p className="mt-4 body-md">
            Click each stage to inspect how confidential refinery field telemetry
            transitions through the multi-agent reasoning graph.
          </p>
        </div>

        {/* Stage selector — 6 cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`pipeline-card flex flex-col gap-2 ${isActive ? "active" : ""}`}
                style={{ minHeight: "90px" }}
                aria-pressed={isActive}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      background: isActive ? "#38B8B0" : "rgba(56,184,176,0.10)",
                      color: isActive ? "#06131C" : "#38B8B0",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      fontFamily: "ui-monospace, monospace",
                      color: "#718B96",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {step.latency}
                  </span>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: isActive ? "#F0F4F6" : "#B8C5CC",
                      lineHeight: 1.3,
                    }}
                  >
                    {step.name}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#718B96",
                      marginTop: "2px",
                      lineHeight: 1.3,
                    }}
                  >
                    {step.shortDesc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active stage detail panel */}
        <div
          className="rounded-xl"
          style={{
            background: "rgba(10,29,40,0.92)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(56,184,176,0.15)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.35)",
          }}
        >
          {/* Panel header */}
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5"
            style={{ borderBottom: "1px solid rgba(56,184,176,0.10)" }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
                style={{
                  background: "rgba(56,184,176,0.12)",
                  border: "1px solid rgba(56,184,176,0.25)",
                }}
              >
                <ActiveIcon className="w-6 h-6" style={{ color: "#38B8B0" }} />
              </div>
              <div>
                <div className="flex items-center gap-2.5 mb-0.5">
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      fontFamily: "ui-monospace, monospace",
                      color: "#38B8B0",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    STAGE {active.id} OF 06
                  </span>
                  <span
                    className="px-2 py-0.5 rounded"
                    style={{
                      fontSize: "11px",
                      fontFamily: "ui-monospace, monospace",
                      background: "rgba(56,184,176,0.08)",
                      border: "1px solid rgba(56,184,176,0.18)",
                      color: "#38B8B0",
                    }}
                  >
                    {active.node}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#F0F4F6", lineHeight: 1.2 }}>
                  {active.name}: {active.shortDesc}
                </h3>
              </div>
            </div>
            <div
              className="px-3 py-1.5 rounded shrink-0"
              style={{
                background: "rgba(232,135,90,0.12)",
                border: "1px solid rgba(232,135,90,0.25)",
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "ui-monospace, monospace",
                color: "#E8875A",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              LATENCY: {active.latency}
            </div>
          </div>

          {/* Panel body */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Left — operational behavior */}
            <div
              className="md:col-span-2 px-6 py-6"
              style={{ borderRight: "1px solid rgba(56,184,176,0.08)" }}
            >
              <h4
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  color: "#718B96",
                  marginBottom: "12px",
                }}
              >
                Operational Behavior &amp; Reasoning Flow
              </h4>
              <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#B8C5CC" }}>
                {active.details}
              </p>
            </div>

            {/* Right — tech stack */}
            <div className="px-6 py-6">
              <h4
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  color: "#718B96",
                  marginBottom: "12px",
                }}
              >
                Enclave Engine Stack
              </h4>
              <p
                style={{
                  fontSize: "13px",
                  fontFamily: "ui-monospace, monospace",
                  fontWeight: 600,
                  color: "#38B8B0",
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                }}
              >
                {active.tech.split(" · ").join("\n")}
              </p>
              <div
                className="mt-4 flex items-center gap-1.5"
                style={{ fontSize: "12px", color: "#45C49A" }}
              >
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#45C49A", display: "inline-block", flexShrink: 0 }} />
                Zero Cloud Egress
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
