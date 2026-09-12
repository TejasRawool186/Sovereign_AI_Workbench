import { create } from "zustand";
import { TaskItem, AuditLogEntry, OperatorRole, TaskStatus } from "@/types/task";
import { Message, ModelGenerationConfig } from "@/types/chat";
import { AgentTraceStep, AgentNodeName, AgentNodeStatus } from "@/types/agent";
import { KnowledgeDocument } from "@/types/file";
import { NetworkSentinelStats, SocketConnection } from "@/types/network";
import { defaultExecutionSteps, codeVerifyExecutionSteps } from "@/mocks/mockAgentTrace";
import { initialMockAuditLogs } from "@/mocks/mockAuditLogs";
import { mockCorrosionDegradationCurve } from "@/mocks/mockInspectionData";
import { mockPumpVibrationFFTSpectrum } from "@/mocks/mockVibrationData";
import { generateSHA256 } from "@/lib/crypto";

export type WorkspaceView = "tasks" | "audit" | "network" | "settings";

export interface ConfiguredModel {
  id: string;
  name: string;
  endpoint: string;
  apiKey?: string;
  provider: string;
}

interface TaskState {
  // Navigation & Shell
  activeView: WorkspaceView;
  setActiveView: (view: WorkspaceView) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isContextPanelOpen: boolean;
  setContextPanelOpen: (open: boolean) => void;
  toggleContextPanel: () => void;
  activeContextTab: "timeline" | "context" | "calculation" | "deliverable";
  setActiveContextTab: (tab: "timeline" | "context" | "calculation" | "deliverable") => void;

  // Operator Profile & Role
  operatorName: string;
  operatorRole: OperatorRole;
  setOperatorRole: (role: OperatorRole) => void;

  // Model & Arena Settings
  modelConfig: ModelGenerationConfig;
  setModelConfig: (config: Partial<ModelGenerationConfig>) => void;
  isModelModalOpen: boolean;
  setModelModalOpen: (open: boolean) => void;

  // Configured Models
  configuredModels: ConfiguredModel[];
  addConfiguredModel: (model: Omit<ConfiguredModel, "id">) => void;
  removeConfiguredModel: (id: string) => void;

  // Tasks & History
  tasks: TaskItem[];
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  createNewTask: () => void;
  deleteTask: (id: string) => void;
  pinTask: (id: string) => void;

  // Active Chat Stream & Agent Steps
  messages: Message[];
  activeTraceSteps: AgentTraceStep[];
  isExecuting: boolean;
  currentRunningNode: AgentNodeName | null;

  // Approval Gate (HITL)
  isApprovalModalOpen: boolean;
  setApprovalModalOpen: (open: boolean) => void;
  activeApprovalData: any | null;
  approveStep: (pin: string, customComment?: string) => Promise<void>;
  rejectStep: (reason: string) => void;
  editRecommendation: (newRecommendation: string) => void;

  // Knowledge Base Documents
  knowledgeDocs: KnowledgeDocument[];
  addKnowledgeDoc: (doc: KnowledgeDocument) => void;

  // Audit Ledger
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, "id" | "timestamp" | "sha256Hash" | "verified">) => Promise<void>;

  // Network Sentinel Telemetry
  networkStats: NetworkSentinelStats;
  activeSockets: SocketConnection[];
  refreshNetworkTelemetry: () => void;

  // Actions
  addMessage: (message: Omit<Message, "id" | "timestamp">) => string;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setTraceStepStatus: (stepId: string, status: AgentNodeStatus, summary?: string, durationMs?: number) => void;
  addTraceStepLog: (stepId: string, log: string) => void;
  resetTraceSteps: () => void;
  setExecuting: (executing: boolean) => void;
}

const initialNewTask: TaskItem = {
  id: "TASK-NEW-01",
  title: "New Chat",
  category: "CUSTOM",
  status: "DRAFT",
  createdAt: "2026-09-11 00:00:00 UTC",
  updatedAt: "2026-09-11 00:00:00 UTC",
  summary: "Fresh sovereign inspection session.",
  messages: [],
  traceSteps: defaultExecutionSteps.map((s) => ({
    ...s,
    status: "pending",
    logs: [],
  })),
  pinned: false,
};

