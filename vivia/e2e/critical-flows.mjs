// End-to-end check of VIVIA's critical flows in a real browser (mobile viewport).
// Usage: BASE_URL=http://localhost:3000 node e2e/critical-flows.mjs [screenshotDir]
import { chromium } from "playwright-core";
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const SHOTS = process.argv[2];
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const exe = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const browser = await chromium.launch({ executablePath: exe });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  geolocation: { latitude: 45.4641, longitude: 9.1899 },
  permissions: ["geolocation"],
  locale: "en-GB",
});
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && !m.text().includes("tile.openstreetmap") && errors.push(m.text()));
const shot = async (name) => SHOTS && page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: false });
const step = async (name, fn) => {
  const t0 = Date.now();
  await fn();
  console.log(`✓ ${name} (${Date.now() - t0} ms)`);
};

const email = `e2e-${Date.now()}@example.test`;

await step("emergency bathroom flow works without an account", async () => {
  await page.goto(`${BASE}/welcome`);
  await shot("01-welcome");
  await page.getByText("Need a bathroom now?").click();
  await page.getByText("Nearest open bathroom").waitFor();
  await page.getByRole("link", { name: /Directions/ }).first().waitFor();
  await shot("02-bathroom");
});

await step("register with explicit consent + onboarding", async () => {
  await page.goto(`${BASE}/register`);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("a-very-long-password");
  await page.getByRole("checkbox").nth(0).check();
  await page.getByRole("checkbox").nth(1).check();
  await page.getByRole("button", { name: "Create your account" }).click();
  await page.waitForURL("**/onboarding");
  await page.getByRole("textbox").first().fill("Sam");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("radio", { name: "Ulcerative colitis" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("radio", { name: "Yes" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await shot("03-onboarding-track");
  await page.getByRole("button", { name: "Start my health story" }).click();
  await page.waitForURL("**/home");
  await page.getByText("Your health story starts here.").waitFor();
  await shot("04-home-zero");
});

await step("a normal day takes one tap", async () => {
  const t0 = Date.now();
  await page.getByRole("button", { name: "Good", exact: true }).click();
  await page.getByText("Noted.").waitFor();
  console.log(`   one-tap check-in round trip: ${Date.now() - t0} ms`);
});

await step("Tell VIVIA: interpret → confirm", async () => {
  await page.goto(`${BASE}/log/tell`);
  await page.getByRole("textbox").fill("Today I went to the bathroom 5 times, first two were normal and then I had diarrhea. No blood, pain 3/10 and I'm tired.");
  await page.getByRole("button", { name: "Understand" }).click();
  await page.getByText("I understood:").waitFor();
  await shot("05-tell-understood");
  await page.getByRole("button", { name: "Confirm" }).click();
  await page.getByText("Saved to your health memory.").waitFor();
});

await step("add a rectal medication and log a dose", async () => {
  await page.goto(`${BASE}/medications/new`);
  await page.getByLabel("Name").fill("Mesalazine enema");
  await page.getByLabel("Dose").fill("1");
  await page.getByLabel("Unit").fill("g");
  await page.getByLabel("Route").selectOption("RECTAL");
  await page.getByLabel("Form").selectOption("ENEMA");
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForURL(/\/medications\/[0-9a-f-]{36}$/);
  await page.getByRole("button", { name: "✓ Taken" }).click();
  await page.getByRole("status").getByText("Saved").waitFor();
  await shot("06-medication");
});

await step("upload a document → review → Health Memory", async () => {
  await page.goto(`${BASE}/documents`);
  await page.locator('input[type="file"]').setInputFiles("tests/fixtures/e2e-bloodtest.pdf");
  await page.waitForURL(/\/review$/);
  await page.getByText("Check what VIVIA found").waitFor();
  await shot("07-review");
  await page.getByRole("button", { name: /All remaining values are correct/ }).click();
  await page.getByRole("button", { name: /Add confirmed values/ }).click();
  await page.getByText(/item\(s\) added to your health memory/).waitFor();
});

await step("timeline shows provenance", async () => {
  await page.goto(`${BASE}/timeline`);
  await page.getByText("From a document").first().waitFor();
  await page.getByText("Told to VIVIA").first().waitFor();
  await shot("08-timeline");
});

let shareUrl;
await step("prepare doctor visit in one tap, then share", async () => {
  await page.goto(`${BASE}/visits`);
  await page.getByRole("button", { name: /Prepare my doctor visit/ }).click();
  await page.waitForURL(/\/summaries\//);
  await page.getByText("My questions").first().waitFor();
  await shot("09-summary");
  const pdfResp = await page.request.get(page.url().replace("/summaries/", "/api/summaries/") + "/pdf");
  if (pdfResp.headers()["content-type"] !== "application/pdf") throw new Error("PDF export failed");
  await page.getByRole("button", { name: /Share securely/ }).click();
  await page.getByRole("button", { name: "Create link" }).click();
  shareUrl = await page.getByLabel("Link").inputValue();
});

await step("shared link opens read-only without an account", async () => {
  const anon = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p2 = await anon.newPage();
  await p2.goto(shareUrl);
  await p2.getByText("VIVIA Care Summary").first().waitFor();
  await anon.close();
});

await step("stoma mode filters on the map", async () => {
  await page.goto(`${BASE}/map`);
  await page.getByText("Stoma mode").waitFor();
  await shot("10-map");
});

await step("emergency card saved for offline use", async () => {
  await page.goto(`${BASE}/emergency-card`);
  await page.getByRole("button", { name: /Save on this device/ }).click();
  await page.goto(`${BASE}/card`);
  await page.getByText("Medical information").waitFor();
});

await step("privacy: export then delete account", async () => {
  await page.goto(`${BASE}/privacy`);
  const exp = await page.request.get(`${BASE}/api/privacy/export`);
  const json = await exp.json();
  if (json.exportFormat !== "vivia-export-v1" || !json.symptomEntries.length) throw new Error("export incomplete");
  await page.getByPlaceholder("Type DELETE to confirm").fill("DELETE");
  await page.getByRole("button", { name: "Delete my account and all data" }).click();
  await page.waitForURL("**/welcome");
  const r = await page.request.get(`${BASE}/api/privacy/export`);
  if (r.status() !== 401) throw new Error("account still accessible after deletion");
});

await step("demo patient: home, trends, conflicts", async () => {
  await page.goto(`${BASE}/login`);
  await page.getByLabel("Email").fill("anna.rossi@demo.vivia");
  await page.getByLabel("Password").fill("vivia-demo-2026");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/home");
  await page.getByText(/above your recent 30-day baseline/).first().waitFor();
  await shot("11-anna-home");
  await page.goto(`${BASE}/trends`);
  await shot("12-anna-trends");
  await page.goto(`${BASE}/documents`);
  await page.getByRole("link", { name: /^Prescription/ }).click();
  await page.getByRole("button", { name: /All remaining values are correct/ }).click();
  await page.getByRole("button", { name: /Add confirmed values/ }).click();
  await page.getByText(/VIVIA found different information/).click();
  await page.waitForURL("**/conflicts");
  await shot("13-conflict");
});

await browser.close();
if (errors.length) {
  writeFileSync("/dev/stderr", `Browser errors:\n${errors.join("\n")}\n`);
  process.exit(1);
}
console.log("All critical flows passed.");
