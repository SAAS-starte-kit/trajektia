// ============================================================
// src/utils/satisfaction-engine.ts
// Moteur de scoring pour la satisfaction et valeurs de travail
// (Theory of Work Adjustment - TWA)
// ============================================================

import type { RawResponses, CareerMatch } from "./scoring-engine";
import { pearsonCorrelation } from "./scoring-engine";
import {
  QUESTIONS_SATISFACTION,
  type ValeurTravail,
  VALEURS_TRAVAIL_META,
} from "../data/questions-satisfaction";
import { METIERS_DATA } from "../data/metiers";
import {
  calculatePRRSM,
  calculateTATInteractions,
  formatPomp,
  getStrainZoneStyle,
  type PersonScores,
  type JobProfile,
  type TATTension,
  type OnetContextScores,
  type StrainZone,
} from "./pr-rsm-engine";

export interface ValeursScores {
  accomplissement: number;
  independance: number;
  reconnaissance: number;
  relations: number;
  soutien: number;
  conditions_travail: number;
}

export interface SatisfactionResults {
  valeurs: ValeursScores;
  valeurs_dominantes: ValeurTravail[];
  differenciation: number;
  timestamp: string;
  totalQuestions: number;
  completedQuestions: number;
}

export interface SatisfactionFit {
  cnp: string;
  titre_court: string;
  secteur: string;
  salaire_annuel_median: number;
  score_satisfaction: number;
  r: number;
  leviers: ValeurTravail[];
  vigilances: ValeurTravail[];
  commentaire: string;
}

// L'ordre des dimensions vectorielles est strict et doit correspondre
// entre l'usager et le métier.
const VECTOR_ORDER: (keyof ValeursScores)[] = [
  "accomplissement",
  "independance",
  "reconnaissance",
  "relations",
  "soutien",
  "conditions_travail",
];

const VALEUR_MAP: Record<ValeurTravail, keyof ValeursScores> = {
  Accomplissement: "accomplissement",
  Independance: "independance",
  Reconnaissance: "reconnaissance",
  Relations: "relations",
  Soutien: "soutien",
  Conditions_Travail: "conditions_travail",
};

const KEY_TO_VALEUR: Record<keyof ValeursScores, ValeurTravail> = {
  accomplissement: "Accomplissement",
  independance: "Independance",
  reconnaissance: "Reconnaissance",
  relations: "Relations",
  soutien: "Soutien",
  conditions_travail: "Conditions_Travail",
};

/**
 * Écart-type d'un tableau de nombres
 */
