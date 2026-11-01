import type { Metadata } from "next";
import WebFlowPicker from "@/components/WebFlowPicker";
export const metadata: Metadata = { title: "Web Flow — Websites and templates — Renolt Flow" };
const inc = ["Design to match your brand colours and logo", "Mobile-friendly pages", "Contact or booking form connected to your other flows", "Basic search-engine setup (titles, descriptions)"];
export default function WebFlow() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <p className="mono text-xs text-sage">SERVICES / WEB FLOW</p>
      <h1 className="fraunces mt-4 text-5xl font-bold text-[#FAFAF8] md:text-6xl">Websites, your way.</h1>
      <p className="mt-5 max-w-2xl text-lg text-ceramic/80">Choose a starting template, or ask for something fully custom. Either way, the site connects to the rest of your flows.</p>
      <ul className="mt-8 grid gap-3 text-sm text-ceramic/80 md:grid-cols-2">{inc.map((i) => <li key={i} className="glass rounded-lg px-4 py-3"><span className="text-lime">✓ </span>{i}</li>)}</ul>
      <p className="mt-4 text-xs text-sage">Scope above is draft wording, to be confirmed.</p>
      <h2 className="fraunces mt-20 text-3xl font-bold text-[#FAFAF8]">Template concepts</h2>
      <p className="mt-2 text-sm text-ceramic/70">These are starting-point design concepts, not live client sites.</p>
      <WebFlowPicker />
    </main>
  );
}
