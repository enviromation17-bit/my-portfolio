"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export default function ScrollWords({ text }: { text: string }) {
  const root = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = root.current; if (!el) return;
    const words = el.querySelectorAll(".sw");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { gsap.set(words, { opacity: 1 }); return; }
    gsap.registerPlugin(ScrollTrigger);
    const t = gsap.fromTo(words, { opacity: 0.15 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, []);
  return <p ref={root} aria-label={text} className="fraunces text-3xl font-bold leading-tight text-[#FAFAF8] md:text-5xl">{text.split(" ").map((w, i) => <span key={i} aria-hidden="true" className="sw inline-block opacity-100">{w}&nbsp;</span>)}</p>;
}
