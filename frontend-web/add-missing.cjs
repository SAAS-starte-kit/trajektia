const fs = require('fs');

// We map your list to basic info
const newPrograms = [
  { code: '081.06', nom: "Tremplin DEC", type: 'preuniversitaire', famille_code: '000', prealables: false },
  { code: '200.B0', nom: "Sciences de la nature", type: 'preuniversitaire', famille_code: '200', prealables: { ts_sn_5: true, chimie_5: true, physique_5: true } },
  { code: '200.C0', nom: "Sciences informatiques et mathématiques", type: 'preuniversitaire', famille_code: '200', prealables: { ts_sn_5: true, chimie_5: true, physique_5: true } },
  { code: '300.A0', nom: "Sciences humaines", type: 'preuniversitaire', famille_code: '300', prealables: { cst_4: true } },
  { code: '561.A1', nom: "Danse", type: 'preuniversitaire', famille_code: '500', prealables: false },
  { code: '510.A1', nom: "Arts visuels", type: 'preuniversitaire', famille_code: '500', prealables: false },
  { code: '551.A1', nom: "Musique", type: 'preuniversitaire', famille_code: '500', prealables: false },
  { code: '700.A0', nom: "Sciences, lettres et arts", type: 'preuniversitaire', famille_code: '700', prealables: { ts_sn_5: true, chimie_5: true, physique_5: true } },
  { code: '200.Z0', nom: "Sciences de la nature – Cheminement du Baccalauréat International", type: 'preuniversitaire', famille_code: '200', prealables: { ts_sn_5: true, chimie_5: true, physique_5: true } },
  
  { code: '410.A0', nom: "Techniques de la logistique du transport", type: 'technique', famille_code: '400', prealables: false },
  { code: '152.A0', nom: "Gestion des établissements de restauration", type: 'technique', famille_code: '100', prealables: false },
  { code: '589.A0', nom: "Arts du cirque", type: 'technique', famille_code: '500', prealables: false },
  { code: '581.A0', nom: "Techniques de communication dans les médias", type: 'technique', famille_code: '500', prealables: false },
  { code: '581.B0', nom: "Technologie de l'électronique des médias", type: 'technique', famille_code: '500', prealables: false },
  { code: '589.BA', nom: "Animation 3D et synthèse d'images", type: 'technique', famille_code: '500', prealables: false },
  { code: '210.AA', nom: "Techniques de laboratoire (Biotechnologies)", type: 'technique', famille_code: '200', prealables: { ts_sn_5: true, chimie_5: true, physique_5: true } },
  { code: '210.C0', nom: "Procédés de la chimie et de la métallurgie", type: 'technique', famille_code: '200', prealables: { ts_sn_5: true, chimie_5: true, physique_5: true } },
  { code: '271.AA', nom: "Technologie de la géomatique (Cartographie / Arpentage)", type: 'technique', famille_code: '200', prealables: false },
  { code: '235.A0', nom: "Technologie du génie industriel", type: 'technique', famille_code: '100', prealables: { ts_sn_4: true } },
  { code: '243.A0', nom: "Technologie de l'électronique industrielle", type: 'technique', famille_code: '200', prealables: { ts_sn_4: true } },
  { code: '243.B0', nom: "Technologie de systèmes ordinés", type: 'technique', famille_code: '200', prealables: { ts_sn_4: true } },
  { code: '243.C0', nom: "Technologie de l'électronique (Télécommunications)", type: 'technique', famille_code: '200', prealables: { ts_sn_4: true } },
  { code: '248.C0', nom: "Techniques d'avionique", type: 'technique', famille_code: '200', prealables: { ts_sn_5: true, physique_5: true } },
  { code: '271.B0', nom: "Technologie de la minéralurgie", type: 'technique', famille_code: '200', prealables: { ts_sn_4: true, st_ats_4: true } },
  { code: '145.A1', nom: "Techniques de bioécologie", type: 'technique', famille_code: '100', prealables: { ts_sn_4: true, chimie_5: true } },
  { code: '320.A0', nom: "Techniques de foresterie", type: 'technique', famille_code: '100', prealables: false },
  { code: '130.A0', nom: "Technologie d'électrophysiologie médicale", type: 'technique', famille_code: '100', prealables: { cst_4: true, physique_5: true } },
  { code: '140.B0', nom: "Technologie d'analyses biomédicales", type: 'technique', famille_code: '100', prealables: { ts_sn_4: true, chimie_5: true, physique_5: true } },
  { code: '142.A0', nom: "Technologie de radio-oncologie", type: 'technique', famille_code: '100', prealables: { ts_sn_5: true, st_ats_4: true } },
  { code: '144.A0', nom: "Techniques de physiothérapie / réadaptation physique", type: 'technique', famille_code: '100', prealables: { physique_5: true } },
  { code: '181.A0', nom: "Soins préhospitaliers d'urgence", type: 'technique', famille_code: '100', prealables: false },
  { code: '322.A0', nom: "Techniques d'education à l'enfance", type: 'technique', famille_code: '300', prealables: false },
  { code: '351.A0', nom: "Techniques d'éducation spécialisée", type: 'technique', famille_code: '300', prealables: false },
  { code: '388.A0', nom: "Techniques de travail social", type: 'technique', famille_code: '300', prealables: false }
];

let fileContent = fs.readFileSync('src/data/programmes-dec-prealables.ts', 'utf8');
const match = fileContent.match(/export const programmesDEC: ProgrammeDEC\[\] = \[([\s\S]*?)\];\n\nexport interface/);

if (!match) {
  console.error("Could not find programmes array.");
  process.exit(1);
}

let arrayStr = match[1];
let programs = eval(`[${arrayStr}]`);

programs.push(...newPrograms);

// Remove duplicates based on code
const uniqueProgramsMap = new Map();
programs.forEach(p => {
    uniqueProgramsMap.set(p.code, p);
});
programs = Array.from(uniqueProgramsMap.values());

programs.sort((a, b) => a.code.localeCompare(b.code));

let tsContent = `// Fichier généré avec l'inventaire exhaustif des programmes DEC
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
    famille_code: "${p.famille_code || '000'}",
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
console.log("Added 34 missing programs. Total unique programs now: " + programs.length);
