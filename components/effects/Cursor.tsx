"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Mood = "ready" | "explain" | "demo" | "trust" | "flow" | "hi" | "wave";

const SECTION_HINTS: { id: string; mood: Mood; line: string }[] = [
  { id: "demo", mood: "demo", line: "This demo is simulated — approval still comes first." },
  { id: "hero", mood: "hi", line: "Know what needs attention. I’m here if you explore." },
];

const SCROLL_LINES: { test: RegExp; mood: Mood; line: string }[] = [
  { test: /problem|stalled/i, mood: "explain", line: "Owners miss what is stalled. Flow surfaces it." },
  { test: /understand|detect|decide|outcome cycle/i, mood: "flow", line: "Goal → detect → decide → act → verify." },
  { test: /approval|trust|evidence|permission/i, mood: "trust", line: "Sensitive steps wait for a person." },
  { test: /orchestrator|lead|omni|capabilities/i, mood: "explain", line: "Orchestrators support outcomes — not the whole brand." },
  { test: /get started|contact|verified action/i, mood: "wave", line: "Ready when you are. Ask about Flow." },
];

function RiloSVG({ mood }: { mood: Mood }) {
  const happy = mood === "hi" || mood === "wave" || mood === "demo";
  const focus = mood === "explain" || mood === "flow" || mood === "trust";
  return (
    <svg width="112" height="128" viewBox="0 0 56 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <ellipse cx="28" cy="60" rx="14" ry="3" fill="rgba(0,0,0,0.22)" />
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
        <ellipse cx="44" cy="36" rx="5" ry="8" fill="#FAF8F4" transform="rotate(30 44 36)" />
      </g>
      <ellipse cx="28" cy="20" rx="16" ry="15" fill="#FAF8F4" />
      <path d="M36 8c8-2 14 4 12 12-1 4-4 6-8 6 2-4 1-10-4-14z" fill="#FAF8F4" />
      <ellipse cx="44" cy="14" rx="5" ry="6" fill="#6B7C8F" transform="rotate(25 44 14)" />
      <ellipse cx="22" cy="20" rx="3.4" ry={focus ? 2.8 : 3.8} fill="#1a1a1a" />
      <ellipse cx="34" cy="20" rx="3.4" ry={focus ? 2.8 : 3.8} fill="#1a1a1a" />
      <circle cx="23.2" cy="18.6" r="1.1" fill="white" opacity="0.95" />
      <circle cx="35.2" cy="18.6" r="1.1" fill="white" opacity="0.95" />
      {happy ? (
        <path d="M23 26c2 3 8 3 10 0" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      ) : focus ? (
        <path d="M25 27c2 1 5 1 7 0" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M24 26c1.5 2 6.5 2 8 0" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );
}

export default function Cursor() {
  const [mood, setMood] = useState<Mood>("hi");
  const [line, setLine] = useState("Hi — I’m Business Rilo. Scroll, and I’ll react.");
  const [open, setOpen] = useState(true);
  const [pos, setPos] = useState({ x: -1, y: -1 }); // -1 = use CSS default corner
  const drag = useRef<{ ox: number; oy: number; px: number; py: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // default bottom-right
    setPos({
      x: Math.max(16, window.innerWidth - 200),
      y: Math.max(16, window.innerHeight - 220),
    });
  }, []);

  // React to scroll / visible sections (Codex-pet style context)
  useEffect(() => {
    if (!mounted) return;

    const pickFromScroll = () => {
      const mid = window.innerHeight * 0.35;
      const nodes = document.querySelectorAll("h1, h2, h3, [id]");
      let best: { mood: Mood; line: string; score: number } | null = null;

      nodes.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top > window.innerHeight || r.bottom < 0) return;
        const dist = Math.abs(r.top - mid);
        const text = (el.textContent || "") + " " + (el.id || "");
        for (const rule of SCROLL_LINES) {
          if (rule.test.test(text)) {
            const score = 1000 - dist;
            if (!best || score > best.score) best = { mood: rule.mood, line: rule.line, score };
          }
        }
        if (el.id === "demo") {
          const score = 1200 - dist;
          if (!best || score > best.score)
            best = { mood: "demo", line: "Simulated path — approval before anything sends.", score };
        }
      });

      if (window.scrollY < 120) {
        setMood("hi");
        setLine("Know what needs attention. Explore Flow with me.");
        return;
      }
      if (best) {
        setMood(best.mood);
        setLine(best.line);
      }
    };

    pickFromScroll();
    window.addEventListener("scroll", pickFromScroll, { passive: true });
    return () => window.removeEventListener("scroll", pickFromScroll);
  }, [mounted]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-rilo-no-drag]")) return;
    const el = rootRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    drag.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y, px: pos.x, py: pos.y };
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current) return;
    const nx = e.clientX - drag.current.ox;
    const ny = e.clientY - drag.current.oy;
    const maxX = window.innerWidth - 160;
    const maxY = window.innerHeight - 180;
    setPos({
      x: Math.min(maxX, Math.max(8, nx)),
      y: Math.min(maxY, Math.max(8, ny)),
    });
  }, []);

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  const onTap = () => {
    const reactions: { mood: Mood; line: string }[] = [
      { mood: "wave", line: "Still here — drag me anywhere you like." },
      { mood: "flow", line: "Understand → Detect → Decide → Act → Verify." },
      { mood: "trust", line: "I don’t send anything without a human OK." },
      { mood: "demo", line: "Try the product demo steps on this page." },
    ];
    const r = reactions[Math.floor(Math.random() * reactions.length)];
    setMood(r.mood);
    setLine(r.line);
    setOpen(true);
  };

  if (!mounted || pos.x < 0) return null;

  return (
    <div
      ref={rootRef}
      className={`rilo-widget rilo-mood-${mood}`}
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="complementary"
      aria-label="Business Rilo companion"
    >
      <div className="rilo-orbit" aria-hidden>
        <span className="rilo-dot d1" />
        <span className="rilo-dot d2" />
        <span className="rilo-dot d3" />
      </div>

      <button
        type="button"
        className="rilo-avatar"
        onClick={onTap}
        data-rilo-no-drag
        aria-label="Talk to Business Rilo"
      >
        <RiloSVG mood={mood} />
      </button>

      {open && (
        <div className="rilo-bubble" data-rilo-no-drag>
          <p>{line}</p>
          <div className="rilo-actions">
            <a href="/contact" data-rilo-no-drag>
              Contact
            </a>
            <a href="#demo" data-rilo-no-drag>
              Demo
            </a>
            <button type="button" onClick={() => setOpen(false)} data-rilo-no-drag>
              Hide
            </button>
          </div>
        </div>
      )}

      {!open && (
        <button type="button" className="rilo-show" onClick={() => setOpen(true)} data-rilo-no-drag>
          Rilo
        </button>
      )}

      <p className="rilo-hint">Drag to move · click to chat</p>
    </div>
  );
}
