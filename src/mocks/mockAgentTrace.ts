import { AgentTraceStep } from "@/types/agent";

export const defaultExecutionSteps: AgentTraceStep[] = [
  {
    id: "step-1",
    node: "ocr_extract",
    label: "Multimodal Table & NDT OCR",
    description: "Extracting tabular wall thickness data and CML tags via local PaddleOCR / PyMuPDF",
    status: "pending",
    logs: [],
  },
  {
    id: "step-2",
    node: "rag_search",
    label: "Confidential SOP Vector Search",
    description: "Querying local ChromaDB/Qdrant vector store for API 570, OISD-105 & MRPL standards",
    status: "pending",
    logs: [],
  },
  {
    id: "step-3",
    node: "recommend",
    label: "Industrial Reasoning & Risk Scoring",
    description: "Computing corrosion rates, remaining life estimation & OISD compliance validation",
    status: "pending",
    logs: [],
  },
  {
    id: "step-4",
    node: "human_checkpoint",
    label: "Human-in-the-Loop Verification Gate",
    description: "Mandatory engineer sign-off required for safety critical equipment intervention",
    status: "pending",
    logs: [],
  },
  {
    id: "step-5",
    node: "generate_docx",
    label: "Cryptographic Deliverable Release",
    description: "Compiling executive inspection report with SHA-256 digital signature stamp",
    status: "pending",
    logs: [],
  },
];

// Distinct step sequence for Code Verification scenario (§9 of SIH plan)
// Deliberately different models + flow to prove ≥2 task types to judges
export const codeVerifyExecutionSteps: AgentTraceStep[] = [
  {
    id: "cv-step-1",
    node: "rag_search",
    label: "CML Table Extraction",
    description: "Parsing CML measurement table from structured input for code generation context",
    status: "pending",
    logs: [],
  },
  {
    id: "cv-step-2",
    node: "code_generate",
    label: "Script Generation — Qwen2.5-Coder-7B",
    description: "Generating Python corrosion rate + remaining life calculation script from CML data",
    status: "pending",
    logs: [],
  },
  {
    id: "cv-step-3",
    node: "sandbox_execute",
    label: "Sandbox Execution (--network none)",
    description: "Running generated script in isolated Docker container with network disabled",
    status: "pending",
    logs: [],
  },
  {
    id: "cv-step-4",
    node: "sandbox_verify",
    label: "Output Verification — Self-RAG",
    description: "Comparing sandbox stdout against SOP-grounded expected values. Flagging deviations.",
    status: "pending",
    logs: [],
  },
  {
    id: "cv-step-5",
    node: "generate_docx",
    label: "Verified Script & Results Release",
    description: "Packaging verified script + stdout results with SHA-256 stamp into audit record",
    status: "pending",
    logs: [],
  },
];
