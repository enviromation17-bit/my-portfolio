import type { Metadata } from "next";
import BlurReveal from "@/components/ui/BlurReveal";
import AgentCard from "@/components/ui/AgentCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { AGENTS } from "@/lib/agents";

export const metadata: Metadata = {
  title: "Renolt Flow — Business orchestration",
  description: "Renolt Flow: business goals, orchestrators, approvals, and evidence. Primary product in the Renolt ecosystem.",
};

export default function Services() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <BlurReveal>
        <p className="mono text-xs tracking-widest text-sage">RENOLT FLOW</p>
        <h1 className="fraunces mt-4 text-5xl font-bold text-[#FAFAF8]">Business orchestration</h1>
        <p className="mt-5 max-w-2xl text-lg text-ceramic/70">
          Flow is the business product: connect goals to capabilities (lead, omni, email, content, web),
          keep people in the approval path, and record what actually happened. Orchestrators support outcomes —
          they are not a catalogue of generic AI agents.
        </p>
      </BlurReveal>

      <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-100/80">
        Scopes below describe intended product direction. Treat detailed automation claims as draft until verified against a live backend.
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((a, i) => (
          <BlurReveal key={a.slug} delay={(i % 3) * 0.1}>
            <AgentCard index={i} slug={a.slug} name={a.name} line={a.line} />
          </BlurReveal>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap gap-4">
        <MagneticButton href="/how-it-works">How orchestration works</MagneticButton>
        <MagneticButton href="/contact" variant="ghost">Get started</MagneticButton>
      </div>
    </main>
  );
}
