import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
export const metadata: Metadata = { title: "Contact — Renolt Flow" };
export default function Contact() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <h1 className="fraunces text-5xl font-bold text-[#FAFAF8]">Contact</h1>
      <p className="mb-8 mt-4 text-ceramic/70">Tell us about your business and which flows interest you.</p>
      <ContactForm />
    </main>
  );
}