function standardDeviation(arr: number[]): number {
  if (arr.length <= 1) return 0;
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  const variance =
    arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

/**
 * Génère un commentaire positif basé sur les leviers et vigilances
 */
function generateCommentaire(
  leviers: ValeurTravail[],
  vigilances: ValeurTravail[]
): string {
  let commentaire = "";
  if (leviers.length > 0) {
    const labels = leviers.map((l) => VALEURS_TRAVAIL_META[l].label_fr.toLowerCase());
    commentaire += `Ce milieu offre un excellent potentiel pour répondre à votre besoin de ${labels.join(" et de ")}. `;
  }
  if (vigilances.length > 0) {
    const labels = vigilances.map((l) => VALEURS_TRAVAIL_META[l].label_fr.toLowerCase());
    commentaire += `Ce poste demanderait de trouver cette satisfaction liée à ${labels.join(" et à ")} ailleurs que dans le cadre professionnel.`;
  }
  return commentaire.trim();
}

/**
 * 1. Calcule les scores de satisfaction 0-100 à partir des réponses Likert 1-5
 */
export function calculateSatisfactionScores(
  responses: RawResponses
): SatisfactionResults {
  const rawScores: Record<ValeurTravail, number> = {
    Accomplissement: 0,
    Independance: 0,
    Reconnaissance: 0,
    Relations: 0,
    Soutien: 0,
    Conditions_Travail: 0,
  };

  const counts: Record<ValeurTravail, number> = {
    Accomplissement: 0,
    Independance: 0,
    Reconnaissance: 0,
    Relations: 0,
    Soutien: 0,
    Conditions_Travail: 0,
  };

  let completedQuestions = 0;

  for (const question of QUESTIONS_SATISFACTION) {
    const rawScore = responses[question.id];
    if (rawScore === undefined || rawScore === null) continue;

    completedQuestions++;
    rawScores[question.valeur] += rawScore;
    counts[question.valeur]++;
  }

  const normalize = (raw: number, itemCount: number): number => {
    if (itemCount === 0) return 0;
    const min = itemCount * 1;
    const max = itemCount * 5;
    const percentage = Math.round(((raw - min) / (max - min)) * 100);
    return Math.min(100, Math.max(0, percentage));
  };

  const valeurs: ValeursScores = {
    accomplissement: normalize(rawScores.Accomplissement, counts.Accomplissement),
    independance: normalize(rawScores.Independance, counts.Independance),
    reconnaissance: normalize(rawScores.Reconnaissance, counts.Reconnaissance),
    relations: normalize(rawScores.Relations, counts.Relations),
    soutien: normalize(rawScores.Soutien, counts.Soutien),
    conditions_travail: normalize(rawScores.Conditions_Travail, counts.Conditions_Travail),
  };

  const scoresArray = Object.values(valeurs);
  const differenciation = standardDeviation(scoresArray);

  // Ordre de départage arbitraire mais déterministe en cas d'égalité
  const tieBreakOrder = VECTOR_ORDER;
  const sorted = (Object.keys(valeurs) as (keyof ValeursScores)[]).sort((a, b) => {
    if (valeurs[b] !== valeurs[a]) {
      return valeurs[b] - valeurs[a];
    }
    return tieBreakOrder.indexOf(a) - tieBreakOrder.indexOf(b);
  });

  const valeurs_dominantes = sorted.slice(0, 3).map((k) => KEY_TO_VALEUR[k]);

  return {
    valeurs,
    valeurs_dominantes,
    differenciation,
    timestamp: new Date().toISOString(),
    totalQuestions: QUESTIONS_SATISFACTION.length,
    completedQuestions,
  };
}

export function buildUserValuesVector(r: SatisfactionResults): number[] {
  return VECTOR_ORDER.map((key) => r.valeurs[key]);
}

export function buildJobValuesVector(cnp: string): number[] | null {
  const metier = METIERS_DATA.find(m => m.cnp === cnp);
  if (!metier || !metier.onet_work_values || !metier.onet_work_values.scores) return null;
  return VECTOR_ORDER.map((key) => metier.onet_work_values!.scores[key]);
}

export function getSatisfactionFit(
  results: SatisfactionResults,
  candidats: {
    cnp: string;
    titre_court: string;
    secteur: string;
    salaire_annuel_median: number;
  }[]
): SatisfactionFit[] {
  if (results.differenciation < 3) {
    return [];
  }

  const userVector = buildUserValuesVector(results);
  const fits: SatisfactionFit[] = [];

  for (const candidat of candidats) {
    const jobVector = buildJobValuesVector(candidat.cnp);
    if (!jobVector) continue;

    const r = pearsonCorrelation(userVector, jobVector);
    if (r === 0) continue; // Instabilité numérique

    const score_satisfaction = Math.round(Math.min(99, Math.max(10, 50 + r * 48)));
    const metier = METIERS_DATA.find(m => m.cnp === candidat.cnp);
    if (!metier || !metier.onet_work_values) continue;
    const profile = metier.onet_work_values;

    const leviers: ValeurTravail[] = [];
    const vigilances: ValeurTravail[] = [];

    for (const dom of results.valeurs_dominantes) {
      const key = VALEUR_MAP[dom];
      const jobScore = profile.scores[key];
      if (jobScore > 60) {
        leviers.push(dom);
      } else if (jobScore < 40) {
        vigilances.push(dom);
      }
    }

    fits.push({
      cnp: candidat.cnp,
      titre_court: candidat.titre_court,
      secteur: candidat.secteur,
      salaire_annuel_median: candidat.salaire_annuel_median,
      score_satisfaction,
      r,
      leviers,
      vigilances,
      commentaire: generateCommentaire(leviers, vigilances),
    });
  }

  fits.sort((a, b) => {
    if (b.r !== a.r) return b.r - a.r;
    return a.cnp.localeCompare(b.cnp);
  });

  return fits;
}

export function rerankBySatisfaction(
  affinityMatches: CareerMatch[],
  results: SatisfactionResults
): Array<CareerMatch & { score_satisfaction: number | null; rang_original: number }> {
  if (results.differenciation < 3) {
    // Profil indifférencié, on ne classe pas, on retourne sans changement (ou null partout)
    return affinityMatches.map((m, i) => ({
      ...m,
      score_satisfaction: null,
      rang_original: i + 1,
    }));
  }

  const userVector = buildUserValuesVector(results);

  const augmented = affinityMatches.map((match, index) => {
    const jobVector = buildJobValuesVector(match.cnp);
    let score_satisfaction: number | null = null;
    let r_sat = -2; // pour le tri (les null en bas)
    
    if (jobVector) {
      const r = pearsonCorrelation(userVector, jobVector);
      if (r !== 0) {
        score_satisfaction = Math.round(Math.min(99, Math.max(10, 50 + r * 48)));
        r_sat = r;
      }
    }

    return {
      ...match,
      score_satisfaction,
      r_sat,
      rang_original: index + 1,
    };
  });

  augmented.sort((a, b) => {
    // Si l'un est null, il va à la fin
    if (a.score_satisfaction === null && b.score_satisfaction !== null) return 1;
    if (a.score_satisfaction !== null && b.score_satisfaction === null) return -1;
    // Sinon tri par r_sat décroissant
    if (b.r_sat !== a.r_sat) return b.r_sat - a.r_sat;
    return a.cnp.localeCompare(b.cnp);
  });

  // on enlève r_sat pour matcher la signature de retour (Optionnel, typescript s'en fiche si on retourne un champ en plus, mais on le garde clean)
  return augmented.map((a) => {
    const { r_sat, ...rest } = a;
    return rest;
  });
}

// ────────────────────────────────────────────────────────────
// PERSISTANCE localStorage
// ────────────────────────────────────────────────────────────
const STORAGE_KEY = "trajektia_satisfaction_results_v1";

export function saveSatisfactionResults(results: SatisfactionResults): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    console.warn("Impossible de sauvegarder les résultats dans localStorage.");
  }
}

