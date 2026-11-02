"use client";
import { useEffect, useState } from "react";

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setOk(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      setHover(!!t.closest("a, button, [data-cursor='hover']"));
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!ok) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed z-[100] mix-blend-difference"
        style={{
          left: pos.x,
          top: pos.y,
          transform: `translate(-50%, -50%) scale(${hover ? 2.2 : 1})`,
          transition: "transform 0.2s ease",
        }}
        aria-hidden
      >
        <div className="h-3 w-3 rounded-full bg-white" />
      </div>
      <div
        className="pointer-events-none fixed z-[99] border border-lime/50 rounded-full"
        style={{
          left: pos.x,
          top: pos.y,
          width: hover ? 48 : 36,
          height: hover ? 48 : 36,
          transform: "translate(-50%, -50%)",
          transition: "width 0.25s ease, height 0.25s ease",
        }}
        aria-hidden
      />
    </>
  );
}
