const fs = require('fs');
const cheerio = require('cheerio');
const http = require('https');

// Extract the user programs from generate-programs.js
const generateProgramsFile = fs.readFileSync('generate-programs.js', 'utf8');
const match = generateProgramsFile.match(/const userPrograms = (\[[\s\S]*?\]);/);
let userPrograms = [];
if (match) {
  // Replace the shorthand objects back to something eval can parse safely if needed,
  // but it's just a JS array literal. Let's use eval.
  userPrograms = eval(match[1]);
} else {
  console.error("Could not find userPrograms in generate-programs.js");
  process.exit(1);
}

// Convert user programs to a map
const userProgramsMap = new Map();
userPrograms.forEach(p => {
  // Use code to uniquely identify
  // Handle bilingual duplicates by taking the French one (assuming first is French or we just keep the first)
  if (!userProgramsMap.has(p.code)) {
    userProgramsMap.set(p.code, p);
  } else {
    // If we have a duplicate, we can add it as alias
    const existing = userProgramsMap.get(p.code);
    if (!existing.alias) existing.alias = [];
    existing.alias.push(p.nom);
  }
});

// Fetch Inforoute FPT
const url = 'https://www.inforoutefpt.org/formation-technique/diplome-etudes-collegiales';

http.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const $ = cheerio.load(data);
    const scrapedPrograms = [];
    
    // The programs are in table rows
    $('tr').each((i, row) => {
      const codeCell = $(row).find('td#tdCode');
      const nomCell = $(row).find('a#lnkProg');
      const familleCell = $(row).find('td#tdFamille');
      
      if (codeCell.length && nomCell.length) {
        const code = codeCell.text().trim();
        const nom = nomCell.text().trim();
        const famille_code = familleCell.text().trim() || "000";
        
        // Sometimes there are multiple rows for the same code (different concentrations)
        // Check if we already added it
        const existing = scrapedPrograms.find(p => p.code === code);
        if (existing) {
          if (existing.nom !== nom) {
            if (!existing.concentrations) existing.concentrations = [];
            if (!existing.concentrations.includes(nom)) {
                existing.concentrations.push(nom);
            }
          }
        } else {
          scrapedPrograms.push({
            code,
            nom,
            famille_code,
            type: code.includes('A') || code.includes('B') || code.includes('C') || code.includes('D') || code.includes('E') || code.includes('F') || code.includes('G') ? 'technique' : 'preuniversitaire' 
          });
        }
      }
    });

    console.log(`Scraped ${scrapedPrograms.length} unique program codes from Inforoute.`);
    
    // Now build the final list
    const finalPrograms = [];
    
    // First, process all scraped programs
    scrapedPrograms.forEach(sp => {
      if (userProgramsMap.has(sp.code)) {
        const userP = userProgramsMap.get(sp.code);
        const merged = { ...sp, ...userP };
        if (sp.concentrations) merged.concentrations = sp.concentrations;
        finalPrograms.push(merged);
        userProgramsMap.delete(sp.code); // mark as processed
      } else {
        finalPrograms.push({
          ...sp,
          prealables: false
        });
      }
    });
    
    // Then add any remaining programs from user data (like pre-university)
    userProgramsMap.forEach(userP => {
      // Don't add the dummy "Programme additionnel" ones!
      if (!userP.nom.startsWith('Programme additionnel')) {
        finalPrograms.push(userP);
      }
    });
    
    // Sort by code
    finalPrograms.sort((a, b) => a.code.localeCompare(b.code));

    // Generate TypeScript content
    let tsContent = `// Fichier généré automatiquement avec les 231 programmes DEC d'Inforoute FPT
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

    finalPrograms.forEach(p => {
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
    famille_code: "${p.famille_code}",
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

    fs.writeFileSync('./src/data/programmes-dec-prealables.ts', tsContent, 'utf8');
    console.log(`Generated ./src/data/programmes-dec-prealables.ts with ${finalPrograms.length} programs!`);
  });
}).on('error', (e) => {
  console.error("Error fetching: ", e);
});
