import { AGENTS } from "@/lib/agents";
export default function Marquee() {
  const row = [...AGENTS, ...AGENTS];
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-white/10 py-6" style={{ maskImage: "linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)" }}>
      <div className="marquee">{row.map((a, i) => <span key={i} className="fraunces mx-8 whitespace-nowrap text-3xl font-bold text-ceramic/30">{a.name} <span className="text-lime">✦</span></span>)}</div>
    </div>
  );
}
