"use client";
import { useEffect, useState } from "react";
import { Card } from "./ui";

const KEY = "vivia.travelChecklist";

export function TravelChecklist({ items }: { items: { key: string; label: string }[] }) {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch {} }, []);
  const toggle = (k: string) => {
    const next = done.includes(k) ? done.filter((x) => x !== k) : [...done, k];
    setDone(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };
  return (
    <Card className="py-1">
      {items.map((i) => (
        <label key={i.key} className="tap flex items-center gap-3 border-b border-line py-2 last:border-0">
          <input type="checkbox" className="size-6 shrink-0 accent-[var(--primary)]" checked={done.includes(i.key)} onChange={() => toggle(i.key)} />
          <span className={done.includes(i.key) ? "text-muted line-through" : ""}>{i.label}</span>
        </label>
      ))}
    </Card>
  );
}
