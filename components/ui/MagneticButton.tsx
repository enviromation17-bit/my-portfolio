"use client";
import Link from "next/link";
import { useRef, type ReactNode, type MouseEvent } from "react";
export default function MagneticButton({ children, href, variant = "solid" }: { children: ReactNode; href: string; variant?: "solid" | "ghost" }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
  };
  const cls = variant === "solid" ? "sheen bg-lime text-black" : "glass text-ceramic";
  return (
    <Link ref={ref} href={href} onMouseMove={move} onMouseLeave={() => { if (ref.current) ref.current.style.transform = "translate(0,0)"; }}
      className={`inline-block rounded-full px-7 py-3.5 font-medium transition-transform duration-200 ease-out ${cls}`}>{children}</Link>
  );
}
