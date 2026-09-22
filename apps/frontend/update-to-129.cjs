const fs = require('fs');

const missingPrograms = [
  { code: '200.D1', nom: 'Sciences de la nature – Langue seconde enrichie', famille_code: '200', type: 'preuniversitaire', prealables: { ts_sn_5: true, chimie_5: true, physique_5: true } },
  { code: '200.Z1', nom: 'Sciences de la nature – Cheminement du Baccalauréat International', famille_code: '200', type: 'preuniversitaire', prealables: { ts_sn_5: true, chimie_5: true, physique_5: true } },
  { code: '300.B1', nom: 'Sciences humaines – Premières Nations', famille_code: '300', type: 'preuniversitaire', prealables: { cst_4: true } },
  { code: '300.C1', nom: 'Sciences humaines – Langue seconde enrichie', famille_code: '300', type: 'preuniversitaire', prealables: { cst_4: true } },
  { code: '300.D1', nom: 'Sciences humaines – Inuits', famille_code: '300', type: 'preuniversitaire', prealables: { cst_4: true } },
  { code: '300.Z0', nom: 'Sciences humaines – Cheminement du Baccalauréat International', famille_code: '300', type: 'preuniversitaire', prealables: { ts_sn_4: true } },
  { code: '500.B1', nom: 'Arts, lettres et communication – Premières Nations : 7 options', famille_code: '500', type: 'preuniversitaire', prealables: false },
  { code: '500.C1', nom: 'Arts, lettres et communication – Inuits : 7 options', famille_code: '500', type: 'preuniversitaire', prealables: false },
  { code: '500.Z0', nom: 'Arts, lettres et communication – Cheminement du Baccalauréat International', famille_code: '500', type: 'preuniversitaire', prealables: { ts_sn_4: true } },
  { code: '700.Z0', nom: 'Cheminement multidisciplinaire du Baccalauréat International', famille_code: '700', type: 'preuniversitaire', prealables: { ts_sn_4: true, ste_se_4: true } },
  { code: '280.A0', nom: 'Techniques de pilotage d’aéronefs : 3 voies de spécialisation', famille_code: '200', type: 'technique', prealables: { ts_sn_5: true, physique_5: true } }
];

const toRemove = [
  '111.A0', '145.A0', '230.A0', '410.B0', '410.D0', '412.A0', '574.B0'
];

let fileContent = fs.readFileSync('src/data/programmes-dec-prealables.ts', 'utf8');

// Match the array content
const match = fileContent.match(/export const programmesDEC: ProgrammeDEC\[\] = \[([\s\S]*?)\];\n\nexport interface/);
if (!match) {
  console.error("Could not find programmes array.");
  process.exit(1);
}

// For simplicity, we will parse the array using eval, modify it, and stringify it back.
// But we need to define the type so it evaluates properly or strip it.
let arrayStr = match[1];
// wrap in array
let programs = eval(`[${arrayStr}]`);

// Remove old ones
programs = programs.filter(p => !toRemove.includes(p.code));

// Add new ones
programs.push(...missingPrograms);

// Sort
programs.sort((a, b) => a.code.localeCompare(b.code));

// Generate TS
let tsContent = `// Fichier généré avec les 129 programmes DEC officiels pour 2026
export type PrealableId = 'cst_4' | 'ts_sn_4' | 'st_ats_4' | 'ts_sn_5' | 'chimie_5' | 'physique_5' | 'ste_se_4';

export interface ProgrammeDEC {
  code: string;
  nom: string;
  nom_en?: string;
  alias?: string[];
  famille_code?: string;
  type: "preuniversitaire" | "technique";
  concentrations?: string[];
  prealables: Record<PrealableId, boolean> | false;
}

export const programmesDEC: ProgrammeDEC[] = [\n`;

programs.forEach(p => {
  let prealablesStr = 'false';
  if (p.prealables && typeof p.prealables === 'object') {
    const keys = Object.keys(p.prealables).filter(k => p.prealables[k]);
    if (keys.length > 0) {
      prealablesStr = `{ ${keys.map(k => `${k}: true`).join(', ')} }`;
    } else {
      prealablesStr = '{}';
    }
  }

  let aliasStr = '';
  if (p.alias && p.alias.length > 0) {
    aliasStr = `\n    alias: ${JSON.stringify(p.alias)},`;
  }
  
  let concStr = '';
  if (p.concentrations && p.concentrations.length > 0) {
    concStr = `\n    concentrations: ${JSON.stringify(p.concentrations)},`;
  }

  tsContent += `  {
    code: "${p.code}",
    nom: ${JSON.stringify(p.nom)},
    famille_code: "${p.famille_code || '00'}",
    type: "${p.type}",
    prealables: ${prealablesStr},${aliasStr}${concStr}
  },\n`;
});

tsContent += `];

export interface ProgrammeRepository {
  getAll(): Promise<ProgrammeDEC[]>;
  getByCode(code: string): Promise<ProgrammeDEC | undefined>;
}

export class LocalProgrammeRepository implements ProgrammeRepository {
  async getAll(): Promise<ProgrammeDEC[]> {
    return programmesDEC;
  }

  async getByCode(code: string): Promise<ProgrammeDEC | undefined> {
    return programmesDEC.find((p) => p.code === code);
  }
}

export const getProgrammes = async (): Promise<ProgrammeDEC[]> => programmesDEC;
export const getProgrammeByCode = async (code: string): Promise<ProgrammeDEC | undefined> => programmesDEC.find(p => p.code === code);
`;

fs.writeFileSync('src/data/programmes-dec-prealables.ts', tsContent, 'utf8');
console.log("Successfully updated to 129 programs.");
