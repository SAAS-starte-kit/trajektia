import { ALL_QUESTIONS, BFI_2_NORMS } from "../data/questions-psychometriques";
import type { BigFiveDimension, RIASECDimension } from "../data/questions-psychometriques";

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

// Normaliser sur 0-100 en fonction du nombre d'items répondus
const normalize = (raw: number, itemCount: number): number => {
  if (itemCount === 0) return 0;
  const min = itemCount * 1; // Tous les items à 1
  const max = itemCount * 5; // Tous les items à 5
  const percentage = Math.round(((raw - min) / (max - min)) * 100);
  return Math.min(100, Math.max(0, percentage));
};

// Calcul du Percentile Normatif basé sur les statistiques du BFI-2
export const calculatePercentile = (raw: number, itemCount: number, dimension: BigFiveDimension): number => {
  if (itemCount === 0) return 0;
  const userMean = raw / itemCount;
  const norm = BFI_2_NORMS[dimension];
  const zScore = (userMean - norm.mean) / norm.sd;
  
  // Approximation logistique de la loi normale (CDF)
  const percentile = 1 / (1 + Math.exp(-1.702 * zScore));
  return Math.max(1, Math.min(99, Math.round(percentile * 100)));
};

export function calculateBigFiveScores(answers: Record<string, number>): { raw: BigFiveScores; normalized: BigFiveScores; percentiles: BigFiveScores; counts: Record<BigFiveDimension, number> } {
  const rawScores: Record<BigFiveDimension, number> = {
    Ouverture: 0,
    Consciencieux: 0,
    Extraversion: 0,
    Agreabilite: 0,
    Stabilite_Emotionnelle: 0,
  };

  const counts: Record<BigFiveDimension, number> = {
    Ouverture: 0,
    Consciencieux: 0,
    Extraversion: 0,
    Agreabilite: 0,
    Stabilite_Emotionnelle: 0,
  };

  for (const question of ALL_QUESTIONS) {
    if (question.modele !== "BigFive") continue;
    const rawScore = answers[question.id];
    if (rawScore === undefined || rawScore === null) continue;

    // Appliquer l'inversion psychométrique si nécessaire
    const effectiveScore = question.type_calcul === "Inverse" ? 6 - rawScore : rawScore;

    rawScores[question.dimension as BigFiveDimension] += effectiveScore;
    counts[question.dimension as BigFiveDimension]++;
  }

  const normalized: BigFiveScores = {
    Ouverture: normalize(rawScores.Ouverture, counts.Ouverture),
    Consciencieux: normalize(rawScores.Consciencieux, counts.Consciencieux),
    Extraversion: normalize(rawScores.Extraversion, counts.Extraversion),
    Agreabilite: normalize(rawScores.Agreabilite, counts.Agreabilite),
    Stabilite_Emotionnelle: normalize(rawScores.Stabilite_Emotionnelle, counts.Stabilite_Emotionnelle),
  };

  const percentiles: BigFiveScores = {
    Ouverture: calculatePercentile(rawScores.Ouverture, counts.Ouverture, "Ouverture"),
    Consciencieux: calculatePercentile(rawScores.Consciencieux, counts.Consciencieux, "Consciencieux"),
    Extraversion: calculatePercentile(rawScores.Extraversion, counts.Extraversion, "Extraversion"),
    Agreabilite: calculatePercentile(rawScores.Agreabilite, counts.Agreabilite, "Agreabilite"),
    Stabilite_Emotionnelle: calculatePercentile(rawScores.Stabilite_Emotionnelle, counts.Stabilite_Emotionnelle, "Stabilite_Emotionnelle"),
  };

  return { raw: rawScores, normalized, percentiles, counts };
}

export function calculateRiasecScores(answers: Record<string, number>): { 
  raw: RIASECScores; 
  normalized: RIASECScores; 
  counts: Record<RIASECDimension, number>;
  codeHolland: string;
  traitsHolland: string[];
} {
  const rawScores: Record<RIASECDimension, number> = {
    Realiste: 0,
    Investigateur: 0,
    Artistique: 0,
    Social: 0,
    Entreprenant: 0,
    Conventionnel: 0,
  };

  const counts: Record<RIASECDimension, number> = {
    Realiste: 0,
    Investigateur: 0,
    Artistique: 0,
    Social: 0,
    Entreprenant: 0,
    Conventionnel: 0,
  };

  for (const question of ALL_QUESTIONS) {
    if (question.modele !== "RIASEC") continue;
    const rawScore = answers[question.id];
    if (rawScore === undefined || rawScore === null) continue;

    // Appliquer l'inversion psychométrique si nécessaire
    const effectiveScore = question.type_calcul === "Inverse" ? 6 - rawScore : rawScore;

    rawScores[question.dimension as RIASECDimension] += effectiveScore;
    counts[question.dimension as RIASECDimension]++;
  }

  const normalized: RIASECScores = {
    Realiste: normalize(rawScores.Realiste, counts.Realiste),
    Investigateur: normalize(rawScores.Investigateur, counts.Investigateur),
    Artistique: normalize(rawScores.Artistique, counts.Artistique),
    Social: normalize(rawScores.Social, counts.Social),
    Entreprenant: normalize(rawScores.Entreprenant, counts.Entreprenant),
    Conventionnel: normalize(rawScores.Conventionnel, counts.Conventionnel),
  };

  const riasecEntries: [RIASECDimension, number][] = Object.entries(normalized) as any;
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

  return { raw: rawScores, normalized, counts, codeHolland, traitsHolland };
}

export function calculatePredigerCoordinates(riasecScores: RIASECScores): { thingsPeople: number; dataIdeas: number } {
  // Projection trigonométrique exacte validée par Prediger (1982) sur l'hexagone de Holland
  const thingsPeople = 2 * riasecScores.Realiste + riasecScores.Investigateur - riasecScores.Artistique - 2 * riasecScores.Social - riasecScores.Entreprenant + riasecScores.Conventionnel;
  const dataIdeas = 1.732 * (riasecScores.Conventionnel + riasecScores.Entreprenant - riasecScores.Investigateur - riasecScores.Artistique);
  
  return { thingsPeople, dataIdeas };
}