export function getSatisfactionResults(): SatisfactionResults | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as SatisfactionResults;
    if (parsed.completedQuestions !== parsed.totalQuestions) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSatisfactionResults(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently fail
  }
}

// ============================================================
// PR-RSM & DIAGNOSTIC TAT
// Modélisation non-linéaire de la surface de satisfaction
// (Tett & Burnett, 2003 ; Edwards, 2002 ; Edwards & Cable, 2009)
// Réutilise les types et fonctions de ./pr-rsm-engine
// ============================================================

// ────────────────────────────────────────────────────────────
// TYPES — Surface de satisfaction & alignement TAT
// ────────────────────────────────────────────────────────────

/**
 * Axe PR-RSM diagnostiqué pour un point (X, Y).
 * - `Congruence`    : X ≈ Y  (l'environnement active les traits disponibles)
 * - `Incongruence`  : X ≠ Y  (le poste exige ce que la personne n'a pas,
 *                          ou active peu des traits pourtant disponibles)
 */
export type SatisfactionAxis = "Congruence" | "Incongruence";

/**
 * Issue dominante du diagnostic TAT, selon Tett & Burnett (2003).
 * Suit la règle clinique OCCOQ : formulation non-jugeante, orientée
 * « vigilance/opportunité » plutôt que « bon/mauvais ».
 */
export type TATOutcome =
  | "OpportuniteEpanouissement"
  | "TensionComportementale"
  | "RisqueDesengagement"
  | "Alignement";

/**
 * Point de la surface de satisfaction PR-RSM.
 * Permet de tracer la courbe Z = f(X, Y) et d'identifier
 * si le couple (X, Y) se trouve sur la ligne de congruence
 * (X = Y) ou sur la ligne d'incongruence (X = -Y).
 */
export interface SatisfactionSurfacePoint {
  /** Score normalisé de la personne (0–100) */
  X: number;
  /** Exigence du poste / contexte O*NET (0–100) */
  Y: number;
  /** Score de satisfaction prédit par la régression quadratique (0–100) */
  Z: number;
  /** Axe diagnostiqué pour ce point */
  axis: SatisfactionAxis;
  /** Valeur le long de l'axe :
   *  - `axisValue = X - Y` si Congruence   (0 = alignement parfait)
   *  - `axisValue = X + Y` si Incongruence (100 = distance max. à l'origine)
   */
  axisValue: number;
}

