/**
 * Single-series charts (no legend needed: the title names the series).
 * Mark specs: bars ≤ 24px, 4px rounded data-end, square baseline, 2px gap;
 * 2px lines, ≥8px markers with a 2px surface ring; hairline recessive grid.
 * Colour var(--chart) validated for light and dark surfaces.
 * Every chart ships with a table view and per-mark hover tooltips (<title>).
 */
type Pt = { day: string; value: number };

function niceMax(v: number) {
  if (v <= 5) return 5;
  if (v <= 10) return 10;
  const p = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / p) * p;
}

export function DailyBars({ points, title, band, unit = "", fixedMax }: { points: Pt[]; title: string; band?: { lo: number; hi: number; label: string } | null; unit?: string; fixedMax?: number }) {
  const W = 340, H = 150, L = 26, B = 20, T = 8;
  const max = fixedMax ?? niceMax(Math.max(1, ...points.map((p) => p.value), band?.hi ?? 0));
  const n = Math.max(points.length, 1);
  const slot = (W - L) / n;
  const bw = Math.min(24, Math.max(3, slot - 2));
  const y = (v: number) => T + (H - T - B) * (1 - v / max);
  const r = Math.min(4, bw / 2);
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={title}>
        {[0, max / 2, max].map((g) => (
          <g key={g}>
            <line x1={L} x2={W} y1={y(g)} y2={y(g)} stroke="var(--line)" strokeWidth={1} />
            <text x={L - 6} y={y(g) + 4} textAnchor="end" fontSize="10" fill="var(--muted)">{Math.round(g)}</text>
          </g>
        ))}
        {band && <rect x={L} width={W - L} y={y(band.hi)} height={Math.max(1, y(band.lo) - y(band.hi))} fill="var(--chart-band)" opacity={0.6}><title>{band.label}</title></rect>}
        {points.map((p, i) => {
          const x = L + i * slot + (slot - bw) / 2;
          const top = y(p.value);
          const h = y(0) - top;
          const rr = Math.min(r, h);
          return (
            <g key={p.day}>
              <rect x={L + i * slot} y={T} width={slot} height={H - T - B} fill="transparent"><title>{`${p.day}: ${p.value}${unit}`}</title></rect>
              {h > 0 && (
                <path pointerEvents="none" fill="var(--chart)"
                  d={`M${x},${y(0)} V${top + rr} Q${x},${top} ${x + rr},${top} H${x + bw - rr} Q${x + bw},${top} ${x + bw},${top + rr} V${y(0)} Z`} />
              )}
            </g>
          );
        })}
        {points.length > 0 && (
          <>
            <text x={L} y={H - 4} fontSize="10" fill="var(--muted)">{points[0].day.slice(5)}</text>
            <text x={W} y={H - 4} fontSize="10" fill="var(--muted)" textAnchor="end">{points[points.length - 1].day.slice(5)}</text>
          </>
        )}
      </svg>
      <DataTable points={points} unit={unit} />
    </figure>
  );
}

export function LineChart({ points, title, unit = "" }: { points: Pt[]; title: string; unit?: string }) {
  const W = 340, H = 140, L = 34, R = 34, B = 20, T = 12;
  const max = niceMax(Math.max(...points.map((p) => p.value), 1));
  const t0 = new Date(points[0].day).getTime();
  const t1 = new Date(points[points.length - 1].day).getTime();
  const x = (d: string) => (t1 === t0 ? (L + W - R) / 2 : L + ((new Date(d).getTime() - t0) / (t1 - t0)) * (W - L - R));
  const y = (v: number) => T + (H - T - B) * (1 - v / max);
  const last = points[points.length - 1];
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={title}>
        {[0, max / 2, max].map((g) => (
          <g key={g}>
            <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke="var(--line)" strokeWidth={1} />
            <text x={L - 6} y={y(g) + 4} textAnchor="end" fontSize="10" fill="var(--muted)">{Math.round(g)}</text>
          </g>
        ))}
        {points.length > 1 && <polyline fill="none" stroke="var(--chart)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" points={points.map((p) => `${x(p.day)},${y(p.value)}`).join(" ")} />}
        {points.map((p) => (
          <g key={p.day}>
            <circle cx={x(p.day)} cy={y(p.value)} r={6} fill="var(--surface)" />
            <circle cx={x(p.day)} cy={y(p.value)} r={4} fill="var(--chart)" />
            <circle cx={x(p.day)} cy={y(p.value)} r={14} fill="transparent"><title>{`${p.day}: ${p.value} ${unit}`}</title></circle>
          </g>
        ))}
        <text x={x(last.day) + 8} y={y(last.value) + 4} fontSize="11" fontWeight="600" fill="var(--ink)">{last.value}</text>
        <text x={L} y={H - 4} fontSize="10" fill="var(--muted)">{points[0].day}</text>
        {points.length > 1 && <text x={W - R} y={H - 4} fontSize="10" fill="var(--muted)" textAnchor="end">{last.day}</text>}
      </svg>
      <DataTable points={points} unit={unit} />
    </figure>
  );
}

function DataTable({ points, unit }: { points: Pt[]; unit: string }) {
  return (
    <details className="mt-1 text-sm">
      <summary className="tap cursor-pointer py-2 text-muted">Table</summary>
      <table className="w-full text-start">
        <tbody>
          {[...points].reverse().map((p) => (
            <tr key={p.day} className="border-b border-line"><td className="py-1 text-muted">{p.day}</td><td className="py-1 text-end tabular-nums">{p.value} {unit}</td></tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
