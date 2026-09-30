"use client";
import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-md px-5 py-16 text-center">
      <p className="font-display text-3xl">Something went wrong.</p>
      <p className="mt-2 text-ink-2">Your data is safe. Please try again.</p>
      <button onClick={reset} className="tap mt-6 rounded-2xl bg-primary px-5 font-semibold text-primary-ink">Try again</button>
      <p className="mt-4"><Link href="/bathroom" className="font-semibold text-accent">Find a bathroom</Link></p>
    </main>
  );
}