const initialTask: TaskItem = {
  id: "TASK-DEMO-01",
  title: "HC-102-B Hydrocracker Unit 3 UT Corrosion Audit",
  category: "UT_AUDIT",
  status: "COMPLETED",
  createdAt: "2026-09-04 18:30:00",
  updatedAt: "2026-09-04 18:42:15",
  summary: "NDT-2026-00481 · Canonical corrosion assessment — HC-102-B flange, CR 0.564 mm/yr, RL 1.24 yrs.",
  messages: [
    {
      id: "msg-user-1",
      role: "user",
      content:
        "Analyze the attached UT inspection log for MRPL Hydrocracker Unit 3, Asset HC-102-B (Report NDT-2026-00481). Extract nominal vs measured wall thickness at all CMLs, compute short-term and long-term corrosion rates, project remaining life, and check compliance against the 5-year inspection interval minimum allowable wall thickness (MAWT = 2.50 mm).",
      timestamp: "18:30:12",
      attachments: [
        {
          id: "att-1",
          name: "HC_102_B_UT_Inspection_Report.pdf",
          size: 2450000,
          type: "application/pdf",
        },
        {
          id: "att-2",
          name: "corrosion_flange.png",
          size: 840000,
          type: "image/png",
        },
      ],
    },
    {
      id: "msg-asst-1",
      role: "assistant",
      content: `### Ultrasonic Thickness (UT) Inspection & Integrity Assessment Report
**Plant:** MRPL Hydrocracker Unit 3 · **Asset:** HC-102-B (High-Pressure Recycle Flange)
**Report ID:** NDT-2026-00481 · **Inspector:** INS-017 · **Approval Ref:** APR-2026-00073
**Standard Cross-Reference:** API 570 / OISD-STD-105 Clause 4.2.1
**Verification Level:** AI-assisted finding — engineer-reviewed recommendation (Qwen2.5-VL-7B + Qwen2.5-14B)

---

#### 1. Critical Findings — Wall Thickness Loss Matrix
18 thickness readings extracted via local multimodal OCR, cross-referenced with baseline records:

| CML Point | Location Description | Nominal (mm) | Measured (mm) | MAWT (mm) | Corrosion Rate | Remaining Life | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CML-HC-102-B** | **HC Unit 3 — HP Recycle Flange** | **6.02 mm** | **3.20 mm** | **2.50 mm** | **0.564 mm/yr** | **1.24 Years** | 🚨 **CRITICAL** |
| CML-HC-101B | Effluent Separator Inlet Nozzle | 16.0 mm | 11.4 mm | 8.0 mm | 0.45 mm/yr | 7.55 Years | ⚠️ WARNING |
| CML-HC-101A | Reactor Overhead Vapor Line Elbow | 14.2 mm | 10.8 mm | 6.5 mm | 0.29 mm/yr | 14.8 Years | ✅ NORMAL |
| CML-HC-103C | Sour Gas Reboiler Bottoms | 12.7 mm | 8.1 mm | 7.0 mm | 0.58 mm/yr | 1.89 Years | 🚨 **CRITICAL** |

#### 2. Vision Model Finding — Localized Pitting (Confidence 0.89)
Qwen2.5-VL-7B analysis of \`corrosion_flange.png\` flagged localized pitting near weld heat-affected zone (HAZ). **This is an AI-assisted finding — requires engineer confirmation.**

#### 3. Root Cause Analysis & Degradation Projection
* **CML-HC-102-B** exhibits flow-accelerated corrosion (FAC) consistent with high-velocity multiphase hydrocarbon flow and trace sour H₂S stream content.
* At the current degradation velocity (0.564 mm/year), wall thickness will breach the **MAWT (2.50 mm)** by **Q3 2027** — well before the scheduled 2029 major plant turnaround.
* Remaining useful life: **1.24 years** from current inspection date (September 2026).

#### 4. Prescribed Corrective Action (Pending Engineering Sign-off)
1. Schedule phased array ultrasonic testing (PAUT) within 60 days to confirm localized pitting extent.
2. Fabricate API 570 Class 1 replacement spool piece (ASTM A335 Grade P22) for installation during the intermediate October 2026 mini-shutdown.
3. Reduce operating velocity by 8% if downstream temperature exceeds 310°C pending replacement.`,
      timestamp: "18:31:05",
      chartData: {
        type: "corrosion_curve",
        title: "CML-HC-102-B Wall Thickness Degradation Curve vs MAWT Retirement Limit",
        description: "Historical UT readings with linear corrosion rate projection demonstrating MAWT breach by Q3 2027.",
        data: mockCorrosionDegradationCurve,
        unit: "mm",
        threshold: 2.50,
      },
      reasoningSteps: [
        "1. Qwen2.5-VL-7B: Processed corrosion_flange.png → localized pitting near weld HAZ, confidence 0.89.",
        "2. PaddleOCR 2.8 (CUDA): Extracted 18 thickness measurement rows from HC_102_B_UT_Inspection_Report.pdf.",
        "3. Router selected Qwen2.5-VL-7B (visual) + Qwen2.5-14B (structured reasoning) based on modality + risk.",
        "4. Retrieved MRPL Hydrocracker-SOPs p.14 (similarity 0.91) + API 570 §7.1.1 (similarity 0.94) from ChromaDB.",
        "5. Sandbox calculation: CR = (6.02 - 3.20) / 5.0 = 0.564 mm/yr · RL = (3.20 - 2.50) / 0.564 = 1.24 yrs.",
        "6. Self-RAG verification passed: calculation supported by retrieved evidence. Critical risk → HITL gate triggered.",
      ],
      requiresApproval: false,
      approvalStatus: "approved",
      approvalDetails: {
        approvedBy: "Admin",
        approvedAt: "2026-09-04 18:42:15 UTC",
        signatureHash: "8f72a45b91e32049d5c181774fa1b203c81665a31b40974ef6f5367809a7b931",
        operatorRole: "Lead Corrosion Specialist",
        comment: "Remaining life revised to 1.10 yrs per conservative PAUT estimate. Emergency ASTM A335 Grade P22 spool fabrication authorized for October 2026 shutdown.",
      },
      deliverable: {
        filename: "Inspection_Approval_Note_HC-102-B.docx",
        fileSize: 1845000,
        sha256: "8f72a45b91e32049d5c181774fa1b203c81665a31b40974ef6f5367809a7b931",
        generatedAt: "2026-09-04 18:42:15 UTC",
        downloadUrl: "#",
      },
    },
  ],
  traceSteps: defaultExecutionSteps.map((step) => ({
    ...step,
    status: "completed",
    durationMs:
      step.node === "ocr_extract" ? 850 :
      step.node === "rag_search" ? 420 :
      step.node === "recommend" ? 1200 :
      step.node === "human_checkpoint" ? 600 : 800,
    outputSummary:
      step.node === "ocr_extract" ? "Extracted 18 measurement rows + vision pitting flag (conf. 0.89)" :
      step.node === "rag_search" ? "Retrieved 3 SOP clauses (avg similarity 0.93)" :
      step.node === "recommend" ? "CR: 0.564 mm/yr · RL: 1.24 yrs · CRITICAL risk → HITL gate" :
      step.node === "human_checkpoint" ? "Approved by Lead Corrosion Specialist (PIN sealed)" :
      step.node === "generate_docx" ? "Inspection_Approval_Note_HC-102-B.docx · SHA-256 stamped" : undefined,
  })),
  deliverableUrl: "#",
  deliverableHash: "8f72a45b91e32049d5c181774fa1b203c81665a31b40974ef6f5367809a7b931",
  pinned: true,
};

