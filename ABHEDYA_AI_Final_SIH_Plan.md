# ABHEDYA AI — Final SIH26117 Plan (Merged)
**Team Quantum Compilers · Team ID 121752 · PS 26117 (MRPL, Smart Automation)**
This supersedes the earlier draft plan. It merges both analyses into one build order — cut down, deduplicated, and biased toward "clean and demonstrable" over "feature-complete."

---

## 1. Positioning — locked, don't revisit

**Name: ABHEDYA AI.** Both analyses converge here and your own latest spec already made the call — stop relitigating it. Update the live site, GitHub repo, and deck title slide in one pass so all four assets match.

**One-liner:**
> ABHEDYA AI is an air-gapped industrial AI workbench that turns scanned inspection records into evidence-backed, human-approved engineering deliverables — without data leaving the organization.

**Mental model to repeat everywhere (deck, video, judge Q&A):**
```
Confidential Input → Local AI Processing → Evidence Retrieval → Calculation →
Verification → Human Approval → Official Deliverable → Tamper-Evident Audit
```
Lead with this chain, not with "we use LangGraph / RAG / OCR." Judges score the outcome; implementation details come up only if asked.

---

## 2. Fix these four claims before anyone reads your copy again

Overclaiming is the fastest way to lose credibility with technical judges. Tone all four down:

| Drop this | Say this instead |
|---|---|
| "Mathematically guaranteeing 0 outbound bytes" | "Enforced and continuously verified zero-egress execution using network-denied containers, host firewall policy, and socket telemetry" |
| "Fully compliant with OISD/ISO/API standards" | "Designed to support evidence-backed workflows aligned with OISD, API, and organizational SOP requirements" |
| "Self-RAG prevents hallucinations" | "Self-RAG flags unsupported claims and routes them for revision or human review" |
| "Critical AI decision" | "AI-assisted finding — engineer-reviewed recommendation" (never implies autonomous authorization) |

This isn't just wording hygiene — it's also your best defense if a judge tries to poke a hole in the sovereignty claim.

---

## 3. What you're actually being scored against

Read the PS "Expected Solution" text as a literal checklist:

| PS requirement | Status | Action |
|---|---|---|
| Model auto-selection across **≥2 task types** | Weak — only the inspection flow is visible | Add the coding scenario below; it fixes this too |
| Agentic task end-to-end → Word file | ✅ Have it | Keep as the flagship |
| **A coding task run and verified in a sandbox** | Ambiguous — your corrosion calc *is* sandboxed code, but it reads as "one internal tool call," not a demonstrated coding capability | Add one short, distinct scenario: prompt → generated script → runs in `--network none` container → verified output. Doing this also satisfies the "≥2 task types" line with zero ambiguity. |
| Multimodal / scanned-document task | ✅ Have it | Keep |
| Visible proof of zero external calls | Nav item exists, depth unclear | Make it real — see §6 |

Two additions (a coding scenario + a genuinely working network monitor) close every open gap. Everything else in this document is about making what you already have look and feel legitimate.

---

## 4. Product structure

Two surfaces, each with one job:

- **Landing page** — explains the problem and trust model in under 60 seconds, ends in "Run the demo."
- **Workbench** — proves it. Task-oriented console, not a chat clone.

Keep the landing page secondary. A judge who never leaves the workbench should still be fully convinced.

---

## 5. Design system — clean, not cluttered

Your instinct (black + safety orange, sharp corners, industrial) is right. The risk in a fully-loaded industrial dashboard is turning every panel into a wall of telemetry. Apply one rule everywhere: **one glanceable state, details on demand.**

```css
--enclave-black: #0B0D0F;   --panel-black: #121619;
--safety-orange: #FF6A00;   --signal-green: #35C46A;
--warning-amber: #E8A317;   --critical-red: #E05252;
--steel: #A8B0B8;           --paper: #E9E5DA;
```

- Rectangular geometry, 0–2px radii. No glassmorphism, no gradients, no decorative AI-bot art in the workbench.
- Orange = active work in progress. Green = verified. Amber = needs attention. Red = blocked/risk. Never use these colors decoratively.
- Monospace for IDs, hashes, timestamps, logs. A clean grotesk for headings and prose. This split alone reads as "engineered system," not "template."
- **Every panel gets one headline value, not a list of eight.** e.g. the security state is a single chip (`ENCLAVE VERIFIED`) that expands into detail on click — not eight stat rows sitting on screen at all times. This is what keeps "operational depth" from becoming "cluttered."

---

## 6. Workbench layout

**Top bar:** one persistent chip — `AIR-GAPPED · 0 OUTBOUND BYTES` — green/amber/red. Click to expand full telemetry. Nothing else permanent up here.

**Left sidebar (trimmed):** Task list (with real history, mixed statuses) + a short preset list (`NDT Corrosion Audit`, `Engineering Calculation`, `Code Verification`). Don't ship all eight sections from a full IA on day one — task list + presets + audit link is enough to feel like a platform without feeling busy.

