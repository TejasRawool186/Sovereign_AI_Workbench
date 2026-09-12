import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowRight } from "lucide-react";

export function LandingFooter() {
  return (
    <>
      {/* ── Final CTA Section ───────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden section-divider"
        style={{ minHeight: "560px", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(5rem,10vw,9rem) 1rem" }}
      >
        {/* Background image — next/image fill for lazy-loaded WebP/AVIF */}
        <Image
          src="/img/5.png"
          alt=""
          fill
          loading="lazy"
          quality={80}
          sizes="100vw"
          className="object-cover object-center pointer-events-none select-none"
          style={{ zIndex: 0 }}
        />
        {/* CTA overlay — strong directional gradient, darkest bottom-left where text sits */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,19,28,0.90) 0%, rgba(6,19,28,0.65) 55%, rgba(6,19,28,0.35) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(6,19,28,0.80) 100%)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          {/* SIH badge */}
          <div
            className="inline-flex items-center gap-2 status-badge mb-6"
            style={{
              background: "rgba(232,135,90,0.12)",
              border: "1px solid rgba(232,135,90,0.28)",
              color: "#E8875A",
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Smart India Hackathon 2026 — PS ID 26117
          </div>

          <h2
            style={{
              fontSize: "clamp(1.875rem,4.5vw,3rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#F0F4F6",
              marginBottom: "1.25rem",
            }}
          >
            Ready to Experience<br />
            <span style={{ color: "#38B8B0" }}>Air-Gapped Industrial Intelligence?</span>
          </h2>

          <p style={{ fontSize: "1.0625rem", color: "#B8C5CC", lineHeight: 1.65, marginBottom: "2.25rem", maxWidth: "520px", margin: "0 auto 2.25rem" }}>
            Launch the Sovereign Workbench to process real ultrasonic logs,
            run vibration FFT diagnostics, and experience deterministic
            human-in-the-loop validation.
          </p>

          <Link href="/workbench">
            <button className="btn-cta-primary" style={{ fontSize: "0.9375rem", padding: "14px 32px" }}>
              Launch Workbench Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "#06131C",
          borderTop: "1px solid rgba(56,184,176,0.08)",
          padding: "1.5rem 1rem",
        }}
      >
        <div className="max-w-landing mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <Image
                src="/img/Abhedya_logo.png"
                alt="ABHEDYA AI"
                width={48}
                height={48}
                className="rounded-lg object-contain"
              />
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#F0F4F6" }}>
                  ABHEDYA AI Sovereign Workbench
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontFamily: "ui-monospace, monospace",
                    color: "#718B96",
                    marginTop: "1px",
                  }}
                >
                  Mangalore Refinery and Petrochemicals Limited (MRPL) Enclave
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex items-center gap-6">
              {[
                { href: "/workbench", label: "Workbench Shell" },
                { href: "#pipeline", label: "Agentic Pipeline" },
                { href: "#compliance", label: "OISD Compliance" },
              ].map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  style={{
                    fontSize: "12px",
                    fontFamily: "ui-monospace, monospace",
                    color: "#718B96",
                    textDecoration: "none",
                    transition: "color 160ms ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#38B8B0"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#718B96"; }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Copyright */}
          <div
            className="mt-4 pt-4 text-center"
            style={{
              borderTop: "1px solid rgba(56,184,176,0.06)",
              fontSize: "11px",
              fontFamily: "ui-monospace, monospace",
              color: "#718B96",
            }}
          >
            © 2026 ABHEDYA AI — Team Quantum Compilers · SIH 2026 · PS ID 26117 (MRPL Smart Automation) · Air-Gapped Industrial Enclave
          </div>
        </div>
      </footer>
    </>
  );
}
