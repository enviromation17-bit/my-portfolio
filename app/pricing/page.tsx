import type { Metadata } from "next";
import Link from "next/link";
import BlurReveal from "@/components/ui/BlurReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { PRICING, CARE } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Pricing — Renolt Flow",
  description: "Founder install pricing. We set up the flows. Optional monthly care. Compared fairly to SaaS tools like GoHighLevel.",
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <BlurReveal>
        <p className="mono text-xs tracking-widest text-sage">PRICING</p>
        <h1 className="fraunces mt-4 text-5xl font-bold text-[#FAFAF8] md:text-6xl">Founder pricing.</h1>
        <p className="mt-5 max-w-2xl text-lg text-ceramic/70">
          GoHighLevel bills ~$97–$497 every month as SaaS. Renolt is a service: we install the flow once.
          Optional care plans if you want us watching the desk. Refund path if Flow does not save meaningful time in the first month — talk to us.
        </p>
      </BlurReveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {PRICING.map((p, i) => (
          <BlurReveal key={p.id} delay={i * 0.1}>
            <div
              className={`relative flex h-full flex-col rounded-3xl border p-8 ${
                p.popular
                  ? "border-lime bg-[#0F1311] shadow-[0_0_40px_rgba(212,255,50,0.12)]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-8 rounded-full bg-lime px-3 py-1 text-[10px] font-bold tracking-wide text-black">
                  MOST POPULAR
                </span>
              )}
              <p className="mono text-xs tracking-widest text-sage">{p.name.toUpperCase()}</p>
              <p className="mt-2 text-sm text-ceramic/60">{p.tagline}</p>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-sm text-ceramic/30 line-through">${p.was}</span>
                <span className="fraunces text-5xl font-bold text-[#FAFAF8]">${p.now}</span>
              </div>
              <p className="mt-1 text-xs text-sage">{p.period} · founder rate</p>
              <ul className="mt-8 flex-1 space-y-3 text-sm text-ceramic/75">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-lime">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-ceramic/40">{p.compare}</p>
              <Link
                href="/contact"
                className={`mt-8 block rounded-full py-3 text-center text-sm font-medium ${
                  p.popular ? "bg-lime text-black" : "bg-white text-black"
                }`}
              >
                Open Flow · {p.name}
              </Link>
            </div>
          </BlurReveal>
        ))}
      </div>

      <section className="mt-20">
        <h2 className="fraunces text-3xl font-bold text-[#FAFAF8]">Optional monthly care</h2>
        <p className="mt-3 max-w-xl text-sm text-ceramic/60">
          Numbers sit near GoHighLevel plan bands so the choice is clear: pay SaaS forever, or pay Renolt to install + optional care.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {CARE.map((c) => (
            <div key={c.name} className="glass rounded-2xl p-6">
              <p className="mono text-xs text-sage">{c.name.toUpperCase()}</p>
              <p className="fraunces mt-2 text-3xl font-bold text-[#FAFAF8]">
                ${c.price}
                <span className="text-base font-normal text-ceramic/50">/mo</span>
              </p>
              <p className="mt-3 text-sm text-ceramic/65">{c.note}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16 rounded-3xl border border-white/10 bg-[#0A0E0B] p-8 md:p-10">
        <h3 className="fraunces text-2xl font-bold text-[#FAFAF8]">Service, not another SaaS seat</h3>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ceramic/70">
          HighLevel is strong if you want a platform you run yourself every month. Renolt is for teams that want the desk
          installed: Lead Flow, Omni, email, social, web, orchestrator — wired to your channels, with people approving what matters.
          You can export and own the setup. No lock-in required.
        </p>
        <div className="mt-8">
          <MagneticButton href="/contact">Talk through pricing</MagneticButton>
        </div>
      </div>
    </main>
  );
}
