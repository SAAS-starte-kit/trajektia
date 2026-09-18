// ============================================================
// src/data/questions-psychometriques.ts
// Banque de questions psychométriques validées en français
// Sources :
//   - Big Five : IPIP-50 (International Personality Item Pool)
//     https://ipip.ori.org — Libre de droits (Public Domain)
//   - RIASEC : O*NET Interest Profiler Short Form (Mini-IP)
//     https://services.onetcenter.org — US Department of Labor
// Traductions francophones validées (α ≥ 0.81)
// ============================================================

export type BigFiveDimension =
  | "Ouverture"
  | "Consciencieux"
  | "Extraversion"
  | "Agreabilite"
  | "Stabilite_Emotionnelle";

export type RIASECDimension =
  | "Realiste"
  | "Investigateur"
  | "Artistique"
  | "Social"
  | "Entreprenant"
  | "Conventionnel";

export type Modele = "BigFive" | "RIASEC";
export type TypeCalcul = "Direct" | "Inverse";

export interface QuestionPsychometrique {
  id: string;
  modele: Modele;
  dimension: BigFiveDimension | RIASECDimension;
  texte_fr: string;
  type_calcul: TypeCalcul;
}

// ============================================================
// SECTION 1 : BIG FIVE (IPIP-50) — 50 questions
// 10 questions par dimension (5 Direct + 5 Inverse)
// Échelle de Likert : 1 (Pas du tout d'accord) → 5 (Tout à fait d'accord)
// ============================================================