**Center panel:** task header (ID, asset, risk, status) → input package (real filenames/thumbnails) → **execution timeline**, one line per step, ticking in with real latencies, not a completed list on load:
```
✓ Files validated · zero-egress verified
✓ OCR extracted 18 measurement rows
✓ Vision model flagged localized pitting (conf. 0.89)
✓ Router selected Qwen2.5-VL-7B + Qwen2.5-14B
✓ Retrieved 3 supporting SOP clauses
✓ Sandbox calculation completed (network: disabled)
✓ Self-RAG verification passed
● Awaiting Lead Engineer approval
```

**Right panel:** one tab open at a time — Evidence / Router / Calculation / Security — not all four stacked. Each shows a single focused card (see §7 for exact content). This is where most of the "looks sophisticated" work pays off, and it's cheap because none of it needs to be backed by a real vector DB to look convincing.

---

## 7. Making mock data read as real

**Lock one scenario, use it everywhere** — deck, doc, live demo, video. Right now your master doc's numbers (CR 0.564 mm/yr, RL 1.24 yrs) and your live MVP's numbers (CR 0.82 mm/yr, RL 1.58 yrs) don't match. Pick one:

```
Plant: MRPL Hydrocracker Unit 3 · Asset: HC-102-B
Report ID: NDT-2026-00481 · Inspector: INS-017 · Approval: APR-2026-00073
Nominal 6.02mm → Measured 3.20mm → Min. required 2.50mm (5-year interval)
Corrosion rate: 0.564 mm/yr · Remaining life: 1.24 years
```
Identical numbers appearing in the pitch deck, the architecture doc, the live demo, and the video is what makes three independent-looking artifacts read as one real deployed system.

**One human correction beats a perfect run.** You already have this built in — the engineer overriding the AI's suggested replacement timeline during approval. Keep and emphasize that beat; it's the single best "this isn't rubber-stamped" signal in the whole demo, and it costs nothing extra to build.

**Evidence card, one focused example, not a wall of text:**
```
MRPL In-Service Piping Inspection Manual · #Hydrocracker-SOPs
Page 14 · Similarity 0.91 — supporting clause shown inline
```

**Router card, shows the reasoning, not just the pick:**
```
Input: PDF + image · Risk: Critical · GPU headroom: 7.8GB
→ Qwen2.5-VL-7B (visual interpretation)
→ Qwen2.5-14B (structured reasoning)
```

**Effort-vs-payoff for what to actually build vs. script:**

| Tier | Effort | Do this |
|---|---|---|
| A (do regardless) | Low | Timeline uses real documented latencies (850/420/1200/600ms); text streams token-by-token; approval requires an actual click + operator ID field |
| B (best ROI) | Medium | A genuinely working network monitor (`/proc/net/tcp` poller or firewall log) shown live in a terminal — the one claim that's trivial to fake and very convincing when it isn't; finish real SHA-256 chaining in Postgres for the audit ledger |
| C (if GPU + time allow) | Higher | Wire at least the OCR or one model call to real local inference — one genuinely live step inside an otherwise-scripted flow means you can honestly say "yes, that's live" if asked |

**Backend build order**, if you're implementing rather than only scripting the UI:
1. One real state machine: `ingest → classify → route → extract → retrieve → calculate → critique → approval → synthesize → audit`
2. Each transition emits a structured event the UI renders directly — no hardcoded frontend progress data
3. Real egress enforcement: local-only endpoints, `--network none` sandbox, firewall rule, a logged blocked-attempt test
4. Real deliverables: docx/xlsx with task ID, model IDs, evidence refs, approval info, SHA-256 hash embedded
5. A marked "Demo Mode" (reset task, preloaded evidence, deterministic output) — using mock data is fine; presenting it as unmarked live production output is the actual risk

---

## 8. Golden path — canonical script (use this exact sequence)

1. Land in the workbench: `AIR-GAPPED · 0 OUTBOUND BYTES` chip visible, task list shows prior history (not empty, not one finished task).
2. Start new task → upload `HC_102_B_UT_Inspection_Report.pdf` + `corrosion_flange.png`. Files render as real thumbnails, not filename text.
3. Timeline animates in, one line at a time, matched latencies (§7). Don't jump to the finished state.
4. OCR + vision findings appear: "18 thickness readings extracted · localized pitting near weld HAZ, confidence 0.89 — requires engineer confirmation." Frame vision output as a finding, not a diagnosis.
5. Router card appears mid-execution (not before), showing the two selected models and why.
6. Evidence tab: 2–3 cited SOP clauses with page numbers.
7. Sandbox result: calculation shown by default; "View generated code" expandable, not open by default.
8. Critical-risk checkpoint halts the flow: `Remaining life: 1.24 years → Lead Corrosion Engineer review required.` Approval form: operator ID, role, decision, editable recommendation. **Have the engineer actually edit the timeline before approving** — this is your realism signal.
9. Deliverable: `Inspection_Approval_Note_HC-102-B.docx`, SHA-256 shown, downloadable/previewable.
10. Audit tab: hash chain, "verify chain" recomputes and confirms — "0 outbound bytes throughout."

