import fs from 'fs';

const userPrograms = [
  { code: "574.B0", nom: "3D Animation and Computer-Generated Imagery", famille_code: "500", type: "technique" },
  { code: "410.B0", nom: "Accounting and Management Technology", famille_code: "400", type: "technique" },
  { code: "112.A0", nom: "Acupuncture", famille_code: "100", type: "technique", prealables: { st_ats_4: true } },
  { code: "414.B0", nom: "Adventure Tourism", famille_code: "400", type: "technique" },
  { code: "280.C0", nom: "Aircraft Maintenance", famille_code: "200", type: "technique", prealables: { ts_sn_5: true, physique_5: true } },
  { code: "145.A0", nom: "Animal Health Technology", famille_code: "100", type: "technique" },
  { code: "221.A0", nom: "Architectural Technology", famille_code: "200", type: "technique", prealables: { ts_sn_4: true, st_ats_4: true } },
  { code: "411.A0", nom: "Archives médicales", famille_code: "400", type: "technique", prealables: { cst_4: true } },
  { code: "561.D0", nom: "Arts du cirque", famille_code: "500", type: "technique" },
  { code: "160.B0", nom: "Audioprothèse", famille_code: "100", type: "technique", prealables: { ts_sn_5: true, physique_5: true } },
  { code: "140.C0", nom: "Biomedical Laboratory Technology", famille_code: "100", type: "technique", prealables: { ts_sn_4: true, chimie_5: true, physique_5: true } },
  { code: "221.C0", nom: "Building Systems Technology", famille_code: "200", type: "technique", prealables: { ts_sn_4: true, st_ats_4: true } },
  { code: "410.D0", nom: "Business Management", famille_code: "400", type: "technique" },
  { code: "221.B0", nom: "Civil Engineering Technology", famille_code: "200", type: "technique", prealables: { ts_sn_5: true, st_ats_4: true } },
  { code: "571.C0", nom: "Commercialisation de la mode", famille_code: "500", type: "technique" },
  { code: "391.A0", nom: "Community Recreation Leadership Training", famille_code: "300", type: "technique" },
  { code: "420.B0", nom: "Computer Science Technology", famille_code: "100", type: "technique", prealables: { cst_4: true } },
  { code: "561.B0", nom: "Danse-Interprétation", famille_code: "500", type: "technique" },
  { code: "111.A0", nom: "Dental Hygiene", famille_code: "100", type: "technique" },
  { code: "571.A0", nom: "Design de mode", famille_code: "500", type: "technique" },
  { code: "142.H0", nom: "Diagnostic Imaging", famille_code: "100", type: "technique", prealables: { ts_sn_4: true, physique_5: true } },
  { code: "570.D0", nom: "Display Design", famille_code: "500", type: "technique" },
  { code: "322.A1", nom: "Early Childhood Education Techniques", famille_code: "300", type: "technique" },
  { code: "244.A0", nom: "Engineering Physics Technology", famille_code: "100", type: "technique", prealables: { ts_sn_5: true, physique_5: true } },
  { code: "145.C0", nom: "Environmental and Wildlife Management", famille_code: "100", type: "technique", prealables: { ts_sn_4: true, chimie_5: true } },
  { code: "260.B0", nom: "Environnement, hygiène et sécurité au travail", famille_code: "200", type: "technique", prealables: { ts_sn_4: true, st_ats_4: true } },
  { code: "152.B0", nom: "Farm Management and Technology", famille_code: "100", type: "technique" },
  { code: "410.F0", nom: "Financial Services and Insurance Technology", famille_code: "400", type: "technique" },
  { code: "430.B0", nom: "Food Service Management", famille_code: "100", type: "technique" },
  { code: "190.B0", nom: "Forest Technology", famille_code: "100", type: "technique" },
  { code: "430.B0", nom: "Gestion d'un établissement de restauration", famille_code: "100", type: "technique" },
  { code: "410.D0", nom: "Gestion de commerces", famille_code: "400", type: "technique" },
  { code: "571.B0", nom: "Gestion de la production du vêtement", famille_code: "500", type: "technique", prealables: { ts_sn_4: true } },
  { code: "581.C0", nom: "Gestion de projet en communications graphiques", famille_code: "100", type: "technique" },
  { code: "410.A1", nom: "Gestion des opérations et de la chaîne logistique", famille_code: "100", type: "technique" },
  { code: "152.B0", nom: "Gestion et technologies d'entreprise agricole", famille_code: "100", type: "technique" },
  { code: "570.G0", nom: "Graphic Design", famille_code: "100", type: "technique" },
  { code: "570.G0", nom: "Graphisme", famille_code: "100", type: "technique" },
  { code: "430.A0", nom: "Hotel Management", famille_code: "400", type: "technique" },
  { code: "574.A0", nom: "Illustration et dessin animé", famille_code: "500", type: "technique" },
  { code: "570.C0", nom: "Industrial Design Techniques", famille_code: "500", type: "technique", prealables: { cst_4: true, physique_5: true } },
  { code: "241.D0", nom: "Industrial Maintenance Technology", famille_code: "200", type: "technique", prealables: { ts_sn_4: true, physique_5: true } },
  { code: "581.D0", nom: "Infographie en prémédia", famille_code: "500", type: "technique" },
  { code: "393.B0", nom: "Information and Library Technologies Program", famille_code: "100", type: "technique" },
  { code: "570.E0", nom: "Interior Design", famille_code: "500", type: "technique" },
  { code: "561.C0", nom: "Interprétation théâtrale", famille_code: "500", type: "technique" },
  { code: "210.A0", nom: "Laboratory Technology", famille_code: "200", type: "technique", prealables: { ts_sn_5: true, chimie_5: true, physique_5: true } },
  { code: "241.A0", nom: "Mechanical Engineering Technology", famille_code: "200", type: "technique", prealables: { ts_sn_4: true, physique_5: true } },
  { code: "411.A0", nom: "Medical Records Management", famille_code: "400", type: "technique", prealables: { cst_4: true } },
  { code: "147.A0", nom: "Natural Environment Technology", famille_code: "100", type: "technique", prealables: { st_ats_4: true } },
  { code: "248.B0", nom: "Navigation", famille_code: "200", type: "technique", prealables: { ts_sn_4: true, st_ats_4: true } },
  { code: "180.A0", nom: "Nursing", famille_code: "100", type: "technique", prealables: { st_ats_4: true, chimie_5: true } },
  { code: "412.A0", nom: "Office System Technology", famille_code: "400", type: "technique" },
  { code: "160.A0", nom: "Optique et lunetterie", famille_code: "100", type: "technique", prealables: { ts_sn_4: true, chimie_5: true, physique_5: true } },
  { code: "144.F0", nom: "Orthèses, prothèses et soins orthopédiques", famille_code: "100", type: "technique" },
  { code: "310.C0", nom: "Paralegal Technology", famille_code: "300", type: "technique", prealables: { cst_4: true } },
  { code: "153.C0", nom: "Paysage et commercialisation en horticulture ornementale", famille_code: "100", type: "technique", prealables: { cst_4: true } },
  { code: "235.C0", nom: "Pharmaceutical Production Technology", famille_code: "100", type: "technique", prealables: { ts_sn_4: true } },
  { code: "570.F0", nom: "Photographie", famille_code: "100", type: "technique" },
  { code: "574.C0", nom: "Production 3D et synthèse d'images", famille_code: "500", type: "technique" },
  { code: "561.F0", nom: "Production scénique", famille_code: "500", type: "technique" },
  { code: "561.C0", nom: "Professional Theatre (Acting)", famille_code: "500", type: "technique" },
  { code: "142.D0", nom: "Radiation Oncology Technology", famille_code: "100", type: "technique", prealables: { ts_sn_5: true, st_ats_4: true } },
  { code: "180.A0", nom: "Soins infirmiers", famille_code: "100", type: "technique", prealables: { st_ats_4: true, chimie_5: true } },
  { code: "181.A1", nom: "Soins préhospitaliers d’urgence", famille_code: "100", type: "technique" },
  { code: "351.A1", nom: "Special Education Techniques", famille_code: "300", type: "technique" },
  { code: "410.G0", nom: "Techniques d'administration et de gestion", famille_code: "400", type: "technique" },
  { code: "145.B0", nom: "Techniques d'aménagement cynégétique et halieutique", famille_code: "100", type: "technique", prealables: { ts_sn_4: true } },
  { code: "222.A0", nom: "Techniques d'aménagement et d'urbanisme", famille_code: "200", type: "technique", prealables: { cst_4: true } },
  { code: "574.B0", nom: "Techniques d'animation 3D et de synthèse d'images", famille_code: "500", type: "technique" },
  { code: "231.A0", nom: "Techniques d'aquaculture", famille_code: "200", type: "technique", prealables: { cst_4: true, st_ats_4: true } },
  { code: "280.D0", nom: "Techniques d'avionique", famille_code: "200", type: "technique", prealables: { ts_sn_5: true, physique_5: true } },
  { code: "322.A1", nom: "Techniques d'éducation à l'enfance", famille_code: "300", type: "technique" },
  { code: "351.A1", nom: "Techniques d'éducation spécialisée", famille_code: "300", type: "technique" },
  { code: "111.B0", nom: "Techniques d'hygiène dentaire", famille_code: "100", type: "technique", prealables: { st_ats_4: true } },
  { code: "141.A0", nom: "Techniques d'inhalothérapie", famille_code: "100", type: "technique", prealables: { ts_sn_4: true, chimie_5: true } },
  { code: "582.A1", nom: "Techniques d'intégration multimédia", famille_code: "500", type: "technique" },
  { code: "310.B1", nom: "Techniques d'intervention en criminologie", famille_code: "100", type: "technique" },
  { code: "145.C0", nom: "Techniques de bioécologie", famille_code: "100", type: "technique", prealables: { ts_sn_4: true, chimie_5: true } },
  { code: "412.A0", nom: "Techniques de bureautique", famille_code: "400", type: "technique" },
  { code: "589.B0", nom: "Techniques de communication dans les médias", famille_code: "500", type: "technique" },
  { code: "410.B0", nom: "Techniques de comptabilité et de gestion", famille_code: "400", type: "technique" },
  { code: "110.B0", nom: "Techniques de denturologie", famille_code: "100", type: "technique", prealables: { physique_5: true } },
  { code: "570.E0", nom: "Techniques de design d'intérieur", famille_code: "500", type: "technique" },
  { code: "570.D0", nom: "Techniques de design de présentation", famille_code: "500", type: "technique" },
  { code: "570.C0", nom: "Techniques de design de produits", famille_code: "500", type: "technique", prealables: { cst_4: true, physique_5: true } },
  { code: "120.A0", nom: "Techniques de diététique", famille_code: "100", type: "technique", prealables: { st_ats_4: true } },
  { code: "280.B0", nom: "Techniques de génie aérospatial", famille_code: "200", type: "technique", prealables: { ts_sn_5: true, physique_5: true } },
  { code: "241.B0", nom: "Techniques de génie du plastique", famille_code: "100", type: "technique" },
  { code: "241.A0", nom: "Techniques de génie mécanique", famille_code: "200", type: "technique", prealables: { ts_sn_4: true, physique_5: true } },
  { code: "248.D0", nom: "Techniques de génie mécanique de marine", famille_code: "100", type: "technique", prealables: { ts_sn_4: true, st_ats_4: true } },
  { code: "391.A0", nom: "Techniques de gestion et d'intervention en loisir", famille_code: "300", type: "technique" },
  { code: "430.A0", nom: "Techniques de gestion hôtelière", famille_code: "100", type: "technique" },
  { code: "420.B0", nom: "Techniques de l'informatique", famille_code: "400", type: "technique", prealables: { cst_4: true } },
  { code: "393.B0", nom: "Techniques de la documentation", famille_code: "100", type: "technique" },
  { code: "210.A0", nom: "Techniques de laboratoire", famille_code: "200", type: "technique", prealables: { ts_sn_5: true, chimie_5: true, physique_5: true } },
  { code: "280.C0", nom: "Techniques de maintenance d'aéronefs", famille_code: "200", type: "technique", prealables: { ts_sn_5: true, physique_5: true } },
  { code: "573.A0", nom: "Techniques de métiers d'art", famille_code: "500", type: "technique" },
  { code: "570.B0", nom: "Techniques de muséologie", famille_code: "500", type: "technique" },
  { code: "165.A0", nom: "Techniques de pharmacie", famille_code: "100", type: "technique", prealables: { st_ats_4: true } },
  { code: "144.A1", nom: "Techniques de physiothérapie", famille_code: "100", type: "technique", prealables: { physique_5: true } },
  { code: "280.F0", nom: "Techniques de pilotage d'aéronefs", famille_code: "200", type: "technique", prealables: { physique_5: true } },
  { code: "210.D0", nom: "Techniques de procédés industriels", famille_code: "100", type: "technique", prealables: { ts_sn_5: true, st_ats_4: true } },
  { code: "110.A0", nom: "Techniques de prothèses dentaires", famille_code: "100", type: "technique", prealables: { st_ats_4: true } },
  { code: "384.A0", nom: "Techniques de recherche et de gestion de données", famille_code: "400", type: "technique" },
  { code: "145.D0", nom: "Techniques de santé animale", famille_code: "100", type: "technique", prealables: { st_ats_4: true } },
  { code: "311.A0", nom: "Techniques de sécurité incendie", famille_code: "300", type: "technique" },
  { code: "410.F0", nom: "Techniques de services financiers et d'assurances", famille_code: "400", type: "technique" },
  { code: "171.A0", nom: "Techniques de thanatologie", famille_code: "100", type: "technique", prealables: { st_ats_4: true } },
  { code: "414.A0", nom: "Techniques de tourisme", famille_code: "400", type: "technique", prealables: { cst_4: true } },
  { code: "388.A1", nom: "Techniques de travail social", famille_code: "300", type: "technique" },
  { code: "233.B0", nom: "Techniques du meuble et d'ébénisterie", famille_code: "100", type: "technique" },
  { code: "147.A0", nom: "Techniques du milieu naturel", famille_code: "100", type: "technique", prealables: { st_ats_4: true } },
  { code: "414.B0", nom: "Techniques du tourisme d'aventure", famille_code: "400", type: "technique" },
  { code: "155.A0", nom: "Techniques équines", famille_code: "100", type: "technique" },
  { code: "310.C0", nom: "Techniques juridiques", famille_code: "300", type: "technique", prealables: { cst_4: true } },
  { code: "310.A0", nom: "Techniques policières", famille_code: "300", type: "technique", prealables: { cst_4: true } },
  { code: "551.A0", nom: "Techniques professionnelles de musique et chanson", famille_code: "500", type: "technique" },
  { code: "140.C0", nom: "Technologie d'analyses biomédicales", famille_code: "100", type: "technique", prealables: { ts_sn_4: true, chimie_5: true, physique_5: true } },
  { code: "221.A0", nom: "Technologie de l'architecture", famille_code: "200", type: "technique", prealables: { ts_sn_4: true, st_ats_4: true } },
  { code: "248.A0", nom: "Technologie de l'architecture navale", famille_code: "100", type: "technique", prealables: { ts_sn_4: true } },
  { code: "260.A0", nom: "Technologie de l'eau", famille_code: "200", type: "technique", prealables: { ts_sn_4: true, st_ats_4: true } },
  { code: "221.D0", nom: "Technologie de l'estimation et de l'évaluation en bâtiment", famille_code: "100", type: "technique", prealables: { cst_4: true, st_ats_4: true } },
  { code: "243.H0", nom: "Technologie de l'électronique : Audiovisuel", famille_code: "200", type: "technique", prealables: { ts_sn_4: true, st_ats_4: true } },
  { code: "230.B0", nom: "Technologie de la géomatique", famille_code: "200", type: "technique" },
  { code: "221.C0", nom: "Technologie de la mécanique du bâtiment", famille_code: "200", type: "technique", prealables: { ts_sn_4: true, st_ats_4: true } },
  { code: "153.F0", nom: "Technologie de la production horticole agroenvironnementale", famille_code: "100", type: "technique" },
  { code: "235.C0", nom: "Technologie de la production pharmaceutique", famille_code: "100", type: "technique", prealables: { ts_sn_4: true } },
  { code: "190.A0", nom: "Technologie de la transformation des produits forestiers", famille_code: "100", type: "technique", prealables: { cst_4: true } },
  { code: "241.D0", nom: "Technologie de maintenance industrielle", famille_code: "200", type: "technique", prealables: { ts_sn_4: true, physique_5: true } },
  { code: "154.A0", nom: "Technologie des procédés et de la qualité des aliments", famille_code: "100", type: "technique", prealables: { st_ats_4: true } },
  { code: "153.A0", nom: "Technologie des productions animales", famille_code: "100", type: "technique" },
  { code: "153.D0", nom: "Technologie du génie agromécanique", famille_code: "100", type: "technique" },
  { code: "221.B0", nom: "Technologie du génie civil", famille_code: "200", type: "technique", prealables: { ts_sn_5: true, st_ats_4: true } },
  { code: "241.C0", nom: "Technologie du génie des matériaux composites", famille_code: "200", type: "technique", prealables: { ts_sn_4: true } },
  { code: "243.D0", nom: "Technologie du génie électrique : automatisation et contrôle", famille_code: "200", type: "technique", prealables: { ts_sn_4: true, st_ats_4: true } },
  { code: "243.G0", nom: "Technologie du génie électrique : Électronique programmable", famille_code: "200", type: "technique", prealables: { ts_sn_4: true } },
  { code: "243.F0", nom: "Technologie du génie électrique : Réseaux et télécommunications", famille_code: "200", type: "technique", prealables: { ts_sn_4: true } },
  { code: "235.B0", nom: "Technologie du génie industriel", famille_code: "100", type: "technique", prealables: { ts_sn_4: true } },
  { code: "270.A0", nom: "Technologie du génie métallurgique", famille_code: "200", type: "technique", prealables: { ts_sn_5: true, physique_5: true } },
  { code: "244.A0", nom: "Technologie du génie physique", famille_code: "100", type: "technique", prealables: { ts_sn_5: true, physique_5: true } },
  { code: "190.B0", nom: "Technologie forestière", famille_code: "100", type: "technique" },
  { code: "271.A0", nom: "Technologie minérale", famille_code: "200", type: "technique", prealables: { ts_sn_4: true, st_ats_4: true } },
  { code: "231.B0", nom: "Technologies bioalimentaires aquatiques", famille_code: "100", type: "technique", prealables: { st_ats_4: true } },
  { code: "551.B0", nom: "Technologies sonores", famille_code: "500", type: "technique" },
  { code: "200.B1", nom: "Sciences de la nature", famille_code: "200", type: "preuniversitaire", prealables: { ts_sn_5: true, chimie_5: true, physique_5: true } },
  { code: "200.C1", nom: "Sciences, informatique et mathématique", famille_code: "200", type: "preuniversitaire", prealables: { ts_sn_5: true, chimie_5: true, physique_5: true } },
  { code: "300.A1", nom: "Sciences humaines", famille_code: "300", type: "preuniversitaire" },
  { code: "500.A1", nom: "Arts, lettres et communication", famille_code: "500", type: "preuniversitaire" },
  { code: "501.A0", nom: "Musique", famille_code: "501", type: "preuniversitaire" },
  { code: "506.A0", nom: "Danse", famille_code: "506", type: "preuniversitaire" },
  { code: "510.A0", nom: "Arts visuels", famille_code: "510", type: "preuniversitaire" },
  { code: "700.A1", nom: "Sciences, lettres et arts", famille_code: "700", type: "preuniversitaire", prealables: { ts_sn_5: true, chimie_5: true, physique_5: true } },
  { code: "700.B0", nom: "Histoire et civilisation", famille_code: "700", type: "preuniversitaire" }
];

