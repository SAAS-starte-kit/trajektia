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
import { METIERS } from "../data/metiers";

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
  const metier = METIERS.find(m => m.cnp === cnp);
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
    const metier = METIERS.find(m => m.cnp === candidat.cnp);
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
