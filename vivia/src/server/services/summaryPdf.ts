import PDFDocument from "pdfkit";
import type { SummaryContent } from "./summary";

const INK = "#1f2a2e";
const MUTED = "#5b6b70";
const ACCENT = "#2f6f62";

/** Render a Care Summary snapshot as a PDF (standard fonts only, no external assets). */
export function renderSummaryPdf(c: SummaryContent): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48, info: { Title: "VIVIA Care Summary", Author: "VIVIA" } });
    const chunks: Buffer[] = [];
    doc.on("data", (b: Buffer) => chunks.push(b));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const h = (t: string) => {
      doc.moveDown(0.8).fillColor(ACCENT).font("Helvetica-Bold").fontSize(13).text(t).moveDown(0.2).fillColor(INK).font("Helvetica").fontSize(10);
    };
    const line = (t: string) => doc.text(t, { lineGap: 2 });
    const muted = (t: string) => doc.fillColor(MUTED).text(t).fillColor(INK);

    doc.fillColor(ACCENT).font("Helvetica-Bold").fontSize(20).text("VIVIA Care Summary");
    doc.fillColor(INK).font("Helvetica").fontSize(10);
    line(`${c.patient.displayName}${c.patient.disease ? ` · ${c.patient.disease.replace(/_/g, " ").toLowerCase()}` : ""}${c.patient.diagnosedYear ? ` (since ${c.patient.diagnosedYear})` : ""}${c.patient.hasStoma ? " · lives with a stoma" : ""}`);
    muted(`${c.basedOn} Generated ${c.generatedAt.slice(0, 10)}.`);

    if (c.overview) {
      h("Overview");
      line(c.overview);
    }
    if (c.concerns) {
      h("What I want to discuss");
      line(c.concerns);
    }
    if (c.symptoms) {
      h("Since my last appointment — symptoms");
      const a = c.symptoms.averages;
      line(`Days logged: ${c.symptoms.daysLogged}`);
      if (a.bowelMovements !== null) line(`Average bowel movements per logged day: ${a.bowelMovements}`);
      if (a.pain !== null) line(`Average abdominal pain (0–10): ${a.pain}`);
      if (a.fatigue !== null) line(`Average fatigue (0–10): ${a.fatigue}`);
      line(`Days with blood reported: ${c.symptoms.daysWithBlood} · Days with marked urgency: ${c.symptoms.daysWithUrgency}`);
      for (const ch of c.symptoms.changes) line(`• ${ch}`);
    }
    if (c.trends?.bowelMovements.length) {
      h("Trend — bowel movements per day");
      chart(doc, c.trends.bowelMovements);
    }
    if (c.wellbeing && c.wellbeing.daysWithMood > 0) {
      h("Well-being (as rated by the patient)");
      line(`Mood logged on ${c.wellbeing.daysWithMood} day(s): average ${c.wellbeing.avgMood ?? "–"}/10 (0 = low, 10 = good) · days rated 3 or below: ${c.wellbeing.lowMoodDays}`);
      if (c.wellbeing.avgStress !== null) line(`Average stress (0–10): ${c.wellbeing.avgStress}`);
      if (c.wellbeing.moodChange) line(`• ${c.wellbeing.moodChange}`);
      muted("Self-rated scores; not a screening or a diagnosis.");
    }
    if (c.medications) {
      h("Current treatment");
      if (!c.medications.length) line("No active medication recorded.");
      for (const m of c.medications)
        line(`• ${m.name} — ${m.dose}, ${m.schedule}, ${m.route}${m.since ? `, since ${m.since}` : ""}${m.verification === "NEEDS_DOCTOR_CONFIRMATION" ? " (patient asks to confirm with doctor)" : ""}`);
    }
    if (c.adherence?.length) {
      h("Treatment adherence (as recorded by the patient)");
      for (const a of c.adherence) {
        line(`• ${a.name}: ${a.taken} taken, ${a.delayed} delayed, ${a.skipped} skipped${a.expected !== null ? ` (about ${a.expected} expected)` : ""}`);
        for (const r of a.reasons) muted(`   "${r}"`);
      }
    }
    if (c.labs?.length) {
      h("Laboratory results");
      for (const l of c.labs) line(`• ${l.date} — ${l.name}: ${l.value}${l.source === "DOCUMENT_EXTRACTION" ? " (from document)" : ""}`);
    }
    if (c.procedures?.length) {
      h("Procedures");
      for (const p of c.procedures) {
        line(`• ${p.date} — ${p.type.toLowerCase()}`);
        if (p.findings) muted(`   ${p.findings.slice(0, 500)}`);
      }
    }
    if (c.events?.length) {
      h("Hospital / urgent events");
      for (const e of c.events) line(`• ${e.date} — ${e.title}${e.description ? `: ${e.description}` : ""}`);
    }
    if (c.documents?.length) {
      h("Documents available");
      for (const d of c.documents) line(`• ${d.date ?? "undated"} — ${d.title} (${d.type.toLowerCase().replace(/_/g, " ")})`);
    }
    if (c.questions?.length) {
      h("My questions");
      c.questions.forEach((q, i) => line(`${i + 1}. ${q}`));
    }
    doc.moveDown(1.5);
    doc.fontSize(8);
    muted(c.disclaimer);
    doc.end();
  });
}

function chart(doc: PDFKit.PDFDocument, pts: { day: string; value: number }[]) {
  const x0 = doc.x;
  const y0 = doc.y + 4;
  const w = 480;
  const hgt = 70;
  const max = Math.max(...pts.map((p) => p.value), 1);
  const bw = Math.max(2, Math.min(14, w / pts.length - 2));
  doc.save();
  doc.strokeColor("#d8e0de").moveTo(x0, y0 + hgt).lineTo(x0 + w, y0 + hgt).stroke();
  pts.forEach((p, i) => {
    const bh = (p.value / max) * hgt;
    doc.rect(x0 + i * (w / pts.length), y0 + hgt - bh, bw, bh).fill(ACCENT);
  });
  doc.restore();
  doc.fillColor(MUTED).fontSize(8).text(`${pts[0].day}`, x0, y0 + hgt + 3).text(`${pts[pts.length - 1].day} · max ${max}`, x0 + w - 120, y0 + hgt + 3, { width: 120, align: "right" });
  doc.x = x0;
  doc.fillColor(INK).fontSize(10).moveDown(0.5);
}
