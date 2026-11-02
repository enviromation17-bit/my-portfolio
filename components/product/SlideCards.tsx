"use client";
import { useEffect, useState } from "react";

/** Detailed workflow stages — how Renolt Flow processes work */
const STAGES = [
  {
    id: "goal",
    step: "01",
    title: "Business goal",
    summary: "Operator states what needs to happen in plain language.",
    detail:
      "Example: “Recover stalled enquiries from the last 7 days and prepare follow-ups.” The goal becomes the input to the cycle — not a blank workflow canvas.",
    flow: ["Goal received", "Context attached", "Ready to interpret"],
    accent: "#D4FF32",
    tone: "#0F1311",
  },
  {
    id: "detect",
    step: "02",
    title: "Detect signals",
    summary: "Relevant stalled work, gaps, and opportunities are surfaced.",
    detail:
      "The system looks for signals tied to the goal — unanswered leads, aging tasks, missing follow-ups — and ranks what needs attention first.",
    flow: ["Scan related work", "Rank by urgency", "Highlight gaps"],
    accent: "#60A5FA",
    tone: "#0C1014",
  },
  {
    id: "decide",
    step: "03",
    title: "Propose next action",
    summary: "A recommended action is drafted with a short reason you can review.",
    detail:
      "Before anything runs, Flow proposes what to do and why. You see the plan, the capability involved (e.g. Lead), and any permission that will be required.",
    flow: ["Draft plan", "Name capability", "Show rationale"],
    accent: "#A78BFA",
    tone: "#100E14",
  },
  {
    id: "approve",
    step: "04",
    title: "Human approval",
    summary: "Sensitive steps wait for a person before send or change.",
    detail:
      "Messages, outbound actions, and high-impact steps can sit in an approval queue. The interface is not the security boundary — the backend must still authorize.",
    flow: ["Queue action", "Review content", "Approve or reject"],
    accent: "#FBBF24",
    tone: "#14120A",
  },
  {
    id: "act",
    step: "05",
    title: "Authorized execution",
    summary: "Approved work runs through the right capability.",
    detail:
      "Lead, Omni, Email, or Content carries out the authorized step. Execution is recorded with status — running, completed, failed, or blocked — not invented success.",
    flow: ["Route to capability", "Execute step", "Capture status"],
    accent: "#34D399",
    tone: "#0A1210",
  },
  {
    id: "verify",
    step: "06",
    title: "Evidence & next",
    summary: "Outcomes are recorded; unresolved work becomes the next recommendation.",
    detail:
      "Evidence shows what actually happened and when. Anything still open feeds Detect again — so the cycle continues from verified results, not from a blank slate.",
    flow: ["Store evidence", "Update open work", "Recommend next"],
    accent: "#D4FF32",
    tone: "#0F1311",
  },
] as const;

export default function SlideCards() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [flowTick, setFlowTick] = useState(0);
  const n = STAGES.length;
  const stage = STAGES[i];

  // Auto-advance stages
  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 4500);
    return () => clearInterval(t);
  }, [paused, n]);

  // Animate micro-flow steps inside active card
  useEffect(() => {
    setFlowTick(0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setFlowTick(stage.flow.length);
      return;
    }
    let k = 0;
    const t = setInterval(() => {
      k += 1;
      setFlowTick(k);
      if (k >= stage.flow.length) clearInterval(t);
    }, 480);
    return () => clearInterval(t);
  }, [i, stage.flow.length]);

  return (
    <div
      className="relative mx-auto max-w-5xl py-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Progress path */}
      <div className="mx-auto mb-8 flex max-w-3xl items-center justify-between gap-1 px-4" aria-hidden>
        {STAGES.map((s, idx) => (
          <div key={s.id} className="flex flex-1 items-center gap-1">
            <button
              type="button"
              onClick={() => setI(idx)}
              className={`h-2 w-2 shrink-0 rounded-full transition-all ${
                idx === i ? "scale-150 bg-lime" : idx < i ? "bg-lime/50" : "bg-white/15"
              }`}
              aria-label={s.title}
            />
            {idx < n - 1 && (
              <div className={`h-px flex-1 transition-colors ${idx < i ? "bg-lime/40" : "bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="relative mx-auto h-[420px] md:h-[440px]" style={{ perspective: "1400px" }}>
        {STAGES.map((c, idx) => {
          let offset = idx - i;
          if (offset > n / 2) offset -= n;
          if (offset < -n / 2) offset += n;
          const abs = Math.abs(offset);
          const active = offset === 0;
          return (
            <button
              key={c.id}
              type="button"
              data-cursor="hover"
              onClick={() => setI(idx)}
              className="absolute left-1/2 top-1/2 w-[min(88vw,340px)] md:w-[360px] rounded-2xl border p-6 text-left shadow-2xl outline-none transition-[transform,opacity] duration-500 ease-out"
              style={{
                background: c.tone,
                borderColor: active ? `${c.accent}66` : "rgba(255,255,255,0.08)",
                transform: `
                  translate(-50%, -50%)
                  translateX(${offset * 78}px)
                  translateZ(${-abs * 90}px)
                  rotateY(${offset * -11}deg)
                  scale(${active ? 1 : 0.86 - abs * 0.03})
                `,
                opacity: abs > 2 ? 0 : 1 - abs * 0.28,
                zIndex: 20 - abs,
                pointerEvents: abs > 2 ? "none" : "auto",
              }}
              aria-current={active ? "true" : undefined}
            >
              <div className="flex items-center justify-between">
                <span className="mono text-[10px] tracking-widest" style={{ color: c.accent }}>
                  STEP {c.step}
                </span>
                <span className="mono text-[10px] text-ceramic/30">{idx + 1}/{n}</span>
              </div>
              <h3 className="fraunces mt-3 text-2xl font-bold text-[#FAFAF8]">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ceramic/70">{c.summary}</p>

              {active && (
                <>
                  <p className="mt-4 text-xs leading-relaxed text-ceramic/45">{c.detail}</p>
                  <ul className="mt-5 space-y-2">
                    {c.flow.map((f, fi) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-xs transition-all duration-300"
                        style={{
                          opacity: fi < flowTick ? 1 : 0.25,
                          transform: fi < flowTick ? "translateX(0)" : "translateX(-6px)",
                          color: fi < flowTick ? c.accent : "rgba(247,245,240,0.35)",
                        }}
                      >
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px]"
                          style={{
                            borderColor: fi < flowTick ? c.accent : "rgba(255,255,255,0.15)",
                            background: fi < flowTick ? `${c.accent}22` : "transparent",
                          }}
                        >
                          {fi + 1}
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {!active && (
                <div className="mt-6 h-1 w-10 rounded-full" style={{ background: c.accent, opacity: 0.5 }} />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {STAGES.map((c, idx) => (
          <button
            key={c.id}
            type="button"
            aria-label={c.title}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === i ? "w-8 bg-lime" : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-center mono text-[10px] text-sage">
        Workflow stages · auto-play · hover to pause · click to jump
      </p>
    </div>
  );
}
