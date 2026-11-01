"use client";
import { useRef, useState } from "react";
import { TEMPLATES } from "@/lib/templates";
import TemplatePreview from "@/components/ui/TemplatePreview";
import TiltCard from "@/components/ui/TiltCard";
import ContactForm from "@/components/ContactForm";
export default function WebFlowPicker() {
  const [sel, setSel] = useState("");
  const form = useRef<HTMLDivElement>(null);
  const choose = (name: string) => { setSel(name); form.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  return (
    <>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <TiltCard key={t.id} className={`rounded-2xl p-5 ${sel === t.name ? "!border-lime" : ""}`}>
            <TemplatePreview bg={t.bg} ac={t.ac} layout={t.layout} />
            <h3 className="fraunces mt-5 text-2xl font-bold">{t.name}</h3>
            <p className="mt-1 text-sm text-ceramic/70">For: {t.for}</p>
            <p className="mt-1 text-xs text-sage">Pages: {t.pages}</p>
            <button onClick={() => choose(t.name)} className="mt-5 rounded-full bg-lime px-5 py-2 text-sm font-medium text-black">{sel === t.name ? "Selected ✓" : "Choose this template"}</button>
          </TiltCard>
        ))}
      </div>
      <div ref={form} className="mx-auto mt-24 max-w-xl scroll-mt-24">
        <h2 className="fraunces text-3xl font-bold text-[#FAFAF8]">Request your site</h2>
        <p className="mb-6 mt-2 text-ceramic/70">Pick a template above, or leave it on custom and describe what you need.</p>
        <ContactForm options={TEMPLATES.map((t) => t.name)} template={sel} onTemplate={setSel} />
      </div>
    </>
  );
}
