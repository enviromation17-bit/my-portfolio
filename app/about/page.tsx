import type { Metadata } from "next";
import MagneticButton from "@/components/ui/MagneticButton";

export const metadata: Metadata = { title: "About — Renolt Flow" };

export default function About() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="mono text-xs tracking-widest text-sage">ABOUT</p>
      <h1 className="fraunces mt-4 text-5xl font-bold text-[#FAFAF8]">About Renolt Flow</h1>
      <p className="mt-6 text-lg leading-relaxed text-ceramic/75">
        Renolt Flow is built so teams can understand what needs attention, decide what to do next,
        run authorized work, and keep evidence of results — without treating the product as another
        generic automation canvas.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ceramic/60">
        We focus on clear outcomes, human approval where it matters, and honest reporting of what
        actually ran. This site does not invent live metrics or unverified results.
      </p>
      <div className="mt-10">
        <MagneticButton href="/contact">Contact</MagneticButton>
      </div>
    </main>
  );
}
