"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
export default function LetterSwap({ text, className = "" }: { text: string; className?: string }) {
  const root = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = root.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const host = (el.closest("[data-swap-host]") as HTMLElement) ?? el;
    const top = el.querySelectorAll(".ls-a"), bot = el.querySelectorAll(".ls-b");
    gsap.set(bot, { yPercent: 100 });
    const run = (to: number) => {
      const o = { duration: 0.5, ease: "power3.out", stagger: { amount: 0.28, from: "random" as const } };
      gsap.to(top, { yPercent: -100 * to, ...o }); gsap.to(bot, { yPercent: 100 - 100 * to, ...o });
    };
    const on = () => run(1), off = () => run(0);
    host.addEventListener("mouseenter", on); host.addEventListener("mouseleave", off);
    host.addEventListener("focusin", on); host.addEventListener("focusout", off);
    return () => { host.removeEventListener("mouseenter", on); host.removeEventListener("mouseleave", off); host.removeEventListener("focusin", on); host.removeEventListener("focusout", off); gsap.killTweensOf([...top, ...bot]); };
  }, []);
  return (
    <span ref={root} className={className} aria-label={text}>
      {Array.from(text).map((c, i) => (
        <span key={i} aria-hidden="true" className="relative inline-block overflow-hidden align-top" style={{ lineHeight: "1.1em", height: "1.1em" }}>
          <span className="ls-a block text-[#FAFAF8]">{c === " " ? "\u00A0" : c}</span>
          <span className="ls-b absolute left-0 top-0 block text-lime">{c === " " ? "\u00A0" : c}</span>
        </span>
      ))}
    </span>
  );
}
