import Link from "next/link";
import RMark from "./RMark";
import { AGENTS } from "@/lib/agents";
export default function Footer() {
  return (
    <footer className="mt-32 border-t border-white/10 px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-4">
        <div><RMark size={32} /><p className="fraunces mt-4 text-xl text-[#FAFAF8]">We install the flow.<br />You run the business.</p></div>
        <div><h3 className="mono mb-4 text-xs text-sage">FLOWS</h3><ul className="space-y-2 text-sm">{AGENTS.map((a) => <li key={a.slug}><Link className="hover:text-lime" href={`/services/${a.slug}`}>{a.name}</Link></li>)}</ul></div>
        <div><h3 className="mono mb-4 text-xs text-sage">COMPANY</h3><ul className="space-y-2 text-sm"><li><Link className="hover:text-lime" href="/about">About</Link></li><li><Link className="hover:text-lime" href="/how-it-works">How it works</Link></li><li><Link className="hover:text-lime" href="/services">Services</Link></li></ul></div>
        <div><h3 className="mono mb-4 text-xs text-sage">GET STARTED</h3><ul className="space-y-2 text-sm"><li><Link className="hover:text-lime" href="/start">Start Flow</Link></li><li><Link className="hover:text-lime" href="/contact">Contact</Link></li></ul></div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl justify-between border-t border-white/10 pt-6 text-xs text-sage"><span>© {new Date().getFullYear()} Renolt</span><span>Remote • Worldwide</span></div>
    </footer>
  );
}