const initialCodeVerifyTask: TaskItem = {
  id: "TASK-CV-02",
  title: "HC-102-B Corrosion Rate Script — Sandbox Verification",
  category: "CODE_VERIFY",
  status: "COMPLETED",
  createdAt: "2026-09-04 16:05:00",
  updatedAt: "2026-09-04 16:09:42",
  summary: "Qwen2.5-Coder-7B generated Python calc script. Executed in --network none Docker sandbox. Self-RAG verified stdout matches NDT audit values.",
  messages: [
    {
      id: "cv-msg-user-1",
      role: "user",
      content: "Write and verify a Python script to compute corrosion rate and remaining life from the CML measurement table for HC-102-B. Run it in a sandboxed environment and confirm the output matches the NDT inspection values.",
      timestamp: "16:05:08",
      attachments: [],
    },
    {
      id: "cv-msg-asst-1",
      role: "assistant",
      content: `### Code Verification Task — Corrosion Rate & Remaining Life Calculator
**Task Type:** Code Generation + Sandbox Execution
**Router Decision:** Qwen2.5-Coder-7B (coding-oriented) — distinct from NDT scenario models
**Sandbox:** Docker \`python:3.11-slim\` · \`--network none\` · \`--memory 256m\`
**Zero-Egress:** Enforced — container network disabled throughout execution

---

#### Generated Script — \`corrosion_rate_calc.py\`

\`\`\`python
"""
ABHEDYA AI — Sandbox Corrosion Rate & Remaining Life Calculator
Asset: MRPL HC Unit 3 · Report: NDT-2026-00481
Sandbox: --network none (zero egress enforced)
"""
import pandas as pd

CML_DATA = [
    {"cml": "CML-HC-102-B", "nominal_mm": 6.02, "measured_mm": 3.20,
     "mawt_mm": 2.50, "interval_yrs": 5.0},
    {"cml": "CML-HC-101B",  "nominal_mm": 16.0, "measured_mm": 11.4,
     "mawt_mm": 8.0,  "interval_yrs": 5.0},
    {"cml": "CML-HC-101A",  "nominal_mm": 14.2, "measured_mm": 10.8,
     "mawt_mm": 6.5,  "interval_yrs": 5.0},
    {"cml": "CML-HC-103C",  "nominal_mm": 12.7, "measured_mm": 8.1,
     "mawt_mm": 7.0,  "interval_yrs": 5.0},
]

df = pd.DataFrame(CML_DATA)
df["cr_mm_yr"] = (df["nominal_mm"] - df["measured_mm"]) / df["interval_yrs"]
df["rl_yrs"]  = (df["measured_mm"] - df["mawt_mm"]) / df["cr_mm_yr"]
df["status"]  = df["rl_yrs"].apply(
    lambda x: "CRITICAL" if x < 2.0 else ("WARNING" if x < 5.0 else "NORMAL")
)

print(df[["cml", "cr_mm_yr", "rl_yrs", "status"]].to_string(index=False))
\`\`\`

#### Sandbox stdout
\`\`\`
         cml  cr_mm_yr  rl_yrs    status
 CML-HC-102-B     0.564    1.24  CRITICAL
 CML-HC-101B      0.450    7.55   WARNING
 CML-HC-101A      0.280   15.36    NORMAL
 CML-HC-103C      0.580    1.91  CRITICAL
\`\`\`

#### Verification Result — PASSED ✓
Self-RAG cross-check: stdout values match SOP-grounded expected results within ±0.01 mm/yr tolerance.
**CML-HC-102-B confirmed: CR = 0.564 mm/yr · RL = 1.24 yrs — consistent with golden-path NDT audit.**`,
      timestamp: "16:07:55",
      reasoningSteps: [
        "1. Router: input=structured_table · task=code · GPU headroom=6.2GB → Qwen2.5-Coder-7B selected.",
        "2. Code generated: corrosion_rate_calc.py — 42 lines, zero external dependencies.",
        "3. Docker sandbox spawned: python:3.11-slim --network none --memory 256m.",
        "4. Container exited 0. Stdout captured. Network: BLOCKED throughout.",
        "5. Self-RAG verified: all 4 CML rows within ±0.01 mm/yr of SOP-grounded expected values.",
      ],
      requiresApproval: false,
      approvalStatus: "approved",
      approvalDetails: {
        approvedBy: "Admin",
        approvedAt: "2026-09-04 16:09:42 UTC",
        signatureHash: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        operatorRole: "Lead Corrosion Specialist",
        comment: "Script output verified. Values consistent with NDT audit. No deviations.",
      },
      deliverable: {
        filename: "HC102B_CodeVerification_Results.py.zip",
        fileSize: 12400,
        sha256: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        generatedAt: "2026-09-04 16:09:42 UTC",
        downloadUrl: "#",
      },
    },
  ],
  traceSteps: codeVerifyExecutionSteps.map((step) => ({
    ...step,
    status: "completed",
    durationMs:
      step.node === "rag_search" ? 480 :
      step.node === "code_generate" ? 920 :
      step.node === "sandbox_execute" ? 1380 :
      step.node === "sandbox_verify" ? 620 : 540,
    outputSummary:
      step.node === "rag_search" ? "CML table parsed — 4 data rows ready for code generation" :
      step.node === "code_generate" ? "corrosion_rate_calc.py generated — 42 lines, zero external deps" :
      step.node === "sandbox_execute" ? "Sandbox exit 0 · --network none · stdout captured" :
      step.node === "sandbox_verify" ? "Self-RAG PASSED — all 4 CML rows within ±0.01 mm/yr tolerance" :
      "HC102B_CodeVerification_Results.py.zip · SHA-256 stamped" ,
  })),
  deliverableUrl: "#",
  deliverableHash: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
  pinned: false,
};

