// ============================================================
// src/utils/scoring-engine.ts
// Moteur de scoring psychométrique Trajektia
//
// Responsabilités :
// 1. Calculer les scores Big Five et RIASEC à partir des réponses brutes
// 2. Appliquer les inversions psychométriques (6 - score)
// 3. Normaliser les scores sur une échelle 0-100
// 4. Calculer la similarité cosinus (Pearson) personne ↔ métier
// 5. Calculer l'Accord Angulaire RIASEC normalisé 0-100%
//    (Wild & Möhring, 2026 — Frontiers in Rehabilitation Sciences)
// 6. Valider la cohérence croisée Big Five ↔ RIASEC
//    via la matrice méta-analytique Barrick & Mount (2003/2005)
// 7. Gérer la persistance localStorage
// ============================================================

import type {
  BigFiveDimension,
  RIASECDimension,
} from "../data/questions-psychometriques";

import {
  ALL_QUESTIONS,
} from "../data/questions-psychometriques";

import {
  calculateBigFiveScores,
  calculateRiasecScores,
} from "./scoring";

import type {
  BigFiveScores,
  RIASECScores,
} from "./scoring";

export type { BigFiveScores, RIASECScores };

// ────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────

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
  const { normalized: bigFive, percentiles: bigFivePercentiles } = calculateBigFiveScores(responses);
  const { normalized: riasec, codeHolland, traitsHolland } = calculateRiasecScores(responses);

  let completedQuestions = 0;
  for (const question of ALL_QUESTIONS) {
    if (responses[question.id] !== undefined && responses[question.id] !== null) {
      completedQuestions++;
    }
  }

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

// ────────────────────────────────────────────────────────────
// 5. ACCORD ANGULAIRE RIASEC (Wild & Möhring, 2026)
// & COHÉRENCE CROISÉE BIG FIVE ↔ RIASEC (Barrick & Mount, 2003/2005)
// ────────────────────────────────────────────────────────────

/**
 * Matrice méta-analytique des corrélations vraies (corrigées pour l'atténuation)
 * entre les 5 dimensions Big Five (OCEAN) et les 6 intérêts RIASEC de Holland.
 *
 * Source : Barrick, M. R., Mount, M. K., & Gupta, R. (2003).
 *   *Meta-analysis of the relationship between the five-factor model of
 *   personality and Holland's occupational types*.
 *   Journal of Vocational Behavior, 63(1), 45-74.
 * Complété par : Mount, M. K., Barrick, M. R., Scullen, S. E., & Rounds, J.
 *   (2005). *Higher-order dimensions of Big Five personality traits and the
 *   big six vocational interest types*. Personnel Psychology, 58(2), 447-478.
 *
 * Note méthodologique : la dernière ligne publiée par Barrick & Mount
 * porte sur le **Névrosisme** (N). Notre inventaire IPIP-50 mesure la
 * dimension opposée, la **Stabilité Émotionnelle**. On inverse donc
 * les signes pour obtenir des coefficients directement applicables à
 * notre score `Stabilite_Emotionnelle` (Stabilité = −Névrosisme).
 *
 * Lecture :
 *  - Ouverture ↔ Artistique : r = .48 (pont le plus robuste)
 *  - Extraversion ↔ Entreprenant : r = .41
 *  - Agréabilité ↔ Social : r = .29
 *  - Ouverture ↔ Investigateur : r = .28
 *  - Conscienciosité ↔ Conventionnel : r = .27
 *  - Extraversion ↔ Social : r = .32
 */
export const BARRICK_MOUNT_MATRIX: Record<
  BigFiveDimension,
  Record<RIASECDimension, number>
