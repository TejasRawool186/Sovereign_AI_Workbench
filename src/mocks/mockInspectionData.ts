export interface InspectionReading {
  cmlPoint: string;
  locationDescription: string;
  nominalThicknessMm: number;
  measuredThicknessMm: number;
  mawtMm: number; // Minimum Allowable Wall Thickness (API 570)
  corrosionRateMmYear: number;
  remainingLifeYears: number;
  status: "CRITICAL" | "WARNING" | "NORMAL";
}

// Canonical scenario — Plant: MRPL Hydrocracker Unit 3 · Asset: HC-102-B
// Report ID: NDT-2026-00481 · Inspector: INS-017 · Approval: APR-2026-00073
// Use THESE exact numbers in deck, doc, live demo, and video (§7 of SIH plan)
export const mockHydrocrackerInspectionReadings: InspectionReading[] = [
  {
    cmlPoint: "CML-HC-102-B",
    locationDescription: "Hydrocracker Unit 3 — High-Pressure Recycle Flange",
    nominalThicknessMm: 6.02,
    measuredThicknessMm: 3.20,
    mawtMm: 2.50,
    corrosionRateMmYear: 0.564,
    remainingLifeYears: 1.24,
    status: "CRITICAL",
  },
  {
    cmlPoint: "CML-HC-101B",
    locationDescription: "Reactor Effluent Separator Inlet Nozzle",
    nominalThicknessMm: 16.0,
    measuredThicknessMm: 11.4,
    mawtMm: 8.0,
    corrosionRateMmYear: 0.45,
    remainingLifeYears: 7.55,
    status: "WARNING",
  },
  {
    cmlPoint: "CML-HC-101A",
    locationDescription: "Reactor Overhead Vapor Line (90° Elbow)",
    nominalThicknessMm: 14.2,
    measuredThicknessMm: 10.8,
    mawtMm: 6.5,
    corrosionRateMmYear: 0.29,
    remainingLifeYears: 14.8,
    status: "NORMAL",
  },
  {
    cmlPoint: "CML-HC-103C",
    locationDescription: "Sour Gas Depropanizer Reboiler Bottoms",
    nominalThicknessMm: 12.7,
    measuredThicknessMm: 8.1,
    mawtMm: 7.0,
    corrosionRateMmYear: 0.58,
    remainingLifeYears: 1.89,
    status: "CRITICAL",
  },
];

// Canonical degradation curve for HC-102-B (5-year inspection interval, nominal 6.02mm → min 2.50mm)
export const mockCorrosionDegradationCurve = [
  { year: "2021 (Baseline)", thickness: 6.02, mawt: 2.50 },
  { year: "2022 (Routine UT)", thickness: 5.45, mawt: 2.50 },
  { year: "2023 (Intermediate)", thickness: 4.88, mawt: 2.50 },
  { year: "2024 (Turnaround)", thickness: 4.31, mawt: 2.50 },
  { year: "2025 (Routine UT)", thickness: 3.75, mawt: 2.50 },
  { year: "2026 (Current)", thickness: 3.20, mawt: 2.50 },
  { year: "2027 (Projected)", thickness: 2.636, mawt: 2.50 },
  { year: "2027 Q3 (Breach)", thickness: 2.50, mawt: 2.50 },
];