/**
 * Diagnostic complet Personne × Métier.
 * Conçu pour être consommé tel quel par un composant React ou Astro.
 */
export interface PersonJobDiagnosis {
  /** Score d'épanouissement global, moyenne des Z PR-RSM (0–100) */
  globalFulfillment: number;
  /** Traits forts × exigences élevées alignées → Opportunités */
  opportunities: TATTension[];
  /** Exigences fortes × traits faibles → Tensions / Burnout */
  behavioralTensions: TATTension[];
  /** Traits forts × exigences faibles → Désengagement / Boreout */
  disengagementRisks: TATTension[];
  /** Issue dominante diagnostiquée (TAT) */
  alignment: TATOutcome;
  /** POMP de l'épanouissement (0–100) */
  fulfillmentPomp: number;
  /** Narratif clinique bienveillant (standard OCCOQ) */
  narrative: string;
  /** Points (X, Y, Z) de la surface PR-RSM, par trait commun */
  surfacePoints: SatisfactionSurfacePoint[];
}

// ────────────────────────────────────────────────────────────
// CONSTANTES CLINIQUES
// (doivent rester cohérentes avec pr-rsm-engine.ts)
// ────────────────────────────────────────────────────────────

/** Seuil d'activation des Opportunités d'Épanouissement (TAT) */
const OPPORTUNITY_THRESHOLD = 60;
/** Écart minimal Y − X pour signaler une tension comportementale */
const STRAIN_GAP_THRESHOLD = 20;
/** Écart minimal X − Y pour signaler un risque de désengagement */
const DISENGAGEMENT_GAP_THRESHOLD = 20;
/** Tolérance autour de la ligne de congruence (X = Y) */
const CONGRUENCE_TOLERANCE = 15;
/** Bornes théoriques du score Z PR-RSM après étirement (cf. pr-rsm-engine.ts) */
const Z_THEORETICAL_MIN = 0;
const Z_THEORETICAL_MAX = 100;

// ────────────────────────────────────────────────────────────
// POMP — Percentage of Maximum Possible
// Cohen et al. (1999) : indice standardisé pour comparer
// des scores issus d'échelles différentes.
// ────────────────────────────────────────────────────────────

/**
 * Calcule l'indice POMP (Percentage of Maximum Possible) :
 *     POMP = (Score − Min) / (Max − Min) × 100
 *
 * Bornes de sortie clampées à [0, 100]. Si `max <= min`, la
 * fonction retourne 0 (indéfini mathématiquement).
 */
export function computePOMP(score: number, min: number, max: number): number {
  if (max <= min) return 0;
  const raw = ((score - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, raw));
}

// ────────────────────────────────────────────────────────────
// CLASSIFICATION D'AXE — Ligne de congruence vs d'incongruence
// Edwards (2002) recommande de tester ces deux axes explicitement
// pour distinguer fit positif (X = Y) de fit négatif (X = −Y).
// ────────────────────────────────────────────────────────────

/**
 * Détermine si un couple (X, Y) se situe sur la ligne de
 * congruence (X = Y) ou sur la ligne d'incongruence (X = -Y).
 *
 * La classification est purement géométrique : aucune note
 * morale n'est associée à un axe ou à l'autre.
 */
export function classifyAxis(
  personScore: number,
  jobScore: number
): { axis: SatisfactionAxis; axisValue: number } {
  const congruenceDistance = Math.abs(personScore - jobScore);
  if (congruenceDistance <= CONGRUENCE_TOLERANCE) {
    return { axis: "Congruence", axisValue: personScore - jobScore };
  }
  return { axis: "Incongruence", axisValue: personScore + jobScore };
}

// ────────────────────────────────────────────────────────────
// SURFACE PR-RSM
// ────────────────────────────────────────────────────────────

/**
 * Génère les points de la surface PR-RSM pour un trait donné,
 * en faisant varier X de 0 à 100 et en gardant Y fixe (jobScore).
 * Utile pour visualiser la courbe de satisfaction prédite.
 */
