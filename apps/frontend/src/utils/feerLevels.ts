/**
 * feerLevels.ts
 * =============
 * Traduction grand public des niveaux de formation et de qualification (FEER / TEER CNP 2021).
 * Remplace l'acronyme technique FEER 0-5 par des libellés clairs, vulgarisés et pédagogiques.
 */

export interface NiveauEtudesInfo {
  feer: number;
  label: string;          // Ex: "Formation collégiale technique (DEC)"
  labelCourt: string;     // Ex: "Collégial (DEC)"
  diplomeCourt: string;   // Ex: "DEC"
  categorie: "Universitaire" | "Collégial" | "Professionnel" | "Secondaire" | "Direction" | "En emploi";
  diplomes: string;       // Ex: "DEC technique de 3 ans ou AEC"
  description: string;
  badgeClass: string;
}

export const FEER_NIVEAUX_MAP: Record<number, NiveauEtudesInfo> = {
  0: {
    feer: 0,
    label: "Gestion & Direction",
    labelCourt: "Gestion & Cadres",
    diplomeCourt: "Direction",
    categorie: "Direction",
    diplomes: "Baccalauréat, maîtrise ou solide expérience de gestion",
    description: "Postes de direction, de cadres supérieurs ou intermédiaires.",
    badgeClass: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/60"
  },
  1: {
    feer: 1,
    label: "Formation universitaire (Baccalauréat / Maîtrise / Doctorat)",
    labelCourt: "Universitaire (BAC+)",
    diplomeCourt: "Université",
    categorie: "Universitaire",
    diplomes: "Baccalauréat (3-4 ans), Maîtrise (2 ans) ou Doctorat / Médecine",
    description: "Professions spécialisées exigeant un diplôme universitaire de 1er, 2e ou 3e cycle.",
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/60"
  },
  2: {
    feer: 2,
    label: "Formation collégiale technique (DEC 3 ans)",
    labelCourt: "Collégial (DEC)",
    diplomeCourt: "DEC",
    categorie: "Collégial",
    diplomes: "Diplôme d'études collégiales technique (DEC) ou apprentissage spécialisé de 2 à 3 ans",
    description: "Postes techniques, technologiques et cliniques exigeant un diplôme collégial de 3 ans.",
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
  },
  3: {
    feer: 3,
    label: "Formation professionnelle ou collégiale courte (DEP / AEC)",
    labelCourt: "Professionnel (DEP/AEC)",
    diplomeCourt: "DEP/AEC",
    categorie: "Professionnel",
    diplomes: "Diplôme d'études professionnelles (DEP de 1 à 2 ans) ou Attestation collégiale (AEC)",
    description: "Métiers qualifiés exigeant une formation professionnelle ou technique courte.",
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60"
  },
  4: {
    feer: 4,
    label: "Diplôme d'études secondaires (DES)",
    labelCourt: "Secondaire (DES)",
    diplomeCourt: "DES",
    categorie: "Secondaire",
    diplomes: "Diplôme d'études secondaires (DES) ou formation en cours d'emploi de plusieurs semaines",
    description: "Postes d'exécution ou de service exigeant généralement un diplôme d'études secondaires.",
    badgeClass: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700/60"
  },
  5: {
    feer: 5,
    label: "Formation en cours d'emploi",
    labelCourt: "En cours d'emploi",
    diplomeCourt: "En emploi",
    categorie: "En emploi",
    diplomes: "Aucune exigence formelle préalable, apprentissage direct sur le terrain",
    description: "Postes d'entrée ou de soutien avec apprentissage direct sur le milieu de travail.",
    badgeClass: "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700/60"
  }
};

export function getNiveauEtudes(feer: number): NiveauEtudesInfo {
  return FEER_NIVEAUX_MAP[feer] || {
    feer,
    label: `Niveau de qualification ${feer}`,
    labelCourt: `Niveau ${feer}`,
    diplomeCourt: `FEER ${feer}`,
    categorie: "Secondaire",
    diplomes: "Formation équivalente",
    description: "Niveau de qualification officiel selon la CNP 2021.",
    badgeClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200"
  };
}
