import Link from "next/link";
import LetterSwap from "./LetterSwap";
import TiltCard from "./TiltCard";
export default function AgentCard({ slug, name, line, index }: { slug: string; name: string; line: string; index: number }) {
  return (
    <TiltCard className="rounded-2xl"><Link href={`/services/${slug}`} data-swap-host className="block rounded-2xl p-8">
      <span className="mono text-xs text-sage">{String(index + 1).padStart(2, "0")}</span>
      <h3 className="fraunces mt-6 text-3xl font-bold"><LetterSwap text={name} /></h3>
      <p className="mt-3 text-sm text-ceramic/70">{line}</p>
      <span className="mt-8 inline-block text-sm text-lime">Read more →</span>
    </Link></TiltCard>
  );
}