export function buildSurfaceSlice(
  jobScore: number,
  xSteps: number[] = [0, 25, 50, 75, 100]
): SatisfactionSurfacePoint[] {
  return xSteps.map((X) => {
    const Y = jobScore;
    const Z = calculatePRRSM(X, Y);
    const { axis, axisValue } = classifyAxis(X, Y);
    return { X, Y, Z, axis, axisValue };
  });
}

// ────────────────────────────────────────────────────────────
// DIAGNOSTIC TAT — Opportunités / Tensions / Désengagement
// Implémentation de Tett & Burnett (2003)
// ────────────────────────────────────────────────────────────

/**
 * Génère le narratif clinique OCCOQ pour le diagnostic.
 * Ton bienveillant, formulations descriptives, aucune étiquette rigide.
 */
function generateDiagnosisNarrative(state: {
  opportunities: TATTension[];
  behavioralTensions: TATTension[];
  disengagementRisks: TATTension[];
  globalFulfillment: number;
  alignment: TATOutcome;
  fulfillmentPomp: number;
}): string {
  const {
    opportunities,
    behavioralTensions,
    disengagementRisks,
    globalFulfillment,
    alignment,
  } = state;

  const fmt = (list: TATTension[], join: string) =>
    list.map((t) => t.traitName.toLowerCase()).join(` ${join} `);

  let intro = "";
  switch (alignment) {
    case "OpportuniteEpanouissement":
      intro =
        "Ce profil de poste semble présenter plusieurs occasions d'alignement stimulant " +
        "entre vos ressources personnelles et les exigences du contexte de travail. ";
      break;
    case "TensionComportementale":
      intro =
        "Certaines caractéristiques de ce contexte de travail pourraient demander un effort " +
        "d'adaptation soutenu dans la durée. Une exploration attentive est recommandée. ";
      break;
    case "RisqueDesengagement":
      intro =
        "Ce profil de poste présente des exigences qui pourraient ne pas suffisamment " +
        "mobiliser certaines de vos forces naturelles à long terme. ";
      break;
    case "Alignement":
    default:
      intro =
        "L'équilibre global entre vos prédispositions et les exigences de ce contexte " +
        "de travail semble cohérent, sans tension majeure identifiée. ";
  }

  let body = "";
  if (opportunities.length > 0) {
    body += `Des opportunités d'épanouissement sont repérées sur les dimensions ` +
      `${fmt(opportunities, "et")}. `;
  }
  if (behavioralTensions.length > 0) {
    body += `Quelques vigilances sont à considérer pour ${fmt(behavioralTensions, "et")} : ` +
      `ces exigences élevées pourraient générer une charge adaptative non négligeable. `;
  }
  if (disengagementRisks.length > 0) {
    body += `Un risque de sous-utilisation est identifié sur ${fmt(disengagementRisks, "et")} : ` +
      `vos forces naturelles dans ces dimensions gagneraient à être canalisées. `;
  }
  if (body === "") {
    body = "Aucune zone de vigilance significative n'a été détectée sur les dimensions analysées. ";
  }

  const closing =
    `Le score global d'épanouissement prédit par la surface PR-RSM est de ` +
    `${globalFulfillment} / 100 (POMP : ${formatPomp(state.fulfillmentPomp)}). ` +
    "Des aménagements du poste, une clarification du périmètre de responsabilités " +
    "ou un dialogue avec un(e) professionnel(le) d'orientation peuvent être explorés " +
    "pour favoriser votre bien-être et votre développement.";

  return (intro + body + closing).trim();
}

/**
 * Détermine la sévérité d'un écart, sur trois niveaux.
 * Suit le barème de Tett & Burnett (2003) : < 30 faible, 30–40 modéré, > 40 élevé.
 */
function severityFromGap(gap: number): "Faible" | "Modérée" | "Élevée" {
  const absGap = Math.abs(gap);
  if (absGap > 40) return "Élevée";
  if (absGap > 30) return "Modérée";
  return "Faible";
}

/**
 * Diagnostic principal : croise un profil de personne (IPIP-50 / Big Five)
 * et un profil de poste (Exigences O*NET mappées) et retourne :
 *  - le score d'épanouissement global prédit par PR-RSM,
 *  - les opportunités, tensions et risques de désengagement,
 *  - l'issue dominante selon la TAT,
 *  - le narratif clinique OCCOQ.
 *
 * Implémentation alignée sur Tett & Burnett (2003) et Edwards (2002).
 */
