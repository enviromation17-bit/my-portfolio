"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
export default function BlurReveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ filter: v ? "blur(0)" : "blur(18px)", opacity: v ? 1 : 0, transform: v ? "none" : "translateY(24px)", transition: `all 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>{children}</div>
  );
}
