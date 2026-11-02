import type { Metadata } from "next";
import BlurReveal from "@/components/ui/BlurReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import OutcomeCycle from "@/components/product/OutcomeCycle";

export const metadata: Metadata = {
  title: "How it works — Renolt",
  description: "From business goal to verified action: understand, detect, decide, act, verify, improve.",
};

const ARCH = [
  { name: "Business goal", note: "What the operator wants to achieve or resolve." },
  { name: "Interpretation", note: "Intent framing — planned capability; labelled conceptual until shipped." },
  { name: "Plan", note: "Proposed steps and required permissions before execution." },
  { name: "Permission checks", note: "Backend authorization — not frontend-only gates." },
  { name: "Orchestrator selection", note: "Lead, Omni, Email, Content, or custom capability." },
  { name: "Execution", note: "Authorized work runs; sensitive steps can wait for approval." },
  { name: "Verification", note: "Evidence of outcomes, failures, and blocked states." },
  { name: "Next recommendation", note: "Unresolved work feeds the next decision." },
] as const;

export default function HowItWorks() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <BlurReveal>
        <p className="mono text-xs tracking-widest text-sage">ORCHESTRATION</p>
        <h1 className="fraunces mt-4 text-5xl font-bold text-[#FAFAF8]">How Renolt works</h1>
        <p className="mt-5 max-w-2xl text-lg text-ceramic/70">
          Customer-facing architecture: goal → plan → permission → execution → evidence.
          Future intent interpreters and planners are marked as planned when not implemented.
        </p>
      </BlurReveal>

      <div className="mt-14">
        <OutcomeCycle />
      </div>

      <section className="mt-20">
        <h2 className="fraunces text-3xl font-bold text-[#FAFAF8]">Architecture path</h2>
        <ol className="mt-8 space-y-0">
          {ARCH.map((a, i) => (
            <li key={a.name} className="flex gap-4 border-l border-white/10 py-4 pl-6">
              <span className="mono text-xs text-lime">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-medium text-[#FAFAF8]">{a.name}</p>
                <p className="mt-1 text-sm text-ceramic/55">{a.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 rounded-3xl border border-white/10 bg-[#0A0E0B] p-8">
        <h3 className="fraunces text-xl font-bold text-[#FAFAF8]">Vision vs reality</h3>
        <p className="mt-3 text-sm leading-relaxed text-ceramic/60">
          Interactive demos on this site use simulated data. Live execution, connector status, and verified outcomes
          depend on the separate backend engine and real authorizations. The frontend is never the source of truth for permissions.
        </p>
        <div className="mt-6">
          <MagneticButton href="/contact">Talk to us</MagneticButton>
        </div>
      </section>
    </main>
  );
}
