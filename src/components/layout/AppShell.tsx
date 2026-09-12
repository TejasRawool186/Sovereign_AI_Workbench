"use client";

import React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ContextPanel } from "./ContextPanel";
import { useTaskStore } from "@/store/useTaskStore";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div
      className="h-screen h-[100dvh] w-full flex flex-col overflow-hidden"
      style={{ background: "var(--wb-bg)", color: "var(--wb-text)" }}
    >
      {/* Global Header — 64px */}
      <Header />

      {/* Main 3-column layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden w-full">
        {/* Left Sidebar — 260px */}
        <Sidebar />

        {/* Centre Workspace */}
        <main
          className="flex-1 flex flex-col min-w-0 min-h-0 h-full overflow-hidden relative"
          style={{ background: "var(--wb-bg)" }}
        >
          {children}
        </main>

        {/* Right Agent Trace Panel */}
        <ContextPanel />
      </div>
    </div>
  );
}