> = {
  Ouverture: {
    Realiste: 0.03,
    Investigateur: 0.28,
    Artistique: 0.48,
    Social: 0.19,
    Entreprenant: 0.09,
    Conventionnel: 0.06,
  },
  Consciencieux: {
    Realiste: 0.08,
    Investigateur: 0.06,
    Artistique: -0.07,
    Social: 0.15,
    Entreprenant: 0.12,
    Conventionnel: 0.27,
  },
  Extraversion: {
    Realiste: -0.05,
    Investigateur: -0.02,
    Artistique: 0.11,
    Social: 0.32,
    Entreprenant: 0.41,
    Conventionnel: 0.12,
  },
  Agreabilite: {
    Realiste: -0.08,
    Investigateur: -0.04,
    Artistique: 0.04,
    Social: 0.29,
    Entreprenant: 0.02,
    Conventionnel: 0.10,
  },
  // Ligne « Névrosisme » publiée par Barrick & Mount, *inversée* pour
  // s'aligner avec notre dimension « Stabilité Émotionnelle ».
  Stabilite_Emotionnelle: {
    Realiste: -0.12,
    Investigateur: -0.09,
    Artistique: 0.12,
    Social: -0.06,
    Entreprenant: -0.15,
    Conventionnel: -0.08,
  },
};

/**
 * Vecteur RIASEC canonique, dans l'ordre strict (R, I, A, S, E, C).
 * Utilisé pour `angularAgreementPercent` et `predictRiasecFromBigFive`.
 */
export function buildRiasecVector(riasec: RIASECScores): number[] {
  return [
    riasec.Realiste,
    riasec.Investigateur,
    riasec.Artistique,
    riasec.Social,
    riasec.Entreprenant,
    riasec.Conventionnel,
  ];
}

/**
 * Calcule l'Accord Angulaire RIASEC normalisé en pourcentage (0–100 %).
 *
 * Formule :
 *   θ = arccos( (A · B) / (‖A‖ ‖B‖) )
 *   Agreement% = (1 − θ / π) × 100
 *
 * Avec :
 *   - A, B : vecteurs hexagonaux RIASEC (R, I, A, S, E, C)
 *   - θ ∈ [0, π] : angle entre les deux vecteurs
 *
 * Interprétation (Wild & Möhring, 2026) :
 *   - 100 % : vecteurs colinéaires (orientation d'intérêt identique)
 *   -  50 % : vecteurs orthogonaux (orientations indépendantes)
 *   -   0 % : vecteurs opposés (orientations antagonistes)
 *
 * Cet indice est insensible au biais d'amplitude globale : deux profils
 * dont la *forme* hexagonale est identique mais dont l'intensité moyenne
 * diffère obtiennent le même score. Validité de critère démontrée :
 * r = .18 (p < .05) avec la persévérance en réadaptation, contre
 * r = −.08 (n.s.) pour la distance euclidienne.
 *
 * @param vecA Vecteur RIASEC (6 dimensions, 0–100)
 * @param vecB Vecteur RIASEC (6 dimensions, 0–100)
 * @returns Score d'accord angulaire ∈ [0, 100]. Retourne 0 si les deux
 *   vecteurs n'ont pas la même longueur, si l'un est vide, ou si l'un
 *   des deux est le vecteur nul (‖·‖ = 0, accord indéfini).
 */
export function angularAgreementPercent(vecA: number[], vecB: number[]): number {
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

  // Clamp numérique pour éviter les NaN d'arccos dus aux erreurs
  // d'arrondi flottant (cos θ peut valoir 1.0000000002 ou −1.0000000002).
  const cosTheta = Math.max(-1, Math.min(1, dotProduct / denominator));
  const theta = Math.acos(cosTheta);

  return Math.round((1 - theta / Math.PI) * 100);
}

/**
 * Prédit le profil RIASEC d'une personne à partir de ses scores Big Five,
 * via la matrice méta-analytique Barrick & Mount (2003).
 *
 * Algorithme :
 *   1. Centrer les scores Big Five sur 0 (X_i = score − 50).
 *   2. Pour chaque dimension RIASEC j :
 *        P_j = 50 + Σ_i (X_i · r_{i,j})
 *      où r_{i,j} est la corrélation méta-analytique Big Five i × RIASEC j.
 *   3. Clamper P_j dans [0, 100].
 *
 * Le profil prédit représente l'**orientation d'intérêt attendue** au
 * regard de la personnalité déclarée. Plus le profil RIASEC réel de
 * l'usager lui est angulairement proche, plus la cohérence interne
 * du questionnaire est élevée.
 *
 * @param bigFive Scores Big Five normalisés 0–100
 * @returns Profil RIASEC prédit (0–100)
 */
