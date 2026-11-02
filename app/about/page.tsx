import type { Metadata } from "next";
import MagneticButton from "@/components/ui/MagneticButton";

export const metadata: Metadata = { title: "About — Renolt" };

export default function About() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="mono text-xs tracking-widest text-sage">ABOUT</p>
      <h1 className="fraunces mt-4 text-5xl font-bold text-[#FAFAF8]">About Renolt</h1>
      <p className="mt-6 text-lg leading-relaxed text-ceramic/75">
        Renolt is building an outcome-oriented system for business work: understand what needs attention,
        recommend what to do next, run authorized actions, and keep evidence of results.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ceramic/60">
        <strong className="text-ceramic/80">Renolt Flow</strong> is the primary business product.
        Personal and Workers + Rooms share the same foundation for identity, isolation, and approvals —
        presented as one ecosystem, not separate brands. Foundation architecture (trust, task lifecycle, recovery)
        is developed alongside the product surface; this site does not invent live metrics or unverified results.
      </p>
      <div className="mt-10">
        <MagneticButton href="/contact">Contact</MagneticButton>
      </div>
    </main>
  );
}
