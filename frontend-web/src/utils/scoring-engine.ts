// ============================================================
// src/utils/scoring-engine.ts
// Moteur de scoring psychométrique Trajektia
//
// Responsabilités :
// 1. Calculer les scores Big Five et RIASEC à partir des réponses brutes
// 2. Appliquer les inversions psychométriques (6 - score)
// 3. Normaliser les scores sur une échelle 0-100
// 4. Calculer la similarité cosinus (Pearson) personne ↔ métier
// 5. Gérer la persistance localStorage
// ============================================================

import type {
  BigFiveDimension,
  RIASECDimension,
} from "../data/questions-psychometriques";

import {
  ALL_QUESTIONS,
  BFI_2_NORMS,
} from "../data/questions-psychometriques";

// ────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────

export interface BigFiveScores {
  Ouverture: number;
  Consciencieux: number;
  Extraversion: number;
  Agreabilite: number;
  Stabilite_Emotionnelle: number;
}

export interface RIASECScores {
  Realiste: number;
  Investigateur: number;
  Artistique: number;
  Social: number;
  Entreprenant: number;
  Conventionnel: number;
}

export interface PsychometricResults {
  bigFive: BigFiveScores;
  bigFivePercentiles: BigFiveScores;
  riasec: RIASECScores;
  codeHolland: string;
  traitsHolland: string[];
  timestamp: string;
  totalQuestions: number;
  completedQuestions: number;
}

export interface CareerMatch {
  cnp: string;
  titre: string;
  titre_court: string;
  secteur: string;
  badge_couleur: string;
  salaire_annuel_median: number;
  score_fit: number; // 0-100
  r: number;
  commentaire: string;
  dimensions_concordantes: string[];
  dimension_opposee?: string;
  type: "affinite" | "adaptation";
}

// Réponses brutes : { questionId: score_likert (1-5) }
export type RawResponses = Record<string, number>;

// ────────────────────────────────────────────────────────────
// 1. CALCUL DES SCORES
// ────────────────────────────────────────────────────────────

/**
 * Calcule les scores psychométriques à partir des réponses brutes.
 */
