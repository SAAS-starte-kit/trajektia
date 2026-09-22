// ============================================================
// src/utils/pr-rsm-engine.ts
// Moteur de calcul Trait Activation Theory (TAT) & PR-RSM
// Modélisation des Tensions Comportementales et Opportunités d'Épanouissement
// Réf. : Tett & Burnett (2003), Edwards & Cable (2009), Shanock et al. (2010)
// ============================================================

// ─────────────────────────────────────────────────────────────
// STRAIN INDEX — Types et constantes
// ─────────────────────────────────────────────────────────────

/**
 * Clés des contextes O*NET utilisés dans le modèle TAT.
 * Chaque clé correspond à un code de Work Context O*NET 30.1.
 */
export type OnetContextKey =
  | 'PRESSION_TEMPORELLE'     // O*NET 4.C.3.d.1 — Time Pressure
  | 'FREQUENCE_CONFLITS'      // O*NET 4.C.1.d.2 — Deal with Unpleasant People
  | 'CONSEQUENCES_ERREUR'     // O*NET 4.C.3.a.1 — Consequence of Error
  | 'TRAVAIL_STRUCTURE';      // O*NET 4.C.3.b.8a — Structured vs. Unstructured Work

/** Classification clinique de l'écart de tension (Strain Gap). */
export type StrainZone = 'Rouge' | 'Verte' | 'Orange';

/** Résultat d'un calcul d'Indice d'Écart de Tension. */
export interface StrainResult {
  /** Valeur brute : Yc (contexte O*NET) − Xs (résistance IPIP), en unités SD */
  gap: number;
  zone: StrainZone;
  /** Libellé court de la zone (affiché dans l'UI) */
  label: string;
  /** Description clinique bienveillante (standard OCCOQ) */
  description: string;
  /** Recommandation d'aménagement ou de vigilance */
  recommendation: string;
}

/** Résultat d'une interaction TAT entre un contexte O*NET et un trait IPIP. */
export interface TATInteraction {
  contextKey: OnetContextKey;
  /** Libellé lisible du contexte de travail */
  contextLabel: string;
  /** Code O*NET de référence */
  onetCode: string;
  /** Trait IPIP activé par ce contexte */
  traitActivated: string;
  /** Score de pression du contexte O*NET (0–100) */
  contextScore: number;
  /** Score de résistance du trait IPIP de la personne (0–100) */
  resistanceScore: number;
  strainResult: StrainResult;
}

/** Scores O*NET Work Contexts fournis pour une fiche métier. */
export interface OnetContextScores {
  PRESSION_TEMPORELLE?: number;   // 0–100
  FREQUENCE_CONFLITS?: number;    // 0–100
  CONSEQUENCES_ERREUR?: number;   // 0–100
  TRAVAIL_STRUCTURE?: number;     // 0–100 (score élevé = très structuré = protecteur)
}

// ─────────────────────────────────────────────────────────────
// SEUILS CLINIQUES (en SD normalisées sur l'échelle 0–100)
// 1 SD ≈ 15 points sur une échelle centrée à 50
// ─────────────────────────────────────────────────────────────
const SD_UNIT = 15; // 1 écart-type ≈ 15 pts sur l'échelle 0–100

const STRAIN_THRESHOLD_ROUGE  =  1.5 * SD_UNIT; // +22.5 pts → Zone Rouge
const STRAIN_THRESHOLD_ORANGE = -0.5 * SD_UNIT; // −7.5 pts → Zone Orange si ≤ seuil

/**
 * Calcule l'Indice d'Écart de Tension (Strain Index Gap).
 *
 * Formule : Strain = Yc (exigence contexte O*NET) − Xs (résistance IPIP)
 * - Strain ≥ +1.5 SD → Zone Rouge  (épuisement / panique cognitive)
 * - −0.5 SD ≤ Strain < +1.5 SD → Zone Verte (environnement sécurisé)
 * - Strain < −0.5 SD → Zone Orange (boreout / sous-stimulation)
 *
 * @param contextScore Exigence du contexte O*NET (0–100)
 * @param resistanceScore Score de résistance IPIP de la personne (0–100)
 * @returns StrainResult complet avec zone, label et narratif clinique
 */
