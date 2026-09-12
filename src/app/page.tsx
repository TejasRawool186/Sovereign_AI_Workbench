"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  FileScan,
  Database,
  UserCheck,
  FileCheck,
  Terminal,
  BookOpen,
  ArrowRight,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { LandingHero } from "@/components/landing/LandingHero";
import { InteractivePipeline } from "@/components/landing/InteractivePipeline";
import { ComplianceShowcase } from "@/components/landing/ComplianceShowcase";
import { LandingFooter } from "@/components/landing/LandingFooter";

/* ─── Trust Boundary ─────────────────────────────────────────────────────── */
function TrustBoundary() {
  const outside = [
    "Public cloud APIs (OpenAI, Anthropic, Gemini)",
    "External telemetry & usage tracking",
    "Internet-facing model endpoints",
    "Third-party vector databases",
    "SaaS compliance logging services",
  ];
  const inside = [
    "Local models (Ollama / vLLM, CUDA)",
    "Embedded vector DB (ChromaDB / Qdrant)",
    "Sandboxed code execution (--network none)",
    "SHA-256 immutable audit ledger",
    "Human-in-the-Loop approval gate",
    "All refinery SOPs, P&IDs, UT logs",
  ];

  return (
    <section
      id="trust"
      className="relative section-divider overflow-hidden"
      style={{ paddingTop: "clamp(4rem,8vw,7rem)", paddingBottom: "clamp(4rem,8vw,7rem)" }}
    >
      {/* §7 plan: img/2.png for trust boundary */}
      <Image
        src="/img/2.png"
        alt=""
        fill
        loading="lazy"
        quality={75}
        sizes="100vw"
        className="object-cover object-center pointer-events-none select-none opacity-45"
        style={{ zIndex: 0 }}
      />
      <div className="absolute inset-0 pointer-events-none overlay-security" />

      <div className="relative z-10 container-landing">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div
            className="inline-flex items-center gap-2 status-badge mb-5"
            style={{
              background: "rgba(69,196,154,0.10)",
              border: "1px solid rgba(69,196,154,0.25)",
              color: "#45C49A",
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero-Egress Enclave Boundary
          </div>
          <h2 className="heading-section" style={{ color: "#F0F4F6" }}>
            What Stays Out. What Stays In.
          </h2>
          <p className="mt-4 body-md">
            A hard boundary enforced by network-denied containers, host firewall
            policy, and continuous socket telemetry — not just claimed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* Outside */}
          <div
            className="rounded-xl p-6"
            style={{
              background: "rgba(228,106,106,0.06)",
              border: "1px solid rgba(228,106,106,0.22)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: "#E46A6A" }} />
              <span
                style={{
                  fontSize: "12px", fontWeight: 700, letterSpacing: "0.09em",
                  textTransform: "uppercase", color: "#E46A6A",
                }}
              >
                Outside the Enclave
              </span>
            </div>
            <ul className="space-y-3.5">
              {outside.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#E46A6A" }} />
                  <span style={{ fontSize: "1rem", color: "#B8C5CC", lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Inside */}
          <div
            className="rounded-xl p-6"
            style={{
              background: "rgba(56,184,176,0.06)",
              border: "1px solid rgba(56,184,176,0.22)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: "#45C49A" }} />
              <span
                style={{
                  fontSize: "12px", fontWeight: 700, letterSpacing: "0.09em",
                  textTransform: "uppercase", color: "#45C49A",
                }}
              >
                Inside the Enclave
              </span>
            </div>
            <ul className="space-y-3.5">
              {inside.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#45C49A" }} />
                  <span style={{ fontSize: "1rem", color: "#B8C5CC", lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Not a Chatbot ──────────────────────────────────────────────────────── */
function NotAChatbot() {
  const capabilities = [
    {
      icon: FileScan,
      label: "Reads scanned inspection files",
      detail: "PaddleOCR + PyMuPDF, multimodal vision",
    },
    {
      icon: Database,
      label: "Retrieves SOP evidence",
      detail: "ChromaDB · API 570 · OISD-105 · MRPL",
    },
    {
      icon: Terminal,
      label: "Runs sandboxed calculations",
      detail: "Docker --network none · exit-0 verified",
    },
    {
      icon: BookOpen,
      label: "Checks its own output (Self-RAG)",
      detail: "Flags unsupported claims, routes for review",
    },
    {
      icon: UserCheck,
      label: "Requests human approval at risk gates",
      detail: "Editable recommendation · PIN sign-off",
    },
    {
      icon: FileCheck,
      label: "Produces official deliverables",
      detail: "Inspection_Approval_Note_HC-102-B.docx",
    },
  ];

  return (
    <section
      id="not-a-chatbot"
      className="relative section-divider overflow-hidden"
      style={{ paddingTop: "clamp(4rem,8vw,7rem)", paddingBottom: "clamp(4rem,8vw,7rem)" }}
    >
      {/* §7 plan: img/3.png for not-a-chatbot */}
      <Image
        src="/img/3.png"
        alt=""
        fill
        loading="lazy"
        quality={75}
        sizes="100vw"
        className="object-cover object-center pointer-events-none select-none opacity-35"
        style={{ zIndex: 0 }}
      />
      <div className="absolute inset-0 pointer-events-none overlay-feature" />

      <div className="relative z-10 container-landing">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="heading-section" style={{ color: "#F0F4F6" }}>
            Not a Chatbot
          </h2>
          <p className="mt-4 body-md">
            ABHEDYA AI is built around industrial workflows — not a general-purpose chat
            interface. Here is exactly what it does, in order.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div key={i} className="feature-card">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                  style={{
                    background: "rgba(56,184,176,0.10)",
                    border: "1px solid rgba(56,184,176,0.20)",
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#38B8B0" }} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.9375rem", fontWeight: 600, color: "#F0F4F6",
                      lineHeight: 1.35, marginBottom: "4px",
                    }}
                  >
                    {cap.label}
                  </div>
                  <div
                    style={{
                      fontSize: "13px", fontFamily: "ui-monospace, monospace",
                      color: "#718B96", lineHeight: 1.4,
                    }}
                  >
                    {cap.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div style={{ background: "#06131C", color: "#F0F4F6", minHeight: "100vh" }}>

      {/* Navigation */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 select-none"
        style={{
          height: "56px",
          background: "rgba(6,19,28,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(56,184,176,0.08)",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <Image
            src="/img/Abhedya_logo.png"
            alt="ABHEDYA AI"
            width={44}
            height={44}
            className="rounded-lg object-contain"
          />
          <span
            style={{
              fontSize: "14px", fontWeight: 700, color: "#F0F4F6", letterSpacing: "-0.01em",
            }}
          >
            ABHEDYA AI
          </span>
        </div>

        {/* Nav links — visible on md+ */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: "#how-it-works", label: "How It Works" },
            { href: "#trust",        label: "Trust Boundary" },
            { href: "#pipeline",     label: "Pipeline" },
          ].map(({ href, label }) => (
            <a
              key={label}
              href={href}
              style={{
                fontSize: "12px", fontFamily: "ui-monospace, monospace",
                color: "#718B96", textDecoration: "none", transition: "color 160ms",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#38B8B0")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#718B96")}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Security status */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#45C49A" }} />
          <span
            style={{
              fontSize: "11px", fontWeight: 600, fontFamily: "ui-monospace, monospace",
              color: "#45C49A", letterSpacing: "0.06em",
            }}
          >
            AIR-GAPPED · 0 OUTBOUND BYTES
          </span>
        </div>

        {/* CTA */}
        <Link href="/workbench">
          <button
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg"
            style={{
              background: "rgba(232,135,90,0.12)",
              border: "1px solid rgba(232,135,90,0.28)",
              color: "#E8875A", fontSize: "13px", fontWeight: 600, cursor: "pointer",
              transition: "background 160ms ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(232,135,90,0.20)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(232,135,90,0.12)")}
          >
            Workbench
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </header>

      {/* Main content — five sections per §10 */}
      <main style={{ paddingTop: "56px" }}>
        {/* 1. Hero — hero4.png */}
        <LandingHero />

        {/* 2. What Actually Happens — six-stage interactive (new §10 section) */}
        <ComplianceShowcase />

        {/* 3. Interactive Pipeline — hero3.png */}
        <InteractivePipeline />

        {/* 4. Trust Boundary — 2.png */}
        <TrustBoundary />

        {/* 5. Not a Chatbot — 3.png */}
        <NotAChatbot />
      </main>

      <LandingFooter />
    </div>
  );
}
