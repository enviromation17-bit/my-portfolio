import type { Metadata } from "next";
import BlurReveal from "@/components/ui/BlurReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { WORK } from "@/lib/templates";

export const metadata: Metadata = { title: "Work — Renolt Flow" };

export default function WorkPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <BlurReveal>
        <p className="mono text-xs tracking-widest text-sage">WORK</p>
        <h1 className="fraunces mt-4 text-5xl font-bold text-[#FAFAF8]">Live patterns</h1>
        <p className="mt-4 max-w-xl text-ceramic/70">
          Example outcomes from installs. International service — no location required to start.
        </p>
      </BlurReveal>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {WORK.map((w, i) => (
          <BlurReveal key={w.title} delay={i * 0.08}>
            <div className="glass rounded-2xl p-7 transition hover:border-lime/30">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-lime font-fraunces text-black">R</span>
                <span className="rounded-full border border-lime/30 bg-lime/10 px-2.5 py-1 text-[10px] text-lime">PATTERN</span>
              </div>
              <h2 className="fraunces mt-5 text-2xl font-bold text-[#FAFAF8]">{w.title}</h2>
              <p className="mt-2 text-sm text-ceramic/65">{w.desc}</p>
              <p className="mono mt-6 text-xs text-sage">{w.live}</p>
            </div>
          </BlurReveal>
        ))}
      </div>
      <div className="mt-14 text-center">
        <MagneticButton href="/contact">Start Flow</MagneticButton>
      </div>
    </main>
  );
}
