import { AuditLogEntry } from "@/types/task";

export const initialMockAuditLogs: AuditLogEntry[] = [
  {
    id: "AUD-2026-0901",
    taskId: "TASK-DEMO-01",
    taskTitle: "HC-102-B Hydrocracker Unit 3 UT Corrosion Audit",
    action: "DELIVERABLE_SIGNED",
    operator: "Admin",
    operatorRole: "Lead Corrosion Specialist",
    timestamp: "2026-09-04 18:42:15 UTC",
    sha256Hash: "8f72a45b91e32049d5c181774fa1b203c81665a31b40974ef6f5367809a7b931",
    details:
      "Remaining life revised to 1.10 yrs per conservative PAUT estimate. Emergency ASTM A335 Grade P22 spool fabrication authorized for October 2026 shutdown. Report: NDT-2026-00481.",
    verified: true,
  },
  {
    id: "AUD-2026-0900",
    taskId: "TASK-CV-02",
    taskTitle: "HC-102-B Corrosion Rate Script — Sandbox Verification",
    action: "DELIVERABLE_SIGNED",
    operator: "Admin",
    operatorRole: "Lead Corrosion Specialist",
    timestamp: "2026-09-04 16:09:42 UTC",
    sha256Hash: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    details:
      "Qwen2.5-Coder-7B script executed in Docker --network none sandbox. Self-RAG verified: CR=0.564 mm/yr, RL=1.24 yrs consistent with NDT audit. HC102B_CodeVerification_Results.py.zip sealed.",
    verified: true,
  },
  {
    id: "AUD-2026-0899",
    taskId: "TASK-VIB-03",
    taskTitle: "P-102B Crude Charge Pump FFT Vibration Analysis",
    action: "APPROVAL_GRANTED",
    operator: "Rajesh V. Nair",
    operatorRole: "Refinery Operations Chief",
    timestamp: "2026-09-04 11:31:18 UTC",
    sha256Hash: "d3b07384d113edec49eaa6238ad5ff00b14c330f8efc0f498c8f00fcba3f7a81",
    details:
      "BPFO bearing outer race defect confirmed at 148.5 Hz (5.12 mm/s). ISO 10816 severity band D. Grease lubrication and seal check scheduled within 30 days.",
    verified: true,
  },
  {
    id: "AUD-2026-0898",
    taskId: "TASK-OISD-04",
    taskTitle: "OISD-105 Confined Space Hot Work Permit Check",
    action: "TASK_INITIATED",
    operator: "Amit K. Verma",
    operatorRole: "Plant Safety Auditor",
    timestamp: "2026-09-04 09:00:00 UTC",
    sha256Hash: "4a2b9183ca109280d463b207567ae2c0245a498b53291244569e5d4810283ca2",
    details:
      "Gas detector calibration valid. Zero LEL hydrocarbon threshold satisfied. Blind isolation verified per OISD-105 §4.2.1. Awaiting Lead Safety Officer sign-off.",
    verified: true,
  },
];
