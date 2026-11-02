import BlurReveal from "@/components/ui/BlurReveal";
import LiquidOrbs from "@/components/effects/LiquidOrbs";
import MagneticButton from "@/components/ui/MagneticButton";
import OutcomeCycle from "@/components/product/OutcomeCycle";
import SimDemo from "@/components/product/SimDemo";
import { PROBLEMS, TRUST, ECOSYSTEM, ORCHESTRATORS } from "@/lib/product";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative isolate">
      <LiquidOrbs />

      <section className="mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-6 py-24">
        <p className="mono mb-5 text-xs tracking-[0.2em] text-sage">RENOLT · BUSINESS OUTCOME INTELLIGENCE</p>
        <h1 className="fraunces max-w-4xl text-4xl font-bold leading-[1.08] text-[#FAFAF8] md:text-6xl lg:text-7xl">
          Know what needs attention.
          <br />
          <span className="text-ceramic/90">Decide what to do next.</span>
          <br />
          <span className="shimmer">Move your business forward.</span>
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-ceramic/65 md:text-lg">
          Renolt is being built so teams can go from a business goal to a recommended action,
          authorized execution, and evidence of what happened — not another workflow builder to maintain.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <MagneticButton href="/services">Explore Renolt Flow</MagneticButton>
          <MagneticButton href="#demo" variant="ghost">Product demonstration</MagneticButton>
        </div>
        <p className="mt-6 max-w-lg text-xs text-ceramic/40">
          Positioning is product direction. Capabilities marked simulated or planned are not claimed as live production execution.
        </p>
      </section>

      <section className="border-y border-white/5 bg-[#080B09]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <BlurReveal>
            <p className="mono text-xs tracking-widest text-sage">THE PROBLEM</p>
            <h2 className="fraunces mt-3 max-w-2xl text-3xl font-bold text-[#FAFAF8] md:text-4xl">
              Owners often lack a clear view of what is stalled and what should happen next.
            </h2>
          </BlurReveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PROBLEMS.map((p, i) => (
              <BlurReveal key={p.title} delay={i * 0.1}>
                <div className="border-l border-lime/40 pl-5">
                  <h3 className="text-lg font-medium text-[#FAFAF8]">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ceramic/60">{p.body}</p>
                </div>
              </BlurReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <BlurReveal>
          <p className="mono text-xs tracking-widest text-sage">HOW RENOLT THINKS ABOUT WORK</p>
          <h2 className="fraunces mt-3 text-3xl font-bold text-[#FAFAF8] md:text-4xl">
            Understand → Detect → Decide → Act → Verify → Improve
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-ceramic/60">
            The cycle is the product story. Orchestrators and tools support it; they are not the whole brand.
          </p>
        </BlurReveal>
        <div className="mt-12">
          <OutcomeCycle />
        </div>
      </section>

      <section id="demo" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16">
        <BlurReveal>
          <p className="mono text-xs tracking-widest text-sage">FIRST USE CASE</p>
          <h2 className="fraunces mt-3 text-3xl font-bold text-[#FAFAF8] md:text-4xl">
            Revenue recovery & lead follow-up
          </h2>
          <p className="mt-3 max-w-xl text-sm text-ceramic/60">
            A realistic path from goal to approval to evidence. Labelled simulated until connected to a live engine.
          </p>
        </BlurReveal>
        <div className="mt-10">
          <SimDemo />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <BlurReveal>
          <p className="mono text-xs tracking-widest text-sage">TRUST & CONTROL</p>
          <h2 className="fraunces mt-3 text-3xl font-bold text-[#FAFAF8]">Approvals, permissions, evidence</h2>
        </BlurReveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TRUST.map((t, i) => (
            <BlurReveal key={t.title} delay={i * 0.08}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="text-lg font-medium text-[#FAFAF8]">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ceramic/60">{t.body}</p>
              </div>
            </BlurReveal>
          ))}
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#080B09]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <BlurReveal>
            <p className="mono text-xs tracking-widest text-sage">CAPABILITIES THAT SUPPORT OUTCOMES</p>
            <h2 className="fraunces mt-3 text-3xl font-bold text-[#FAFAF8]">Orchestrators</h2>
            <p className="mt-3 max-w-xl text-sm text-ceramic/55">
              Lead, Omni, Email, and Content run authorized work. They sit under the outcome cycle — not as a grid of generic AI agents.
            </p>
          </BlurReveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ORCHESTRATORS.map((o) => (
              <div key={o.name} className="rounded-xl border border-white/10 px-5 py-4">
                <p className="font-medium text-[#FAFAF8]">{o.name}</p>
                <p className="mt-1 text-xs text-ceramic/55">{o.role}</p>
              </div>
            ))}
          </div>
          <Link href="/services" className="mt-8 inline-block text-sm text-lime hover:underline">
            Renolt Flow product detail →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <BlurReveal>
          <p className="mono text-xs tracking-widest text-sage">ONE ECOSYSTEM</p>
          <h2 className="fraunces mt-3 text-3xl font-bold text-[#FAFAF8]">Flow, Personal, Workers + Rooms</h2>
          <p className="mt-3 max-w-2xl text-sm text-ceramic/60">
            One foundation for identity, isolation, approvals, and evidence. Flow is the business product focus today;
            Personal and Workers + Rooms are direction, not shipping claims.
          </p>
        </BlurReveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {ECOSYSTEM.map((e) => (
            <div key={e.name} className="rounded-2xl border border-white/10 p-6">
              <span className="mono text-[10px] tracking-widest text-sage">{e.status.toUpperCase()}</span>
              <p className="mt-2 font-medium text-[#FAFAF8]">{e.name}</p>
              <p className="mt-2 text-sm text-ceramic/55">{e.line}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="fraunces text-3xl font-bold text-[#FAFAF8] md:text-5xl">
          From business goals to verified action
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-ceramic/55">
          Talk with us about early access to Renolt Flow, or explore how the outcome cycle maps to your operation.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <MagneticButton href="/contact">Get started</MagneticButton>
          <MagneticButton href="/how-it-works" variant="ghost">How orchestration works</MagneticButton>
        </div>
      </section>
    </main>
  );
}
