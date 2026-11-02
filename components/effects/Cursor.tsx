"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Mood = "ready" | "explain" | "demo" | "trust" | "flow" | "hi" | "wave" | "think" | "listen";

const SCROLL_LINES: { test: RegExp; mood: Mood; line: string }[] = [
  { test: /problem|stalled/i, mood: "explain", line: "Owners miss what is stalled. Flow surfaces it." },
  { test: /understand|detect|decide|outcome cycle/i, mood: "flow", line: "Goal → detect → decide → act → verify." },
  { test: /approval|trust|evidence|permission/i, mood: "trust", line: "Sensitive steps wait for a person." },
  { test: /orchestrator|lead|omni|capabilities/i, mood: "explain", line: "Orchestrators support outcomes — not the whole brand." },
  { test: /get started|contact|verified action/i, mood: "wave", line: "Ready when you are. Ask me anything about Flow." },
];

const FAQ: { test: RegExp; mood: Mood; line: string }[] = [
  { test: /price|cost|pricing|how much/i, mood: "explain", line: "See Pricing for founder install tiers. Happy to walk through what fits." },
  { test: /lead|follow.?up|enquiry|inquiry/i, mood: "flow", line: "Lead recovery: detect stalled enquiries → propose follow-ups → you approve → evidence." },
  { test: /omni|whatsapp|instagram|facebook|inbox/i, mood: "explain", line: "Omni brings channels together with suggested replies — humans still approve sends." },
  { test: /demo|try|show me/i, mood: "demo", line: "Open the product demo on this page — it’s labelled simulated until a live engine is connected." },
  { test: /approval|safe|security|permission/i, mood: "trust", line: "Consequential actions can wait for approval. The backend is the real authority, not this UI." },
  { test: /how.*(work|flow)|what is renolt|outcome/i, mood: "flow", line: "Understand → Detect → Decide → Act → Verify → Improve. That’s the product story." },
  { test: /contact|talk|human|call|whatsapp/i, mood: "wave", line: "Use Contact or Get started — a person on our side will pick it up." },
  { test: /hello|hi|hey|who are you/i, mood: "hi", line: "I’m Business Rilo — companion for Renolt Flow. Ask about leads, omni, pricing, or the demo." },
  { test: /follow|cursor|move with/i, mood: "wave", line: "Tap Follow me and I’ll trail your pointer. Stay put keeps me parked." },
];

function answerQuestion(q: string): { mood: Mood; line: string } {
  const t = q.trim();
  if (!t) return { mood: "listen", line: "Type a question — pricing, leads, omni, demo, approvals…" };
  for (const f of FAQ) {
    if (f.test.test(t)) return { mood: f.mood, line: f.line };
  }
  return {
    mood: "explain",
    line: "I can help with Flow outcomes, leads, omni, pricing, and the demo. Or use Contact for a human.",
  };
}

