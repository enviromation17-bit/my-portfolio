"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Business Rilo mascot cursor — follows pointer with lag and shows working motion.
 * Based on Renolt Family BUSINESS character (blue jacket, coordinated work).
 */
function BusinessRilo({ mode }: { mode: "idle" | "work" | "point" }) {
  return (
    <svg
      width="56"
      height="64"
      viewBox="0 0 56 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={mode === "work" ? "rilo-work" : mode === "point" ? "rilo-point" : "rilo-idle"}
      aria-hidden
    >
      {/* Soft shadow */}
      <ellipse cx="28" cy="60" rx="14" ry="3" fill="rgba(0,0,0,0.18)" />

      {/* Legs */}
      <ellipse cx="22" cy="54" rx="5" ry="6" fill="#F5F2EC" />
      <ellipse cx="34" cy="54" rx="5" ry="6" fill="#F5F2EC" />

      {/* Body */}
      <ellipse cx="28" cy="42" rx="14" ry="16" fill="#FAF8F4" />

      {/* Blue business jacket */}
      <path
        d="M14 38c0-2 2-6 6-8 2 6 6 9 8 10 2-1 6-4 8-10 4 2 6 6 6 8v10c0 4-4 8-14 8s-14-4-14-8V38z"
        fill="#5B6B7C"
      />
      <path d="M20 36c2 8 5 12 8 13 3-1 6-5 8-13" stroke="#3D4A58" strokeWidth="1.2" fill="none" opacity="0.5" />

      {/* Arms */}
      <g className="rilo-arm-l">
        <ellipse cx="12" cy="40" rx="5" ry="7" fill="#FAF8F4" transform="rotate(-20 12 40)" />
      </g>
      <g className="rilo-arm-r">
        <ellipse cx="44" cy="38" rx="5" ry="8" fill="#FAF8F4" transform="rotate(25 44 38)" />
        {/* Small work tablet when working */}
        {mode === "work" && (
          <g transform="translate(38, 28)">
            <rect x="0" y="0" width="14" height="10" rx="1.5" fill="#1a1f1c" stroke="#D4FF32" strokeWidth="0.8" />
            <rect x="2" y="2" width="6" height="1.2" rx="0.4" fill="#D4FF32" opacity="0.9" className="rilo-bar" />
            <rect x="2" y="4.5" width="10" height="1" rx="0.3" fill="#8A9A8B" opacity="0.7" />
            <rect x="2" y="6.5" width="8" height="1" rx="0.3" fill="#8A9A8B" opacity="0.5" />
          </g>
        )}
      </g>

      {/* Head */}
      <ellipse cx="28" cy="20" rx="16" ry="15" fill="#FAF8F4" />

      {/* Swirl ear — blue for Business */}
      <path
        d="M36 8c8-2 14 4 12 12-1 4-4 6-8 6 2-4 1-10-4-14z"
        fill="#FAF8F4"
      />
      <ellipse cx="44" cy="14" rx="5" ry="6" fill="#6B7C8F" transform="rotate(25 44 14)" />

      {/* Eyes */}
      <ellipse cx="22" cy="20" rx="3.2" ry="3.6" fill="#1a1a1a" />
      <ellipse cx="34" cy="20" rx="3.2" ry="3.6" fill="#1a1a1a" />
      <circle cx="23" cy="18.5" r="1" fill="white" opacity="0.9" />
      <circle cx="35" cy="18.5" r="1" fill="white" opacity="0.9" />

      {/* Smile */}
      <path
        d="M24 26c1.5 2 6.5 2 8 0"
        stroke="#1a1a1a"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function Cursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -120, y: -120 });
  const current = useRef({ x: -120, y: -120 });
  const raf = useRef(0);
  const [mode, setMode] = useState<"idle" | "work" | "point">("idle");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.documentElement.classList.add("has-custom-cursor");
    setVisible(true);

    let moving = false;
    let moveTimer: ReturnType<typeof setTimeout> | null = null;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      moving = true;
      if (moveTimer) clearTimeout(moveTimer);
      moveTimer = setTimeout(() => {
        moving = false;
      }, 120);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = !!t.closest("a, button, [data-cursor='hover'], input, textarea, [role='button']");
      setMode(interactive ? "work" : "idle");
    };

    // Smooth lag — business mascot trails calmly
    const LERP = 0.1;

    const tick = () => {
      const cx = current.current.x;
      const cy = current.current.y;
      const tx = target.current.x;
      const ty = target.current.y;

      current.current.x = cx + (tx - cx) * LERP;
      current.current.y = cy + (ty - cy) * LERP;

      if (wrapRef.current) {
        // Offset so mascot sits near pointer tip (bottom-right of character)
        const x = current.current.x + 12;
        const y = current.current.y + 8;
        wrapRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
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
      if (moveTimer) clearTimeout(moveTimer);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed left-0 top-0 z-[100] will-change-transform"
      style={{ marginLeft: -28, marginTop: -32 }}
      aria-hidden
    >
      <BusinessRilo mode={mode} />
      <style jsx global>{`
        .rilo-idle {
          animation: rilo-bob 2.4s ease-in-out infinite;
        }
        .rilo-work {
          animation: rilo-bob 1.2s ease-in-out infinite;
        }
        .rilo-work .rilo-arm-r {
          transform-origin: 44px 38px;
          animation: rilo-type 0.55s ease-in-out infinite;
        }
        .rilo-work .rilo-bar {
          animation: rilo-progress 1.1s ease-in-out infinite;
        }
        .rilo-point .rilo-arm-r {
          transform-origin: 44px 38px;
          animation: rilo-wave 0.9s ease-in-out infinite;
        }
        @keyframes rilo-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes rilo-type {
          0%, 100% { transform: rotate(8deg); }
          50% { transform: rotate(-6deg); }
        }
        @keyframes rilo-wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(18deg); }
        }
        @keyframes rilo-progress {
          0% { width: 4px; opacity: 0.5; }
          50% { width: 10px; opacity: 1; }
          100% { width: 4px; opacity: 0.5; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rilo-idle, .rilo-work, .rilo-work .rilo-arm-r, .rilo-work .rilo-bar {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
