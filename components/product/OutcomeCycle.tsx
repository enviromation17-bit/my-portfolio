"use client";
import { useEffect, useState } from "react";
import { CYCLE } from "@/lib/product";

export default function OutcomeCycle() {
  const [active, setActive] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setActive((i) => (i + 1) % CYCLE.length), 2200);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0E0B] p-6 md:p-10">
      <p className="mono text-[10px] tracking-[0.2em] text-sage">OUTCOME CYCLE</p>
      <p className="fraunces mt-2 text-2xl font-bold text-[#FAFAF8] md:text-3xl">
        From a business goal to verified action
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2 md:gap-1">
        {CYCLE.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <button
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full border px-3 py-2 text-left transition md:px-4 ${
                active === i
                  ? "border-lime bg-lime/10 text-lime"
                  : "border-white/10 bg-white/[0.03] text-ceramic/60 hover:border-white/20"
              }`}
              aria-pressed={active === i}
            >
              <span className="mono text-[10px] tracking-widest opacity-70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-0.5 block text-sm font-medium">{step.label}</span>
            </button>
            {i < CYCLE.length - 1 && (
              <span className="mx-1 hidden text-ceramic/20 md:inline" aria-hidden>
                →
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 min-h-[72px] rounded-2xl border border-white/10 bg-black/30 p-5" aria-live="polite">
        <p className="mono text-[10px] tracking-widest text-lime">{CYCLE[active].label.toUpperCase()}</p>
        <p className="mt-2 text-sm text-ceramic/80 md:text-base">{CYCLE[active].detail}</p>
      </div>

      <div className="mt-8 flex items-center gap-1" aria-hidden>
        {CYCLE.map((step, i) => (
          <div key={step.id} className="flex flex-1 items-center min-w-0">
            <div
              className={`h-1.5 w-full rounded-full transition-colors duration-500 ${
                i <= active ? "bg-lime" : "bg-white/10"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