export function calculateStrainIndex(
  contextScore: number,
  resistanceScore: number
): StrainResult {
  const gap = contextScore - resistanceScore;

  if (gap >= STRAIN_THRESHOLD_ROUGE) {
    return {
      gap,
      zone: 'Rouge',
      label: 'Zone Rouge — Point de vigilance élevé',
      description:
        "L'exigence de ce contexte de travail dépasse sensiblement votre niveau de résistance naturelle. " +
        "Ce type d'écart est associé à un risque accru de fatigue adaptative, " +
        "d'épuisement émotionnel ou de panique cognitive lorsque la pression s'accumule.",
      recommendation:
        "Des aménagements préventifs sont à explorer avec votre conseiller(ère) d'orientation : " +
        "délégation de tâches, techniques de régulation émotionnelle, ou réévaluation du périmètre de poste.",
    };
  }

  if (gap <= STRAIN_THRESHOLD_ORANGE) {
    return {
      gap,
      zone: 'Orange',
      label: 'Zone Orange — Sous-stimulation potentielle',
      description:
        "Votre résistance naturelle est nettement supérieure aux exigences de ce contexte. " +
        "Cette situation est généralement sécurisante à court terme, mais peut générer " +
        "un sentiment de boreout ou de sous-utilisation de vos capacités à long terme.",
      recommendation:
        "Explorez des projets enrichissants, un rôle élargi ou une responsabilité additionnelle " +
        "pour maintenir votre engagement et votre sentiment de contribution.",
    };
  }

  return {
    gap,
    zone: 'Verte',
    label: 'Zone Verte — Environnement sécurisé',
    description:
      "L'équilibre entre l'exigence de ce contexte et votre profil de résistance est optimal. " +
      "Vous disposez des ressources psychologiques pour naviguer ce type d'environnement " +
      "sans effort d'adaptation démesuré.",
    recommendation:
      "Maintenez vos stratégies d'adaptation actuelles et restez attentif(ve) aux " +
      "changements organisationnels qui pourraient modifier cet équilibre.",
  };
}

// ─────────────────────────────────────────────────────────────
// MAPPAGE TAT — Interactions contexte × trait (Tett & Burnett, 2003)
// ─────────────────────────────────────────────────────────────

/** Métadonnées par contexte O*NET pour le mappage TAT. */
const TAT_CONTEXT_META: Record<
  OnetContextKey,
  { label: string; onetCode: string; traitActivated: string; protectif?: boolean }
> = {
  PRESSION_TEMPORELLE: {
    label: 'Pression temporelle',
    onetCode: '4.C.3.d.1',
    traitActivated: 'Névrosisme / Perfectionnisme',
  },
  FREQUENCE_CONFLITS: {
    label: 'Fréquence des conflits interpersonnels',
    onetCode: '4.C.1.d.2',
    traitActivated: 'Névrosisme / Empathie',
  },
  CONSEQUENCES_ERREUR: {
    label: 'Conséquences des erreurs',
    onetCode: '4.C.3.a.1',
    traitActivated: 'Névrosisme / Consciencieux',
  },
  TRAVAIL_STRUCTURE: {
    label: 'Degré de structuration du travail',
    onetCode: '4.C.3.b.8a',
    traitActivated: 'Stabilité Émotionnelle (Protecteur)',
    protectif: true,
  },
};

/**
 * Calcule toutes les interactions TAT entre les contextes O*NET
 * et le profil de résistance de la personne.
 *
 * Pour le contexte protectif TRAVAIL_STRUCTURE, le calcul est inversé :
 * un environnement très structuré (score élevé) réduit la tension.
 *
 * @param resistanceScores Scores IPIP de résistance de la personne (0–100)
 * @param onetContexts Scores O*NET Work Contexts du métier (0–100)
 * @returns Tableau des interactions TAT avec leur Strain Index respectif
 */