const initialVibrationTask: TaskItem = {
  id: "TASK-VIB-03",
  title: "P-102B Crude Charge Pump FFT Vibration Analysis",
  category: "VIBRATION_FFT",
  status: "COMPLETED",
  createdAt: "2026-09-04 11:20:00",
  updatedAt: "2026-09-04 11:31:18",
  summary: "BPFO bearing defect at 148.5 Hz confirmed. Grease lubrication and seal check scheduled.",
  messages: [
    {
      id: "vib-msg-user-1",
      role: "user",
      content:
        "Evaluate pump P-102B FFT vibration spectrum for bearing wear, unbalance, and misalignment frequencies against ISO 10816 vibration severity limits.",
      timestamp: "11:20:08",
      attachments: [
        {
          id: "att-vib-1",
          name: "vibration_fft_sample.json",
          size: 480000,
          type: "application/json",
        },
      ],
    },
    {
      id: "vib-msg-asst-1",
      role: "assistant",
      content: `### FFT Vibration Spectral Analysis — Crude Charge Pump P-102B
**Equipment:** P-102B Crude Charge Pump (Centrifugal, 1750 RPM)
**Standard:** ISO 10816-3 Vibration Severity Band Classification
**Verification Level:** AI-assisted finding — engineer-reviewed recommendation (Qwen2.5-14B)

---

#### 1. Spectral Findings — Dominant Frequency Components

| Frequency (Hz) | Amplitude (mm/s) | ISO Limit | Classification | Fault Signature |
| :--- | :--- | :--- | :--- | :--- |
| **148.5 Hz** | **5.12 mm/s** | 2.8 mm/s | 🚨 **SEVERITY D** | **BPFO Bearing Outer Race Defect** |
| 59.6 Hz | 3.42 mm/s | 2.8 mm/s | ⚠️ SEVERITY C | 2X Misalignment Harmonic |
| 29.8 Hz | 4.85 mm/s | 2.8 mm/s | ⚠️ SEVERITY C | 1X Rotational Unbalance |

#### 2. Root Cause Assessment
* **148.5 Hz BPFO spike (5.12 mm/s)**: Ball Pass Frequency Outer race defect signature — bearing outer race fatigue consistent with 18–24 months of continuous service without regreasing. Amplitude exceeds ISO 10816 Severity D threshold (>4.5 mm/s).
* **29.8 Hz (1X)**: Rotational unbalance slightly above ISO Band C. Likely rotor fouling from crude residue accumulation.
* **59.6 Hz (2X)**: Misalignment harmonic — recommend shaft alignment check at next opportunity.

#### 3. Prescribed Maintenance Actions
1. **Immediate (within 7 days):** Apply 15g lithium-complex grease to DE/NDE bearing housings.
2. **Planned (within 30 days):** Perform full bearing inspection and replace if inner/outer race spalling confirmed via borescope.
3. **Next shutdown:** Shaft alignment check and rotor balance verification.`,
      timestamp: "11:22:45",
      chartData: {
        type: "vibration_fft",
        title: "P-102B Crude Charge Pump FFT Vibration Spectrum",
        description: "Spectral analysis highlighting BPFO outer race defect spike at 148.5 Hz (5.12 mm/s) — ISO 10816 Severity D.",
        data: mockPumpVibrationFFTSpectrum,
        threshold: 2.8,
      },
      reasoningSteps: [
        "1. Parsed vibration_fft_sample.json — 17 frequency-amplitude data points, 10–500 Hz range.",
        "2. Router: input=structured_json · task=signal_analysis → Qwen2.5-14B selected (no vision required).",
        "3. Retrieved ISO 10816-3 severity band thresholds from local vector DB (similarity 0.96).",
        "4. Identified 3 peaks exceeding 2.8 mm/s limit: 29.8 Hz (1X), 59.6 Hz (2X), 148.5 Hz (BPFO).",
        "5. BPFO = n_balls × (RPM/60) × (1 - ball_dia/pitch_dia × cos α) = 148.5 Hz — matches bearing catalog.",
        "6. Self-RAG check passed: fault signatures supported by ISO 10816 + bearing defect frequency library.",
      ],
      requiresApproval: false,
      approvalStatus: "approved",
      approvalDetails: {
        approvedBy: "Rajesh V. Nair",
        approvedAt: "2026-09-04 11:31:18 UTC",
        signatureHash: "d3b07384d113edec49eaa6238ad5ff00b14c330f8efc0f498c8f00fcba3f7a81",
        operatorRole: "Refinery Operations Chief",
        comment: "BPFO confirmed. Bearing replacement scheduled for next planned stoppage. Grease interval reduced to 90 days.",
      },
      deliverable: {
        filename: "P102B_Vibration_Analysis_Report.docx",
        fileSize: 924000,
        sha256: "d3b07384d113edec49eaa6238ad5ff00b14c330f8efc0f498c8f00fcba3f7a81",
        generatedAt: "2026-09-04 11:31:18 UTC",
        downloadUrl: "#",
      },
    },
  ],
  traceSteps: defaultExecutionSteps.map((s) => ({ ...s, status: "completed", durationMs: 600 })),
  pinned: false,
};

const initialOISDTask: TaskItem = {
  id: "TASK-OISD-04",
  title: "OISD-105 Confined Space Hot Work Permit Check",
  category: "OISD_PERMIT",
  status: "AWAITING_APPROVAL",
  createdAt: "2026-09-04 09:00:00",
  updatedAt: "2026-09-04 09:45:30",
  summary: "Gas detector calibration valid. Blind isolation verified. Awaiting Plant Safety Auditor sign-off.",
  messages: [
    {
      id: "oisd-msg-user-1",
      role: "user",
      content:
        "Verify the current hot work and confined space work permit for Unit 3 Shutdown Task ST-2026-0481 against OISD-STD-105 standard operating checklists for atmospheric testing, blind isolation, and fire watch compliance.",
      timestamp: "09:00:15",
      attachments: [
        {
          id: "att-oisd-1",
          name: "ST-2026-0481_Work_Permit.pdf",
          size: 1240000,
          type: "application/pdf",
        },
      ],
    },
    {
      id: "oisd-msg-asst-1",
      role: "assistant",
      content: `### OISD-STD-105 Work Permit Compliance Verification
**Permit ID:** ST-2026-0481 · **Unit:** Hydrocracker Unit 3 Shutdown
**Standard:** OISD-STD-105 — Work Permit System (Govt. of India, MoP&NG)
**Verification Level:** AI-assisted checklist review (Qwen2.5-14B) — requires authorized sign-off

---

#### 1. Checklist Verification Results

| Requirement | OISD-STD-105 Ref | Status | Finding |
| :--- | :--- | :--- | :--- |
| Atmospheric gas testing (LEL < 10%) | Clause 6.2.1 | ✅ PASS | LEL: 0% · O₂: 20.9% · H₂S: 0 ppm |
| Blind isolation of all process lines | Clause 6.3.2 | ✅ PASS | 14 blinds installed, slip-plate log verified |
| Fire watch stationed at entry point | Clause 6.4.1 | ✅ PASS | FW: Ramesh Kumar (ID: FW-0234) on duty |
| Gas detector calibration validity | Clause 6.2.3 | ✅ PASS | Calibrated 2026-09-01 (valid 90 days) |
| Rescue team standby confirmation | Clause 6.5.1 | ✅ PASS | Emergency Response Team ERT-B on standby |
| Permit issuer authorization level | Clause 5.1.2 | ⚠️ PENDING | Requires Plant Safety Auditor (Level 2) sign-off |
| Night work extension approval | Clause 7.3.1 | ⚠️ PENDING | Extension beyond 18:00 IST needs countersignature |

#### 2. Summary
* **6 of 7 checklist items PASS.** All physical safety measures (isolation, atmospheric testing, fire watch, rescue) are verified and documented.
* **2 items PENDING:** Permit requires Level 2 Plant Safety Auditor authorization before work may commence. Night extension countersignature also required if work extends past 18:00 IST.

#### 3. Recommended Action
Obtain authorized Level 2 sign-off from the Plant Safety Auditor. This AI review does not constitute permit authorization — human sign-off is mandatory per OISD-STD-105 Clause 5.1.2.`,
      timestamp: "09:12:33",
      reasoningSteps: [
        "1. PaddleOCR extracted permit form fields from ST-2026-0481_Work_Permit.pdf — 7 checklist sections.",
        "2. Retrieved OISD-STD-105 Clauses 5.1.2, 6.2.1, 6.3.2, 6.4.1, 6.5.1, 7.3.1 from local ChromaDB (avg similarity 0.92).",
        "3. Cross-checked each field against standard requirements — 5 PASS, 2 PENDING authorization.",
        "4. Policy rule: permit authorization requires human Level-2 sign-off — autonomous approval blocked.",
        "5. Self-RAG check passed: all findings grounded in retrieved OISD-105 clauses.",
      ],
      requiresApproval: true,
      approvalStatus: "pending",
    },
  ],
  traceSteps: defaultExecutionSteps.map((s, i) => ({
    ...s,
    status: i < 3 ? "completed" : i === 3 ? "waiting_approval" : "pending",
    durationMs: i < 3 ? 700 : undefined,
  })),
  pinned: false,
};

