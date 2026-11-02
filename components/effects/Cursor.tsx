"use client";
import { useEffect, useRef, useState } from "react";

type Activity = "idle" | "type" | "think" | "read" | "wave" | "sleep";

const ACTIVITIES: { id: Activity; label: string; screen: string }[] = [
  { id: "idle", label: "At desk", screen: "Renolt Flow · ready" },
  { id: "type", label: "Working", screen: "Drafting next action…" },
  { id: "think", label: "Thinking", screen: "Weighing options…" },
  { id: "read", label: "Reviewing", screen: "Evidence log open" },
  { id: "wave", label: "Hello", screen: "Need a hand?" },
  { id: "sleep", label: "Resting", screen: "zzz · click to wake" },
];

const FAQ: { test: RegExp; reply: string }[] = [
  { test: /price|cost|pricing|how much/i, reply: "Founder pricing is on the Pricing page — install once, optional care." },
  { test: /lead|follow.?up|enquiry|inquiry/i, reply: "Lead path: detect stalled → propose follow-up → you approve → evidence." },
  { test: /omni|whatsapp|instagram|facebook|inbox/i, reply: "Omni unifies channels; suggested replies still need human OK." },
  { test: /demo|try|show/i, reply: "Scroll to the product demo — labelled simulated until a live engine is connected." },
  { test: /approval|safe|security|permission/i, reply: "Sensitive steps can wait for approval. Backend is the real gate." },
  { test: /how.*(work|flow)|what is|outcome/i, reply: "Understand → Detect → Decide → Act → Verify → Improve." },
  { test: /contact|talk|human|call/i, reply: "Use Contact / Get started — a person will respond." },
  { test: /hello|hi|hey|who are you/i, reply: "Business Rilo — I sit at this desk and help explain Flow." },
  { test: /hide|go away|sleep/i, reply: "Hiding the desk. Open the chip anytime." },
];

function replyTo(q: string) {
  const t = q.trim();
  if (!t) return "Ask about leads, omni, pricing, demo, or approvals.";
  for (const f of FAQ) if (f.test.test(t)) return f.reply;
  return "I can cover Flow outcomes, leads, omni, pricing, and the demo — or send you to Contact.";
}

