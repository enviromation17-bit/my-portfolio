"use client";
import { useEffect, useRef } from "react";
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const upd = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { const h = document.documentElement.scrollHeight - innerHeight; if (ref.current) ref.current.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; }); };
    addEventListener("scroll", upd, { passive: true }); upd();
    return () => { removeEventListener("scroll", upd); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} aria-hidden="true" className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left bg-lime" style={{ transform: "scaleX(0)", boxShadow: "0 0 12px #D4FF32" }} />;
}