export function calculateTATInteractions(
  resistanceScores: {
    nevrosisme: number;
    stabiliteEmotionnelle?: number;
  },
  onetContexts: OnetContextScores
): TATInteraction[] {
  const interactions: TATInteraction[] = [];

  // Score de résistance dérivé de la Stabilité Émotionnelle (inverse du Névrosisme)
  const baseResistance = resistanceScores.stabiliteEmotionnelle
    ?? (100 - resistanceScores.nevrosisme);

  const contextEntries: [OnetContextKey, number | undefined][] = [
    ['PRESSION_TEMPORELLE',  onetContexts.PRESSION_TEMPORELLE],
    ['FREQUENCE_CONFLITS',   onetContexts.FREQUENCE_CONFLITS],
    ['CONSEQUENCES_ERREUR',  onetContexts.CONSEQUENCES_ERREUR],
    ['TRAVAIL_STRUCTURE',    onetContexts.TRAVAIL_STRUCTURE],
  ];

  for (const [key, contextScore] of contextEntries) {
    if (contextScore === undefined) continue;

    const meta = TAT_CONTEXT_META[key];

    // Pour TRAVAIL_STRUCTURE : un contexte très structuré est protectif
    // → on inverse l'axe : gap = résistance - contextScore (contraire du strain)
    const isProtectif = meta.protectif ?? false;
    const strain = isProtectif
      ? calculateStrainIndex(100 - contextScore, baseResistance)
      : calculateStrainIndex(contextScore, baseResistance);

    interactions.push({
      contextKey: key,
      contextLabel: meta.label,
      onetCode: meta.onetCode,
      traitActivated: meta.traitActivated,
      contextScore,
      resistanceScore: baseResistance,
      strainResult: strain,
    });
  }

  return interactions;
}

// ─────────────────────────────────────────────────────────────
// UTILITAIRES D'AFFICHAGE
// ─────────────────────────────────────────────────────────────

/**
 * Formate un score selon la règle POMP / présentation OCCOQ :
 * - Si value < 5 → affiche "< 5 %"
 * - Sinon → affiche "XX %"
 * Évite l'effet de bug visuel pour les scores très faibles.
 */
export function formatPomp(value: number): string {
  if (value < 5) return '< 5 %';
  return `${Math.round(value)} %`;
}

/**
 * Retourne la couleur Tailwind associée à une zone de strain.
 * Utilisable directement dans les className React/Astro.
 */
export function getStrainZoneStyle(zone: StrainZone): {
  bg: string;
  border: string;
  text: string;
  badge: string;
} {
  switch (zone) {
    case 'Rouge':
      return {
        bg:     'bg-rose-50 dark:bg-rose-900/10',
        border: 'border-rose-200 dark:border-rose-800/50',
        text:   'text-rose-700 dark:text-rose-300',
        badge:  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
      };
    case 'Orange':
      return {
        bg:     'bg-amber-50 dark:bg-amber-900/10',
        border: 'border-amber-200 dark:border-amber-800/50',
        text:   'text-amber-700 dark:text-amber-300',
        badge:  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      };
    case 'Verte':
    default:
      return {
        bg:     'bg-emerald-50 dark:bg-emerald-900/10',
        border: 'border-emerald-200 dark:border-emerald-800/50',
        text:   'text-emerald-700 dark:text-emerald-300',
        badge:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      };
  }
}

export interface PersonScores {
  [traitName: string]: number; // Scores sur 100
}

export interface JobProfile {
  [traitName: string]: number; // Scores sur 100 (Exigences O*NET ou mappées)
}

export interface TATTension {
  traitName: string;
  type: "Sur-sollicitation" | "Sous-utilisation";
  severity: "Faible" | "Modérée" | "Élevée";
  personScore: number;
  jobScore: number;
  cost: number; // Le coût énergétique ou l'impact de la tension
}

export interface TATResult {
  fulfillmentScore: number; // 0-100%
  tensions: TATTension[];
  clinicalExplanation: string;
}

// Coefficients empiriques PR-RSM (Edwards & Cable, 2009 / Shanock et al. 2010)
const BETA_0 = 50; // Constante de base pour recentrer le score
const BETA_1 = 0.35;
const BETA_2 = 0.24;
const BETA_3 = -0.005;
const BETA_4 = 0.010;
const BETA_5 = -0.006;

/**
 * Calcule le score de congruence PR-RSM pour un trait donné.
 * X: Score de la personne (0-100)
 * Y: Exigence du métier (0-100)
 * Retourne le score prédit (Z) normalisé entre 0 et 100.
 */
