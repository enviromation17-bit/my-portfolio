"use client";
import { useState } from "react";
import { DEMO_STEPS } from "@/lib/product";

export default function SimDemo() {
  const [step, setStep] = useState(0);
  const current = DEMO_STEPS[step];

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0A0E0B]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <p className="mono text-[10px] tracking-widest text-sage">PRODUCT DEMO</p>
          <p className="text-sm text-ceramic/70">Simulated scenario — not a live backend execution</p>
        </div>
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-medium text-amber-200">
          SIMULATED DATA
        </span>
      </div>

      <div className="grid md:grid-cols-[200px_1fr]">
        <ol className="border-b border-white/10 p-3 md:border-b-0 md:border-r md:border-white/10">
          {DEMO_STEPS.map((s, i) => (
            <li key={s.phase}>
              <button
                type="button"
                onClick={() => setStep(i)}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  i === step ? "bg-lime/10 text-lime" : "text-ceramic/50 hover:bg-white/5 hover:text-ceramic/80"
                }`}
              >
                <span className="mono text-[10px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
                <span className="ml-2 font-medium">{s.phase}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="p-6 md:p-8">
          <p className="mono text-[10px] tracking-widest text-lime">{current.phase.toUpperCase()}</p>
          <p className="fraunces mt-3 text-2xl font-bold leading-tight text-[#FAFAF8] md:text-3xl">
            {current.text}
          </p>
          <p className="mt-4 text-sm text-ceramic/55">
            Example use case: revenue recovery and lead follow-up. Approval is shown before any send.
            When a real engine is connected, evidence will come from that system — not from this UI alone.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-ceramic/70 disabled:opacity-30"
            >
              Back
            </button>
            <button
              type="button"
              disabled={step === DEMO_STEPS.length - 1}
              onClick={() => setStep((s) => Math.min(DEMO_STEPS.length - 1, s + 1))}
              className="rounded-full bg-lime px-5 py-2 text-sm font-medium text-black disabled:opacity-30"
            >
              Next step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