export function predictRiasecFromBigFive(bigFive: BigFiveScores): RIASECScores {
  const bigFiveDims: BigFiveDimension[] = [
    "Ouverture",
    "Consciencieux",
    "Extraversion",
    "Agreabilite",
    "Stabilite_Emotionnelle",
  ];
  const riasecDims: RIASECDimension[] = [
    "Realiste",
    "Investigateur",
    "Artistique",
    "Social",
    "Entreprenant",
    "Conventionnel",
  ];

  // Accumulateur brut (peut être négatif : centrage sur 0)
  const predicted: Record<RIASECDimension, number> = {
    Realiste: 0,
    Investigateur: 0,
    Artistique: 0,
    Social: 0,
    Entreprenant: 0,
    Conventionnel: 0,
  };

  for (const bfDim of bigFiveDims) {
    const x = bigFive[bfDim] - 50; // centrage [-50, +50]
    const row = BARRICK_MOUNT_MATRIX[bfDim];
    for (const riasecDim of riasecDims) {
      predicted[riasecDim] += x * row[riasecDim];
    }
  }

  // Recentrage sur 50 puis clamp [0, 100]
  const result: RIASECScores = {
    Realiste: 0,
    Investigateur: 0,
    Artistique: 0,
    Social: 0,
    Entreprenant: 0,
    Conventionnel: 0,
  };
  for (const dim of riasecDims) {
    result[dim] = Math.max(0, Math.min(100, Math.round(predicted[dim] + 50)));
  }
  return result;
}

/**
 * Diagnostic qualitatif de la cohérence Big Five ↔ RIASEC.
 *
 * - `Alignee` : profil RIASEC réel globalement en accord avec la
 *     projection Big Five **et** peu d'écarts dimensionnels (≤ 1) →
 *     convergence théorique élevée.
 * - `Hybride` : signal intermédiaire — mix d'intérêts compatible avec
 *     plusieurs facettes de personnalité.
 * - `Tendue` : **plusieurs** dimensions RIASEC (≥ 3) présentent un
 *     écart ≥ `COHERENCE_ATTENTION_THRESHOLD` entre le score réel et
 *     la projection Barrick & Mount, OU accord angulaire nettement
 *     dégradé (< 70 %). À explorer en counseling.
 *
 * Note méthodologique : l'accord angulaire peut rester élevé (≥ 80 %)
 * même en présence d'écarts dimensionnels marqués, car les coefficients
 * méta-analytiques de Barrick & Mount sont modérés (max |r| = .48) et
 * génèrent une *prédiction douce*. La règle de classification combine
 * donc **deux signaux** : l'orientation globale (accord angulaire) et
 * la dispersion des écarts par dimension.
 */
export type BigFiveRiasecInterpretation =
  | "Alignee"
  | "Hybride"
  | "Tendue";

/**
 * Écart signé, par dimension RIASEC, entre le score réel et le score
 * prédit par la matrice méta-analytique. Positif = intérêt plus
 * prononcé que prédit ; négatif = intérêt plus faible que prédit.
 */
export interface BigFiveRiasecCoherence {
  /** Score d'Accord Angulaire normalisé 0–100 % entre RIASEC réel et prédit. */
  agreementPercent: number;
  /** Profil RIASEC prédit par les Big Five via Barrick & Mount (2003). */
  predictedRiasec: RIASECScores;
  /** Écarts signés réel − prédit, par dimension RIASEC (pts). */
  perDimensionGap: Record<RIASECDimension, number>;
  /** Lecture qualitative globale (Alignée / Hybride / Tendue). */
  interpretation: BigFiveRiasecInterpretation;
  /** Liste des dimensions RIASEC où l'écart absolu dépasse le seuil clinique. */
  attentionDimensions: RIASECDimension[];
}

/** Seuil d'écart absolu (en points 0–100) au-delà duquel une dimension
 *  RIASEC mérite une attention particulière en counseling. */
export const COHERENCE_ATTENTION_THRESHOLD = 15;

/** Bornes de l'Accord Angulaire pour la lecture qualitative. */
const COHERENCE_THRESHOLD_ALIGNEE = 80;
const COHERENCE_THRESHOLD_TENDUE = 70;
/** Seuil d'écarts dimensionnels « tendus » (≥ 3 dimensions au-dessus
 *  de `COHERENCE_ATTENTION_THRESHOLD`). */
