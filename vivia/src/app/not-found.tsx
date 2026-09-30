import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md px-5 py-16 text-center">
      <p className="font-display text-5xl text-primary">404</p>
      <p className="mt-3 text-ink-2">This page does not exist.</p>
      <Link href="/home" className="mt-6 inline-block font-semibold text-primary">VIVIA →</Link>
      <p className="mt-4"><Link href="/bathroom" className="font-semibold text-accent">🚻 Find a bathroom</Link></p>
    </main>
  );
}
