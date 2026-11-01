"use client";
import { useState, type FormEvent } from "react";
export default function ContactForm({ options, template = "", onTemplate }: { options?: string[]; template?: string; onTemplate?: (v: string) => void }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState("sending");
    const f = new FormData(e.currentTarget);
    const payload: Record<string, string> = {
      name: String(f.get("name") ?? ""),
      email: String(f.get("email") ?? ""),
      company: String(f.get("company") ?? ""),
      message: String(f.get("message") ?? ""),
      honeypot: String(f.get("honeypot") ?? ""),
    };
    if (options) payload.template = template;
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) { setState("ok"); setMsg("Thanks — your message was sent."); (e.target as HTMLFormElement).reset(); }
      else { setState("error"); setMsg(j.error || "Something went wrong."); }
    } catch { setState("error"); setMsg("Network error. Please try again."); }
  }
  const input = "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-lime";
  return (
    <form onSubmit={submit} className="glass space-y-4 rounded-2xl p-8" noValidate>
      <div className="hidden" aria-hidden="true"><input name="honeypot" tabIndex={-1} autoComplete="off" /></div>
      {options && (
        <label className="block text-sm">Template<select value={template} onChange={(e) => onTemplate?.(e.target.value)} className={input}>
          <option value="">Custom request (no template)</option>{options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select></label>
      )}
      <label className="block text-sm">Name<input name="name" required minLength={2} autoComplete="name" className={input} /></label>
      <label className="block text-sm">Email<input name="email" type="email" required autoComplete="email" className={input} /></label>
      <label className="block text-sm">Company<input name="company" required minLength={2} autoComplete="organization" className={input} /></label>
      <label className="block text-sm">Message<textarea name="message" required minLength={10} rows={5} className={input} /></label>
      <button disabled={state === "sending"} className="rounded-full bg-lime px-7 py-3 font-medium text-black disabled:opacity-60">{state === "sending" ? "Sending…" : "Send message"}</button>
      <p role="status" aria-live="polite" className={`text-sm ${state === "error" ? "text-red-400" : "text-lime"}`}>{msg}</p>
    </form>
  );
}