---

## 9. Second scenario — coding task (new, closes your biggest gap)

Short, deliberately different from the golden path so the model-routing contrast is obvious:
> Prompt: "Write and verify a script to compute corrosion rate and remaining life from this CML table." → router selects a coding-oriented model (visibly different from the VL/reasoning pair above) → script runs in a `--network none` container → stdout shown → marked verified.

Two minutes of build time, and it single-handedly proves both "≥2 task types" and "coding task in sandbox" from the PS text.

---

## 10. Landing page — trim to five sections

1. **Hero** — one-liner + a live-looking workbench preview (not a stock screenshot) with `OUTBOUND BYTES: 0` visible.
2. **What actually happens** — six short stages (Ingest → Understand → Retrieve → Execute → Verify → Approve), each a small illustration, not paragraphs.
3. **Trust boundary** — a simple two-column contrast: what stays outside the enclave (cloud APIs, telemetry) vs. what stays inside (local models, local vector DB, sandboxed tools, audit ledger).
4. **Not a chatbot** — short bullet list: reads files, retrieves evidence, runs calculations, checks its own output, requests approval, produces deliverables, records the trace.
5. **Demo CTA** — straight into the workbench.

Cut anything beyond this for now; a five-screen page that's tight beats a nine-screen page that repeats itself.

---

## 11. Demo video — 3 minutes, shot against the finished flow (not before)

| Time | Beat |
|---|---|
| 0:00–0:20 | Problem — one stat from your deck, then the scanned document + photo |
| 0:20–0:40 | Product reveal — workbench + enclave status |
| 0:40–1:45 | Golden path (§8), compressed |
| 1:45–2:05 | Coding scenario (§9) — proves the two hardest PS lines in one shot |
| 2:05–2:30 | Real terminal: network monitor showing 0 outbound packets for the whole session just filmed — worth more than any slide |
| 2:30–2:50 | Deliverable + audit hash |
| 2:50–3:00 | Close: name + one-liner |

Film real mouse-driven interaction at 1080p/60fps minimum. If Tier C (§7) is done, put the real inference moment in the golden path — genuine token streaming is visually distinguishable from a typewriter animation, and judges have all used an LLM tool.

---

## 12. Judge Q&A — have these ready verbatim

- **"Is this actually local?"** → "Models run through local inference endpoints, the sandbox is network-disabled, and we expose socket/outbound-byte telemetry — shown during the workflow, not just claimed."
- **"What if the model is wrong?"** → "Output is restricted to retrieved evidence, checked by a verification gate, and routed to human approval for risk-sensitive tasks."
- **"Why multiple models?"** → "Document extraction, vision, coding, and structured reasoning have different resource/capability needs — the router picks based on modality, complexity, risk, and available VRAM."
- **"Isn't this just Open WebUI?"** → "Open WebUI is a general local chat interface. This is built around industrial workflows: risk-adaptive routing, evidence-linked outputs, sandboxed execution, human approval, and tamper-evident audit records."
- **"Can it make autonomous decisions?"** → "No — decision support only. High-risk findings require authorized human review, and we record who approved or edited the recommendation."
- **"What if the venue GPU is weaker?"** → "The router selects smaller quantized models based on available VRAM — the demo uses a lighter configuration on the same architecture."

---

## 13. Build order (single ranked list)

1. Lock name + canonical scenario numbers (§1, §7) — 30 min, unblocks everything.
2. Task list with real history (kills the "static screenshot" tell).
3. Build the coding + sandbox scenario (§9) — closes your worst compliance risk.
4. Make the network monitor genuinely real (§7, Tier B) — best ROI on the sovereignty claim.
5. Wire the interactive replay for both scenarios (§8, §9) with real latencies and a required approval click.
6. Finish real SHA-256 audit chaining.
7. Trim the landing page to the five sections in §10.
8. Film the video against the finished flow.
9. Only then: extra right-panel tabs, arena comparison, slash commands — polish, not requirements.

---

## 14. Final scorecard — check before you submit

- [ ] Name consistent across site, repo, deck, video
- [ ] Same scenario numbers everywhere
- [ ] Two visibly distinct task types, two different models routed to
- [ ] Coding task run and verified in a sandbox, shown explicitly
- [ ] Multimodal task shown
- [ ] Network monitor is real, or visibly running in a terminal, not just a claim
- [ ] Approval step requires an actual click and includes a human edit
- [ ] Every nav item leads somewhere real, not a stub
- [ ] No absolute/overclaimed language left in copy (§2)
- [ ] Judge Q&A answers rehearsed by the whole team
