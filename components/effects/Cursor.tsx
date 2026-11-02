"use client";
import { useEffect, useRef, useState } from "react";
import Rilo3D, { type Rilo3DActivity } from "./Rilo3D";

type Activity = Rilo3DActivity;

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
  { test: /hello|hi|hey|who are you/i, reply: "Business Rilo — 3D desk companion for Renolt Flow." },
  { test: /hide|go away|sleep/i, reply: "Hiding the desk. Open the chip anytime." },
];

function replyTo(q: string) {
  const t = q.trim();
  if (!t) return "Ask about leads, omni, pricing, demo, or approvals.";
  for (const f of FAQ) if (f.test.test(t)) return f.reply;
  return "I can cover Flow outcomes, leads, omni, pricing, and the demo — or send you to Contact.";
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

  useEffect(() => {
    if (!mounted || hidden) return;
    const cycle = () => {
      if (userBusy.current) return;
      const next = ACTIVITIES[Math.floor(Math.random() * (ACTIVITIES.length - 1))];
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

      <div className="rilo-seat">
        <Rilo3D activity={activity} size={148} />
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
