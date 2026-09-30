/**
 * Demo data. EVERYTHING here is fictional: the patient "Anna Rossi", her
 * doctors, her documents and values, and the places (names are prefixed
 * "Demo"). Login: anna.rossi@demo.vivia / vivia-demo-2026
 */
import PDFDocument from "pdfkit";
import { prisma } from "../src/server/db";
import { registerUser } from "../src/server/auth";
import { completeOnboarding } from "../src/server/services/profile";
import { createMedication, logMedicationEvent } from "../src/server/services/medications";
import { logSymptoms } from "../src/server/services/symptoms";
import { uploadDocument, reviewField, applyReviewedFields } from "../src/server/services/documents";
import { createVisit } from "../src/server/services/visits";
import { addClinicalEvent } from "../src/server/services/clinical";
import { saveEmergencyCard } from "../src/server/services/emergency";
import { addDays, todayDay } from "../src/lib/dates";

const EMAIL = "anna.rossi@demo.vivia";
const PASSWORD = "vivia-demo-2026";

function pdf(text: string): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    for (const line of text.split("\n")) doc.text(line);
    doc.end();
  });
}

const eu = (day: string) => day.split("-").reverse().join("/");

// Deterministic pseudo-random so the demo is stable.
let s = 42;
const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);

async function seedLocations() {
  if (await prisma.location.count({ where: { source: "vivia_demo" } })) return;
  const all7 = (open: string, close: string) => [0, 1, 2, 3, 4, 5, 6].map((d) => ({ d, open, close }));
  const week = (open: string, close: string) => [1, 2, 3, 4, 5, 6].map((d) => ({ d, open, close }));
  const base = { source: "vivia_demo", city: "Milano", country: "IT", lastVerifiedAt: new Date("2026-09-01") };
  type F = [string, "VERIFIED" | "COMMUNITY_REPORTED" | "UNVERIFIED"];
  const places: { name: string; category: "BATHROOM" | "PHARMACY" | "HOSPITAL" | "IBD_CENTER" | "AIRPORT" | "STATION" | "HOTEL"; lat: number; lng: number; address?: string; hours?: ReturnType<typeof all7>; openingHours?: string; open24h?: boolean; accessible?: boolean; free?: boolean; ver: "MAP_PROVIDER" | "USER_REPORTED" | "VIVIA_VERIFIED" | "PARTNER_VERIFIED"; features?: F[] }[] = [
    { name: "Demo — Public toilet, Piazza Duomo", category: "BATHROOM", lat: 45.4646, lng: 9.1897, hours: all7("08:00", "20:00"), openingHours: "Daily 08:00–20:00", accessible: true, free: false, ver: "VIVIA_VERIFIED", features: [["accessible", "VERIFIED"], ["sink", "VERIFIED"], ["disposal_bin", "VERIFIED"], ["large_space", "VERIFIED"]] },
    { name: "Demo — Galleria shopping arcade restroom", category: "BATHROOM", lat: 45.4659, lng: 9.19, hours: all7("09:00", "21:00"), openingHours: "Daily 09:00–21:00", accessible: true, free: true, ver: "PARTNER_VERIFIED", features: [["accessible", "VERIFIED"], ["private", "VERIFIED"], ["sink", "VERIFIED"], ["changing_area", "COMMUNITY_REPORTED"]] },
    { name: "Demo — Café Brera (customers & IBD card)", category: "BATHROOM", lat: 45.4719, lng: 9.1878, hours: all7("07:00", "23:00"), openingHours: "Daily 07:00–23:00", accessible: false, free: true, ver: "USER_REPORTED", features: [["private", "COMMUNITY_REPORTED"], ["sink", "COMMUNITY_REPORTED"]] },
    { name: "Demo — Central station toilets", category: "BATHROOM", lat: 45.4852, lng: 9.2045, open24h: true, openingHours: "24/7", accessible: true, free: false, ver: "VIVIA_VERIFIED", features: [["accessible", "VERIFIED"], ["open_24_7", "VERIFIED"], ["disposal_bin", "VERIFIED"], ["sink", "VERIFIED"], ["changing_area", "UNVERIFIED"]] },
    { name: "Demo — Castello park kiosk toilet", category: "BATHROOM", lat: 45.4705, lng: 9.1795, hours: all7("09:00", "19:00"), openingHours: "Daily 09:00–19:00", accessible: true, ver: "MAP_PROVIDER", features: [["accessible", "UNVERIFIED"]] },
    { name: "Demo — Department store, 4th floor", category: "BATHROOM", lat: 45.4637, lng: 9.1925, hours: week("10:00", "21:00"), openingHours: "Mon–Sat 10:00–21:00", accessible: true, free: true, ver: "USER_REPORTED", features: [["accessible", "COMMUNITY_REPORTED"], ["large_space", "COMMUNITY_REPORTED"], ["sink", "COMMUNITY_REPORTED"], ["disposal_bin", "COMMUNITY_REPORTED"]] },
    { name: "Demo — Navigli bar (ask at counter)", category: "BATHROOM", lat: 45.4520, lng: 9.1760, hours: all7("18:00", "02:00"), openingHours: "Daily 18:00–02:00", free: true, ver: "USER_REPORTED" },
    { name: "Demo — Porta Venezia metro toilet", category: "BATHROOM", lat: 45.4745, lng: 9.2050, hours: all7("06:00", "00:00"), openingHours: "Daily 06:00–00:00", accessible: false, free: false, ver: "MAP_PROVIDER" },
    { name: "Demo — Farmacia Duomo", category: "PHARMACY", lat: 45.4640, lng: 9.1915, open24h: true, openingHours: "24/7", ver: "MAP_PROVIDER" },
    { name: "Demo — Farmacia Brera", category: "PHARMACY", lat: 45.4725, lng: 9.1870, hours: week("08:30", "19:30"), openingHours: "Mon–Sat 08:30–19:30", ver: "MAP_PROVIDER" },
    { name: "Demo — Pharmacy at Central station", category: "PHARMACY", lat: 45.4858, lng: 9.2040, hours: all7("07:00", "21:00"), openingHours: "Daily 07:00–21:00", ver: "MAP_PROVIDER" },
    { name: "Demo — City General Hospital (A&E)", category: "HOSPITAL", lat: 45.4580, lng: 9.2080, open24h: true, openingHours: "Emergency department 24/7", ver: "MAP_PROVIDER" },
    { name: "Demo — North University Hospital", category: "HOSPITAL", lat: 45.5100, lng: 9.1900, open24h: true, openingHours: "24/7", ver: "MAP_PROVIDER" },
    { name: "Demo — IBD Centre, Gastroenterology Unit", category: "IBD_CENTER", lat: 45.4585, lng: 9.2090, hours: [1, 2, 3, 4, 5].map((d) => ({ d, open: "08:00", close: "16:00" })), openingHours: "Mon–Fri 08:00–16:00", ver: "PARTNER_VERIFIED" },
    { name: "Demo — Central railway station", category: "STATION", lat: 45.4855, lng: 9.2040, open24h: true, ver: "MAP_PROVIDER" },
    { name: "Demo — City airport", category: "AIRPORT", lat: 45.4490, lng: 9.2780, open24h: true, ver: "MAP_PROVIDER" },
    { name: "Demo — Hotel near the Duomo", category: "HOTEL", lat: 45.4650, lng: 9.1880, open24h: true, ver: "MAP_PROVIDER" },
  ];
  for (const p of places) {
    await prisma.location.create({
      data: {
        ...base, name: p.name, category: p.category, latitude: p.lat, longitude: p.lng, address: p.address, openingHours: p.openingHours,
        hoursJson: p.hours, open24h: p.open24h ?? false, accessible: p.accessible, free: p.free, verificationType: p.ver,
        features: { create: (p.features ?? []).map(([feature, status]) => ({ feature, status })) },
      },
    });
  }
}