const COHERENCE_TENDUE_DIM_COUNT = 3;

/**
 * Valide la cohérence croisée Big Five ↔ RIASEC d'un profil usager.
 *
 * Compare le profil RIASEC réel avec celui prédit par les Big Five via
 * la matrice méta-analytique Barrick & Mount (2003/2005). Un accord
 * angulaire élevé indique que les intérêts exprimés sont cohérents
 * avec la personnalité déclarée — un signal de fiabilité des réponses
 * et un point d'ancrage pour le counseling d'orientation.
 *
 * @param bigFive Scores Big Five normalisés 0–100
 * @param riasec  Scores RIASEC normalisés 0–100
 */
export function validateBigFiveRiasecCoherence(
  bigFive: BigFiveScores,
  riasec: RIASECScores
): BigFiveRiasecCoherence {
  const predicted = predictRiasecFromBigFive(bigFive);
  const userVec = buildRiasecVector(riasec);
  const predVec = buildRiasecVector(predicted);

  const agreementPercent = angularAgreementPercent(userVec, predVec);

  const perDimensionGap: Record<RIASECDimension, number> = {
    Realiste: riasec.Realiste - predicted.Realiste,
    Investigateur: riasec.Investigateur - predicted.Investigateur,
    Artistique: riasec.Artistique - predicted.Artistique,
    Social: riasec.Social - predicted.Social,
    Entreprenant: riasec.Entreprenant - predicted.Entreprenant,
    Conventionnel: riasec.Conventionnel - predicted.Conventionnel,
  };

  const attentionDimensions = (Object.keys(perDimensionGap) as RIASECDimension[])
    .filter((dim) => Math.abs(perDimensionGap[dim]) >= COHERENCE_ATTENTION_THRESHOLD);

  let interpretation: BigFiveRiasecInterpretation;
  // Règle composite : l'accord angulaire **et** le nombre d'écarts
  // dimensionnels sont nécessaires pour qualifier la cohérence, car
  // les coefficients méta-analytiques modérés de Barrick & Mount
  // produisent une projection qui reste angulairement proche même en
  // cas d'écarts marqués par dimension.
  if (
    agreementPercent >= COHERENCE_THRESHOLD_ALIGNEE &&
    attentionDimensions.length <= 1
  ) {
    interpretation = "Alignee";
  } else if (
    agreementPercent < COHERENCE_THRESHOLD_TENDUE ||
    attentionDimensions.length >= COHERENCE_TENDUE_DIM_COUNT
  ) {
    interpretation = "Tendue";
  } else {
    interpretation = "Hybride";
  }

  return {
    agreementPercent,
    predictedRiasec: predicted,
    perDimensionGap,
    interpretation,
    attentionDimensions,
  };
}

/**
 * Calcule l'Accord Angulaire RIASEC entre un usager et un métier.
 * Helper de commodité pour brancher la métrique Wild & Möhring (2026)
 * directement sur les structures `PsychometricResults` et
 * `MetierForMatching`.
 *
 * @returns Score 0–100 %, ou 0 si le profil métier n'expose pas de RIASEC.
 */
export function riasecAngularAgreementJob(
  userRiasec: RIASECScores,
  metier: MetierForMatching
): number {
  const jobVec: number[] = [
    metier.riasec.scores.realiste,
    metier.riasec.scores.investigateur,
    metier.riasec.scores.artistique,
    metier.riasec.scores.social,
    metier.riasec.scores.entreprenant,
    metier.riasec.scores.conventionnel,
  ];
  return angularAgreementPercent(buildRiasecVector(userRiasec), jobVec);
}

// ────────────────────────────────────────────────────────────
// 6. CAS DE VALIDATION — Accord angulaire & cohérence BF↔RIASEC
// ────────────────────────────────────────────────────────────

export interface CoherenceValidationCase {
  name: string;
  bigFive: BigFiveScores;
  riasec: RIASECScores;
  expectedAgreementMin: number;
  expectedAgreementMax: number;
  expectedInterpretation: BigFiveRiasecInterpretation;
}