export function calculatePRRSM(personScore: number, jobScore: number): number {
  // Centrage des scores sur [-50, +50]
  const X = personScore - 50;
  const Y = jobScore - 50;

  // Modèle quadratique PR-RSM
  const Z =
    BETA_0 +
    BETA_1 * X +
    BETA_2 * Y +
    BETA_3 * Math.pow(X, 2) +
    BETA_4 * (X * Y) +
    BETA_5 * Math.pow(Y, 2);

  // Pour garantir que la valeur reste dans un range lisible (0-100)
  // et ajuster le scaling en fonction des max/min empiriques.
  // Empiriquement, Max théorique Z ~ 77, Min Z ~ 18. On fait un stretch.
  const stretchedZ = (Z - 15) * (100 / 65); 
  return Math.max(0, Math.min(100, stretchedZ));
}

/**
 * Génère le narratif clinique de bienveillance (standard OCCOQ)
 */
function generateClinicalExplanation(tensions: TATTension[], isCongruent: boolean): string {
  if (tensions.length === 0) {
    return "Ce milieu professionnel offre d'excellentes opportunités d'épanouissement. Vos prédispositions naturelles s'alignent harmonieusement avec les exigences du métier, favorisant ainsi la performance sans exiger d'effort d'adaptation démesuré.";
  }

  const surSollicitations = tensions.filter((t) => t.type === "Sur-sollicitation");
  const sousUtilisations = tensions.filter((t) => t.type === "Sous-utilisation");

  let explanation = "Ce profil présente des dynamiques intéressantes nécessitant une certaine vigilance. ";

  if (surSollicitations.length > 0) {
    const traits = surSollicitations.map(t => t.traitName.toLowerCase()).join(" et ");
    explanation += `Le poste présente des exigences élevées en termes de ${traits}, ce qui pourrait générer une sur-sollicitation (risque d'épuisement ou de fatigue adaptative). `;
  }

  if (sousUtilisations.length > 0) {
    const traits = sousUtilisations.map(t => t.traitName.toLowerCase()).join(" et ");
    explanation += `À l'inverse, vos forces naturelles en ${traits} pourraient être sous-utilisées, posant un risque d'ennui ou de désengagement à long terme si elles ne sont pas canalisées. `;
  }

  explanation += "Des stratégies d'adaptation ou des aménagements du poste pourraient être explorés pour favoriser votre bien-être global.";
  
  return explanation;
}

/**
 * Fonction principale d'évaluation de la Trait Activation Theory
 */
export function calculateTATEvaluation(
  personScores: PersonScores,
  jobProfile: JobProfile
): TATResult {
  let totalScore = 0;
  let count = 0;
  const tensions: TATTension[] = [];

  const commonTraits = Object.keys(personScores).filter((trait) => trait in jobProfile);

  for (const trait of commonTraits) {
    const pScore = personScores[trait];
    const jScore = jobProfile[trait];

    const zScore = calculatePRRSM(pScore, jScore);
    totalScore += zScore;
    count += 1;

    // Détection des tensions sur la ligne d'incongruence (X = -Y, ou différence significative)
    const diff = pScore - jScore;
    const absDiff = Math.abs(diff);

    // Si la différence est supérieure à 20 points, on signale une tension
    if (absDiff > 20) {
      let severity: "Faible" | "Modérée" | "Élevée" = "Faible";
      if (absDiff > 40) severity = "Élevée";
      else if (absDiff > 30) severity = "Modérée";

      tensions.push({
        traitName: trait,
        type: diff < 0 ? "Sur-sollicitation" : "Sous-utilisation",
        severity,
        personScore: pScore,
        jobScore: jScore,
        cost: absDiff,
      });
    }
  }

  // Score global (moyenne des scores Z)
  const fulfillmentScore = count > 0 ? Math.round(totalScore / count) : 0;

  // Tri des tensions (plus sévères en premier)
  tensions.sort((a, b) => b.cost - a.cost);

  return {
    fulfillmentScore,
    tensions,
    clinicalExplanation: generateClinicalExplanation(tensions, fulfillmentScore > 75),
  };
}