function Rilo({ activity }: { activity: Activity }) {
  const sleepy = activity === "sleep";
  const focus = activity === "think" || activity === "read";
  const happy = activity === "wave";
  return (
    <svg className={`rilo-body rilo-act-${activity}`} width="72" height="80" viewBox="0 0 56 64" fill="none" aria-hidden>
      <ellipse cx="28" cy="60" rx="12" ry="2.5" fill="rgba(0,0,0,0.2)" />
      <ellipse cx="22" cy="54" rx="5" ry="6" fill="#F5F2EC" />
      <ellipse cx="34" cy="54" rx="5" ry="6" fill="#F5F2EC" />
      <ellipse cx="28" cy="42" rx="14" ry="16" fill="#FAF8F4" />
      <path d="M14 38c0-2 2-6 6-8 2 6 6 9 8 10 2-1 6-4 8-10 4 2 6 6 6 8v10c0 4-4 8-14 8s-14-4-14-8V38z" fill="#5B6B7C" />
      <g className="rilo-arm-l">
        <ellipse cx="12" cy="40" rx="5" ry="7" fill="#FAF8F4" transform="rotate(-15 12 40)" />
      </g>
      <g className="rilo-arm-r">
        <ellipse cx="44" cy="38" rx="5" ry="8" fill="#FAF8F4" transform="rotate(20 44 38)" />
      </g>
      <ellipse cx="28" cy="20" rx="16" ry="15" fill="#FAF8F4" />
      <path d="M36 8c8-2 14 4 12 12-1 4-4 6-8 6 2-4 1-10-4-14z" fill="#FAF8F4" />
      <ellipse cx="44" cy="14" rx="5" ry="6" fill="#6B7C8F" transform="rotate(25 44 14)" />
      {sleepy ? (
        <>
          <path d="M18 20h8" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M30 20h8" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="22" cy="20" rx="3.2" ry={focus ? 2.4 : 3.6} fill="#1a1a1a" />
          <ellipse cx="34" cy="20" rx="3.2" ry={focus ? 2.4 : 3.6} fill="#1a1a1a" />
          <circle cx="23" cy="18.6" r="1" fill="#fff" opacity="0.95" />
          <circle cx="35" cy="18.6" r="1" fill="#fff" opacity="0.95" />
        </>
      )}
      {happy ? (
        <path d="M23 26c2 3 8 3 10 0" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      ) : sleepy ? (
        <path d="M25 27c2 .8 4 .8 6 0" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      ) : focus ? (
        <path d="M25 27c2 1 5 1 7 0" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M24 26c1.5 2 6.5 2 8 0" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );
}

export default function Cursor() {
  const [hidden, setHidden] = useState(false);
  const [panel, setPanel] = useState(true);
  const [activity, setActivity] = useState<Activity>("idle");
  const [screen, setScreen] = useState("Renolt Flow · ready");
  const [chat, setChat] = useState("I’m at my desk. Ask about Flow, or let me work.");
  const [q, setQ] = useState("");
  const [mounted, setMounted] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userBusy = useRef(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem("rilo-hidden") === "1") setHidden(true);
    } catch {
      /* ignore */
    }
  }, []);

  // Autonomous desk activities (Codex-pet style)
  useEffect(() => {
    if (!mounted || hidden) return;
    const cycle = () => {
      if (userBusy.current) return;
      const next = ACTIVITIES[Math.floor(Math.random() * (ACTIVITIES.length - 1))]; // avoid sleep mostly
      setActivity(next.id);
      setScreen(next.screen);
    };
    autoRef.current = setInterval(cycle, 7000);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [mounted, hidden]);

  const hide = () => {
    setHidden(true);
    setActivity("sleep");
    try {
      localStorage.setItem("rilo-hidden", "1");
    } catch {
      /* ignore */
    }
  };

  const show = () => {
    setHidden(false);
    setPanel(true);
    setActivity("wave");
    setScreen("Back at the desk");
    setChat("Welcome back. What do you need?");
    try {
      localStorage.setItem("rilo-hidden", "0");
    } catch {
      /* ignore */
    }
  };

  const setAct = (id: Activity) => {
    userBusy.current = true;
    const a = ACTIVITIES.find((x) => x.id === id)!;
    setActivity(id);
    setScreen(a.screen);
    window.setTimeout(() => {
      userBusy.current = false;
    }, 5000);
  };

  const ask = () => {
    const query = q.trim();
    if (!query) return;
    userBusy.current = true;
    setActivity("think");
    setScreen("Thinking…");
    setChat("…");
    window.setTimeout(() => {
      const r = replyTo(query);
      if (/hide|go away|sleep/i.test(query)) {
        setChat(r);
        window.setTimeout(hide, 600);
        return;
      }
      setActivity("read");
      setScreen("Answer ready");
      setChat(r);
      setQ("");
      window.setTimeout(() => {
        userBusy.current = false;
      }, 6000);
    }, 500);
  };

  if (!mounted) return null;

  if (hidden) {
    return (
      <button type="button" className="rilo-chip-show" onClick={show} aria-label="Show Business Rilo desk">
        <span className="rilo-chip-dot" />
        Rilo desk
      </button>
    );
  }

  return (
    <aside className={`rilo-desk rilo-act-${activity}`} aria-label="Business Rilo desk">
      {/* Mini computer */}
      <div className="rilo-pc">
        <div className="rilo-pc-bezel">
          <div className="rilo-pc-screen">
            <div className="rilo-pc-bar">
              <span /><span /><span />
              <em>rilo://desk</em>
            </div>
            <p className="rilo-pc-line">{screen}</p>
            <div className="rilo-pc-meter" aria-hidden>
              <i style={{ width: activity === "type" ? "72%" : activity === "think" ? "45%" : "28%" }} />
            </div>
          </div>
        </div>
        <div className="rilo-pc-base" />
      </div>

      {/* Character at desk */}
      <div className="rilo-seat">
        <Rilo activity={activity} />
      </div>

      {panel && (
        <div className="rilo-panel">
          <div className="rilo-panel-head">
            <strong>Business Rilo</strong>
            <span>{ACTIVITIES.find((a) => a.id === activity)?.label}</span>
          </div>
          <p className="rilo-panel-chat">{chat}</p>
          <form
            className="rilo-panel-ask"
            onSubmit={(e) => {
              e.preventDefault();
              ask();
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ask anything…"
              aria-label="Ask Rilo"
            />
            <button type="submit">Ask</button>
          </form>
          <div className="rilo-panel-acts">
            {(["type", "think", "read", "wave"] as Activity[]).map((id) => (
              <button key={id} type="button" onClick={() => setAct(id)}>
                {ACTIVITIES.find((a) => a.id === id)?.label}
              </button>
            ))}
          </div>
          <div className="rilo-panel-foot">
            <a href="/contact">Contact</a>
            <a href="#demo">Demo</a>
            <button type="button" onClick={() => setPanel(false)}>
              Minimize
            </button>
            <button type="button" onClick={hide}>
              Hide desk
            </button>
          </div>
        </div>
      )}

      {!panel && (
        <button type="button" className="rilo-mini" onClick={() => setPanel(true)}>
          Open desk
        </button>
      )}
    </aside>
  );
}
