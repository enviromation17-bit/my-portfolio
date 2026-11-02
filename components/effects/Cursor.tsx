"use client";
import { useEffect, useRef } from "react";

/**
 * Smooth lagged cursor — lerp toward pointer so it does not snap or race.
 * Disabled on touch and prefers-reduced-motion.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const hover = useRef(false);
  const raf = useRef(0);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      hover.current = !!t.closest("a, button, [data-cursor='hover'], input, textarea");
    };

    // Lower = slower / smoother
    const LERP = 0.12;
    const LERP_RING = 0.08;

    const tick = () => {
      const cx = current.current.x;
      const cy = current.current.y;
      const tx = target.current.x;
      const ty = target.current.y;

      current.current.x = cx + (tx - cx) * LERP;
      current.current.y = cy + (ty - cy) * LERP;

      const rx = cx + (tx - cx) * LERP_RING;
      const ry = cy + (ty - cy) * LERP_RING;

      if (dotRef.current) {
        const s = hover.current ? 2.4 : 1;
        dotRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%) scale(${s})`;
      }
      if (ringRef.current) {
        const size = hover.current ? 52 : 36;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }

      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference will-change-transform"
        aria-hidden
      >
        <div className="h-2.5 w-2.5 rounded-full bg-white" />
      </div>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[99] rounded-full border border-lime/40 will-change-transform"
        style={{ width: 36, height: 36, transition: "width 0.3s ease, height 0.3s ease" }}
        aria-hidden
      />
    </>
  );
}