/* Task 7 — a second AWAITING_APPROVAL task so the sidebar always shows mixed statuses */
const initialPendingVibTask: TaskItem = {
  id: "TASK-VIB-05",
  title: "P-203A Reactor Feed Pump — ISO 10816 Severity D",
  category: "VIBRATION_FFT",
  status: "AWAITING_APPROVAL",
  createdAt: "2026-09-09 07:15:00",
  updatedAt: "2026-09-09 07:28:45",
  summary:
    "BPFI inner-race defect at 182.3 Hz confirmed (6.74 mm/s). Severity D breach — awaiting Refinery Operations Chief sign-off before shutdown recommendation is released.",
  messages: [
    {
      id: "vib2-msg-user-1",
      role: "user",
      content:
        "Analyse P-203A reactor feed pump vibration data for bearing defects and unbalance. Flag any ISO 10816-3 Severity D breaches and recommend immediate action.",
      timestamp: "07:15:22",
      attachments: [
        { id: "att-vib2-1", name: "P203A_vibration_log_2026-09-09.json", size: 392000, type: "application/json" },
      ],
    },
    {
      id: "vib2-msg-asst-1",
      role: "assistant",
      content: `### FFT Vibration Spectral Analysis — Reactor Feed Pump P-203A
**Equipment:** P-203A Reactor Feed Pump (Centrifugal, 2950 RPM)
**Standard:** ISO 10816-3 Vibration Severity Band Classification
**Verification Level:** AI-assisted finding — engineer-reviewed recommendation (Qwen2.5-14B)

---

#### 1. Spectral Findings

| Frequency (Hz) | Amplitude (mm/s) | ISO Limit | Classification | Fault Signature |
| :--- | :--- | :--- | :--- | :--- |
| **182.3 Hz** | **6.74 mm/s** | 2.8 mm/s | 🚨 **SEVERITY D** | **BPFI Inner Race Defect** |
| 98.3 Hz | 4.12 mm/s | 2.8 mm/s | ⚠️ SEVERITY C | 2X Misalignment Harmonic |
| 49.2 Hz | 3.58 mm/s | 2.8 mm/s | ⚠️ SEVERITY C | 1X Rotational Unbalance |

#### 2. Prescribed Corrective Action (Awaiting Sign-off)
1. **Immediate (within 24 h):** Reduce pump load to 70% pending bearing replacement.
2. **Planned (within 7 days):** Full bearing inspection and replacement — inner race fatigue confirmed.
3. **Next shutdown:** Rotor rebalance and shaft alignment verification.`,
      timestamp: "07:18:10",
      reasoningSteps: [
        "1. Parsed P203A_vibration_log_2026-09-09.json — 19 frequency-amplitude data points.",
        "2. Router: input=structured_json · task=signal_analysis → Qwen2.5-14B selected.",
        "3. Retrieved ISO 10816-3 severity bands from local vector DB (similarity 0.96).",
        "4. BPFI = n_balls × (RPM/60) × (1 + ball_dia/pitch_dia × cos α) = 182.3 Hz — inner race defect.",
        "5. Amplitude 6.74 mm/s breaches Severity D threshold (>4.5 mm/s) — HITL gate triggered.",
        "6. Self-RAG check passed: fault signatures grounded in ISO 10816 + bearing defect library.",
      ],
      requiresApproval: true,
      approvalStatus: "pending",
    },
  ],
  traceSteps: defaultExecutionSteps.map((s, i) => ({
    ...s,
    status: i < 3 ? ("completed" as const) : i === 3 ? ("waiting_approval" as const) : ("pending" as const),
    durationMs: i < 3 ? 680 : undefined,
    outputSummary:
      i === 0 ? "19 FFT data points parsed · BPFI inner race defect identified" :
      i === 1 ? "ISO 10816-3 severity bands retrieved (similarity 0.96)" :
      i === 2 ? "BPFI 182.3 Hz · 6.74 mm/s · Severity D → HITL gate triggered" : undefined,
  })),
  pinned: false,
};

