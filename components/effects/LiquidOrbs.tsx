"use client";
import { useEffect, useRef } from "react";
export default function LiquidOrbs() {
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: PointerEvent) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; };
    const loop = () => { cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05;
      layers.current.forEach((el, i) => { if (el) el.style.transform = `translate(${cx * (i + 1) * -60}px,${cy * (i + 1) * -60}px)`; });
      raf = requestAnimationFrame(loop); };
    addEventListener("pointermove", move); raf = requestAnimationFrame(loop);
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  const set = (i: number) => (el: HTMLDivElement | null) => { layers.current[i] = el; };
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div ref={set(0)} className="absolute left-[8%] top-[5%]"><div className="h-[520px] w-[520px] rounded-full bg-lime/30 blur-[90px]" style={{ animation: "drift1 18s ease-in-out infinite" }} /></div>
      <div ref={set(1)} className="absolute right-[5%] top-[20%]"><div className="h-[640px] w-[640px] rounded-full bg-sage/20 blur-[110px]" style={{ animation: "drift2 24s ease-in-out infinite" }} /></div>
      <div ref={set(2)} className="absolute bottom-[-10%] left-[30%]"><div className="h-[720px] w-[720px] rounded-full bg-ceramic/15 blur-[130px]" style={{ animation: "drift3 30s ease-in-out infinite" }} /></div>
    </div>
  );
}