const NEUTRAL_BF: BigFiveScores = {
  Ouverture: 50,
  Consciencieux: 50,
  Extraversion: 50,
  Agreabilite: 50,
  Stabilite_Emotionnelle: 50,
};

const NEUTRAL_RIASEC: RIASECScores = {
  Realiste: 50,
  Investigateur: 50,
  Artistique: 50,
  Social: 50,
  Entreprenant: 50,
  Conventionnel: 50,
};

/**
 * Cas de validation unitaires pour l'Accord Angulaire et la matrice
 * méta-analytique Big Five ↔ RIASEC. Exécutables en CI via
 * `runCoherenceValidationCases()` ou `node --import tsx ...`.
 *
 * Cinq cas représentatifs :
 *   1. Profil moyen (tout à 50) → cohérence parfaite (accord = 100 %).
 *   2. Profil Ouverture↑ + Artistique↑ → alignement théorique fort
 *      (Barrick & Mount : r = .48 entre Ouverture et Artistique).
 *   3. Profil Conscienciosité↑ + Conventionnel↑ → alignement méta-analytique
 *      (r = .27 entre Conscienciosité et Conventionnel).
 *   4. Profil artistique attendu (BF Ouverture↑) mais intérêts
 *      conventionnels déclarés → tension diagnostiquée.
 *   5. Accord angulaire sur RIASEC : vecteurs identiques → 100 %,
 *      vecteurs opposés → 0 %, vecteurs orthogonaux → ~50 %.
 */
export const COHERENCE_VALIDATION_CASES: CoherenceValidationCase[] = [
  {
    name: "Profil moyen — accord parfait (tout à 50)",
    bigFive: { ...NEUTRAL_BF },
    riasec: { ...NEUTRAL_RIASEC },
    expectedAgreementMin: 99,
    expectedAgreementMax: 100,
    expectedInterpretation: "Alignee",
  },
  {
    name: "Profil Ouverture↑ + Artistique↑ (r = .48 Barrick & Mount)",
    bigFive: {
      ...NEUTRAL_BF,
      Ouverture: 85,
    },
    riasec: {
      ...NEUTRAL_RIASEC,
      Artistique: 80,
      Investigateur: 65,
    },
    expectedAgreementMin: 60,
    expectedAgreementMax: 100,
    expectedInterpretation: "Alignee",
  },
  {
    name: "Profil Consciencieux↑ + Conventionnel↑ (r = .27)",
    bigFive: {
      ...NEUTRAL_BF,
      Consciencieux: 85,
    },
    riasec: {
      ...NEUTRAL_RIASEC,
      Conventionnel: 75,
    },
    expectedAgreementMin: 55,
    expectedAgreementMax: 100,
    expectedInterpretation: "Alignee",
  },
  {
    name: "Tension — BF Ouverture↑ vs intérêts Réaliste/Conventionnel",
    bigFive: {
      ...NEUTRAL_BF,
      Ouverture: 90,
    },
    riasec: {
      ...NEUTRAL_RIASEC,
      Conventionnel: 85,
      Realiste: 70,
      Artistique: 30,
    },
    // L'accord angulaire peut rester élevé (≥ 80 %) car les coefficients
    // modérés de Barrick & Mount produisent une prédiction douce.
    // C'est le nombre d'écarts dimensionnels (≥ 3) qui qualifie la
    // tension — voir la règle composite dans `validateBigFiveRiasecCoherence`.
    expectedAgreementMin: 70,
    expectedAgreementMax: 100,
    expectedInterpretation: "Tendue",
  },
  {
    name: "Profil extraverti sociable — BF Extraversion↑ vs Social/Entreprenant↑",
    bigFive: {
      ...NEUTRAL_BF,
      Extraversion: 85,
      Agreabilite: 75,
    },
    riasec: {
      ...NEUTRAL_RIASEC,
      Social: 80,
      Entreprenant: 70,
    },
    expectedAgreementMin: 55,
    expectedAgreementMax: 100,
    expectedInterpretation: "Alignee",
  },
];

/**
 * Cas de validation pour `angularAgreementPercent` directement (RIASEC).
 *
 * Note : la fonction opère sur n'importe quel vecteur numérique, mais
 * les scores RIASEC sont bornés 0–100. Avec ces bornes, deux vecteurs
 * strictement antiparallèles (v = −u) ne sont pas atteignables, car les
 * scores négatifs n'existent pas. On utilise donc des vecteurs centrés
 * signés (−50 à +50) pour tester les configurations géométriques pures.
 */
