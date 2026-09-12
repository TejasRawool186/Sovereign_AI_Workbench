"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Cpu, Lock } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center py-20 overflow-hidden">

      {/* Background image — next/image fill for automatic WebP/AVIF + preload */}
      <Image
        src="/img/hero4.png"
        alt=""
        fill
        priority
        fetchPriority="high"
        quality={85}
        sizes="100vw"
        className="object-cover object-[center_28%] pointer-events-none select-none"
        style={{ zIndex: 0 }}
      />

      {/* Layered overlay system — dark navy, strongest behind text, opens up at edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,19,28,0.62) 0%, rgba(6,19,28,0.38) 48%, rgba(6,19,28,0.78) 100%)",
        }}
      />
      {/* Radial vignette behind the text block */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 52%, rgba(6,19,28,0.40) 0%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-landing mx-auto px-4 sm:px-6 text-center">

        {/* Logo mark */}
        <div className="flex justify-center mb-6 scroll-reveal">
          <Image
            src="/img/Abhedya_logo.png"
            alt="ABHEDYA AI Logo"
            width={120}
            height={120}
            className="rounded-2xl object-contain drop-shadow-lg"
            priority
          />
        </div>

        {/* Eyebrow status badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-8 scroll-reveal delay-75"
          style={{
            background: "rgba(56,184,176,0.10)",
            borderColor: "rgba(56,184,176,0.25)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#38B8B0] animate-pulse" />
          <span className="label-eyebrow" style={{ color: "#38B8B0", fontSize: "11px" }}>
            SIH 2026 · PS 26117 · MRPL Smart Automation
          </span>
        </div>

        {/* Main headline */}
        <h1 className="heading-hero max-w-4xl mx-auto scroll-reveal delay-150">
          <span style={{ color: "#F0F4F6" }}>ABHEDYA AI </span>
          <br />
          <span style={{ color: "#38B8B0" }}>Air-Gapped</span>{" "}
          <span style={{ color: "#F0F4F6" }}>Industrial Intelligence</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg leading-relaxed max-w-2xl mx-auto scroll-reveal delay-225"
          style={{ color: "#B8C5CC", fontSize: "1.0625rem" }}
        >
          Scanned inspection records → evidence-backed engineering deliverables.
          Local inference, deterministic reasoning, human-in-the-loop verification.
          Zero data leaves the organization.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 scroll-reveal delay-300">
          <Link href="/workbench">
            <button className="btn-cta-primary">
              Enter Workbench
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <a href="#how-it-works">
            <button className="btn-cta-secondary">
              How It Works
            </button>
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 scroll-reveal delay-375">
          {[
            { icon: ShieldCheck, label: "Air-Gapped" },
            { icon: Lock,        label: "Zero Egress" },
            { icon: Cpu,         label: "Local Inference" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2"
              style={{ color: "#718B96" }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: "#38B8B0" }} />
              <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "ui-monospace, monospace" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