export function diagnosePersonJobAlignment(
  personScores: PersonScores,
  jobProfile: JobProfile
): PersonJobDiagnosis {
  const commonTraits = Object.keys(personScores).filter(
    (trait) => trait in jobProfile
  );

  const opportunities: TATTension[] = [];
  const behavioralTensions: TATTension[] = [];
  const disengagementRisks: TATTension[] = [];
  const surfacePoints: SatisfactionSurfacePoint[] = [];

  let totalZ = 0;

  for (const trait of commonTraits) {
    const X = personScores[trait];
    const Y = jobProfile[trait];
    const diffYX = Y - X; // > 0 = exigences > traits
    const diffXY = X - Y; // > 0 = traits > exigences

    // 1. Opportunités d'épanouissement : X ≥ 60 ET Y ≥ 60
    if (X >= OPPORTUNITY_THRESHOLD && Y >= OPPORTUNITY_THRESHOLD) {
      opportunities.push({
        traitName: trait,
        type: "Sur-sollicitation", // Réutilisation du type existant (sémantique = activation positive)
        severity: severityFromGap(diffYX),
        personScore: X,
        jobScore: Y,
        cost: Math.abs(diffYX),
      });
    }
    // 2. Tension comportementale / Burnout : Y >> X
    else if (diffYX > STRAIN_GAP_THRESHOLD) {
      behavioralTensions.push({
        traitName: trait,
        type: "Sur-sollicitation",
        severity: severityFromGap(diffYX),
        personScore: X,
        jobScore: Y,
        cost: diffYX,
      });
    }
    // 3. Risque de désengagement / Ennui : X >> Y
    else if (diffXY > DISENGAGEMENT_GAP_THRESHOLD) {
      disengagementRisks.push({
        traitName: trait,
        type: "Sous-utilisation",
        severity: severityFromGap(diffXY),
        personScore: X,
        jobScore: Y,
        cost: diffXY,
      });
    }

    // Calcul du point de surface (toujours, même hors zone)
    const Z = calculatePRRSM(X, Y);
    totalZ += Z;
    const { axis, axisValue } = classifyAxis(X, Y);
    surfacePoints.push({ X, Y, Z, axis, axisValue });
  }

  // Score global : moyenne des Z PR-RSM sur les traits communs
  const globalFulfillment =
    commonTraits.length > 0
      ? Math.round(totalZ / commonTraits.length)
      : 0;

  // Issue dominante : on tranche en faveur du signal le plus chargé
  // (priorité : tension > désengagement > opportunité > alignement),
  // choix aligné sur la prudence clinique OCCOQ.
  let alignment: TATOutcome;
  if (behavioralTensions.length > 0) {
    alignment = "TensionComportementale";
  } else if (disengagementRisks.length > 0) {
    alignment = "RisqueDesengagement";
  } else if (opportunities.length > 0) {
    alignment = "OpportuniteEpanouissement";
  } else {
    alignment = "Alignement";
  }

  const fulfillmentPomp = computePOMP(
    globalFulfillment,
    Z_THEORETICAL_MIN,
    Z_THEORETICAL_MAX
  );

  const narrative = generateDiagnosisNarrative({
    opportunities,
    behavioralTensions,
    disengagementRisks,
    globalFulfillment,
    fulfillmentPomp,
    alignment,
  });

  return {
    globalFulfillment,
    opportunities,
    behavioralTensions,
    disengagementRisks,
    alignment,
    fulfillmentPomp,
    narrative,
    surfacePoints,
  };
}

// ────────────────────────────────────────────────────────────
// WRAPPERS DEPUIS PR-RSM — Réexport sélectif pour les composants
// qui n'utilisent que satisfaction-engine.ts (SatisfactionTest)
// ────────────────────────────────────────────────────────────

/** Réexport de calculatePRRSM : utile pour les composants qui
 *  ne chargent que ce module. */
export { calculatePRRSM };
/** Réexport du formateur POMP depuis pr-rsm-engine. */
export { formatPomp, getStrainZoneStyle };

