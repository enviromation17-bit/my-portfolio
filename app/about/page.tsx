import type { Metadata } from "next";
export const metadata: Metadata = { title: "About — Renolt Flow" };
export default function About() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="fraunces text-5xl font-bold text-[#FAFAF8]">About</h1>
      <p className="mt-6 text-lg text-ceramic/80">Renolt Flow is a remote, worldwide service. We install connected workflows for your business so you can focus on running it.</p>
    </main>
  );
}