export function calculateScores(responses: RawResponses): PsychometricResults {
  // Initialiser les accumulateurs
  const bigFiveRaw: Record<BigFiveDimension, number> = {
    Ouverture: 0,
    Consciencieux: 0,
    Extraversion: 0,
    Agreabilite: 0,
    Stabilite_Emotionnelle: 0,
  };

  const riasecRaw: Record<RIASECDimension, number> = {
    Realiste: 0,
    Investigateur: 0,
    Artistique: 0,
    Social: 0,
    Entreprenant: 0,
    Conventionnel: 0,
  };
  
  const bigFiveCounts: Record<BigFiveDimension, number> = {
    Ouverture: 0,
    Consciencieux: 0,
    Extraversion: 0,
    Agreabilite: 0,
    Stabilite_Emotionnelle: 0,
  };

  const riasecCounts: Record<RIASECDimension, number> = {
    Realiste: 0,
    Investigateur: 0,
    Artistique: 0,
    Social: 0,
    Entreprenant: 0,
    Conventionnel: 0,
  };

  let completedQuestions = 0;

  // Traiter chaque question
  for (const question of ALL_QUESTIONS) {
    const rawScore = responses[question.id];
    if (rawScore === undefined || rawScore === null) continue;

    completedQuestions++;

    // Appliquer l'inversion psychométrique si nécessaire
    const effectiveScore =
      question.type_calcul === "Inverse" ? 6 - rawScore : rawScore;

    // Ajouter au bon accumulateur
    if (question.modele === "BigFive") {
      bigFiveRaw[question.dimension as BigFiveDimension] += effectiveScore;
      bigFiveCounts[question.dimension as BigFiveDimension]++;
    } else {
      riasecRaw[question.dimension as RIASECDimension] += effectiveScore;
      riasecCounts[question.dimension as RIASECDimension]++;
    }
  }

  // Normaliser sur 0-100 en fonction du nombre d'items répondus
  const normalize = (raw: number, itemCount: number): number => {
    if (itemCount === 0) return 0;
    const min = itemCount * 1; // Tous les items à 1
    const max = itemCount * 5; // Tous les items à 5
    const percentage = Math.round(((raw - min) / (max - min)) * 100);
    return Math.min(100, Math.max(0, percentage));
  };

  // Calcul du Percentile Normatif basé sur les statistiques du BFI-2
  const calculatePercentile = (raw: number, itemCount: number, dimension: BigFiveDimension): number => {
    if (itemCount === 0) return 0;
    const userMean = raw / itemCount;
    const norm = BFI_2_NORMS[dimension];
    const zScore = (userMean - norm.mean) / norm.sd;
    
    // Approximation logistique de la loi normale (CDF)
    const percentile = 1 / (1 + Math.exp(-1.702 * zScore));
    return Math.max(1, Math.min(99, Math.round(percentile * 100)));
  };

  const bigFive: BigFiveScores = {
    Ouverture: normalize(bigFiveRaw.Ouverture, bigFiveCounts.Ouverture),
    Consciencieux: normalize(bigFiveRaw.Consciencieux, bigFiveCounts.Consciencieux),
    Extraversion: normalize(bigFiveRaw.Extraversion, bigFiveCounts.Extraversion),
    Agreabilite: normalize(bigFiveRaw.Agreabilite, bigFiveCounts.Agreabilite),
    Stabilite_Emotionnelle: normalize(bigFiveRaw.Stabilite_Emotionnelle, bigFiveCounts.Stabilite_Emotionnelle),
  };

  const bigFivePercentiles: BigFiveScores = {
    Ouverture: calculatePercentile(bigFiveRaw.Ouverture, bigFiveCounts.Ouverture, "Ouverture"),
    Consciencieux: calculatePercentile(bigFiveRaw.Consciencieux, bigFiveCounts.Consciencieux, "Consciencieux"),
    Extraversion: calculatePercentile(bigFiveRaw.Extraversion, bigFiveCounts.Extraversion, "Extraversion"),
    Agreabilite: calculatePercentile(bigFiveRaw.Agreabilite, bigFiveCounts.Agreabilite, "Agreabilite"),
    Stabilite_Emotionnelle: calculatePercentile(bigFiveRaw.Stabilite_Emotionnelle, bigFiveCounts.Stabilite_Emotionnelle, "Stabilite_Emotionnelle"),
  };

  const riasec: RIASECScores = {
    Realiste: normalize(riasecRaw.Realiste, riasecCounts.Realiste),
    Investigateur: normalize(riasecRaw.Investigateur, riasecCounts.Investigateur),
    Artistique: normalize(riasecRaw.Artistique, riasecCounts.Artistique),
    Social: normalize(riasecRaw.Social, riasecCounts.Social),
    Entreprenant: normalize(riasecRaw.Entreprenant, riasecCounts.Entreprenant),
    Conventionnel: normalize(riasecRaw.Conventionnel, riasecCounts.Conventionnel),
  };

  // Calculer le code Holland (3 lettres dominantes)
  const riasecEntries: [RIASECDimension, number][] = Object.entries(riasec) as any;
  riasecEntries.sort((a, b) => b[1] - a[1]);

  const letterMap: Record<RIASECDimension, string> = {
    Realiste: "R",
    Investigateur: "I",
    Artistique: "A",
    Social: "S",
    Entreprenant: "E",
    Conventionnel: "C",
  };

  const labelMap: Record<RIASECDimension, string> = {
    Realiste: "Réaliste",
    Investigateur: "Investigateur",
    Artistique: "Artistique",
    Social: "Social",
    Entreprenant: "Entreprenant",
    Conventionnel: "Conventionnel",
  };

  const top3 = riasecEntries.slice(0, 3);
  const codeHolland = top3.map(([dim]) => letterMap[dim]).join("");
  const traitsHolland = top3.map(([dim]) => labelMap[dim]);

  return {
    bigFive,
    bigFivePercentiles,
    riasec,
    codeHolland,
    traitsHolland,
    timestamp: new Date().toISOString(),
    totalQuestions: ALL_QUESTIONS.length,
    completedQuestions,
  };
}

// ────────────────────────────────────────────────────────────
// 2. SIMILARITÉ COSINUS ET PEARSON
// ────────────────────────────────────────────────────────────

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

export function pearsonCorrelation(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  
  const n = vecA.length;
  const meanA = vecA.reduce((sum, val) => sum + val, 0) / n;
  const meanB = vecB.reduce((sum, val) => sum + val, 0) / n;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < n; i++) {
    const diffA = vecA[i] - meanA;
    const diffB = vecB[i] - meanB;
    dotProduct += diffA * diffB;
    normA += diffA * diffA;
    normB += diffB * diffB;
  }
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0; // Rejet de la variance nulle
  
  return dotProduct / denominator;
}