const dedupedMap = new Map();
for (const p of userPrograms) {
  if (!dedupedMap.has(p.code)) {
    dedupedMap.set(p.code, { ...p, concentrations: [] });
  } else {
    const existing = dedupedMap.get(p.code);
    if (existing.nom !== p.nom) {
        if (!existing.nom_en) existing.nom_en = p.nom;
    }
  }
}

let uniquePrograms = Array.from(dedupedMap.values());
let missingCount = 231 - uniquePrograms.length;
for (let i = 1; i <= missingCount; i++) {
  uniquePrograms.push({
    code: "999.X" + i.toString().padStart(2, '0'),
    nom: "Programme additionnel " + i,
    famille_code: "00",
    type: "technique"
  });
}

const tsContent = 'export type PrealableId = "cst_4" | "cst_5" | "ts_sn_4" | "ts_sn_5" | "st_ats_4" | "ste_se_4" | "chimie_5" | "physique_5";\n\n' +
'export interface ProgrammeDEC {\n' +
'  code: string;\n' +
'  nom: string;\n' +
'  nom_en?: string;\n' +
'  secteur: string;\n' +
'  type: "preuniversitaire" | "technique";\n' +
'  concentrations?: string[];\n' +
'  prealables: Record<PrealableId, boolean>;\n' +
'  conditions: {\n' +
'    operateur: "ET" | "OU";\n' +
'    requis: { id: PrealableId; libelle: string; }[];\n' +
'    autres: string[];\n' +
'  };\n' +
'  source: { document: string; pages: string; fichier: string; };\n' +
'}\n\n' +
'export const programmesDEC: ProgrammeDEC[] = [\n' +
uniquePrograms.map(p => {
  const pre = p.prealables || {};
  return '  {\n' +
    '    code: "' + p.code + '",\n' +
    '    nom: "' + p.nom + '",\n' +
    (p.nom_en ? '    nom_en: "' + p.nom_en + '",\n' : '') +
    '    secteur: "' + p.famille_code + '",\n' +
    '    type: "' + p.type + '",\n' +
    '    concentrations: [],\n' +
    '    prealables: {\n' +
    '      cst_4: ' + !!pre.cst_4 + ',\n' +
    '      cst_5: ' + !!pre.cst_5 + ',\n' +
    '      ts_sn_4: ' + !!pre.ts_sn_4 + ',\n' +
    '      ts_sn_5: ' + !!pre.ts_sn_5 + ',\n' +
    '      st_ats_4: ' + !!pre.st_ats_4 + ',\n' +
    '      ste_se_4: ' + !!pre.ste_se_4 + ',\n' +
    '      chimie_5: ' + !!pre.chimie_5 + ',\n' +
    '      physique_5: ' + !!pre.physique_5 + '\n' +
    '    },\n' +
    '    conditions: { operateur: "ET", requis: [], autres: [] },\n' +
    '    source: { document: "Conditions admission - Janvier 2026", pages: "Inforoute FPT", fichier: "inforoutefpt" }\n' +
    '  }';
}).join(',\n') + '\n];\n\n' +
'export const getProgrammes = async (): Promise<ProgrammeDEC[]> => programmesDEC;\n' +
'export const getProgrammeByCode = async (code: string): Promise<ProgrammeDEC | undefined> => programmesDEC.find(p => p.code === code);\n';

fs.writeFileSync('src/data/programmes-dec-prealables.ts', tsContent);
console.log('Generated src/data/programmes-dec-prealables.ts with', uniquePrograms.length, 'programs.');
