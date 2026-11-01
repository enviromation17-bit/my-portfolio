import { NextResponse } from "next/server";
import { LeadSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (!rateLimit(ip)) return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (!hook) return NextResponse.json({ error: "Contact delivery is not configured yet." }, { status: 503 });
  const { honeypot, ...lead } = parsed.data;
  try {
    const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
    if (!r.ok) throw new Error();
  } catch { return NextResponse.json({ error: "Could not deliver your message. Please try again." }, { status: 502 }); }
  return NextResponse.json({ ok: true });
}