// ────────────────────────────────────────────────────────────
// STRAIN DIAGNOSTIC (OnetContextScores) — Pont TAT simplifié
// Réutilise calculateTATInteractions de pr-rsm-engine.ts
// (Tett & Burnett, 2003 ; Edwards & Cable, 2009)
// ────────────────────────────────────────────────────────────

/**
 * Variante du diagnostic principal qui prend en entrée les
 * scores O*NET Work Contexts bruts (4 dimensions) et les scores
 * IPIP de résistance (névrosisme / stabilité émotionnelle).
 *
 * C'est un pont vers `calculateTATInteractions` de pr-rsm-engine
 * : on garde la même signature de sortie côté `PersonJobDiagnosis`
 * en agrégeant les StrainResult en `behavioralTensions`.
 *
 * @param onetContexts Scores O*NET Work Contexts du métier
 * @param resistanceScores Scores IPIP de résistance (0–100)
 */
export function diagnoseStrainAlignment(
  onetContexts: OnetContextScores,
  resistanceScores: { nevrosisme: number; stabiliteEmotionnelle?: number }
): PersonJobDiagnosis {
  const interactions = calculateTATInteractions(resistanceScores, onetContexts);

  const behavioralTensions: TATTension[] = [];
  const disengagementRisks: TATTension[] = [];
  const opportunities: TATTension[] = [];

  for (const inter of interactions) {
    const { contextScore, resistanceScore, strainResult } = inter;
    const gap = strainResult.gap;

    // On mappe les zones TAT du Strain sur le modèle diagnostic :
    // - Zone Rouge  → tension comportementale (burnout)
    // - Zone Orange → désengagement (boreout / sous-stimulation)
    // - Zone Verte  → alignement / opportunité si gap proche de 0
    const baseTension: TATTension = {
      traitName: inter.contextLabel,
      type: "Sur-sollicitation",
      severity:
        strainResult.zone === "Rouge"
          ? "Élevée"
          : "Faible",
      personScore: resistanceScore,
      jobScore: contextScore,
      cost: Math.abs(gap),
    };

    if (strainResult.zone === "Rouge") {
      behavioralTensions.push({ ...baseTension, type: "Sur-sollicitation" });
    } else if (strainResult.zone === "Orange") {
      disengagementRisks.push({ ...baseTension, type: "Sous-utilisation" });
    } else {
      opportunities.push({ ...baseTension, type: "Sur-sollicitation" });
    }
  }

  // Score global : on moyenne les zones, en pénalisant les zones Rouge.
  const zoneScore: Record<StrainZone, number> = {
    Verte: 80,
    Orange: 55,
    Rouge: 30,
  };
  const globalFulfillment =
    interactions.length > 0
      ? Math.round(
          interactions.reduce(
            (acc: number, i: (typeof interactions)[number]) =>
              acc + zoneScore[i.strainResult.zone],
            0
          ) / interactions.length
        )
      : 0;

  const fulfillmentPomp = computePOMP(
    globalFulfillment,
    Z_THEORETICAL_MIN,
    Z_THEORETICAL_MAX
  );

  let alignment: TATOutcome;
  if (behavioralTensions.length > 0) {
    alignment = "TensionComportementale";
  } else if (disengagementRisks.length > 0) {
    alignment = "RisqueDesengagement";
  } else if (opportunities.length > 0) {
    alignment = "OpportuniteEpanouissement";
  } else {
    alignment = "Alignement";
  }

  const narrative = generateDiagnosisNarrative({
    opportunities,
    behavioralTensions,
    disengagementRisks,
    globalFulfillment,
    fulfillmentPomp,
    alignment,
  });

  return {
    globalFulfillment,
    opportunities,
    behavioralTensions,
    disengagementRisks,
    alignment,
    fulfillmentPomp,
    narrative,
    surfacePoints: [],
  };
}

// ────────────────────────────────────────────────────────────
// CAS DE VALIDATION (exécutables en dev / CI)
// Suivent le principe "tests rapides" demandé dans les critères
// d'acceptation : 4 cas cliniques représentatifs.
// ────────────────────────────────────────────────────────────

export interface ValidationCase {
  name: string;
  personScores: PersonScores;
  jobProfile: JobProfile;
  expectedAlignment: TATOutcome;
  expectedFulfillmentMin: number;
  expectedFulfillmentMax: number;
}