const initialDocs: KnowledgeDocument[] = [
  {
    id: "doc-1",
    name: "OISD-STD-105_Work_Permit_System.pdf",
    category: "OISD_STANDARD",
    tags: ["OISD-105", "Safety", "Hot-Work", "Confined-Space"],
    fileSize: 3450000,
    uploadedAt: "2026-08-15",
    sha256: "4a2b9183ca109280d463b207567ae2c0245a498b53291244569e5d4810283ca2",
    vectorChunksCount: 142,
    status: "indexed",
    similarityScore: 0.94,
  },
  {
    id: "doc-2",
    name: "API_570_Piping_Inspection_Code_5th_Ed.pdf",
    category: "API_STANDARD",
    tags: ["API-570", "Piping", "MAWT", "Corrosion-Rate"],
    fileSize: 8900000,
    uploadedAt: "2026-08-20",
    sha256: "6c72199b0485603e839e55b689ef2e3d36b85d388656cb45c0883cf3a1e967a5",
    vectorChunksCount: 480,
    status: "indexed",
    similarityScore: 0.96,
  },
  {
    id: "doc-3",
    name: "MRPL_Hydrocracker_Unit3_Operating_Manual.pdf",
    category: "SOP",
    tags: ["Hydrocracker-SOPs", "Reactor-Overhead", "Metallurgy"],
    fileSize: 12400000,
    uploadedAt: "2026-08-28",
    sha256: "d3b07384d113edec49eaa6238ad5ff00b14c330f8efc0f498c8f00fcba3f7a81",
    vectorChunksCount: 612,
    status: "indexed",
    similarityScore: 0.91,
  },
];

const initialSockets: SocketConnection[] = [
  {
    id: "sock-1",
    protocol: "TCP",
    localAddress: "127.0.0.1",
    localPort: 8000,
    remoteAddress: "127.0.0.1",
    remotePort: 54321,
    state: "ESTABLISHED",
    processName: "fastapi-sovereign-agent",
    pid: 14208,
    isExternal: false,
    isBlocked: false,
  },
  {
    id: "sock-2",
    protocol: "TCP",
    localAddress: "127.0.0.1",
    localPort: 6333,
    remoteAddress: "0.0.0.0",
    remotePort: 0,
    state: "LISTEN",
    processName: "qdrant-embedded-vector",
    pid: 14210,
    isExternal: false,
    isBlocked: false,
  },
  {
    id: "sock-3",
    protocol: "TCP",
    localAddress: "127.0.0.1",
    localPort: 11434,
    remoteAddress: "0.0.0.0",
    remotePort: 0,
    state: "LISTEN",
    processName: "ollama-qwen2.5-14b-cuda",
    pid: 14215,
    isExternal: false,
    isBlocked: false,
  },
  {
    id: "sock-4",
    protocol: "TCP",
    localAddress: "0.0.0.0",
    localPort: 443,
    remoteAddress: "142.250.190.46",
    remotePort: 443,
    state: "BLOCKED",
    processName: "blocked_telemetry_probe",
    pid: 9999,
    isExternal: true,
    isBlocked: true,
  },
];

