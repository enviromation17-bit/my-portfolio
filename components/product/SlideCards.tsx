"use client";
import { useEffect, useState } from "react";

const CARDS = [
  {
    title: "Outcome cycle",
    line: "Understand → Detect → Decide → Act → Verify",
    tone: "#0F1311",
    accent: "#D4FF32",
    tag: "Core",
  },
  {
    title: "Lead recovery",
    line: "Stalled enquiries ranked, draft follow-ups, human approve",
    tone: "#121816",
    accent: "#8A9A8B",
    tag: "Use case",
  },
  {
    title: "Approvals",
    line: "Sensitive steps wait for a person before send",
    tone: "#0E1210",
    accent: "#D4FF32",
    tag: "Control",
  },
  {
    title: "Evidence",
    line: "Planned · running · waiting · completed · failed",
    tone: "#141A16",
    accent: "#A78BFA",
    tag: "Trust",
  },
  {
    title: "Omni inbox",
    line: "Channels in one place with suggested replies",
    tone: "#0C100E",
    accent: "#60A5FA",
    tag: "Capability",
  },
  {
    title: "Renolt Flow",
    line: "Business goals to verified action",
    tone: "#101410",
    accent: "#D4FF32",
    tag: "Product",
  },
] as const;

export default function SlideCards() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = CARDS.length;

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 3200);
    return () => clearInterval(t);
  }, [paused, n]);

  return (
    <div
      className="relative mx-auto max-w-5xl py-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto h-[320px] md:h-[380px]" style={{ perspective: "1200px" }}>
        {CARDS.map((c, idx) => {
          let offset = idx - i;
          if (offset > n / 2) offset -= n;
          if (offset < -n / 2) offset += n;
          const abs = Math.abs(offset);
          const active = offset === 0;
          return (
            <button
              key={c.title}
              type="button"
              data-cursor="hover"
              onClick={() => setI(idx)}
              className="absolute left-1/2 top-1/2 w-[min(78vw,280px)] md:w-[300px] rounded-2xl border border-white/10 p-6 text-left shadow-2xl outline-none transition-[transform,opacity] duration-500 ease-out"
              style={{
                background: c.tone,
                borderColor: active ? `${c.accent}55` : "rgba(255,255,255,0.08)",
                transform: `
                  translate(-50%, -50%)
                  translateX(${offset * 72}px)
                  translateZ(${-abs * 80}px)
                  rotateY(${offset * -12}deg)
                  scale(${active ? 1 : 0.88 - abs * 0.04})
                `,
                opacity: abs > 2 ? 0 : 1 - abs * 0.25,
                zIndex: 20 - abs,
                pointerEvents: abs > 2 ? "none" : "auto",
              }}
              aria-current={active ? "true" : undefined}
            >
              <span className="mono text-[10px] tracking-widest" style={{ color: c.accent }}>
                {c.tag.toUpperCase()}
              </span>
              <h3 className="fraunces mt-3 text-2xl font-bold text-[#FAFAF8]">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ceramic/60">{c.line}</p>
              <div className="mt-6 h-1 w-12 rounded-full" style={{ background: c.accent }} />
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {CARDS.map((c, idx) => (
          <button
            key={c.title}
            type="button"
            aria-label={`Show ${c.title}`}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === i ? "w-8 bg-lime" : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-center mono text-[10px] text-sage">
        Auto-play · hover to pause · click a card
      </p>
    </div>
  );
}