async function seedAnna() {
  const existing = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (existing) await prisma.user.delete({ where: { id: existing.id } });
  const user = await registerUser({ email: EMAIL, password: PASSWORD, locale: "en", consentHealthData: true, consentTerms: true });
  const u = user.id;
  await completeOnboarding(u, { displayName: "Anna", disease: "CROHNS", diagnosedYear: 2019, hasStoma: false });
  await prisma.patientProfile.update({ where: { userId: u }, data: { birthYear: 1991, country: "IT" } });
  await prisma.diagnosis.updateMany({ where: { userId: u }, data: { location: "Terminal ileum (patient-reported)" } });

  const today = todayDay();
  const ada = await createMedication(u, { name: "Adalimumab", activeIngredient: "adalimumab", dose: 40, unit: "mg", route: "SUBCUTANEOUS", form: "INJECTION", intervalDays: 14, timesPerDay: 1, startDate: "2024-03-01", prescribingDoctor: "Dr. Demo Bianchi" });
  const iron = await createMedication(u, { name: "Iron (ferrous sulfate)", dose: 105, unit: "mg", route: "ORAL", form: "TABLET", intervalDays: 1, timesPerDay: 1, startDate: addDays(today, -60) });
  await createMedication(u, { name: "Vitamin D", dose: 25000, unit: "IU", route: "ORAL", form: "LIQUID", intervalDays: 14, startDate: "2025-01-10" });
  await createMedication(u, { name: "Budesonide foam", dose: 2, unit: "mg", route: "RECTAL", form: "FOAM", asNeeded: true, notes: "As agreed with GI team" });

  // Adalimumab every 14 days for ~6 months; one skipped dose with a reason.
  for (let d = -182; d <= 0; d += 14) {
    const day = addDays(today, d - 2);
    const skipped = d === -42;
    await logMedicationEvent(u, ada.id, { status: skipped ? "SKIPPED" : "TAKEN", occurredAt: `${day}T08:30:00.000Z`, reason: skipped ? "Had a cold with fever" : null });
  }
  for (let d = -30; d <= 0; d++) {
    if (rnd() < 0.12) continue;
    await logMedicationEvent(u, iron.id, { status: rnd() < 0.08 ? "DELAYED" : "TAKEN", occurredAt: `${addDays(today, d)}T07:45:00.000Z` });
  }

  // 90 days of check-ins: stable baseline ~2/day, then a change over the last 3 days.
  for (let d = -89; d <= 0; d++) {
    if (d < -3 && rnd() < 0.15) continue; // realistic gaps
    const recent = d >= -2;
    const bm = recent ? 5 + Math.round(rnd()) : 1 + Math.round(rnd() * 2);
    await logSymptoms(u, {
      date: addDays(today, d),
      overall: d === 0 ? undefined : recent ? 2 : 3 + Math.round(rnd()),
      bowelMovements: bm,
      stoolConsistency: recent ? 6 : 4 + Math.round(rnd()),
      blood: recent && d === 0 ? 1 : 0,
      urgency: recent ? 2 : Math.round(rnd() * 0.8),
      pain: recent ? 4 + Math.round(rnd()) : Math.round(rnd() * 2),
      fatigue: recent ? 6 : 2 + Math.round(rnd() * 2),
      sleepQuality: 6 + Math.round(rnd() * 2),
    });
  }

  // Past hospitalisation & procedures (patient-entered)
  await addClinicalEvent(u, { type: "DIAGNOSIS", startedAt: "2019-05-20", title: "Diagnosis of Crohn's disease", description: "After ileocolonoscopy and MRI." });
  await addClinicalEvent(u, { type: "HOSPITALIZATION", startedAt: "2024-02-10", endedAt: "2024-02-16", title: "Hospital stay", facility: "Demo — City General Hospital", description: "Admitted for abdominal pain; discharged after 6 days." });

  // Labs history (patient-entered)
  const crp = [[-160, 3.1], [-120, 2.4], [-80, 4.0], [-40, 3.5]] as const;
  for (const [d, v] of crp) await prisma.labResult.create({ data: { userId: u, testCode: "CRP", testName: "C-reactive protein (CRP)", value: v, unit: "mg/L", takenAt: new Date(`${addDays(today, d)}T00:00:00Z`), sourceType: "PATIENT_ENTERED" } });
  const cal = [[-170, 95], [-100, 140], [-45, 180]] as const;
  for (const [d, v] of cal) await prisma.labResult.create({ data: { userId: u, testCode: "CALPROTECTIN", testName: "Fecal calprotectin", value: v, unit: "µg/g", takenAt: new Date(`${addDays(today, d)}T00:00:00Z`), sourceType: "PATIENT_ENTERED" } });

  // Documents: colonoscopy (reviewed & in the Health Memory)
  const colo = addDays(today, -110);
  const coloDoc = await uploadDocument(u, {
    fileName: "colonoscopy-demo.pdf",
    title: "Ileocolonoscopy report",
    data: await pdf(`DEMO HOSPITAL — Endoscopy Unit (fictional)
ILEOCOLONOSCOPY REPORT
Date: ${eu(colo)}
Patient: Anna Rossi (demo patient)
Indication: Crohn's disease follow-up on adalimumab
Findings:
Mild erythema and a few aphthous ulcers in the terminal ileum over 5 cm.
Colon and rectum with normal mucosa.
Biopsies taken from the terminal ileum and colon.
Conclusion:
Mild ileal activity. SES-CD 4.
Recommendations:
Continue current therapy. Repeat fecal calprotectin in 3 months.`),
  });
  for (const f of coloDoc.extractions[0].fields) await reviewField(u, f.id, "confirm");
  await applyReviewedFields(u, coloDoc.id);

  // Blood test — left for the patient to review (demo of the review flow)
  const bt = addDays(today, -6);
  await uploadDocument(u, {
    fileName: "blood-test-demo.pdf",
    title: "Blood test",
    data: await pdf(`DEMO LABORATORY (fictional)
Laboratory report
Collection date: ${eu(bt)}
CRP (C-reactive protein) 9.8 mg/L (ref. < 5)
Hemoglobin 11.6 g/dL (12.0 - 15.5)
Ferritin 21 ng/mL
Platelets 395 x10^9/L
Fecal calprotectin 310 µg/g`),
  });

  // Prescription with a DIFFERENT adalimumab frequency — reviewing it demonstrates conflict resolution.
  await uploadDocument(u, {
    fileName: "prescription-demo.pdf",
    title: "Prescription",
    data: await pdf(`Prescription (fictional demo)
Date: ${eu(addDays(today, -3))}
Adalimumab 40 mg subcutaneous injection every 7 days
Dr. Demo Bianchi — Gastroenterology`),
  });

  // Care team + upcoming visit
  const visitDay = "2026-10-14";
  await createVisit(u, {
    scheduledAt: `${visitDay > today ? visitDay : addDays(today, 14)}T09:30:00+02:00`,
    doctorName: "Dr. Demo Bianchi",
    specialty: "Gastroenterology",
    reason: "IBD follow-up",
    patientConcerns: "More bathroom trips this week and more tired than usual. Should I repeat calprotectin?",
  });
  await createVisit(u, { scheduledAt: `${addDays(today, -120)}T10:00:00+02:00`, doctorName: "Dr. Demo Bianchi", reason: "IBD follow-up" });
  await prisma.doctorVisit.updateMany({ where: { userId: u, scheduledAt: { lt: new Date() } }, data: { completed: true } });

  await saveEmergencyCard(u, {
    showCondition: true, showMedications: true, showAllergies: true, showSurgeries: true, showStoma: true, showContact: true,
    allergies: "Penicillin (rash)", surgeriesNote: null, contactName: "Marco Rossi (partner, demo)", contactPhone: "+39 000 000 0000", extraNote: "Takes immunosuppressive medication.",
  });
  return user;
}

async function main() {
  await seedLocations();
  await seedAnna();
  console.log(`Seeded demo data. Sign in with ${EMAIL} / ${PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