export const useTaskStore = create<TaskState>((set, get) => ({
  // Navigation
  activeView: "tasks",
  setActiveView: (view) => set({ activeView: view }),
  isSidebarOpen: true,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  isContextPanelOpen: true,
  setContextPanelOpen: (open) => set({ isContextPanelOpen: open }),
  toggleContextPanel: () => set((state) => ({ isContextPanelOpen: !state.isContextPanelOpen })),
  activeContextTab: "timeline",
  setActiveContextTab: (tab) => set({ activeContextTab: tab }),

  // Operator
  operatorName: "Admin",
  operatorRole: "Lead Corrosion Specialist",
  setOperatorRole: (role) => set({ operatorRole: role }),

  // Model Settings
  modelConfig: {
    temperature: 0.0,
    topP: 0.9,
    contextWindowBudget: 32768,
    maxTokens: 4096,
    systemPrompt:
      "You are ABHEDYA AI, a confidential sovereign industrial AI agent deployed inside the Mangalore Refinery and Petrochemicals Limited (MRPL) air-gapped enclave. Strictly enforce OISD-105, ISO 27001, and API 570 standards. Never emit external network calls. Always yield to Human-in-the-Loop gates on safety critical maintenance actions.",
    selectedModel: "Qwen 2.5 14B Industrial (CUDA Q4_K_M)",
    secondaryModel: "DeepSeek R1 14B Distill",
    isArenaMode: false,
  },
  setModelConfig: (config) =>
    set((state) => ({ modelConfig: { ...state.modelConfig, ...config } })),
  isModelModalOpen: false,
  setModelModalOpen: (open) => set({ isModelModalOpen: open }),

  // Configured Models
  configuredModels: [
    {
      id: "model-1",
      name: "Qwen 2.5 14B Industrial",
      endpoint: "http://localhost:11434/v1",
      provider: "Ollama (Local)",
    },
    {
      id: "model-2",
      name: "DeepSeek R1 14B Distill",
      endpoint: "http://localhost:11434/v1",
      provider: "Ollama (Local)",
    },
    {
      id: "model-3",
      name: "Llama 3.3 70B Industrial",
      endpoint: "http://gpu-cluster:8000/v1",
      provider: "VLLM (Multi-GPU)",
    },
  ],
  addConfiguredModel: (model) =>
    set((state) => ({
      configuredModels: [
        ...state.configuredModels,
        { ...model, id: `model-${Date.now()}` },
      ],
    })),
  removeConfiguredModel: (id) =>
    set((state) => ({
      configuredModels: state.configuredModels.filter((m) => m.id !== id),
    })),

  // Tasks & History
  tasks: [initialNewTask, initialTask, initialCodeVerifyTask, initialVibrationTask, initialOISDTask, initialPendingVibTask],
  activeTaskId: "TASK-NEW-01",
  setActiveTaskId: (id) => {
    const state = get();
    if (state.activeTaskId === id) return;

    // Save previous active task state
    const updatedTasks = state.tasks.map((t) => {
      if (t.id === state.activeTaskId) {
        return {
          ...t,
          messages: state.messages,
          traceSteps: state.activeTraceSteps,
        };
      }
      return t;
    });

    const target = updatedTasks.find((t) => t.id === id);
    if (target) {
      set({
        tasks: updatedTasks,
        activeTaskId: id,
        messages: target.messages || [],
        activeTraceSteps: target.traceSteps || defaultExecutionSteps,
        isExecuting: false,
        currentRunningNode: null,
        isApprovalModalOpen: false,
        activeApprovalData: null,
        activeView: "tasks",
      });
    } else {
      set({
        tasks: updatedTasks,
        activeTaskId: null,
        messages: [],
        activeTraceSteps: defaultExecutionSteps,
        isExecuting: false,
        currentRunningNode: null,
        isApprovalModalOpen: false,
        activeApprovalData: null,
        activeView: "tasks",
      });
    }
  },

  createNewTask: () => {
    const state = get();

    // If current active task is already an empty draft, just ensure we're viewing tasks
    const current = state.tasks.find((t) => t.id === state.activeTaskId);
    if (current && current.status === "DRAFT" && current.messages.length === 0 && state.messages.length === 0) {
      set({ activeView: "tasks" });
      return;
    }

    // Preserve previous active task
    const updatedTasks = state.tasks.map((t) => {
      if (t.id === state.activeTaskId) {
        return {
          ...t,
          messages: state.messages,
          traceSteps: state.activeTraceSteps,
        };
      }
      return t;
    });

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    const fullDate = `${dateStr} ${timeStr}:00 UTC`;
    const newId = `TASK-${Date.now().toString().slice(-6)}`;

    const newTask: TaskItem = {
      id: newId,
      title: "New Chat",
      category: "CUSTOM",
      status: "DRAFT",
      createdAt: fullDate,
      updatedAt: fullDate,
      summary: "Fresh sovereign inspection session.",
      messages: [],
      traceSteps: defaultExecutionSteps.map((s) => ({
        ...s,
        status: "pending",
        logs: [],
      })),
      pinned: false,
    };

    set({
      tasks: [newTask, ...updatedTasks],
      activeTaskId: newId,
      messages: [],
      activeTraceSteps: newTask.traceSteps,
      isExecuting: false,
      currentRunningNode: null,
      isApprovalModalOpen: false,
      activeApprovalData: null,
      activeView: "tasks",
    });
  },

  deleteTask: (id) => {
    const state = get();
    const remainingTasks = state.tasks.filter((t) => t.id !== id);
    if (state.activeTaskId === id) {
      const nextTask = remainingTasks[0] || null;
      set({
        tasks: remainingTasks,
        activeTaskId: nextTask ? nextTask.id : null,
        messages: nextTask ? nextTask.messages : [],
        activeTraceSteps: nextTask ? nextTask.traceSteps : defaultExecutionSteps,
        isExecuting: false,
        currentRunningNode: null,
      });
    } else {
      set({ tasks: remainingTasks });
    }
  },

  pinTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, pinned: !t.pinned } : t
      ),
    })),

  // Messages & Agent Steps
  messages: [],
  activeTraceSteps: initialNewTask.traceSteps,
  isExecuting: false,
  currentRunningNode: null,

  // Approval Gate
  isApprovalModalOpen: false,
  setApprovalModalOpen: (open) => set({ isApprovalModalOpen: open }),
  activeApprovalData: null,

  approveStep: async (pin, customComment) => {
    const state = get();
    const hash = await generateSHA256(
      `${state.operatorName}:${state.operatorRole}:${Date.now()}:${pin}`
    );

    const updatedSteps = state.activeTraceSteps.map((step) =>
      step.node === "human_checkpoint"
        ? {
            ...step,
            status: "completed" as AgentNodeStatus,
            logs: [
              ...step.logs,
              `Verification PIN signed by ${state.operatorName} (${state.operatorRole}).`,
              `Cryptographic SHA-256 seal: ${hash}`,
            ],
          }
        : step.node === "generate_docx"
        ? {
            ...step,
            status: "completed" as AgentNodeStatus,
            durationMs: 600,
            logs: [
              "Synthesized executive .docx inspection report with embedded signature blocks.",
              `Stamping digital hash ${hash} into immutable audit ledger.`,
            ],
          }
        : step
    );

    // Update last assistant message
    const updatedMessages = [...state.messages];
    const lastMsgIndex = updatedMessages.findLastIndex((m) => m.role === "assistant");
    if (lastMsgIndex !== -1) {
      updatedMessages[lastMsgIndex] = {
        ...updatedMessages[lastMsgIndex],
        requiresApproval: false,
        approvalStatus: "approved",
        approvalDetails: {
          approvedBy: state.operatorName,
          approvedAt: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
          signatureHash: hash,
          operatorRole: state.operatorRole,
          comment: customComment || "Emergency ASTM A335 Grade P22 spool piece fabrication authorized.",
        },
        deliverable: {
          filename: "Inspection_Approval_Note_HC-102-B.docx",
          fileSize: 1845000,
          sha256: hash,
          generatedAt: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
          downloadUrl: "#",
        },
      };
    }

    const updatedTasks = state.tasks.map((t) => {
      if (t.id === state.activeTaskId) {
        return {
          ...t,
          status: "COMPLETED" as TaskStatus,
          messages: updatedMessages,
          traceSteps: updatedSteps,
          deliverableUrl: "#",
          deliverableHash: hash,
        };
      }
      return t;
    });

    set({
      tasks: updatedTasks,
      activeTraceSteps: updatedSteps,
      messages: updatedMessages,
      isExecuting: false,
      currentRunningNode: null,
      isApprovalModalOpen: false,
      activeApprovalData: null,
      activeContextTab: "deliverable",
    });

    await state.addAuditLog({
      taskId: state.activeTaskId || "TASK-NEW-01",
      taskTitle: "HC-102-B Hydrocracker Unit 3 UT Corrosion Audit",
      action: "DELIVERABLE_SIGNED",
      operator: state.operatorName,
      operatorRole: state.operatorRole,
      details: customComment || "Safety Critical sign-off approved with SHA-256 digital stamp.",
    });
  },

  rejectStep: (reason) => {
    const state = get();
    const updatedSteps = state.activeTraceSteps.map((step) =>
      step.node === "human_checkpoint"
        ? {
            ...step,
            status: "failed" as AgentNodeStatus,
            logs: [...step.logs, `Recommendation rejected by operator: ${reason}`],
          }
        : step
    );

    const updatedTasks = state.tasks.map((t) => {
      if (t.id === state.activeTaskId) {
        return {
          ...t,
          status: "REJECTED" as TaskStatus,
          traceSteps: updatedSteps,
        };
      }
      return t;
    });

    set({
      tasks: updatedTasks,
      activeTraceSteps: updatedSteps,
      isExecuting: false,
      currentRunningNode: null,
      isApprovalModalOpen: false,
      activeApprovalData: null,
    });
  },

  editRecommendation: (newRecommendation) => {
    set((state) => ({
      activeApprovalData: {
        ...state.activeApprovalData,
        recommendedAction: newRecommendation,
      },
    }));
  },

  // Knowledge Base
  knowledgeDocs: initialDocs,
  addKnowledgeDoc: (doc) =>
    set((state) => ({ knowledgeDocs: [doc, ...state.knowledgeDocs] })),

  // Audit Ledger
  auditLogs: initialMockAuditLogs,
  addAuditLog: async (entry) => {
    const hash = await generateSHA256(
      `${entry.taskId}:${entry.action}:${entry.operator}:${Date.now()}`
    );
    const newEntry: AuditLogEntry = {
      id: `AUD-2026-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
      sha256Hash: hash,
      verified: true,
      ...entry,
    };
    set((state) => ({ auditLogs: [newEntry, ...state.auditLogs] }));
  },

  // Network Sentinel
  networkStats: {
    airGapStatus: "VERIFIED_AIRGAP",
    totalSockets: 4,
    externalSockets: 0,
    blockedOutboundAttempts: 148,
    outboundBytesTotal: 0,
    inboundBytesTotal: 0,
    lastChecked: "Just now (Kernel Watcher Active)",
    hardwareInterface: "enp3s0 (Air-Gapped Loopback Only)",
  },
  activeSockets: initialSockets,
  refreshNetworkTelemetry: () => {
    set((state) => ({
      networkStats: {
        ...state.networkStats,
        blockedOutboundAttempts: state.networkStats.blockedOutboundAttempts + 1,
        lastChecked: "Just now",
      },
    }));
  },

  // Actions
  addMessage: (message) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const newMsg: Message = { id, timestamp, ...message };

    set((state) => {
      const newMessages = [...state.messages, newMsg];
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
      const updatedAt = `${dateStr} ${timeStr}:00 UTC`;

      let activeId = state.activeTaskId;
      let currentTasks = [...state.tasks];

      if (!activeId || !currentTasks.some((t) => t.id === activeId)) {
        activeId = `TASK-${Date.now().toString().slice(-6)}`;
        const newTask: TaskItem = {
          id: activeId,
          title:
            message.role === "user" && message.content.trim()
              ? message.content.trim().slice(0, 36) + (message.content.trim().length > 36 ? "..." : "")
              : "New Chat",
          category: "CUSTOM",
          status: "RUNNING",
          createdAt: updatedAt,
          updatedAt,
          summary: message.content.slice(0, 80),
          messages: newMessages,
          traceSteps: state.activeTraceSteps,
          pinned: false,
        };
        currentTasks = [newTask, ...currentTasks];
      } else {
        currentTasks = currentTasks.map((t) => {
          if (t.id === activeId) {
            const isInitialTitle = !t.title || t.title === "New Chat" || t.title === "New Inspection Chat";
            const newTitle =
              message.role === "user" && isInitialTitle && message.content.trim()
                ? message.content.trim().slice(0, 36) + (message.content.trim().length > 36 ? "..." : "")
                : t.title;

            return {
              ...t,
              title: newTitle,
              updatedAt,
              status: (t.status === "DRAFT" ? "RUNNING" : t.status) as TaskStatus,
              messages: newMessages,
            };
          }
          return t;
        });
      }

      return {
        activeTaskId: activeId,
        messages: newMessages,
        tasks: currentTasks,
      };
    });
    return id;
  },

  updateMessage: (id, updates) => {
    set((state) => {
      const updatedMessages = state.messages.map((m) => (m.id === id ? { ...m, ...updates } : m));
      const updatedTasks = state.tasks.map((t) => {
        if (t.id === state.activeTaskId) {
          return {
            ...t,
            messages: updatedMessages,
            ...(updates.requiresApproval ? { status: "AWAITING_APPROVAL" as TaskStatus } : {}),
          };
        }
        return t;
      });

      return {
        messages: updatedMessages,
        tasks: updatedTasks,
      };
    });
  },

  setTraceStepStatus: (stepId, status, summary, durationMs) => {
    set((state) => {
      const updatedSteps = state.activeTraceSteps.map((s) =>
        s.id === stepId
          ? {
              ...s,
              status,
              ...(summary ? { outputSummary: summary } : {}),
              ...(durationMs ? { durationMs } : {}),
            }
          : s
      );

      const updatedTasks = state.tasks.map((t) => {
        if (t.id === state.activeTaskId) {
          return {
            ...t,
            traceSteps: updatedSteps,
          };
        }
        return t;
      });

      return {
        activeTraceSteps: updatedSteps,
        tasks: updatedTasks,
      };
    });
  },

  addTraceStepLog: (stepId, log) => {
    set((state) => {
      const updatedSteps = state.activeTraceSteps.map((s) =>
        s.id === stepId ? { ...s, logs: [...s.logs, log] } : s
      );

      const updatedTasks = state.tasks.map((t) => {
        if (t.id === state.activeTaskId) {
          return {
            ...t,
            traceSteps: updatedSteps,
          };
        }
        return t;
      });

      return {
        activeTraceSteps: updatedSteps,
        tasks: updatedTasks,
      };
    });
  },

  resetTraceSteps: () => {
    const freshSteps = defaultExecutionSteps.map((s) => ({
      ...s,
      status: "pending" as AgentNodeStatus,
      logs: [],
    }));

    set((state) => {
      const updatedTasks = state.tasks.map((t) => {
        if (t.id === state.activeTaskId) {
          return {
            ...t,
            traceSteps: freshSteps,
          };
        }
        return t;
      });

      return {
        activeTraceSteps: freshSteps,
        tasks: updatedTasks,
      };
    });
  },

  setExecuting: (executing) => {
    set((state) => {
      let updatedTasks = state.tasks;
      if (!executing && state.activeTaskId) {
        updatedTasks = state.tasks.map((t) => {
          if (t.id === state.activeTaskId && t.status !== "AWAITING_APPROVAL" && t.status !== "REJECTED") {
            return {
              ...t,
              status: "COMPLETED" as TaskStatus,
              messages: state.messages,
              traceSteps: state.activeTraceSteps,
            };
          }
          return t;
        });
      }
      return {
        isExecuting: executing,
        tasks: updatedTasks,
      };
    });
  },
}));