export const QUESTIONS_BIG_FIVE: QuestionPsychometrique[] = [
  // ──────────────────────────────────────────────────────────
  // EXTRAVERSION (E) — 10 items
  // ──────────────────────────────────────────────────────────
  { id: "B5_E01", modele: "BigFive", dimension: "Extraversion", texte_fr: "Être le bout-en-train de la fête.", type_calcul: "Direct" },
  { id: "B5_E02", modele: "BigFive", dimension: "Extraversion", texte_fr: "Me sentir à l'aise avec les gens.", type_calcul: "Direct" },
  { id: "B5_E03", modele: "BigFive", dimension: "Extraversion", texte_fr: "Engager facilement la conversation avec des inconnus.", type_calcul: "Direct" },
  { id: "B5_E04", modele: "BigFive", dimension: "Extraversion", texte_fr: "Me sentir bien quand je suis le centre de l'attention.", type_calcul: "Direct" },
  { id: "B5_E05", modele: "BigFive", dimension: "Extraversion", texte_fr: "Avoir beaucoup d'énergie quand je suis en groupe.", type_calcul: "Direct" },
  { id: "B5_E06", modele: "BigFive", dimension: "Extraversion", texte_fr: "Préférer rester en retrait dans les situations sociales.", type_calcul: "Inverse" },
  { id: "B5_E07", modele: "BigFive", dimension: "Extraversion", texte_fr: "Avoir peu de choses à dire aux gens.", type_calcul: "Inverse" },
  { id: "B5_E08", modele: "BigFive", dimension: "Extraversion", texte_fr: "Ne pas aimer attirer l'attention sur moi.", type_calcul: "Inverse" },
  { id: "B5_E09", modele: "BigFive", dimension: "Extraversion", texte_fr: "Être plutôt silencieux en présence d'inconnus.", type_calcul: "Inverse" },
  { id: "B5_E10", modele: "BigFive", dimension: "Extraversion", texte_fr: "Préférer la solitude aux grands groupes.", type_calcul: "Inverse" },

  // ──────────────────────────────────────────────────────────
  // AGRÉABILITÉ (A) — 10 items
  // ──────────────────────────────────────────────────────────
  { id: "B5_A01", modele: "BigFive", dimension: "Agreabilite", texte_fr: "M'intéresser sincèrement aux problèmes des autres.", type_calcul: "Direct" },
  { id: "B5_A02", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Avoir le cœur tendre.", type_calcul: "Direct" },
  { id: "B5_A03", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Prendre le temps d'aider les autres.", type_calcul: "Direct" },
  { id: "B5_A04", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Faire en sorte que les gens se sentent à l'aise.", type_calcul: "Direct" },
  { id: "B5_A05", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Ressentir facilement les émotions des autres.", type_calcul: "Direct" },
  { id: "B5_A06", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Ressentir peu d'intérêt envers les autres.", type_calcul: "Inverse" },
  { id: "B5_A07", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Insulter ou critiquer facilement les gens.", type_calcul: "Inverse" },
  { id: "B5_A08", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Ne pas vraiment m'intéresser aux problèmes d'autrui.", type_calcul: "Inverse" },
  { id: "B5_A09", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Être parfois dur ou froid envers les autres.", type_calcul: "Inverse" },
  { id: "B5_A10", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Ne pas me soucier vraiment du bien-être des autres.", type_calcul: "Inverse" },

  // ──────────────────────────────────────────────────────────
  // CONSCIENCIOSITÉ (C) — 10 items
  // ──────────────────────────────────────────────────────────
  { id: "B5_C01", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Être toujours prêt et organisé.", type_calcul: "Direct" },
  { id: "B5_C02", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Accorder une grande attention aux détails.", type_calcul: "Direct" },
  { id: "B5_C03", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Suivre un horaire régulier et structuré.", type_calcul: "Direct" },
  { id: "B5_C04", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Aimer l'ordre et la propreté.", type_calcul: "Direct" },
  { id: "B5_C05", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Terminer mes tâches avec rigueur et sans tarder.", type_calcul: "Direct" },
  { id: "B5_C06", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Laisser souvent traîner mes affaires.", type_calcul: "Inverse" },
  { id: "B5_C07", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Faire parfois les choses à moitié.", type_calcul: "Inverse" },
  { id: "B5_C08", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Oublier fréquemment de remettre les choses à leur place.", type_calcul: "Inverse" },
  { id: "B5_C09", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Négliger parfois mes responsabilités.", type_calcul: "Inverse" },
  { id: "B5_C10", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Avoir tendance à remettre les choses au lendemain.", type_calcul: "Inverse" },

  // ──────────────────────────────────────────────────────────
  // STABILITÉ ÉMOTIONNELLE (N inversé) — 10 items
  // ──────────────────────────────────────────────────────────
  { id: "B5_N01", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Être rarement perturbé par les choses.", type_calcul: "Direct" },
  { id: "B5_N02", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Rester calme même sous la pression.", type_calcul: "Direct" },
  { id: "B5_N03", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Me sentir généralement serein et détendu.", type_calcul: "Direct" },
  { id: "B5_N04", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Rarement me sentir triste sans raison.", type_calcul: "Direct" },
  { id: "B5_N05", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Ne pas me laisser facilement contrarier.", type_calcul: "Direct" },
  { id: "B5_N06", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Avoir des sautes d'humeur fréquentes.", type_calcul: "Inverse" },
  { id: "B5_N07", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "M'inquiéter facilement pour beaucoup de choses.", type_calcul: "Inverse" },
  { id: "B5_N08", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Être facilement irrité ou contrarié.", type_calcul: "Inverse" },
  { id: "B5_N09", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Me sentir souvent triste ou mélancolique.", type_calcul: "Inverse" },
  { id: "B5_N10", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Être souvent stressé ou tendu.", type_calcul: "Inverse" },

  // ──────────────────────────────────────────────────────────
  // OUVERTURE À L'EXPÉRIENCE (O) — 10 items
  // ──────────────────────────────────────────────────────────
  { id: "B5_O01", modele: "BigFive", dimension: "Ouverture", texte_fr: "Avoir une imagination débordante.", type_calcul: "Direct" },
  { id: "B5_O02", modele: "BigFive", dimension: "Ouverture", texte_fr: "Aimer réfléchir à des idées abstraites et complexes.", type_calcul: "Direct" },
  { id: "B5_O03", modele: "BigFive", dimension: "Ouverture", texte_fr: "Avoir une grande curiosité intellectuelle.", type_calcul: "Direct" },
  { id: "B5_O04", modele: "BigFive", dimension: "Ouverture", texte_fr: "Apprécier l'art et la beauté sous toutes leurs formes.", type_calcul: "Direct" },
  { id: "B5_O05", modele: "BigFive", dimension: "Ouverture", texte_fr: "Avoir une vie intérieure riche et créative.", type_calcul: "Direct" },
  { id: "B5_O06", modele: "BigFive", dimension: "Ouverture", texte_fr: "Avoir de la difficulté à comprendre les idées abstraites.", type_calcul: "Inverse" },
  { id: "B5_O07", modele: "BigFive", dimension: "Ouverture", texte_fr: "Ne pas m'intéresser particulièrement à l'art.", type_calcul: "Inverse" },
  { id: "B5_O08", modele: "BigFive", dimension: "Ouverture", texte_fr: "Éviter les discussions philosophiques ou théoriques.", type_calcul: "Inverse" },
  { id: "B5_O09", modele: "BigFive", dimension: "Ouverture", texte_fr: "Préférer la routine aux nouvelles expériences.", type_calcul: "Inverse" },
  { id: "B5_O10", modele: "BigFive", dimension: "Ouverture", texte_fr: "Avoir peu d'intérêt pour les idées nouvelles ou originales.", type_calcul: "Inverse" },
];

// ============================================================
// SECTION 2 : RIASEC (O*NET Mini Interest Profiler) — 60 questions
// 10 questions par dimension
// Échelle de Likert : 1 (Pas du tout intéressé) → 5 (Très intéressé)
// Toutes les questions sont de type "Direct"
// ============================================================

export const QUESTIONS_RIASEC: QuestionPsychometrique[] = [
  // ──────────────────────────────────────────────────────────
  // RÉALISTE (R) — 10 items
  // Activités concrètes, manuelles, techniques
  // ──────────────────────────────────────────────────────────
  { id: "RIA_R01", modele: "RIASEC", dimension: "Realiste", texte_fr: "Construire ou réparer des armoires de cuisine.", type_calcul: "Direct" },
  { id: "RIA_R02", modele: "RIASEC", dimension: "Realiste", texte_fr: "Poser des briques ou du carrelage.", type_calcul: "Direct" },
  { id: "RIA_R03", modele: "RIASEC", dimension: "Realiste", texte_fr: "Réparer un appareil électroménager en panne.", type_calcul: "Direct" },
  { id: "RIA_R04", modele: "RIASEC", dimension: "Realiste", texte_fr: "Assembler un circuit électronique.", type_calcul: "Direct" },
  { id: "RIA_R05", modele: "RIASEC", dimension: "Realiste", texte_fr: "Travailler sur la mécanique d'une automobile.", type_calcul: "Direct" },
  { id: "RIA_R06", modele: "RIASEC", dimension: "Realiste", texte_fr: "Faire fonctionner un équipement de forage ou d'excavation.", type_calcul: "Direct" },
  { id: "RIA_R07", modele: "RIASEC", dimension: "Realiste", texte_fr: "Installer un plancher de bois franc.", type_calcul: "Direct" },
  { id: "RIA_R08", modele: "RIASEC", dimension: "Realiste", texte_fr: "Faire l'entretien de terrains ou d'espaces verts.", type_calcul: "Direct" },
  { id: "RIA_R09", modele: "RIASEC", dimension: "Realiste", texte_fr: "Opérer des machines industrielles.", type_calcul: "Direct" },
  { id: "RIA_R10", modele: "RIASEC", dimension: "Realiste", texte_fr: "Souder ou assembler des pièces métalliques.", type_calcul: "Direct" },

  // ──────────────────────────────────────────────────────────
  // INVESTIGATEUR (I) — 10 items
  // Activités intellectuelles, scientifiques, analytiques
  // ──────────────────────────────────────────────────────────
  { id: "RIA_I01", modele: "RIASEC", dimension: "Investigateur", texte_fr: "Développer un nouveau médicament en laboratoire.", type_calcul: "Direct" },
  { id: "RIA_I02", modele: "RIASEC", dimension: "Investigateur", texte_fr: "Étudier les étoiles et les planètes.", type_calcul: "Direct" },
  { id: "RIA_I03", modele: "RIASEC", dimension: "Investigateur", texte_fr: "Faire des recherches pour trouver des traitements contre les maladies.", type_calcul: "Direct" },
  { id: "RIA_I04", modele: "RIASEC", dimension: "Investigateur", texte_fr: "Analyser des données scientifiques complexes.", type_calcul: "Direct" },
  { id: "RIA_I05", modele: "RIASEC", dimension: "Investigateur", texte_fr: "Faire des expériences de chimie ou de physique.", type_calcul: "Direct" },
  { id: "RIA_I06", modele: "RIASEC", dimension: "Investigateur", texte_fr: "Étudier le comportement des animaux dans la nature.", type_calcul: "Direct" },
  { id: "RIA_I07", modele: "RIASEC", dimension: "Investigateur", texte_fr: "Concevoir un algorithme informatique pour résoudre un problème.", type_calcul: "Direct" },
  { id: "RIA_I08", modele: "RIASEC", dimension: "Investigateur", texte_fr: "Résoudre des problèmes mathématiques complexes.", type_calcul: "Direct" },
  { id: "RIA_I09", modele: "RIASEC", dimension: "Investigateur", texte_fr: "Mener une enquête criminalistique ou médico-légale.", type_calcul: "Direct" },
  { id: "RIA_I10", modele: "RIASEC", dimension: "Investigateur", texte_fr: "Étudier les effets du changement climatique sur les écosystèmes.", type_calcul: "Direct" },

  // ──────────────────────────────────────────────────────────
  // ARTISTIQUE (A) — 10 items
  // Activités créatives, expressives, non conventionnelles
  // ──────────────────────────────────────────────────────────
  { id: "RIA_A01", modele: "RIASEC", dimension: "Artistique", texte_fr: "Composer ou arranger une pièce de musique.", type_calcul: "Direct" },
  { id: "RIA_A02", modele: "RIASEC", dimension: "Artistique", texte_fr: "Dessiner des illustrations pour un livre ou un magazine.", type_calcul: "Direct" },
  { id: "RIA_A03", modele: "RIASEC", dimension: "Artistique", texte_fr: "Écrire des chansons, de la poésie ou des nouvelles.", type_calcul: "Direct" },
  { id: "RIA_A04", modele: "RIASEC", dimension: "Artistique", texte_fr: "Jouer un rôle dans une pièce de théâtre ou un film.", type_calcul: "Direct" },
  { id: "RIA_A05", modele: "RIASEC", dimension: "Artistique", texte_fr: "Concevoir des décors pour des films ou des spectacles.", type_calcul: "Direct" },
  { id: "RIA_A06", modele: "RIASEC", dimension: "Artistique", texte_fr: "Photographier des paysages ou des portraits artistiques.", type_calcul: "Direct" },
  { id: "RIA_A07", modele: "RIASEC", dimension: "Artistique", texte_fr: "Peindre des tableaux ou réaliser des murales.", type_calcul: "Direct" },
  { id: "RIA_A08", modele: "RIASEC", dimension: "Artistique", texte_fr: "Créer des designs graphiques ou des interfaces web.", type_calcul: "Direct" },
  { id: "RIA_A09", modele: "RIASEC", dimension: "Artistique", texte_fr: "Réaliser un court métrage ou un documentaire vidéo.", type_calcul: "Direct" },
  { id: "RIA_A10", modele: "RIASEC", dimension: "Artistique", texte_fr: "Danser ou chorégraphier un spectacle.", type_calcul: "Direct" },

  // ──────────────────────────────────────────────────────────
  // SOCIAL (S) — 10 items
  // Activités d'aide, d'enseignement, de soin
  // ──────────────────────────────────────────────────────────
  { id: "RIA_S01", modele: "RIASEC", dimension: "Social", texte_fr: "Enseigner à des enfants à lire et à écrire.", type_calcul: "Direct" },
  { id: "RIA_S02", modele: "RIASEC", dimension: "Social", texte_fr: "Aider les gens à résoudre leurs problèmes personnels.", type_calcul: "Direct" },
  { id: "RIA_S03", modele: "RIASEC", dimension: "Social", texte_fr: "Organiser des activités pour des personnes âgées.", type_calcul: "Direct" },
  { id: "RIA_S04", modele: "RIASEC", dimension: "Social", texte_fr: "Encadrer une équipe de bénévoles.", type_calcul: "Direct" },
  { id: "RIA_S05", modele: "RIASEC", dimension: "Social", texte_fr: "Conseiller les jeunes sur leur choix de carrière.", type_calcul: "Direct" },
  { id: "RIA_S06", modele: "RIASEC", dimension: "Social", texte_fr: "Animer un groupe de soutien pour des personnes en difficulté.", type_calcul: "Direct" },
  { id: "RIA_S07", modele: "RIASEC", dimension: "Social", texte_fr: "Former des employés dans une entreprise.", type_calcul: "Direct" },
  { id: "RIA_S08", modele: "RIASEC", dimension: "Social", texte_fr: "Travailler comme intervenant social auprès de familles.", type_calcul: "Direct" },
  { id: "RIA_S09", modele: "RIASEC", dimension: "Social", texte_fr: "Faire du mentorat auprès d'étudiants.", type_calcul: "Direct" },
  { id: "RIA_S10", modele: "RIASEC", dimension: "Social", texte_fr: "Coordonner des programmes communautaires.", type_calcul: "Direct" },

  // ──────────────────────────────────────────────────────────
  // ENTREPRENANT (E) — 10 items
  // Activités de leadership, vente, persuasion
  // ──────────────────────────────────────────────────────────
  { id: "RIA_E01", modele: "RIASEC", dimension: "Entreprenant", texte_fr: "Gérer un commerce ou un restaurant.", type_calcul: "Direct" },
  { id: "RIA_E02", modele: "RIASEC", dimension: "Entreprenant", texte_fr: "Vendre des produits ou des services à des clients.", type_calcul: "Direct" },
  { id: "RIA_E03", modele: "RIASEC", dimension: "Entreprenant", texte_fr: "Négocier des contrats d'affaires importants.", type_calcul: "Direct" },
  { id: "RIA_E04", modele: "RIASEC", dimension: "Entreprenant", texte_fr: "Lancer une nouvelle entreprise ou un projet innovant.", type_calcul: "Direct" },
  { id: "RIA_E05", modele: "RIASEC", dimension: "Entreprenant", texte_fr: "Diriger une campagne de financement ou de collecte de fonds.", type_calcul: "Direct" },
  { id: "RIA_E06", modele: "RIASEC", dimension: "Entreprenant", texte_fr: "Recruter et embaucher du personnel.", type_calcul: "Direct" },
  { id: "RIA_E07", modele: "RIASEC", dimension: "Entreprenant", texte_fr: "Convaincre des investisseurs de financer un projet.", type_calcul: "Direct" },
  { id: "RIA_E08", modele: "RIASEC", dimension: "Entreprenant", texte_fr: "Organiser et présider des réunions d'affaires.", type_calcul: "Direct" },
  { id: "RIA_E09", modele: "RIASEC", dimension: "Entreprenant", texte_fr: "Développer une stratégie de marketing ou de communication.", type_calcul: "Direct" },
  { id: "RIA_E10", modele: "RIASEC", dimension: "Entreprenant", texte_fr: "Superviser le travail d'une équipe ou d'un département.", type_calcul: "Direct" },

  // ──────────────────────────────────────────────────────────
  // CONVENTIONNEL (C) — 10 items
  // Activités d'organisation, de gestion de données, de précision
  // ──────────────────────────────────────────────────────────
  { id: "RIA_C01", modele: "RIASEC", dimension: "Conventionnel", texte_fr: "Tenir des registres financiers à jour.", type_calcul: "Direct" },
  { id: "RIA_C02", modele: "RIASEC", dimension: "Conventionnel", texte_fr: "Classer et organiser des dossiers administratifs.", type_calcul: "Direct" },
  { id: "RIA_C03", modele: "RIASEC", dimension: "Conventionnel", texte_fr: "Vérifier des factures et des documents comptables.", type_calcul: "Direct" },
  { id: "RIA_C04", modele: "RIASEC", dimension: "Conventionnel", texte_fr: "Entrer des données dans un système informatique.", type_calcul: "Direct" },
  { id: "RIA_C05", modele: "RIASEC", dimension: "Conventionnel", texte_fr: "Préparer des rapports financiers ou des bilans.", type_calcul: "Direct" },
  { id: "RIA_C06", modele: "RIASEC", dimension: "Conventionnel", texte_fr: "Gérer l'inventaire d'un entrepôt ou d'un magasin.", type_calcul: "Direct" },
  { id: "RIA_C07", modele: "RIASEC", dimension: "Conventionnel", texte_fr: "Corriger et relire des textes officiels ou juridiques.", type_calcul: "Direct" },
  { id: "RIA_C08", modele: "RIASEC", dimension: "Conventionnel", texte_fr: "Planifier des horaires de travail pour une équipe.", type_calcul: "Direct" },
  { id: "RIA_C09", modele: "RIASEC", dimension: "Conventionnel", texte_fr: "Calculer et vérifier des budgets ou des estimations.", type_calcul: "Direct" },
  { id: "RIA_C10", modele: "RIASEC", dimension: "Conventionnel", texte_fr: "Opérer un système de gestion de base de données.", type_calcul: "Direct" },
];

// ============================================================
// SECTION 1.5 : BIG FIVE (BFI-2-Fr) — 60 questions
// 12 questions par dimension
// ============================================================

export const QUESTIONS_BFI_2_FR: QuestionPsychometrique[] = [
  // ──────────────────────────────────────────────────────────
  // EXTRAVERSION (E) — 12 items
  // ──────────────────────────────────────────────────────────
  { id: "BFI2_E01", modele: "BigFive", dimension: "Extraversion", texte_fr: "Est sociable, extraverti", type_calcul: "Direct" },
  { id: "BFI2_E06", modele: "BigFive", dimension: "Extraversion", texte_fr: "A une personnalité affirmée", type_calcul: "Direct" },
  { id: "BFI2_E11", modele: "BigFive", dimension: "Extraversion", texte_fr: "Se sent rarement heureux ou enthousiaste", type_calcul: "Inverse" },
  { id: "BFI2_E16", modele: "BigFive", dimension: "Extraversion", texte_fr: "A tendance à être silencieux", type_calcul: "Inverse" },
  { id: "BFI2_E21", modele: "BigFive", dimension: "Extraversion", texte_fr: "Est dominant, se comporte en leader", type_calcul: "Direct" },
  { id: "BFI2_E26", modele: "BigFive", dimension: "Extraversion", texte_fr: "Est moins actif que les autres", type_calcul: "Inverse" },
  { id: "BFI2_E31", modele: "BigFive", dimension: "Extraversion", texte_fr: "Est quelquefois timide, introverti", type_calcul: "Inverse" },
  { id: "BFI2_E36", modele: "BigFive", dimension: "Extraversion", texte_fr: "Trouve difficile d'influencer les autres", type_calcul: "Inverse" },
  { id: "BFI2_E41", modele: "BigFive", dimension: "Extraversion", texte_fr: "Est plein d’énergie", type_calcul: "Direct" },
  { id: "BFI2_E46", modele: "BigFive", dimension: "Extraversion", texte_fr: "Est bavard", type_calcul: "Direct" },
  { id: "BFI2_E51", modele: "BigFive", dimension: "Extraversion", texte_fr: "Préfère laisser les autres prendre les responsabilités", type_calcul: "Inverse" },
  { id: "BFI2_E56", modele: "BigFive", dimension: "Extraversion", texte_fr: "Montre beaucoup d'enthousiasme", type_calcul: "Direct" },

  // ──────────────────────────────────────────────────────────
  // AGRÉABILITÉ (A) — 12 items
  // ──────────────────────────────────────────────────────────
  { id: "BFI2_A02", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Est sensible, a bon cœur", type_calcul: "Direct" },
  { id: "BFI2_A07", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Est respectueux, traite les autres avec respect", type_calcul: "Direct" },
  { id: "BFI2_A12", modele: "BigFive", dimension: "Agreabilite", texte_fr: "A tendance à trouver des défauts chez les autres", type_calcul: "Inverse" },
  { id: "BFI2_A17", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Ressent peu de compassion pour les autres", type_calcul: "Inverse" },
  { id: "BFI2_A22", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Commence facilement à se disputer avec les autres", type_calcul: "Inverse" },
  { id: "BFI2_A27", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Pardonne facilement", type_calcul: "Direct" },
  { id: "BFI2_A32", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Est toujours prêt à aider et n’est pas égoïste", type_calcul: "Direct" },
  { id: "BFI2_A37", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Est parfois impoli avec les autres", type_calcul: "Inverse" },
  { id: "BFI2_A42", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Est méfiant des intentions des autres", type_calcul: "Inverse" },
  { id: "BFI2_A47", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Est dédaigneux et insensible", type_calcul: "Inverse" },
  { id: "BFI2_A52", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Est poli, courtois avec les autres", type_calcul: "Direct" },
  { id: "BFI2_A57", modele: "BigFive", dimension: "Agreabilite", texte_fr: "Voit les autres sous leur meilleur jour", type_calcul: "Direct" },

  // ──────────────────────────────────────────────────────────
  // CONSCIENCIOSITÉ (C) — 12 items
  // ──────────────────────────────────────────────────────────
  { id: "BFI2_C03", modele: "BigFive", dimension: "Consciencieux", texte_fr: "A tendance à être désorganisé", type_calcul: "Inverse" },
  { id: "BFI2_C08", modele: "BigFive", dimension: "Consciencieux", texte_fr: "A tendance à être paresseux", type_calcul: "Inverse" },
  { id: "BFI2_C13", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Est sérieux, solide", type_calcul: "Direct" },
  { id: "BFI2_C18", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Est méthodique, aime que tout soit en ordre", type_calcul: "Direct" },
  { id: "BFI2_C23", modele: "BigFive", dimension: "Consciencieux", texte_fr: "A des difficultés à démarrer ce qu’il a à faire", type_calcul: "Inverse" },
  { id: "BFI2_C28", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Peut se conduire de façon irréfléchie", type_calcul: "Inverse" },
  { id: "BFI2_C33", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Garde les choses propres et bien rangées", type_calcul: "Direct" },
  { id: "BFI2_C38", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Est efficace, fait ce qu’il a à faire", type_calcul: "Direct" },
  { id: "BFI2_C43", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Est fiable dans son travail", type_calcul: "Direct" },
  { id: "BFI2_C48", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Laisse en désordre, ne nettoie pas", type_calcul: "Inverse" },
  { id: "BFI2_C53", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Est persévérant, travaille jusqu'à ce que la tâche soit finie", type_calcul: "Direct" },
  { id: "BFI2_C58", modele: "BigFive", dimension: "Consciencieux", texte_fr: "Se conduit parfois de manière irresponsable", type_calcul: "Inverse" },

  // ──────────────────────────────────────────────────────────
  // STABILITÉ ÉMOTIONNELLE (S) — Névrosisme Inversé — 12 items
  // ──────────────────────────────────────────────────────────
  { id: "BFI2_S04", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Est décontracté, gère bien le stress", type_calcul: "Direct" },
  { id: "BFI2_S09", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Ne se décourage pas après un échec", type_calcul: "Direct" },
  { id: "BFI2_S14", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Est d’humeur instable, avec des hauts et des bas", type_calcul: "Inverse" },
  { id: "BFI2_S19", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Peut être angoissé", type_calcul: "Inverse" },
  { id: "BFI2_S24", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Est serein, en accord avec lui-même", type_calcul: "Direct" },
  { id: "BFI2_S29", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Est quelqu’un de tempéré, pas facilement troublé", type_calcul: "Direct" },
  { id: "BFI2_S34", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Se fait beaucoup de souci", type_calcul: "Inverse" },
  { id: "BFI2_S39", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Se sent souvent triste", type_calcul: "Inverse" },
  { id: "BFI2_S44", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Contrôle ses émotions", type_calcul: "Direct" },
  { id: "BFI2_S49", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Est rarement anxieux ou apeuré", type_calcul: "Direct" },
  { id: "BFI2_S54", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "A tendance à être déprimé, cafardeux", type_calcul: "Inverse" },
  { id: "BFI2_S59", modele: "BigFive", dimension: "Stabilite_Emotionnelle", texte_fr: "Est émotif, peut avoir des réactions émotionnelles", type_calcul: "Inverse" },

  // ──────────────────────────────────────────────────────────
  // OUVERTURE À L'EXPÉRIENCE (O) — 12 items
  // ──────────────────────────────────────────────────────────
  { id: "BFI2_O05", modele: "BigFive", dimension: "Ouverture", texte_fr: "Est peu intéressé par tout ce qui est artistique", type_calcul: "Inverse" },
  { id: "BFI2_O10", modele: "BigFive", dimension: "Ouverture", texte_fr: "A de la curiosité pour beaucoup de choses différentes", type_calcul: "Direct" },
  { id: "BFI2_O15", modele: "BigFive", dimension: "Ouverture", texte_fr: "Est inventif, trouve des solutions astucieuses pour faire les choses", type_calcul: "Direct" },
  { id: "BFI2_O20", modele: "BigFive", dimension: "Ouverture", texte_fr: "Est fasciné par l'art, la musique ou la littérature", type_calcul: "Direct" },
  { id: "BFI2_O25", modele: "BigFive", dimension: "Ouverture", texte_fr: "Évite les discussions intellectuelles et philosophiques", type_calcul: "Inverse" },
  { id: "BFI2_O30", modele: "BigFive", dimension: "Ouverture", texte_fr: "Est peu créatif", type_calcul: "Inverse" },
  { id: "BFI2_O35", modele: "BigFive", dimension: "Ouverture", texte_fr: "Apprécie l'art et les belles choses", type_calcul: "Direct" },
  { id: "BFI2_O40", modele: "BigFive", dimension: "Ouverture", texte_fr: "Est complexe, pense profondément", type_calcul: "Direct" },
  { id: "BFI2_O45", modele: "BigFive", dimension: "Ouverture", texte_fr: "N’a pas beaucoup d’imagination", type_calcul: "Inverse" },
  { id: "BFI2_O50", modele: "BigFive", dimension: "Ouverture", texte_fr: "Pense que la poésie et le théâtre sont ennuyeux", type_calcul: "Inverse" },
  { id: "BFI2_O55", modele: "BigFive", dimension: "Ouverture", texte_fr: "N’a pas beaucoup d’intérêt pour les idées abstraites", type_calcul: "Inverse" },
  { id: "BFI2_O60", modele: "BigFive", dimension: "Ouverture", texte_fr: "Est original, trouve de nouvelles idées", type_calcul: "Direct" },
];

// ============================================================
// EXPORT COMBINÉ
// ============================================================

export const ALL_QUESTIONS: QuestionPsychometrique[] = [
  ...QUESTIONS_BFI_2_FR,
  ...QUESTIONS_RIASEC,
];

// Métadonnées des dimensions pour l'affichage UI
export const BIG_FIVE_DIMENSIONS_META: Record<BigFiveDimension, {
  label_fr: string;
  description_fr: string;
  icone: string;
  couleur: string;
  facettes?: string[];
  description_detaillee?: string;
}> = {
  Ouverture: {
    label_fr: "Ouverture à l'expérience",
    description_fr: "Curiosité intellectuelle, créativité, goût pour la nouveauté et les idées abstraites.",
    icone: "💡",
    couleur: "#8B5CF6", // purple
    facettes: ["Curiosité intellectuelle", "Sensibilité esthétique", "Imaginaire créatif"],
    description_detaillee: "Les personnes 'ouvertes' sont curieuses de leurs univers interne et externe et leur vie est plus riche en expériences. Elles sont disposées à accueillir des idées nouvelles et à adopter des valeurs non conventionnelles."
  },
  Consciencieux: {
    label_fr: "Conscienciosité",
    description_fr: "Organisation, rigueur, sens du devoir, persévérance et souci du détail.",
    icone: "🎯",
    couleur: "#22C55E", // green
    facettes: ["Organisation", "Autodiscipline", "Sens du devoir"],
    description_detaillee: "Un score élevé indique une approche réfléchie, de la volonté et de la détermination. Les individus consciencieux planifient, organisent et exécutent leurs tâches avec rigueur."
  },
  Extraversion: {
    label_fr: "Extraversion",
    description_fr: "Sociabilité, énergie, enthousiasme et recherche de stimulation sociale.",
    icone: "⚡",
    couleur: "#F59E0B", // amber
    facettes: ["Sociabilité", "Assertivité", "Niveau d'énergie"],
    description_detaillee: "L'extraversion se traduit par l'appréciation des grands groupes, l'assurance, l'activité et la loquacité. Les introvertis ne sont pas nécessairement timides, mais préfèrent l'indépendance et un rythme calme."
  },
  Agreabilite: {
    label_fr: "Agréabilité",
    description_fr: "Empathie, coopération, altruisme et bienveillance envers autrui.",
    icone: "💚",
    couleur: "#EC4899", // pink
    facettes: ["Compassion", "Respect", "Confiance"],
    description_detaillee: "L'agréabilité est relative aux tendances interpersonnelles. La personne agréable est foncièrement altruiste, bienveillante et compatissante, préférant la coopération à la compétition."
  },
  Stabilite_Emotionnelle: {
    label_fr: "Stabilité émotionnelle",
    description_fr: "Calme intérieur, résistance au stress, maîtrise de soi et sérénité.",
    icone: "🧘",
    couleur: "#06B6D4", // cyan
    facettes: ["Anxiété (inversée)", "Dépression (inversée)", "Volatilité émotionnelle (inversée)"],
    description_detaillee: "Cette dimension met en contraste l'adaptation émotionnelle avec la tendance à éprouver des affects négatifs (névrosisme). Un profil stable est généralement calme, d'humeur égale et détendu face aux situations stressantes."
  },
};

// ============================================================
// NORMES STATISTIQUES (BFI-2 Adultes, Echelle de 1 à 5 par item)
// ============================================================
export const BFI_2_NORMS: Record<BigFiveDimension, { mean: number; sd: number }> = {
  Extraversion: { mean: 3.22, sd: 0.73 },
  Agreabilite: { mean: 3.82, sd: 0.63 },
  Consciencieux: { mean: 3.89, sd: 0.72 },
  // Névrosisme d'origine: mean 2.72, sd 0.90. On inverse la moyenne pour Stabilité.
  Stabilite_Emotionnelle: { mean: 3.28, sd: 0.90 },
  Ouverture: { mean: 3.65, sd: 0.69 },
};

export const RIASEC_DIMENSIONS_META: Record<RIASECDimension, {
  label_fr: string;
  lettre: string;
  description_fr: string;
  icone: string;
  couleur: string;
}> = {
  Realiste: {
    label_fr: "Réaliste",
    lettre: "R",
    description_fr: "Aime travailler avec les mains, les outils, les machines. Préfère le concret à l'abstrait.",
    icone: "🔧",
    couleur: "#EF4444", // red
  },
  Investigateur: {
    label_fr: "Investigateur",
    lettre: "I",
    description_fr: "Aime réfléchir, analyser, résoudre des problèmes complexes. Esprit scientifique.",
    icone: "🔬",
    couleur: "#3B82F6", // blue
  },
  Artistique: {
    label_fr: "Artistique",
    lettre: "A",
    description_fr: "Aime créer, s'exprimer, imaginer. Valorise l'originalité et l'esthétique.",
    icone: "🎨",
    couleur: "#A855F7", // violet
  },
  Social: {
    label_fr: "Social",
    lettre: "S",
    description_fr: "Aime aider, enseigner, soigner, accompagner. Empathie et communication.",
    icone: "🤝",
    couleur: "#22C55E", // green
  },
  Entreprenant: {
    label_fr: "Entreprenant",
    lettre: "E",
    description_fr: "Aime diriger, convaincre, vendre, organiser. Leadership et ambition.",
    icone: "🚀",
    couleur: "#F97316", // orange
  },
  Conventionnel: {
    label_fr: "Conventionnel",
    lettre: "C",
    description_fr: "Aime organiser, classer, gérer les données. Précision et méthode.",
    icone: "📊",
    couleur: "#64748B", // slate
  },
};
