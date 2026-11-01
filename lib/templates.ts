export const TEMPLATES = [
  { id: "real-estate", name: "Real Estate", for: "Agencies, brokers, property teams", pages: "Home, Listings, Property, About, Contact", bg: "#0b0f0c", ac: "#D4FF32", layout: "hero" as const },
  { id: "service", name: "Service", for: "HVAC, clinics, local trades", pages: "Home, Services, Booking, About, Contact", bg: "#111714", ac: "#8A9A8B", layout: "split" as const },
  { id: "agency", name: "Agency", for: "Marketing and creative studios", pages: "Home, Work, Services, About, Contact", bg: "#0F1311", ac: "#D4FF32", layout: "grid" as const },
  { id: "saas", name: "SaaS", for: "Product and software teams", pages: "Home, Features, Pricing, Docs, Contact", bg: "#050706", ac: "#A78BFA", layout: "hero" as const },
  { id: "local", name: "Local", for: "Cafés, shops, neighbourhood brands", pages: "Home, Menu or Catalogue, Location, Contact", bg: "#F7F5F0", ac: "#050706", layout: "grid" as const },
  { id: "portfolio", name: "Portfolio", for: "Founders and consultants", pages: "Home, About, Work, Writing, Contact", bg: "#0A0E0B", ac: "#D4FF32", layout: "split" as const },
] as const;

export const PRICING = [
  {
    id: "starter",
    name: "Starter",
    tagline: "One business. Core lead + inbox flow.",
    was: 990,
    now: 490,
    period: "one-time install",
    popular: false,
    features: [
      "Lead Flow install (capture → score → route)",
      "Omni Flow: WhatsApp + one extra channel",
      "Basic reply templates you approve",
      "1 workspace · founder onboarding call",
      "14-day handover support",
    ],
    compare: "Closest to GHL Starter scope — we install it for you, not a monthly seat.",
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Full desk. Leads, email, social, web.",
    was: 2500,
    now: 1290,
    period: "one-time install",
    popular: true,
    features: [
      "Everything in Starter",
      "Email Engine sequences",
      "Social Autopilot schedule",
      "Web Flow site (template or custom shell)",
      "3 workspaces · priority support",
      "Desk dashboard: pipeline + hot leads",
    ],
    compare: "Closest to GHL Unlimited features — service install, you own the setup.",
  },
  {
    id: "full",
    name: "Full",
    tagline: "Orchestrator + custom automations.",
    was: 4900,
    now: 2490,
    period: "one-time install",
    popular: false,
    features: [
      "Everything in Growth",
      "Your Agent / Orchestrator",
      "Unlimited workspaces",
      "Custom n8n / API automations",
      "You own the code & export",
      "Founder Slack channel",
    ],
    compare: "Closest to GHL Agency Pro depth — without SaaS lock-in.",
  },
] as const;

export const CARE = [
  { name: "Watch", price: 97, note: "Optional monthly: we monitor flows, fix breaks, small changes." },
  { name: "Run", price: 297, note: "Optional monthly: active ops, new sequences, channel tuning." },
  { name: "Scale", price: 497, note: "Optional monthly: multi-business desk, priority builds." },
] as const;

export const WORK = [
  { title: "Brick & Build", desc: "Real estate · more booked viewings, fewer missed enquiries", live: "Lead + Omni Flow" },
  { title: "Lead desk", desc: "WhatsApp → score → reply in under a minute when hot", live: "Lead Flow" },
  { title: "Web Flow", desc: "Template → brand → live site connected to the rest of the flow", live: "Web Flow" },
  { title: "Agency inbox", desc: "One place for client messages across channels", live: "Omni Flow" },
] as const;

export const PROCESS = [
  { n: "01", title: "Notice", body: "We map how leads arrive, who replies, and what repeats." },
  { n: "02", title: "Peek", body: "You get a clear proposal: which flows, what desk looks like, timeline." },
  { n: "03", title: "Hello", body: "We install. You approve templates and scoring rules." },
  { n: "04", title: "Resolve", body: "Handover in about 14 days. People stay in control of every approval." },
] as const;
