import type { Metadata } from "next";
import BlurReveal from "@/components/ui/BlurReveal";
import WebFlowPicker from "@/components/WebFlowPicker";
import MagneticButton from "@/components/ui/MagneticButton";

export const metadata: Metadata = {
  title: "Web Flow — Templates & request — Renolt Flow",
  description: "Pick a template or request a custom site. Connected to your Lead, Omni, and desk flows.",
};

const included = [
  "Design matched to your brand colours and logo",
  "Mobile-friendly pages",
  "Contact or booking form wired into your other flows",
  "Basic SEO titles and descriptions",
  "Optional desk view for enquiries from the site",
];

const steps = [
  { n: "01", t: "Choose", d: "Pick a template below or describe a custom build." },
  { n: "02", t: "Request", d: "Send business details — we confirm scope and timeline." },
  { n: "03", t: "Build", d: "We ship the site and connect Lead / Omni / desk if you use them." },
  { n: "04", t: "Own", d: "You own the code. Export to Vercel or your host." },
];

export default function WebFlowPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <BlurReveal>
        <p className="mono text-xs text-sage">SERVICES / WEB FLOW</p>
        <h1 className="fraunces mt-4 text-5xl font-bold text-[#FAFAF8] md:text-6xl">Websites, your way.</h1>
        <p className="mt-5 max-w-2xl text-lg text-ceramic/80">
          Templates for real estate, services, agencies, SaaS, local and portfolio. Or request a custom site.
          Either way it can connect to the same desk that runs Lead and Omni Flow.
        </p>
      </BlurReveal>

      <ul className="mt-10 grid gap-3 text-sm text-ceramic/80 md:grid-cols-2">
        {included.map((i) => (
          <li key={i} className="glass rounded-lg px-4 py-3">
            <span className="text-lime">✓ </span>
            {i}
          </li>
        ))}
      </ul>

      <div className="mt-14 grid gap-4 md:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <span className="mono text-xs text-lime">{s.n}</span>
            <h3 className="fraunces mt-2 text-xl font-bold text-[#FAFAF8]">{s.t}</h3>
            <p className="mt-2 text-xs text-ceramic/60">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <MagneticButton href="#templates">Browse templates</MagneticButton>
        <MagneticButton href="/contact" variant="ghost">Custom request</MagneticButton>
      </div>

      <section id="templates" className="mt-20 scroll-mt-24">
        <h2 className="fraunces text-3xl font-bold text-[#FAFAF8]">Template concepts</h2>
        <p className="mt-2 text-sm text-ceramic/70">
          Starting points — not live client sites. Select one and request your build; we adapt to your business.
        </p>
        <WebFlowPicker />
      </section>

      <section className="mt-24 rounded-3xl border border-lime/20 bg-[#0F1311] p-8 md:p-10">
        <h2 className="fraunces text-2xl font-bold text-[#FAFAF8] md:text-3xl">Backend desk for their business</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ceramic/70">
          When Web Flow is paired with Lead and Omni, enquiries from the site land in the same desk: scored, queued,
          reply suggestions for a person to approve, and alerts only when something is hot. One place for the team —
          not another login they abandon.
        </p>
        <div className="mt-8">
          <MagneticButton href="/pricing">See install pricing</MagneticButton>
        </div>
      </section>
    </main>
  );
}
