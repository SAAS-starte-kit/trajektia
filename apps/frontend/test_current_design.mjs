import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = "C:/Users/Patrice.DESKTOP-I932PON/.gemini/antigravity-ide/brain/afbab8c8-688c-4d7a-a84a-cf61ef6efce8";

async function runTest() {
  console.log("🚀 Lancement du test Playwright - Mode Sombre & Correction ESCO...");

  const browser = await chromium.launch({ headless: true });

  // 1. Contexte Sombre (Dark Mode)
  const darkContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
    colorScheme: 'dark',
  });

  // Injecter le thème sombre dans localStorage pour chaque page
  await darkContext.addInitScript(() => {
    window.localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');
  });

  const page = await darkContext.newPage();

  // Test Catalogue Métiers (Dark Mode)
  console.log("\n[1/4] Test Catalogue Métiers en MODE SOMBRE...");
  await page.goto("http://localhost:3000/metiers", { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // Capture plein écran catalogue sombre
  const darkMetiersPath = path.join(ARTIFACT_DIR, "screenshot_dark_metiers.png");
  await page.screenshot({ path: darkMetiersPath, fullPage: true });
  console.log(`   ✓ Capture globale sombre : ${darkMetiersPath}`);

  // Capture ciblée de la première carte métier (CNP 31301 Infirmier) pour vérifier le badge ESCO
  const firstCard = page.locator('.metier-card').first();
  if (await firstCard.count() > 0) {
    const cardScreenshotDark = path.join(ARTIFACT_DIR, "screenshot_dark_card_esco_fixed.png");
    await firstCard.screenshot({ path: cardScreenshotDark });
    console.log(`   ✓ Capture zoom carte ESCO (Sombre) : ${cardScreenshotDark}`);
  }

  // Test Fiche Métier 31301 (Infirmier) en Mode Sombre
  console.log("\n[2/4] Test Fiche Métier CNP 31301 (Infirmier) en MODE SOMBRE...");
  await page.goto("http://localhost:3000/metiers/31301", { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  const darkFiche31301Path = path.join(ARTIFACT_DIR, "screenshot_dark_fiche_31301.png");
  await page.screenshot({ path: darkFiche31301Path, fullPage: true });
  console.log(`   ✓ Capture Fiche 31301 (Sombre) : ${darkFiche31301Path}`);

  // Test Fiche Métier 21231 (Ingénieurs logiciel) en Mode Sombre
  console.log("\n[3/4] Test Fiche Métier CNP 21231 (Logiciel) en MODE SOMBRE...");
  await page.goto("http://localhost:3000/metiers/21231", { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  const darkFiche21231Path = path.join(ARTIFACT_DIR, "screenshot_dark_fiche_21231.png");
  await page.screenshot({ path: darkFiche21231Path, fullPage: true });
  console.log(`   ✓ Capture Fiche 21231 (Sombre) : ${darkFiche21231Path}`);

  // 2. Contexte Clair (Light Mode) pour comparer le badge ESCO
  console.log("\n[4/4] Test de comparaison en MODE CLAIR...");
  const lightContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
    colorScheme: 'light',
  });
  await lightContext.addInitScript(() => {
    window.localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  const lightPage = await lightContext.newPage();
  await lightPage.goto("http://localhost:3000/metiers", { waitUntil: 'networkidle', timeout: 30000 });
  await lightPage.waitForTimeout(1000);

  const lightFirstCard = lightPage.locator('.metier-card').first();
  if (await lightFirstCard.count() > 0) {
    const cardScreenshotLight = path.join(ARTIFACT_DIR, "screenshot_light_card_esco_fixed.png");
    await lightFirstCard.screenshot({ path: cardScreenshotLight });
    console.log(`   ✓ Capture zoom carte ESCO (Clair) : ${cardScreenshotLight}`);
  }

  await browser.close();
  console.log("\n✅ Tous les tests Playwright (Sombre & Clair) sont terminés avec succès !");
}

runTest().catch((err) => {
  console.error("❌ Erreur Playwright :", err);
  process.exit(1);
});
