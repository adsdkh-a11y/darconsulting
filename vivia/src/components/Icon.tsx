/** Stroke icon set (24px grid, 1.8 stroke). Replaces emoji so the UI reads as one system. */
const PATHS = {
  home: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  pulse: "M3 12h4l2-6 4 12 2-6h6",
  mic: "M9 3h6v8a3 3 0 0 1-6 0zM5 11a7 7 0 0 0 14 0M12 18v3",
  pill: "M10.5 3.5a4.5 4.5 0 0 1 6.4 6.4l-7 7a4.5 4.5 0 0 1-6.4-6.4zM7.7 7.7l6.6 6.6",
  file: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4",
  wc: "M8 8.5v5.5M5.5 21 8 14l2.5 7M16 8.5v5.5M14 14h4l-2 7zM8 3.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM16 3.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6z",
  flask: "M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3",
  scope: "M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM20 20l-4.2-4.2",
  bed: "M4 20V6M4 14h16v6M20 14v-2a3 3 0 0 0-3-3h-6v5",
  hospital: "M4 21V7l8-4 8 4v14M9 21v-6h6v6M12 8v4M10 10h4",
  trend: "M3 17l6-6 4 4 8-9M15 6h6v6",
  scale: "M12 3v18M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z",
  plane: "M2 13l20-8-5 16-4-7-7-1zM13 14l9-9",
  train: "M7 3h10a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2zM5 11h14M8 21l2-3M16 21l-2-3",
  lock: "M7 10h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM8 10V7a4 4 0 0 1 8 0v3",
  alert: "M12 3l10 18H2zM12 10v5M12 18h.01",
  clipboard: "M9 4h6v3H9zM7 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1M8 12h8M8 16h5",
  card: "M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 10h18M7 15h4",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  share: "M12 15V3M8 7l4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6",
  flag: "M5 21V4M5 4h11l-2 4 2 4H5",
  pencil: "M4 20h4L19 9l-4-4L4 16z",
  x: "M6 6l12 12M18 6L6 18",
  food: "M6 3v8a2 2 0 0 0 4 0V3M8 11v10M17 3c-2 1-3 3-3 6s1 4 3 4v8",
  download: "M12 3v12M8 11l4 4 4-4M5 21h14",
  refresh: "M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5",
  bandage: "M8 8l8 8M5 11l6-6a3.5 3.5 0 0 1 5 5l-6 6a3.5 3.5 0 0 1-5-5z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  building: "M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M15 10h3a1 1 0 0 1 1 1v10M9 8h2M9 12h2M9 16h2M3 21h18",
  bedh: "M3 18V8M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5",
  phone: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2",
  print: "M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  wheelchair: "M9 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9 8v6h6l3 5M9 11h5M6 13a5 5 0 1 0 8 5",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = "size-[22px]" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={PATHS[name]} />
    </svg>
  );
}

const DOC_ICON: Record<string, IconName> = { COLONOSCOPY: "scope", HISTOLOGY: "flask", MRI: "file", CT: "file", ULTRASOUND: "file", BLOOD_TEST: "flask", CALPROTECTIN: "flask", PRESCRIPTION: "pill", DISCHARGE_LETTER: "hospital", SURGERY_REPORT: "hospital" };
export const docIcon = (type: string): IconName => DOC_ICON[type] ?? "file";