function RiloSVG({ mood }: { mood: Mood }) {
  const happy = mood === "hi" || mood === "wave" || mood === "demo";
  const focus = mood === "explain" || mood === "flow" || mood === "trust" || mood === "think";
  const listen = mood === "listen";
  return (
    <svg width="112" height="128" viewBox="0 0 56 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <ellipse cx="28" cy="60" rx="14" ry="3" fill="rgba(0,0,0,0.22)" />
      <ellipse cx="22" cy="54" rx="5" ry="6" fill="#F5F2EC" />
      <ellipse cx="34" cy="54" rx="5" ry="6" fill="#F5F2EC" />
      <ellipse cx="28" cy="42" rx="14" ry="16" fill="#FAF8F4" />
      <path d="M14 38c0-2 2-6 6-8 2 6 6 9 8 10 2-1 6-4 8-10 4 2 6 6 6 8v10c0 4-4 8-14 8s-14-4-14-8V38z" fill="#5B6B7C" />
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
      <ellipse cx="22" cy="20" rx="3.4" ry={focus ? 2.6 : listen ? 4 : 3.8} fill="#1a1a1a" />
      <ellipse cx="34" cy="20" rx="3.4" ry={focus ? 2.6 : listen ? 4 : 3.8} fill="#1a1a1a" />
      <circle cx="23.2" cy="18.6" r="1.1" fill="white" opacity="0.95" />
      <circle cx="35.2" cy="18.6" r="1.1" fill="white" opacity="0.95" />
      {mood === "think" ? (
        <circle cx="28" cy="27" r="1.6" fill="#1a1a1a" />
      ) : happy ? (
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
  const [line, setLine] = useState("Hi — ask me anything about Renolt Flow.");
  const [open, setOpen] = useState(true);
  const [follow, setFollow] = useState(false);
  const [q, setQ] = useState("");
  const [pos, setPos] = useState({ x: -1, y: -1 });
  const drag = useRef<{ ox: number; oy: number } | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const followRef = useRef(false);
  const scrollPaused = useRef(false);

  useEffect(() => {
    setMounted(true);
    const x = Math.max(16, window.innerWidth - 220);
    const y = Math.max(16, window.innerHeight - 280);
    setPos({ x, y });
    current.current = { x, y };
    target.current = { x, y };
  }, []);

  useEffect(() => {
    followRef.current = follow;
  }, [follow]);

  // Smooth follow when enabled (cursor-like, Muse trail)
  useEffect(() => {
    if (!mounted) return;
    const onMove = (e: MouseEvent) => {
      if (!followRef.current) return;
      target.current = { x: e.clientX + 18, y: e.clientY + 14 };
    };
    const tick = () => {
      if (followRef.current) {
        const LERP = 0.1;
        current.current.x += (target.current.x - current.current.x) * LERP;
        current.current.y += (target.current.y - current.current.y) * LERP;
        setPos({ x: current.current.x, y: current.current.y });
      }
      raf.current = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
    };
  }, [mounted]);

  // Section awareness when not in follow + not chatting
  useEffect(() => {
    if (!mounted) return;
    const pick = () => {
      if (followRef.current || scrollPaused.current) return;
      const mid = window.innerHeight * 0.35;
      let best: { mood: Mood; line: string; score: number } | null = null;
      document.querySelectorAll("h1, h2, h3, [id]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top > window.innerHeight || r.bottom < 0) return;
        const dist = Math.abs(r.top - mid);
        const text = `${el.textContent || ""} ${el.id || ""}`;
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
        setLine("Ask me anything — or turn on Follow me to trail your pointer.");
        return;
      }
      if (best) {
        setMood(best.mood);
        setLine(best.line);
      }
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    return () => window.removeEventListener("scroll", pick);
  }, [mounted]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (follow || (e.target as HTMLElement).closest("[data-rilo-no-drag]")) return;
      rootRef.current?.setPointerCapture(e.pointerId);
      drag.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y };
    },
    [follow, pos]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag.current || follow) return;
      const nx = Math.min(window.innerWidth - 170, Math.max(8, e.clientX - drag.current.ox));
      const ny = Math.min(window.innerHeight - 200, Math.max(8, e.clientY - drag.current.oy));
      setPos({ x: nx, y: ny });
      current.current = { x: nx, y: ny };
      target.current = { x: nx, y: ny };
    },
    [follow]
  );

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  const ask = (text?: string) => {
    const query = (text ?? q).trim();
    if (!query) return;
    scrollPaused.current = true;
    setMood("think");
    setLine("Thinking…");
    setOpen(true);
    window.setTimeout(() => {
      const a = answerQuestion(query);
      setMood(a.mood);
      setLine(a.line);
      setQ("");
      window.setTimeout(() => {
        scrollPaused.current = false;
      }, 8000);
    }, 450);
  };

  const toggleFollow = () => {
    setFollow((f) => {
      const next = !f;
      if (next) {
        setMood("wave");
        setLine("Following you — move the pointer. Turn off anytime.");
      } else {
        setMood("ready");
        setLine("Parked. Drag me, or ask a question.");
        current.current = { ...pos };
        target.current = { ...pos };
      }
      return next;
    });
    setOpen(true);
  };

  if (!mounted || pos.x < 0) return null;

  return (
    <div
      ref={rootRef}
      className={`rilo-widget rilo-mood-${mood}${follow ? " rilo-following" : ""}`}
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
        data-rilo-no-drag
        aria-label="Focus Business Rilo"
        onClick={() => {
          setOpen(true);
          setMood("listen");
          setLine("I’m listening — type a question below.");
        }}
      >
        <RiloSVG mood={mood} />
      </button>

      {open && (
        <div className="rilo-bubble" data-rilo-no-drag>
          <p>{line}</p>
          <form
            className="rilo-ask"
            onSubmit={(e) => {
              e.preventDefault();
              ask();
            }}
          >
            <input
              data-rilo-no-drag
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => {
                setMood("listen");
                scrollPaused.current = true;
              }}
              placeholder="Ask anything…"
              aria-label="Ask Business Rilo"
            />
            <button type="submit" data-rilo-no-drag>
              Ask
            </button>
          </form>
          <div className="rilo-actions">
            <button type="button" onClick={toggleFollow} data-rilo-no-drag>
              {follow ? "Stay put" : "Follow me"}
            </button>
            <a href="/contact" data-rilo-no-drag>
              Contact
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

      <p className="rilo-hint">{follow ? "Following pointer" : "Drag · Follow me · Ask"}</p>
    </div>
  );
}
