import Link from "next/link";
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="mono text-xs text-sage">404</p>
      <h1 className="fraunces mt-4 text-4xl font-bold text-[#FAFAF8]">Page not found</h1>
      <Link href="/" className="mt-8 rounded-full bg-lime px-6 py-3 text-sm font-medium text-black">Back home</Link>
    </main>
  );
}
