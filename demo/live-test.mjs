import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "test-output");
const BASE = process.env.DEMO_URL || "http://localhost:5173/";

async function isDialogVisible(page, timeout = 2000) {
  return page
    .locator('[role="dialog"]')
    .waitFor({ state: "visible", timeout })
    .then(() => true)
    .catch(() => false);
}

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1100, height: 1400 },
  permissions: [], // start clean
});
const page = await context.newPage();

const consoleLogs = [];
page.on("console", (msg) => {
  consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
});

console.log(`Opening ${BASE}`);
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForSelector("#list .row");

// Screenshot initial state
await page.screenshot({ path: path.join(OUT, "01-initial.png"), fullPage: true });
console.log("✓ Screenshot: 01-initial.png");

// Click "Check all statuses"
await page.click("#check-all");
// Wait until at least one real status badge is painted (not the placeholder "—")
await page
  .locator("[data-status]")
  .filter({ hasNotText: "—" })
  .first()
  .waitFor({ state: "visible", timeout: 5000 });

const statuses = await page.$$eval("[data-status]", (els) =>
  els.map((el) => ({
    permission: el.getAttribute("data-status"),
    status: el.textContent?.trim(),
  }))
);

console.log("\n=== checkPermission (all) ===");
for (const row of statuses) {
  console.log(`  ${row.permission.padEnd(22)} → ${row.status}`);
}

await page.screenshot({ path: path.join(OUT, "02-after-check-all.png"), fullPage: true });
console.log("✓ Screenshot: 02-after-check-all.png");

// Subscribe to notifications changes
const notifListen = page.locator('[data-listen="notifications"]');
await notifListen.click();

// Request notifications — modal should appear
const requestBtn = page.locator('[data-request="notifications"]');
await requestBtn.click();

const modalVisible = await isDialogVisible(page);
console.log(`\n=== requestPermission(notifications) modal visible: ${modalVisible}`);

if (modalVisible) {
  await page.screenshot({
    path: path.join(OUT, "03-permission-modal.png"),
    fullPage: true,
  });
  console.log("✓ Screenshot: 03-permission-modal.png");

  // Click Continue in modal
  const continueBtn = page.locator('[role="dialog"] button', { hasText: "Continue" });
  if (await continueBtn.count()) {
    // Grant notification permission via context before native prompt resolves
    await context.grantPermissions(["notifications"]);
    await continueBtn.click();
    await page
      .locator('[role="dialog"]')
      .waitFor({ state: "hidden", timeout: 3000 })
      .catch(() => {});
  }
}

// Request bluetooth — permission modal or unsupported guidance modal
const bluetoothRequest = page.locator('[data-request="bluetooth"]');
await bluetoothRequest.click();

const infoVisible = await isDialogVisible(page);
const infoTitle = infoVisible
  ? await page.locator('[role="dialog"] h2').innerText().catch(() => "")
  : "";
console.log(`\n=== bluetooth request modal: visible=${infoVisible} title="${infoTitle}"`);

if (infoVisible) {
  await page.screenshot({
    path: path.join(OUT, "04-unsupported-or-request-modal.png"),
    fullPage: true,
  });
  console.log("✓ Screenshot: 04-unsupported-or-request-modal.png");
  const okBtn = page.locator('[role="dialog"] button').first();
  if (await okBtn.count()) {
    await okBtn.click();
    await page
      .locator('[role="dialog"]')
      .waitFor({ state: "hidden", timeout: 2000 })
      .catch(() => {});
  }
}

// Final log dump from page
const logText = await page.locator("#log").innerText();
console.log("\n=== Demo event log ===");
console.log(logText);

await page.screenshot({ path: path.join(OUT, "05-final.png"), fullPage: true });
console.log("✓ Screenshot: 05-final.png");

// Sanity assertions
const unsupportedOrValid = statuses.every((s) =>
  ["granted", "denied", "prompt", "unsupported", "—"].includes(s.status)
);
if (!unsupportedOrValid) {
  console.error("FAIL: unexpected status values");
  process.exitCode = 1;
} else {
  console.log("\n✓ All status badges are valid PermissionCheckResult values");
}

const exportsOk = await page.evaluate(async () => {
  const mod = await import("./library.js");
  return {
    hasOnPermissionChange: typeof mod.onPermissionChange === "function",
    hasCheck: typeof mod.checkPermission === "function",
    hasRequest: typeof mod.requestPermission === "function",
    hasIsSupported: typeof mod.isPermissionFeatureSupported === "function",
  };
});
console.log("✓ Library exports in browser:", exportsOk);

await browser.close();
console.log(`\nDone. Screenshots in ${OUT}`);
