#!/usr/bin/env node
/**
 * audit_data_integrity.ts
 * ========================
 * Audit complet de l'intégrité des données Trajektia.
 * Valide tous les liens croisés entre :
 *   - METIERS_DATA (metiers.ts)
 *   - programmesDEC / programmesDEP (programmes-*-prealables.ts)
 *   - programmes-metiers-map.json (program_to_cnps + cnp_to_programs)
 *   - programmes-devis.json
 *
 * Usage (depuis apps/frontend):
 *   npx tsx ../../scripts/audit_data_integrity.ts
 * ou depuis la racine:
 *   npx tsx scripts/audit_data_integrity.ts
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─────────────────────────────────────────────
// 1. Chargement des données
// ─────────────────────────────────────────────

const ROOT = resolve(__dirname, '../apps/frontend/src/data');

function loadJSON(name: string): any {
  return JSON.parse(readFileSync(resolve(ROOT, name), 'utf-8'));
}

// Charger le JSON directement
const map = loadJSON('programmes-metiers-map.json');
const devis = loadJSON('programmes-devis.json');

// Parser les exports TypeScript (METIERS_DATA, programmesDEC, programmesDEP)
// avec une extraction regex robuste
function extractTSArray(filePath: string, exportName: string): any[] {
  const content = readFileSync(resolve(ROOT, filePath), 'utf-8');
  // On cherche le pattern: export const NAME = [...] ou export const NAME: Type = [...]
  const start = content.indexOf(`"cnp":`) > -1 
    ? 0  // Pour metiers.ts on utilise une autre stratégie
    : content.indexOf(exportName);
  return [];
}

// Stratégie JSON pour les fichiers TS :
// Extraire les valeurs de cnp, secteur, feer, formations, titre_court de metiers.ts
function parseMetiersTS(): { cnp: string; titre: string; titre_court: string; secteur: string; secteur_nom: string; feer: number; formations: any[] }[] {
  const content = readFileSync(resolve(ROOT, 'metiers.ts'), 'utf-8');
  const items: any[] = [];
  
  // Regex pour trouver chaque bloc métier
  const cnpRegex = /"cnp":\s*"(\d+)"/g;
  const titreCourtRegex = /"titre_court":\s*"([^"]+)"/;
  const titreRegex = /"titre":\s*"([^"]+)"/;
  const secteurRegex = /"secteur":\s*"([^"]+)"/;
  const secteurNomRegex = /"secteur_nom":\s*"([^"]+)"/;
  const feerRegex = /"feer":\s*(\d+)/;

  // On découpe par bloc de niveau racine (chaque métier commence par 2 espaces, {, saut de ligne, 4 espaces "cnp": "xxxxx")
  const blocks = content.split(/(?=\n\s{2}\{\s*\n\s{4}"cnp":)/);
  
  for (const block of blocks) {
    const cnpMatch = block.match(/"cnp":\s*"(\d+)"/);
    if (!cnpMatch) continue;
    
    const cnp = cnpMatch[1];
    const titre_court = (block.match(/"titre_court":\s*"([^"]+)"/) || [])[1] || '';
    const titre = (block.match(/"titre":\s*"([^"]+)"/) || [])[1] || '';
    const secteur = (block.match(/"secteur":\s*"([^"]+)"/) || [])[1] || '';
    const secteur_nom = (block.match(/"secteur_nom":\s*"([^"]+)"/) || [])[1] || '';
    const feerMatch = block.match(/"feer":\s*(\d+)/);
    const feer = feerMatch ? parseInt(feerMatch[1]) : -1;
    
    // Extraire les formations
    const formations: any[] = [];
    const formationsMatch = block.match(/"formations":\s*\[([\s\S]*?)\]/);
    if (formationsMatch) {
      const formBlocks = formationsMatch[1].split(/\},\s*\{/);
      for (const fb of formBlocks) {
        const fType = (fb.match(/"type":\s*"([^"]+)"/) || [])[1] || '';
        const fTitre = (fb.match(/"titre":\s*"([^"]+)"/) || [])[1] || '';
        const fLien = (fb.match(/"lien_interne":\s*"([^"]+)"/) || [])[1] || '';
        if (fType && fTitre) {
          formations.push({ type: fType, titre: fTitre, lien_interne: fLien });
        }
      }
    }
    
    items.push({ cnp, titre, titre_court, secteur, secteur_nom, feer, formations });
  }
  
  return items;
}

function parseProgrammesTS(filePath: string): { code: string; nom: string; secteur_nom?: string }[] {
  const content = readFileSync(resolve(ROOT, filePath), 'utf-8');
  const items: { code: string; nom: string; secteur_nom?: string }[] = [];
  
  // Gère à la fois les clés citées "code": et non citées code:
  const blocks = content.split(/(?=\s*\{\s*\n?\s*["']?code["']?\s*:)/);
  for (const block of blocks) {
    const codeMatch = block.match(/["']?code["']?\s*:\s*['"]([^'"]+)['"]/);
    const nomMatch = block.match(/["']?nom["']?\s*:\s*['"]([^'"]+)['"]/);
    const secteurMatch = block.match(/["']?secteur_nom["']?\s*:\s*['"]([^'"]+)['"]/);
    
    if (codeMatch && nomMatch) {
      items.push({
        code: codeMatch[1],
        nom: nomMatch[1],
        secteur_nom: secteurMatch ? secteurMatch[1] : undefined
      });
    }
  }
  return items;
}

// ─────────────────────────────────────────────
// 2. Fonctions utilitaires
// ─────────────────────────────────────────────

function slugify(text: string): string {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function generateSlug(code: string, nom: string): string {
  const safeCode = code.toLowerCase().replace('.', '-').replace(/\./g, '-');
  return `${safeCode}-${slugify(nom)}`;
}

// ─────────────────────────────────────────────
// 3. Chargement
// ─────────────────────────────────────────────

console.log('⏳ Chargement des données...');
const metiers = parseMetiersTS();
const programmesDEC = parseProgrammesTS('programmes-dec-prealables.ts');
const programmesDEP = parseProgrammesTS('programmes-dep-prealables.ts');
const allProgrammes = [...programmesDEC, ...programmesDEP];

const allCnps = new Set(metiers.map(m => m.cnp));
const allProgCodes = new Set(allProgrammes.map(p => p.code));
const decCodes = new Set(programmesDEC.map(p => p.code));
const depCodes = new Set(programmesDEP.map(p => p.code));

console.log(`✅ ${metiers.length} métiers CNP chargés`);
console.log(`✅ ${programmesDEC.length} DEC + ${programmesDEP.length} DEP chargés`);
console.log(`✅ ${Object.keys(map.program_to_cnps || {}).length} entrées program_to_cnps`);
console.log(`✅ ${Object.keys(map.cnp_to_programs || {}).length} entrées cnp_to_programs`);
console.log(`✅ ${Object.keys(devis).length} entrées dans programmes-devis.json\n`);

// ─────────────────────────────────────────────
// 4. Audits
// ─────────────────────────────────────────────

interface Issue {
  severity: 'ERROR' | 'WARN' | 'INFO';
  category: string;
  code: string;
  message: string;
  detail?: string;
}

const issues: Issue[] = [];

function error(category: string, code: string, message: string, detail?: string) {
  issues.push({ severity: 'ERROR', category, code, message, detail });
}
function warn(category: string, code: string, message: string, detail?: string) {
  issues.push({ severity: 'WARN', category, code, message, detail });
}
function info(category: string, code: string, message: string, detail?: string) {
  issues.push({ severity: 'INFO', category, code, message, detail });
}

// ── A. program_to_cnps : CNPs référencés existent-ils dans METIERS_DATA ? ──
console.log('🔍 A. Validation program_to_cnps → METIERS_DATA...');
const prog2cnps = map.program_to_cnps || {};
for (const [progCode, progInfo] of Object.entries<any>(prog2cnps)) {
  // Le programme existe-t-il ?
  if (!allProgCodes.has(progCode)) {
    warn('MAP_PROG', 'PROG_NOT_IN_TS', 
      `Programme ${progCode} (${progInfo.title}) dans map mais ABSENT de programmesDEC/DEP`,
      `Level déclaré: ${progInfo.level}`);
  }
  // Chaque CNP mappé existe-t-il ?
  for (const cnp of (progInfo.cnps || [])) {
    if (!allCnps.has(cnp)) {
      error('MAP_PROG', 'CNP_NOT_IN_METIERS',
        `CNP ${cnp} mappé depuis programme ${progCode} mais ABSENT de METIERS_DATA`,
        `Programme: ${progInfo.title}`);
    }
  }
}

// ── B. cnp_to_programs : programmes référencés existent-ils ? ──
console.log('🔍 B. Validation cnp_to_programs → programmesDEC/DEP...');
const cnp2progs = map.cnp_to_programs || {};
for (const [cnp, progs] of Object.entries<any[]>(cnp2progs)) {
  // Le CNP existe-t-il ?
  if (!allCnps.has(cnp)) {
    warn('MAP_CNP', 'CNP_NOT_IN_METIERS',
      `CNP ${cnp} dans cnp_to_programs mais ABSENT de METIERS_DATA`);
  }
  for (const prog of progs) {
    if (!allProgCodes.has(prog.code)) {
      error('MAP_CNP', 'PROG_NOT_IN_TS',
        `Programme ${prog.code} (${prog.title}) mappé depuis CNP ${cnp} mais ABSENT de programmesDEC/DEP`);
    }
  }
}

// ── C. Cohérence bidirectionnelle ──
console.log('🔍 C. Cohérence bidirectionnelle prog→cnp ↔ cnp→prog...');
for (const [progCode, progInfo] of Object.entries<any>(prog2cnps)) {
  for (const cnp of (progInfo.cnps || [])) {
    const reverseProgs: any[] = cnp2progs[cnp] || [];
    const reverseHasProg = reverseProgs.some((rp: any) => rp.code === progCode);
    if (!reverseHasProg) {
      warn('BIDIRECTIONNEL', 'MISSING_REVERSE',
        `Prog ${progCode} → CNP ${cnp} MAIS pas de reverse dans cnp_to_programs[${cnp}]`);
    }
  }
}
for (const [cnp, progs] of Object.entries<any[]>(cnp2progs)) {
  for (const prog of progs) {
    const forwardEntry = prog2cnps[prog.code];
    if (!forwardEntry) {
      warn('BIDIRECTIONNEL', 'MISSING_FORWARD',
        `CNP ${cnp} → Prog ${prog.code} MAIS pas de forward dans program_to_cnps[${prog.code}]`);
    } else if (!forwardEntry.cnps.includes(cnp)) {
      warn('BIDIRECTIONNEL', 'MISSING_FORWARD',
        `CNP ${cnp} → Prog ${prog.code} MAIS program_to_cnps[${prog.code}].cnps ne contient pas ${cnp}`);
    }
  }
}

// ── D. Liens internes des formations dans metiers.ts ──
console.log('🔍 D. Validation des lien_interne dans metiers.formations...');
const validSlugs = new Set<string>();
for (const prog of allProgrammes) {
  validSlugs.add(`/programmes/${generateSlug(prog.code, prog.nom)}`);
}
for (const metier of metiers) {
  for (const form of (metier.formations || [])) {
    if (!form.lien_interne) continue;
    if (form.lien_interne.startsWith('/programmes/') && !validSlugs.has(form.lien_interne)) {
      error('LIENS_FORMATIONS', 'BROKEN_LINK',
        `CNP ${metier.cnp} (${metier.titre_court}): lien_interne "${form.lien_interne}" ne correspond à aucune page`,
        `Formation: "${form.titre}" (${form.type})`);
    }
    if (form.lien_interne === '/dec-prealables' || form.lien_interne === '/dep') {
      warn('LIENS_FORMATIONS', 'GENERIC_LINK',
        `CNP ${metier.cnp} (${metier.titre_court}): lien_interne générique "${form.lien_interne}"`,
        `Formation: "${form.titre}" — devrait pointer vers une page spécifique`);
    }
  }
}

// ── E. Titres de formations fictifs / suspects ──
console.log('🔍 E. Titres de formations suspects dans metiers.ts...');
const suspectPatterns = [
  /DEC technique en/i,
  /DEP spécialisé du secteur/i,
  /formation professionnelle du secteur/i,
  /programme collégial du domaine/i,
  /CNP \d+/  // Description-like
];
for (const metier of metiers) {
  for (const form of (metier.formations || [])) {
    for (const pattern of suspectPatterns) {
      if (pattern.test(form.titre)) {
        error('FORMATIONS_FICTIVES', 'FAKE_TITLE',
          `CNP ${metier.cnp} (${metier.titre_court}): titre formation FICTIF "${form.titre}"`,
          `Type: ${form.type}`);
      }
    }
  }
}

// ── F. Programmes sans entrée dans programmes-devis.json ──
console.log('🔍 F. Programmes sans devis ministériel...');
for (const prog of programmesDEC) {
  if (!devis[prog.code]) {
    info('DEVIS', 'MISSING_DEVIS',
      `DEC ${prog.code} (${prog.nom}): absent de programmes-devis.json`,
      'Page programme aura une description générique minimale');
  }
}

// ── G. Métiers sans formations dans metiers.ts ──
console.log('🔍 G. Métiers sans formations...');
for (const metier of metiers) {
  if (!metier.formations || metier.formations.length === 0) {
    warn('FORMATIONS_VIDES', 'NO_FORMATIONS',
      `CNP ${metier.cnp} (${metier.titre_court}): aucune formation listée`);
  }
}

// ── H. CNPs dans METIERS_DATA sans mapping dans cnp_to_programs ──
console.log('🔍 H. CNPs sans mapping programme...');
for (const metier of metiers) {
  if (!cnp2progs[metier.cnp]) {
    info('MAP_CNP', 'NO_PROGRAM_MAPPING',
      `CNP ${metier.cnp} (${metier.titre_court}): absent de cnp_to_programs`,
      `Feer: ${metier.feer}, Secteur: ${metier.secteur}`);
  }
}

// ── I. Programmes DEC sans mapping programme ──
console.log('🔍 I. DEC sans mapping CNP...');
for (const prog of programmesDEC) {
  if (!prog2cnps[prog.code]) {
    warn('MAP_PROG', 'NO_CNP_MAPPING',
      `DEC ${prog.code} (${prog.nom}): absent de program_to_cnps`,
      'Page programme n\'affichera aucun débouché direct');
  }
}

// ── J. Incohérence secteur (CNP) vs niveau FEER requis ──
console.log('🔍 J. Cohérence secteur métier ↔ level programme...');
for (const [progCode, progInfo] of Object.entries<any>(prog2cnps)) {
  const level = progInfo.level;
  const expectedFeer = level === 'DEC' ? 2 : level === 'DEP' ? 3 : -1;
  for (const cnp of (progInfo.cnps || [])) {
    const metier = metiers.find(m => m.cnp === cnp);
    if (metier && expectedFeer !== -1 && metier.feer !== expectedFeer) {
      // Certains cas sont légitimes (DEC → FEER 1 pour passerelles)
      if (metier.feer === 1 && level === 'DEC') {
        // OK : passerelle universitaire
      } else {
        warn('FEER_MISMATCH', 'FEER_INCOHERENCE',
          `Prog ${progCode} (${level}) → CNP ${cnp} (${metier.titre_court}) FEER=${metier.feer} ≠ attendu ${expectedFeer}`,
          `Peut indiquer un mauvais mapping CNP`);
      }
    }
  }
}

// ─────────────────────────────────────────────
// 5. Rapport
// ─────────────────────────────────────────────

const errors = issues.filter(i => i.severity === 'ERROR');
const warnings = issues.filter(i => i.severity === 'WARN');
const infos = issues.filter(i => i.severity === 'INFO');

console.log('\n══════════════════════════════════════════════');
console.log('📊 RAPPORT D\'AUDIT — Trajektia Data Integrity');
console.log('══════════════════════════════════════════════');
console.log(`🔴 ERREURS  : ${errors.length}`);
console.log(`🟡 WARNINGS : ${warnings.length}`);
console.log(`🔵 INFOS    : ${infos.length}`);
console.log('──────────────────────────────────────────────\n');

// Grouper par catégorie
const byCategory = new Map<string, Issue[]>();
for (const issue of issues) {
  if (!byCategory.has(issue.category)) byCategory.set(issue.category, []);
  byCategory.get(issue.category)!.push(issue);
}

for (const [cat, catIssues] of byCategory) {
  const errs = catIssues.filter(i => i.severity === 'ERROR').length;
  const warns = catIssues.filter(i => i.severity === 'WARN').length;
  const infosC = catIssues.filter(i => i.severity === 'INFO').length;
  console.log(`\n📁 [${cat}] — ${errs} erreurs | ${warns} warnings | ${infosC} infos`);
  
  for (const issue of catIssues.slice(0, 20)) { // Max 20 par catégorie dans la console
    const icon = issue.severity === 'ERROR' ? '🔴' : issue.severity === 'WARN' ? '🟡' : '🔵';
    console.log(`  ${icon} [${issue.code}] ${issue.message}`);
    if (issue.detail) console.log(`       ↳ ${issue.detail}`);
  }
  if (catIssues.length > 20) {
    console.log(`  ... et ${catIssues.length - 20} autres (voir rapport JSON)`);
  }
}

// Sauvegarder le rapport JSON complet
import { writeFileSync } from 'fs';
const reportPath = resolve(__dirname, 'audit_report.json');
const report = {
  generated_at: new Date().toISOString(),
  summary: {
    total_metiers: metiers.length,
    total_dec: programmesDEC.length,
    total_dep: programmesDEP.length,
    errors: errors.length,
    warnings: warnings.length,
    infos: infos.length
  },
  issues: issues
};
writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log(`\n✅ Rapport JSON complet sauvegardé : ${reportPath}`);
console.log('══════════════════════════════════════════════\n');