export interface AngularAgreementValidationCase {
  name: string;
  vecA: number[];
  vecB: number[];
  expectedAgreement: number;
}

export const ANGULAR_AGREEMENT_VALIDATION_CASES: AngularAgreementValidationCase[] = [
  {
    name: "Vecteurs identiques → 100 %",
    vecA: [70, 50, 60, 80, 65, 55],
    vecB: [70, 50, 60, 80, 65, 55],
    expectedAgreement: 100,
  },
  {
    name: "Vecteurs antiparallèles (centrés signés) → 0 %",
    vecA: [3, 1, -1, -1, -3, 0],
    vecB: [-3, -1, 1, 1, 3, 0],
    expectedAgreement: 0,
  },
  {
    name: "Vecteurs orthogonaux (6D) → 50 %",
    vecA: [100, 0, 0, 0, 0, 0],
    vecB: [0, 100, 0, 0, 0, 0],
    expectedAgreement: 50,
  },
  {
    name: "Vecteurs vides → 0 % (indéfini)",
    vecA: [],
    vecB: [],
    expectedAgreement: 0,
  },
  {
    name: "Vecteur nul → 0 % (division impossible)",
    vecA: [0, 0, 0, 0, 0, 0],
    vecB: [50, 50, 50, 50, 50, 50],
    expectedAgreement: 0,
  },
  {
    name: "Tailles différentes → 0 %",
    vecA: [70, 50, 60, 80, 65, 55],
    vecB: [70, 50, 60, 80],
    expectedAgreement: 0,
  },
];

/**
 * Exécute tous les cas de validation de la section 5 (Accord Angulaire
 * & Cohérence Big Five ↔ RIASEC) et retourne un rapport.
 *
 * En cas d'échec, log un `console.warn` mais ne lève pas d'exception
 * (cohérent avec le ton bienveillant OCCOQ et le pattern adopté dans
 * `satisfaction-engine.ts`).
 */
export function runCoherenceValidationCases(): {
  passed: number;
  failed: string[];
  total: number;
} {
  const failed: string[] = [];
  let passed = 0;

  // ── Cas d'Accord Angulaire direct ──
  for (const tc of ANGULAR_AGREEMENT_VALIDATION_CASES) {
    const actual = angularAgreementPercent(tc.vecA, tc.vecB);
    // Tolérance ±1 pt pour les arrondis
    if (Math.abs(actual - tc.expectedAgreement) > 1) {
      failed.push(
        `[angularAgreementPercent] ${tc.name} : attendu ≈ ${tc.expectedAgreement}, ` +
          `reçu = ${actual}`
      );
      continue;
    }
    passed++;
  }

  // ── Cas de cohérence Big Five ↔ RIASEC ──
  for (const tc of COHERENCE_VALIDATION_CASES) {
    const diag = validateBigFiveRiasecCoherence(tc.bigFive, tc.riasec);

    if (
      diag.agreementPercent < tc.expectedAgreementMin ||
      diag.agreementPercent > tc.expectedAgreementMax
    ) {
      failed.push(
        `[validateBigFiveRiasecCoherence] ${tc.name} : accord attendu dans ` +
          `[${tc.expectedAgreementMin}, ${tc.expectedAgreementMax}], ` +
          `reçu = ${diag.agreementPercent}`
      );
      continue;
    }

    if (diag.interpretation !== tc.expectedInterpretation) {
      failed.push(
        `[validateBigFiveRiasecCoherence] ${tc.name} : interprétation ` +
          `attendue = ${tc.expectedInterpretation}, reçue = ${diag.interpretation}`
      );
      continue;
    }

    passed++;
  }

  const total =
    ANGULAR_AGREEMENT_VALIDATION_CASES.length + COHERENCE_VALIDATION_CASES.length;

  if (failed.length > 0 && typeof console !== "undefined") {
    console.warn(
      `[scoring-engine] ${failed.length}/${total} cas de validation (section 5) ont échoué :`,
      failed
    );
  }

  return { passed, failed, total };
}
