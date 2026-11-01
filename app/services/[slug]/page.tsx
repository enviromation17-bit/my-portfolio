import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MagneticButton from "@/components/ui/MagneticButton";
import { AGENTS } from "@/lib/agents";
export const dynamicParams = false;
export function generateStaticParams() { return AGENTS.filter((a) => a.slug !== "web-flow").map((a) => ({ slug: a.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = AGENTS.find((x) => x.slug === params.slug);
  return { title: a ? `${a.name} — Renolt Flow` : "Renolt Flow" };
}
export default function Agent({ params }: { params: { slug: string } }) {
  const a = AGENTS.find((x) => x.slug === params.slug);
  if (!a) notFound();
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="mono text-xs text-sage">FLOW</p>
      <h1 className="fraunces mt-4 text-5xl font-bold text-[#FAFAF8]">{a.name}</h1>
      <p className="mt-4 text-xl text-ceramic/80">{a.line}</p>
      <p className="glass mt-10 rounded-2xl p-8 text-ceramic/80">{a.body}</p>
      <div className="mt-10"><MagneticButton href="/start">Start Flow</MagneticButton></div>
    </main>
  );
}