/**
 * Cas de validation unitaires — utiles en CI ou via
 * `node --import tsx ...` pour un smoke-test rapide.
 */
export const VALIDATION_CASES: ValidationCase[] = [
  {
    name: "Opportunité d'épanouissement — Extraversion 80/80",
    personScores: { Extraversion: 80 },
    jobProfile: { Extraversion: 80 },
    expectedAlignment: "OpportuniteEpanouissement",
    // Z PR-RSM(80,80) ≈ 79.7 → arrondi ≈ 80
    expectedFulfillmentMin: 70,
    expectedFulfillmentMax: 90,
  },
  {
    name: "Tension comportementale — Névrosisme 30 / Pression 70",
    personScores: { Névrosisme: 30 },
    jobProfile: { Névrosisme: 70 },
    expectedAlignment: "TensionComportementale",
    // Z PR-RSM(30,70) ≈ 37.5
    expectedFulfillmentMin: 30,
    expectedFulfillmentMax: 50,
  },
  {
    name: "Risque de désengagement — Ouverture 80 / Exigence 30",
    personScores: { Ouverture: 80 },
    jobProfile: { Ouverture: 30 },
    expectedAlignment: "RisqueDesengagement",
    // Z PR-RSM(80,30) ≈ 42.8
    expectedFulfillmentMin: 35,
    expectedFulfillmentMax: 55,
  },
  {
    name: "Alignement neutre — Profil moyen",
    personScores: { Consciencieusete: 50 },
    jobProfile: { Consciencieusete: 50 },
    expectedAlignment: "Alignement",
    // Z PR-RSM(50,50) = 53.8 → arrondi ≈ 54
    expectedFulfillmentMin: 45,
    expectedFulfillmentMax: 65,
  },
  {
    name: "Profil mixte — Forte exigence + Forte capacité",
    personScores: { Extraversion: 70, Névrosisme: 30 },
    jobProfile: { Extraversion: 70, Névrosisme: 80 },
    expectedAlignment: "TensionComportementale",
    // Le trait Névrosisme 30 / 80 déclenche une tension, qui domine l'opportunité sur Extraversion.
    expectedFulfillmentMin: 40,
    expectedFulfillmentMax: 70,
  },
];

/**
 * Exécute tous les `VALIDATION_CASES` et retourne un rapport.
 * Utilisable en CI : `node --import tsx src/utils/satisfaction-engine.ts`
 * ou importé depuis un test runner.
 *
 * En cas d'échec, log un warning dans la console mais ne lève pas
 * d'exception (suit le ton bienveillant OCCOQ).
 */
export function runValidationCases(): {
  passed: number;
  failed: string[];
  total: number;
} {
  const failed: string[] = [];
  let passed = 0;

  for (const tc of VALIDATION_CASES) {
    const diag = diagnosePersonJobAlignment(tc.personScores, tc.jobProfile);

    if (diag.alignment !== tc.expectedAlignment) {
      failed.push(
        `[${tc.name}] alignement attendu = ${tc.expectedAlignment}, ` +
          `reçu = ${diag.alignment}`
      );
      continue;
    }

    if (
      diag.globalFulfillment < tc.expectedFulfillmentMin ||
      diag.globalFulfillment > tc.expectedFulfillmentMax
    ) {
      failed.push(
        `[${tc.name}] fulfillment attendu dans [${tc.expectedFulfillmentMin}, ` +
          `${tc.expectedFulfillmentMax}], reçu = ${diag.globalFulfillment}`
      );
      continue;
    }

    passed++;
  }

  if (failed.length > 0 && typeof console !== "undefined") {
    console.warn(
      `[satisfaction-engine] ${failed.length}/${VALIDATION_CASES.length} cas de validation ont échoué :`,
      failed
    );
  }

  return { passed, failed, total: VALIDATION_CASES.length };
}

/**
 * Helper pour intégration Astro/React : retourne la zone de strain
 * dominante (pour affichage couleur via `getStrainZoneStyle`).
 */
export function dominantStrainZone(
  diagnosis: PersonJobDiagnosis
): StrainZone {
  if (diagnosis.behavioralTensions.length > 0) return "Rouge";
  if (diagnosis.disengagementRisks.length > 0) return "Orange";
  return "Verte";
}
