"use client";
import { useEffect, useRef, useState } from "react";

type Mode = "idle" | "think" | "work" | "yes";

/** Business Rilo companion — Muse / Grok / OpenAI-dots energy */
function BusinessRilo({ mode, blink }: { mode: Mode; blink: boolean }) {
  return (
    <div className={`rilo-shell rilo-mode-${mode}`}>
      {/* OpenAI-style orbit dots */}
      <div className="rilo-orbit" aria-hidden>
        <span className="rilo-dot d1" />
        <span className="rilo-dot d2" />
        <span className="rilo-dot d3" />
      </div>

      {/* Soft status ring */}
      <div className="rilo-ring" />

      <svg width="64" height="72" viewBox="0 0 56 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <ellipse cx="28" cy="60" rx="14" ry="3" fill="rgba(0,0,0,0.2)" />
        <ellipse cx="22" cy="54" rx="5" ry="6" fill="#F5F2EC" />
        <ellipse cx="34" cy="54" rx="5" ry="6" fill="#F5F2EC" />
        <ellipse cx="28" cy="42" rx="14" ry="16" fill="#FAF8F4" />
        <path
          d="M14 38c0-2 2-6 6-8 2 6 6 9 8 10 2-1 6-4 8-10 4 2 6 6 6 8v10c0 4-4 8-14 8s-14-4-14-8V38z"
          fill="#5B6B7C"
        />
        <path d="M20 36c2 8 5 12 8 13 3-1 6-5 8-13" stroke="#3D4A58" strokeWidth="1.2" fill="none" opacity="0.5" />
        <g className="rilo-arm-l">
          <ellipse cx="12" cy="40" rx="5" ry="7" fill="#FAF8F4" transform="rotate(-20 12 40)" />
        </g>
        <g className="rilo-arm-r">
          <ellipse cx="44" cy="38" rx="5" ry="8" fill="#FAF8F4" transform="rotate(25 44 38)" />
          {(mode === "work" || mode === "think") && (
            <g transform="translate(37, 26)">
              <rect x="0" y="0" width="15" height="11" rx="2" fill="#121612" stroke="#D4FF32" strokeWidth="0.9" />
              <rect x="2" y="2.2" width="7" height="1.3" rx="0.4" fill="#D4FF32" className="rilo-bar" />
              <rect x="2" y="4.8" width="11" height="1" rx="0.3" fill="#8A9A8B" opacity="0.75" />
              <rect x="2" y="7" width="9" height="1" rx="0.3" fill="#8A9A8B" opacity="0.45" />
            </g>
          )}
        </g>
        <ellipse cx="28" cy="20" rx="16" ry="15" fill="#FAF8F4" />
        <path d="M36 8c8-2 14 4 12 12-1 4-4 6-8 6 2-4 1-10-4-14z" fill="#FAF8F4" />
        <ellipse cx="44" cy="14" rx="5" ry="6" fill="#6B7C8F" transform="rotate(25 44 14)" />

        {/* Eyes — blink by scaling Y */}
        <g className={blink ? "rilo-blink" : undefined}>
          <ellipse cx="22" cy="20" rx="3.2" ry="3.6" fill="#1a1a1a" />
          <ellipse cx="34" cy="20" rx="3.2" ry="3.6" fill="#1a1a1a" />
          <circle cx="23" cy="18.5" r="1" fill="white" opacity="0.95" />
          <circle cx="35" cy="18.5" r="1" fill="white" opacity="0.95" />
        </g>

        {/* Mouth changes by mode */}
        {mode === "yes" ? (
          <ellipse cx="28" cy="27" rx="3.5" ry="2.8" fill="#1a1a1a" />
        ) : mode === "think" ? (
          <path d="M25 27c2 1.2 5 1.2 7 0" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M24 26c1.5 2 6.5 2 8 0" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        )}
      </svg>

      {/* Status chip like Grok/Muse */}
      <div className="rilo-chip">
        {mode === "work" && "working"}
        {mode === "think" && "thinking"}
        {mode === "yes" && "on it"}
        {mode === "idle" && "ready"}
      </div>
    </div>
  );
}

export default function Cursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -120, y: -120 });
  const current = useRef({ x: -120, y: -120 });
  const vel = useRef({ x: 0, y: 0 });
  const last = useRef({ x: -120, y: -120, t: 0 });
  const raf = useRef(0);
  const [mode, setMode] = useState<Mode>("idle");
  const [blink, setBlink] = useState(false);
  const [visible, setVisible] = useState(false);
  const modeRef = useRef<Mode>("idle");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.documentElement.classList.add("has-custom-cursor");
    setVisible(true);

    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let yesTimer: ReturnType<typeof setTimeout> | null = null;

    const setM = (m: Mode) => {
      modeRef.current = m;
      setMode(m);
    };

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(8, now - (last.current.t || now));
      vel.current.x = (e.clientX - last.current.x) / dt;
      vel.current.y = (e.clientY - last.current.y) / dt;
      last.current = { x: e.clientX, y: e.clientY, t: now };
      target.current.x = e.clientX;
      target.current.y = e.clientY;

      // Fast move → thinking pulse (like processing attention)
      const speed = Math.hypot(vel.current.x, vel.current.y);
      if (modeRef.current !== "yes" && modeRef.current !== "work") {
        if (speed > 1.2) setM("think");
        else if (speed < 0.15 && modeRef.current === "think") setM("idle");
      }

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (modeRef.current === "think") setM("idle");
      }, 400);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || modeRef.current === "yes") return;
      const interactive = !!t.closest(
        "a, button, [data-cursor='hover'], input, textarea, [role='button']"
      );
      setM(interactive ? "work" : modeRef.current === "think" ? "think" : "idle");
    };

    const onDown = () => {
      setM("yes");
      if (yesTimer) clearTimeout(yesTimer);
      yesTimer = setTimeout(() => setM("idle"), 700);
    };

    // Occasional blink
    const blinkLoop = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
    }, 3200 + Math.random() * 2000);

    const LERP = 0.11;

    const tick = () => {
      const cx = current.current.x;
      const cy = current.current.y;
      const tx = target.current.x;
      const ty = target.current.y;
      current.current.x = cx + (tx - cx) * LERP;
      current.current.y = cy + (ty - cy) * LERP;

      if (wrapRef.current) {
        // Velocity lean (Grok-style physicality)
        const leanX = Math.max(-12, Math.min(12, vel.current.x * 18));
        const leanY = Math.max(-8, Math.min(8, vel.current.y * 12));
        const rot = leanX * 0.6;
        const x = current.current.x + 16;
        const y = current.current.y + 12;
        wrapRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) translate(${leanX * 0.3}px, ${leanY * 0.3}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      clearInterval(blinkLoop);
      if (idleTimer) clearTimeout(idleTimer);
      if (yesTimer) clearTimeout(yesTimer);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed left-0 top-0 z-[100] will-change-transform"
      style={{ marginLeft: -32, marginTop: -36 }}
      aria-hidden
    >
      <BusinessRilo mode={mode} blink={blink} />
    </div>
  );
}
