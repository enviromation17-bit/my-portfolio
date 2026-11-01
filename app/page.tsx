import Link from "next/link";
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
const steps = [["01", "Listen", "We map how your business runs today."], ["02", "Install", "We set up the flows that fit, one at a time."], ["03", "Run", "You run the business. People stay in control of every approval."]];
export default function Home() {
  return (
    <main className="relative isolate">
      <LiquidOrbs />
      <VelocitySkew>
        <section className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-6 py-24">
          <p className="mono mb-6 text-xs tracking-widest text-sage">RENOLT FLOW</p>
          <h1 className="fraunces text-5xl font-bold leading-[1.05] text-[#FAFAF8] md:text-7xl lg:text-[84px]"><WordStagger text="We install the flow." /><span className="shimmer"><WordStagger text="You run the business." /></span></h1>
          <BlurReveal delay={0.5} className="mt-10 flex flex-wrap gap-4">
            <MagneticButton href="/start">Start Flow</MagneticButton>
            <MagneticButton href="/services" variant="ghost">See the flows</MagneticButton>
          </BlurReveal>
        </section>
        <Marquee />
        <section className="mx-auto max-w-4xl px-6 py-40"><ScrollWords text="Leads, replies, follow-ups, posts and pages. Renolt Flow connects the repeat work, so people can focus on the work only people can do." /></section>
        <section className="mx-auto max-w-6xl px-6 py-24">
          <BlurReveal><h2 className="fraunces text-4xl font-bold text-[#FAFAF8]">How it works</h2></BlurReveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map(([n, t, d], i) => (
              <BlurReveal key={n} delay={i * 0.12}><TiltCard className="h-full rounded-2xl p-8"><div><span className="mono text-xs text-lime">{n}</span><h3 className="fraunces mt-4 text-2xl font-bold">{t}</h3><p className="mt-2 text-sm text-ceramic/70">{d}</p></div></TiltCard></BlurReveal>
            ))}
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-6 py-24">
          <BlurReveal><h2 className="fraunces text-4xl font-bold text-[#FAFAF8]">Six flows</h2></BlurReveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AGENTS.map((a, i) => <BlurReveal key={a.slug} delay={(i % 3) * 0.1}><AgentCard index={i} {...a} /></BlurReveal>)}
          </div>
        </section>
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <BlurReveal><h2 className="fraunces text-4xl font-bold text-[#FAFAF8] md:text-5xl">Ready to hand off the busywork?</h2><div className="mt-8"><MagneticButton href="/start">Start Flow</MagneticButton></div></BlurReveal>
        </section>
      </VelocitySkew>
    </main>
  );
}