export function buildUserVector(scores: PsychometricResults): number[] {
  return [
    scores.riasec.Realiste,
    scores.riasec.Investigateur,
    scores.riasec.Artistique,
    scores.riasec.Social,
    scores.riasec.Entreprenant,
    scores.riasec.Conventionnel,
    scores.bigFive.Ouverture,
    scores.bigFive.Consciencieux,
    scores.bigFive.Extraversion,
    scores.bigFive.Agreabilite,
    scores.bigFive.Stabilite_Emotionnelle,
  ];
}

// ────────────────────────────────────────────────────────────
// 3. MATCHING AVEC LES MÉTIERS
// ────────────────────────────────────────────────────────────

export interface MetierForMatching {
  cnp: string;
  titre: string;
  titre_court: string;
  secteur: string;
  badge_couleur: string;
  salaire: { annuel_median: number };
  riasec: {
    scores: {
      realiste: number;
      investigateur: number;
      artistique: number;
      social: number;
      entreprenant: number;
      conventionnel: number;
    };
  };
  big_five?: {
    ouverture: number;
    conscientieux: number;
    extraversion: number;
    agreabilite: number;
    stabilite_emotionnelle: number;
  };
}

export function buildJobVector(metier: MetierForMatching): number[] {
  const bf = metier.big_five;
  return [
    metier.riasec.scores.realiste,
    metier.riasec.scores.investigateur,
    metier.riasec.scores.artistique,
    metier.riasec.scores.social,
    metier.riasec.scores.entreprenant,
    metier.riasec.scores.conventionnel,
    bf ? bf.ouverture : 50,
    bf ? bf.conscientieux : 50,
    bf ? bf.extraversion : 50,
    bf ? bf.agreabilite : 50,
    bf ? bf.stabilite_emotionnelle : 50,
  ];
}

export function getCareerMatches(
  scores: PsychometricResults,
  metiersData: MetierForMatching[],
  options: { topLimit?: number; mirrorLimit?: number } = {}
): { top: CareerMatch[]; mirror: CareerMatch[] } {
  const topLimit = options.topLimit || 10;
  const mirrorLimit = options.mirrorLimit || 5;
  const userVector = buildUserVector(scores);

  const scoredMetiers = metiersData.map(metier => {
    const jobVector = buildJobVector(metier);
    const r = pearsonCorrelation(userVector, jobVector);
    // Calibrage conforme au plan: 50 + r * 48, borné entre 10 et 99
    const scoreFit = Math.round(Math.min(99, Math.max(10, 50 + r * 48)));
    return { metier, r, scoreFit };
  }).filter(item => item.r !== 0);

  // Tie-break déterministe (score puis cnp)
  scoredMetiers.sort((a, b) => {
    if (b.r !== a.r) return b.r - a.r;
    return a.metier.cnp.localeCompare(b.metier.cnp);
  });

  const mapToMatch = (item: any, type: "affinite" | "adaptation"): CareerMatch => ({
    cnp: item.metier.cnp,
    titre: item.metier.titre,
    titre_court: item.metier.titre_court,
    secteur: item.metier.secteur,
    badge_couleur: item.metier.badge_couleur,
    salaire_annuel_median: item.metier.salaire.annuel_median,
    score_fit: item.scoreFit,
    r: item.r,
    commentaire: "",
    dimensions_concordantes: [],
    type
  });

  const top = scoredMetiers.slice(0, topLimit).map(m => mapToMatch(m, "affinite"));
  
  const potentialMirror = scoredMetiers
    .filter(m => m.r < 0)
    .sort((a, b) => {
      if (a.r !== b.r) return a.r - b.r; // Croissant (les plus négatifs d'abord)
      return a.metier.cnp.localeCompare(b.metier.cnp);
    });
    
  const topCnps = new Set(top.map(m => m.cnp));
  const mirror = potentialMirror
    .filter(m => !topCnps.has(m.metier.cnp))
    .slice(0, mirrorLimit)
    .map(m => mapToMatch(m, "adaptation"));

  return { top, mirror };
}

export function getTopMatchingCareers(
  scores: PsychometricResults,
  metiersData: MetierForMatching[],
  limit: number = 10
): CareerMatch[] {
  return getCareerMatches(scores, metiersData, { topLimit: limit }).top;
}

// ────────────────────────────────────────────────────────────
// 4. PERSISTANCE localStorage
// ────────────────────────────────────────────────────────────

const STORAGE_KEY = "trajektia_psychometric_results";

export function saveResultsToLocalStorage(results: PsychometricResults): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    console.warn("Impossible de sauvegarder les résultats dans localStorage.");
  }
}

export function getResultsFromLocalStorage(): PsychometricResults | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as PsychometricResults;
    if (parsed.completedQuestions !== parsed.totalQuestions) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearResultsFromLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently fail
  }
}
