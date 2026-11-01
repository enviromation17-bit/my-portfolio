import WordStagger from "@/components/ui/WordStagger";
import BlurReveal from "@/components/ui/BlurReveal";
import LiquidOrbs from "@/components/effects/LiquidOrbs";
import VelocitySkew from "@/components/effects/VelocitySkew";
import MagneticButton from "@/components/ui/MagneticButton";
import TiltCard from "@/components/ui/TiltCard";
import ScrollWords from "@/components/ui/ScrollWords";
import Marquee from "@/components/ui/Marquee";
import AgentCard from "@/components/ui/AgentCard";
import { AGENTS } from "@/lib/agents";
import { PROCESS, WORK, PRICING } from "@/lib/templates";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative isolate">
      <LiquidOrbs />
      <VelocitySkew>
        <section className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-6 py-24">
          <p className="mono mb-6 text-xs tracking-widest text-sage">RENOLT FLOW</p>
          <h1 className="fraunces text-5xl font-bold leading-[1.05] text-[#FAFAF8] md:text-7xl lg:text-[84px]">
            <WordStagger text="We install the flow." />
            <span className="shimmer">
              <WordStagger text="You run the business." />
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-base text-ceramic/65 md:text-lg">
            Lead, inbox, email, social and web — connected into one desk. Not another SaaS you babysit monthly.
            We set it up. People approve what matters.
          </p>
          <BlurReveal delay={0.4} className="mt-10 flex flex-wrap gap-4">
            <MagneticButton href="/start">Start Flow</MagneticButton>
            <MagneticButton href="/services" variant="ghost">See the flows</MagneticButton>
            <MagneticButton href="/pricing" variant="ghost">Pricing</MagneticButton>
          </BlurReveal>
        </section>

        <Marquee />

        <section className="mx-auto max-w-4xl px-6 py-32">
          <ScrollWords text="Leads, replies, follow-ups, posts and pages. Renolt Flow connects the repeat work, so people can focus on the work only people can do." />
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <BlurReveal>
            <h2 className="fraunces text-4xl font-bold text-[#FAFAF8]">How it works</h2>
          </BlurReveal>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {PROCESS.map((s, i) => (
              <BlurReveal key={s.n} delay={i * 0.1}>
                <TiltCard className="h-full rounded-2xl p-6">
                  <span className="mono text-xs text-lime">{s.n}</span>
                  <h3 className="fraunces mt-3 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-ceramic/65">{s.body}</p>
                </TiltCard>
              </BlurReveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <BlurReveal>
            <h2 className="fraunces text-4xl font-bold text-[#FAFAF8]">Six flows</h2>
            <p className="mt-3 max-w-xl text-sm text-ceramic/60">Including Web Flow — templates and custom requests — and Orchestrator for the full desk.</p>
          </BlurReveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AGENTS.map((a, i) => (
              <BlurReveal key={a.slug} delay={(i % 3) * 0.1}>
                <AgentCard index={i} slug={a.slug} name={a.name} line={a.line} />
              </BlurReveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <BlurReveal>
              <h2 className="fraunces text-4xl font-bold text-[#FAFAF8]">Work</h2>
            </BlurReveal>
            <Link href="/work" className="text-sm text-lime hover:underline">All patterns →</Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {WORK.map((w, i) => (
              <BlurReveal key={w.title} delay={i * 0.08}>
                <div className="glass rounded-2xl p-5">
                  <p className="fraunces text-lg font-bold text-[#FAFAF8]">{w.title}</p>
                  <p className="mt-2 text-xs text-ceramic/60">{w.desc}</p>
                  <p className="mono mt-4 text-[10px] text-sage">{w.live}</p>
                </div>
              </BlurReveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <BlurReveal>
            <h2 className="fraunces text-4xl font-bold text-[#FAFAF8]">Founder pricing</h2>
            <p className="mt-3 max-w-xl text-sm text-ceramic/60">
              Install once. Optional care near GoHighLevel monthly bands — without locking you into SaaS.
            </p>
          </BlurReveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PRICING.map((p, i) => (
              <BlurReveal key={p.id} delay={i * 0.1}>
                <div className={`rounded-2xl border p-6 ${p.popular ? "border-lime bg-[#0F1311]" : "border-white/10 bg-white/[0.03]"}`}>
                  {p.popular && <span className="mono text-[10px] text-lime">MOST POPULAR</span>}
                  <p className="fraunces mt-2 text-2xl font-bold text-[#FAFAF8]">{p.name}</p>
                  <p className="mt-2">
                    <span className="text-sm text-ceramic/30 line-through">${p.was}</span>{" "}
                    <span className="fraunces text-3xl font-bold text-[#FAFAF8]">${p.now}</span>
                  </p>
                  <p className="mt-1 text-xs text-sage">{p.period}</p>
                  <Link href="/pricing" className="mt-6 inline-block text-sm text-lime">Full comparison →</Link>
                </div>
              </BlurReveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <BlurReveal>
            <h2 className="fraunces text-4xl font-bold text-[#FAFAF8] md:text-5xl">Ready to hand off the busywork?</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <MagneticButton href="/start">Start Flow</MagneticButton>
              <MagneticButton href="/services/web-flow" variant="ghost">Web Flow templates</MagneticButton>
            </div>
          </BlurReveal>
        </section>
      </VelocitySkew>
    </main>
  );
}
