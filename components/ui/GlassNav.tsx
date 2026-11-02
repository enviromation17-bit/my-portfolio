import Link from "next/link";
import RMark from "./RMark";
import { AGENTS } from "@/lib/agents";

const links = [
  ["How it works", "/how-it-works"],
  ["Work", "/work"],
  ["Pricing", "/pricing"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export default function GlassNav() {
  return (
    <nav aria-label="Main" className="glass sticky top-0 z-50 flex items-center justify-between px-6 py-4">
      <Link href="/" className="flex items-center gap-2.5" data-cursor="hover">
        <RMark />
        <span className="flex flex-col leading-none">
          <span className="text-[13px] font-semibold tracking-tight text-[#FAFAF8]">Renolt</span>
          <span className="mono text-[9px] tracking-[0.18em] text-lime">FLOW</span>
        </span>
      </Link>
      <ul className="hidden items-center gap-7 text-sm text-ceramic/80 lg:flex">
        <li className="group relative">
          <Link href="/services" className="transition hover:text-lime">
            Product ▾
          </Link>
          <ul
            className="glass invisible absolute left-0 top-full mt-3 w-52 rounded-xl p-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
            style={{ background: "rgba(5,7,6,.95)" }}
          >
            <li>
              <Link href="/services" className="block rounded-lg px-3 py-2 hover:bg-white/10 hover:text-lime">
                Overview
              </Link>
            </li>
            {AGENTS.map((a) => (
              <li key={a.slug}>
                <Link href={`/services/${a.slug}`} className="block rounded-lg px-3 py-2 hover:bg-white/10 hover:text-lime">
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        {links.map(([l, h]) => (
          <li key={h}>
            <Link href={h} className="transition hover:text-lime">
              {l}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/contact" className="rounded-full bg-lime px-4 py-2 text-sm font-medium text-black" data-cursor="hover">
        Get started
      </Link>
    </nav>
  );
}
