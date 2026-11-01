"use client";
import { useEffect, useRef, type ReactNode } from "react";
export default function VelocitySkew({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = window.scrollY, v = 0, raf = 0;
    const loop = () => {
      const y = window.scrollY; v += ((y - last) - v) * 0.15; last = y;
      if (ref.current) ref.current.style.transform = `skewY(${Math.max(-6, Math.min(6, v * 0.08))}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div ref={ref} style={{ willChange: "transform" }}>{children}</div>;
}
