import type { Metadata } from "next";
import BlurReveal from "@/components/ui/BlurReveal";
export const metadata: Metadata = { title: "How it works — Renolt Flow" };
const s = [["Listen", "We map how your business runs today: where leads arrive, who replies, what repeats."], ["Install", "We set up the flows that fit, one at a time, so you can see each one working."], ["Run", "The flows handle the repeat work. People approve what matters."]];
export default function How() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="fraunces text-5xl font-bold text-[#FAFAF8]">How it works</h1>
      <div className="mt-12 space-y-6">{s.map(([t, d], i) => <BlurReveal key={t}><div className="glass rounded-2xl p-8"><span className="mono text-xs text-lime">0{i + 1}</span><h2 className="fraunces mt-3 text-2xl font-bold">{t}</h2><p className="mt-2 text-ceramic/70">{d}</p></div></BlurReveal>)}</div>
    </main>
  );
}
