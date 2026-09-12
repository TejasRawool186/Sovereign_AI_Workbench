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
        <div className="text-center max-w-2xl mx-auto mb-12 scroll-reveal">
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
            className="rounded-xl p-6 scroll-reveal-scale delay-150"
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
            className="rounded-xl p-6 scroll-reveal-scale delay-300"
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
      icon: Terminal,
      label: "Ingests real inspection spreadsheets & PDFs",
      detail: "XLSX · PDF · CSV · DWG metadata",
    },
    {
      icon: Database,
      label: "Queries local OISD/API/ASME vector store",
      detail: "OISD-142 · API-570 · ASME B31.3",
    },
    {
      icon: BookOpen,
      label: "Calculates corrosion rate & remaining life",
      detail: "Formula: Cr = (T_prev - T_act) / Yrs",
    },
    {
      icon: FileScan,
      label: "Auto-detects high-risk discrepancies",
      detail: "Red-flag highlighting · anomaly score",
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

  const delays = ["delay-75", "delay-150", "delay-225", "delay-300", "delay-375", "delay-450"];

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
        <div className="text-center max-w-2xl mx-auto mb-12 scroll-reveal">
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
              <div key={i} className={`feature-card scroll-reveal ${delays[i] || ""}`}>
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
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  React.useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setIsScrolled(scrollY > 24);

      // Scroll-spy active section detection
      const sectionIds = ["how-it-works", "pipeline", "trust"];
      const offset = 120;
      let current: string | null = null;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset && rect.bottom > offset) {
            current = id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver for scroll-reveal animations
    const revealElements = document.querySelectorAll(".scroll-reveal, .scroll-reveal-scale");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -10px 0px",
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const topPos = targetEl.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top: topPos, behavior: "smooth" });
      }
    }
  };

  return (
    <div style={{ background: "#06131C", color: "#F0F4F6", minHeight: "100vh" }}>

      {/* Navigation with dynamic glassmorphism and scroll progress bar */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 select-none transition-all duration-300"
        style={{
          height: "56px",
          background: isScrolled ? "rgba(6,19,28,0.96)" : "rgba(6,19,28,0.85)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: isScrolled
            ? "1px solid rgba(56,184,176,0.18)"
            : "1px solid rgba(56,184,176,0.06)",
          boxShadow: isScrolled ? "0 4px 24px rgba(0,0,0,0.35)" : "none",
        }}
      >
        {/* Scroll depth progress line */}
        <div
          className="absolute bottom-0 left-0 h-[2px] pointer-events-none transition-[width] duration-100 ease-out"
          style={{
            width: `${scrollProgress}%`,
            background: "linear-gradient(90deg, #38B8B0 0%, #45C49A 65%, #E8875A 100%)",
            boxShadow: "0 0 10px rgba(56,184,176,0.7)",
          }}
        />

        {/* Brand */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (window.location.pathname !== "/") {
              window.location.href = "/";
            } else {
              // Clear any section hash
              if (window.location.hash) {
                window.history.replaceState(null, "", "/");
              }
              // If already at the top, reload the page fresh
              if (window.scrollY < 20) {
                window.location.reload();
              } else {
                // Otherwise smoothly glide to the top of the landing page
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }
          }}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          style={{ textDecoration: "none" }}
          title="ABHEDYA AI - Top of Landing Page"
        >
          <Image
            src="/img/Abhedya_logo.png"
            alt="ABHEDYA AI"
            width={44}
            height={44}
            className="rounded-lg object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <span
            className="transition-colors duration-200 group-hover:text-[#38B8B0]"
            style={{
              fontSize: "14px", fontWeight: 700, color: "#F0F4F6", letterSpacing: "-0.01em",
            }}
          >
            ABHEDYA AI
          </span>
        </a>

        {/* Nav links — centered in header with scroll-spy active highlight */}
        <nav className="hidden md:flex items-center gap-2 sm:gap-4 absolute left-1/2 -translate-x-1/2">
          {[
            { href: "#how-it-works", label: "How It Works" },
            { href: "#pipeline",     label: "Pipeline" },
            { href: "#trust",        label: "Trust Boundary" },
          ].map(({ href, label }) => {
            const sectionKey = href.replace("#", "");
            const isActive = activeSection === sectionKey;
            return (
              <a
                key={label}
                href={href}
                onClick={(e) => scrollToSection(e, href)}
                className="relative px-3 py-1.5 rounded-full transition-all duration-200"
                style={{
                  fontSize: "12px",
                  fontFamily: "ui-monospace, monospace",
                  color: isActive ? "#38B8B0" : "#718B96",
                  background: isActive ? "rgba(56,184,176,0.12)" : "transparent",
                  border: isActive ? "1px solid rgba(56,184,176,0.28)" : "1px solid transparent",
                  boxShadow: isActive ? "0 0 12px rgba(56,184,176,0.15)" : "none",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = "#38B8B0";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = "#718B96";
                }}
              >
                {label}
              </a>
            );
          })}
        </nav>

        {/* CTA */}
        <Link href="/workbench">
          <button
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg"
            style={{
              background: "rgba(232,135,90,0.12)",
              border: "1px solid rgba(232,135,90,0.28)",
              color: "#E8875A", fontSize: "13px", fontWeight: 600, cursor: "pointer",
              transition: "background 160ms ease, box-shadow 160ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(232,135,90,0.20)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px rgba(232,135,90,0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(232,135,90,0.12)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            Workbench
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </header>

      {/* Main content */}
      <main style={{ paddingTop: "56px" }}>
        {/* 1. Hero — hero4.png */}
        <LandingHero />

        {/* 2. What Actually Happens — six-stage interactive */}
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
