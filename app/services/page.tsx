import type { Metadata } from "next";
import BlurReveal from "@/components/ui/BlurReveal";
import AgentCard from "@/components/ui/AgentCard";
import { AGENTS } from "@/lib/agents";
export const metadata: Metadata = { title: "Services — Renolt Flow" };
export default function Services() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="fraunces text-5xl font-bold text-[#FAFAF8]">Services</h1>
      <p className="mt-4 max-w-xl text-ceramic/70">Six flows. Hover a card to see the letters swap.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((a, i) => <BlurReveal key={a.slug} delay={(i % 3) * 0.1}><AgentCard index={i} slug={a.slug} name={a.name} line={a.line} /></BlurReveal>)}
      </div>
    </main>
  );
}
